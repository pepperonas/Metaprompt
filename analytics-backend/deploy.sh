#!/bin/bash

# Deployment Script für Metaprompt Analytics Backend
# Usage: ./deploy.sh [ssh-user@host]

set -e

SSH_TARGET="${1:-celox}"
DEPLOY_PATH="/var/www/html/api/metaprompt"

echo "🚀 Deploying Metaprompt Analytics Backend..."
echo "📦 Target: $SSH_TARGET:$DEPLOY_PATH"

# Prüfe ob Dateien existieren
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Run this script from analytics-backend directory."
  exit 1
fi

# Erstelle temporäres Archiv
echo "📦 Creating deployment archive..."
TEMP_DIR=$(mktemp -d)
ARCHIVE="$TEMP_DIR/metaprompt-analytics.tar.gz"

tar czf "$ARCHIVE" \
  --exclude='node_modules' \
  --exclude='*.db' \
  --exclude='*.db-shm' \
  --exclude='*.db-wal' \
  --exclude='.git' \
  --exclude='.env' \
  .

# Kopiere auf Server
echo "📤 Uploading files..."
scp "$ARCHIVE" "$SSH_TARGET:/tmp/metaprompt-analytics.tar.gz"

# Aufräumen
rm -rf "$TEMP_DIR"

# Auf Server: Entpacken und installieren
echo "🔧 Installing on server..."
ssh "$SSH_TARGET" bash << 'ENDSSH'
set -e

DEPLOY_PATH="/var/www/html/api/metaprompt"

# Erstelle Verzeichnis
mkdir -p "$DEPLOY_PATH"
cd "$DEPLOY_PATH"

# Backup falls vorhanden
if [ -f "analytics.db" ]; then
  echo "💾 Backing up existing database..."
  cp analytics.db "analytics.db.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Entpacke neue Version
echo "📦 Extracting files..."
tar xzf /tmp/metaprompt-analytics.tar.gz -C "$DEPLOY_PATH"
rm /tmp/metaprompt-analytics.tar.gz

# Erstelle data Verzeichnis
mkdir -p data
chmod 755 data

# Installiere Dependencies
echo "📥 Installing dependencies..."
npm install --production

# Erstelle .env falls nicht vorhanden
if [ ! -f ".env" ]; then
  echo "⚙️  Creating .env file..."
  ADMIN_KEY=$(openssl rand -hex 32)
  cat > .env << EOF
PORT=3030
ADMIN_KEY=$ADMIN_KEY
DB_PATH=$DEPLOY_PATH/data/analytics.db
EOF
  echo "✅ Created .env with generated ADMIN_KEY"
  echo "🔑 ADMIN_KEY: $ADMIN_KEY"
  echo "⚠️  Save this key! You'll need it for the admin dashboard."
else
  echo "✅ .env file already exists"
fi

# Initialisiere Datenbank
echo "🗄️  Initializing database..."
node -e "import('./database.js').then(m => m.initDatabase()).catch(e => console.error(e))" || echo "Database initialization skipped (will be done on first start)"

echo "✅ Deployment complete!"
ENDSSH

echo ""
echo "✅ Deployment erfolgreich!"
echo ""
echo "📋 Next steps:"
echo "1. Setze Nginx-Konfiguration (siehe DEPLOYMENT.md)"
echo "2. Starte den Server mit PM2: pm2 start server.js --name metaprompt-analytics"
echo "3. Admin-Dashboard: https://metaprompt.celox.io/admin?key=YOUR_ADMIN_KEY"
