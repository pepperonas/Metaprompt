# Deployment-Anleitung für VPS

## Voraussetzungen

- VPS mit SSH-Zugriff
- Node.js 20+ installiert
- Nginx als Reverse Proxy (für HTTPS)
- Domain: `metaprompt.celox.io`
- PM2 für Process Management (optional, empfohlen)

## Schnellstart mit deploy.sh

```bash
cd analytics-backend
./deploy.sh celox
```

Das Script:
1. Erstellt ein Archiv aller Dateien
2. Kopiert es auf den Server
3. Installiert Dependencies
4. Erstellt .env mit generiertem Admin-Key
5. Initialisiert die Datenbank

**Wichtig:** Notiere dir den generierten ADMIN_KEY!

## Manuelle Installation

### Schritt 1: Dateien auf VPS kopieren

```bash
# Auf lokalem Rechner
cd analytics-backend
scp -r * celox:/var/www/html/api/metaprompt/
```

### Schritt 2: Auf VPS verbinden

```bash
celox
cd /var/www/html/api/metaprompt
```

### Schritt 3: Dependencies installieren

```bash
npm install --production
```

### Schritt 4: Umgebungsvariablen setzen

```bash
nano .env
```

Inhalt:
```
PORT=3001
ADMIN_KEY=<starker-zufälliger-key>
DB_PATH=/var/www/html/api/metaprompt/data/analytics.db
```

**Wichtig:** Generiere einen starken Admin-Key:
```bash
openssl rand -hex 32
```

### Schritt 5: Datenbank-Verzeichnis erstellen

```bash
mkdir -p data
chmod 755 data
```

### Schritt 6: Datenbank initialisieren

```bash
npm run init-db
```

### Schritt 7: Nginx-Konfiguration

Erstelle oder bearbeite `/etc/nginx/sites-available/metaprompt-analytics`:

```nginx
server {
    listen 443 ssl http2;
    server_name metaprompt.celox.io;
    
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;
    
    # API Endpoints
    location /api/metaprompt {
        proxy_pass http://localhost:3030;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Admin Dashboard
    location /admin {
        alias /var/www/html/api/metaprompt/admin;
        index index.html;
        try_files $uri $uri/ =404;
    }
}

# HTTP zu HTTPS Redirect
server {
    listen 80;
    server_name metaprompt.celox.io;
    return 301 https://$server_name$request_uri;
}
```

Aktiviere die Konfiguration:
```bash
sudo ln -s /etc/nginx/sites-available/metaprompt-analytics /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Oder:** Kopiere die fertige Konfiguration:
```bash
sudo cp /var/www/html/api/metaprompt/nginx-config.conf /etc/nginx/sites-available/metaprompt-analytics
# Passe SSL-Pfade an!
sudo ln -s /etc/nginx/sites-available/metaprompt-analytics /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Schritt 8: PM2 für Process Management

```bash
npm install -g pm2

# Starte Server
cd /var/www/html/api/metaprompt
pm2 start server.js --name metaprompt-analytics

# Oder mit Ecosystem-File
pm2 start pm2-ecosystem.config.js

# PM2 beim Boot starten
pm2 save
pm2 startup
```

### Schritt 9: Firewall (falls aktiv)

```bash
sudo ufw allow 3030/tcp
```

### Schritt 10: Testen

```bash
# Health Check
curl http://localhost:3030/health

# Stats (mit Admin-Key)
curl "http://localhost:3030/api/stats?key=YOUR_ADMIN_KEY"
```

## Admin Dashboard

Zugriff: `https://metaprompt.celox.io/admin?key=YOUR_ADMIN_KEY`

Der Key wird im LocalStorage gespeichert, muss also nur einmal eingegeben werden.

## Monitoring

```bash
# PM2 Status
pm2 status

# Logs
pm2 logs metaprompt-analytics

# Restart
pm2 restart metaprompt-analytics

# Stop
pm2 stop metaprompt-analytics
```

## Backup

Die SQLite-Datenbank liegt unter:
```
/var/www/html/api/metaprompt/data/analytics.db
```

Backup-Script (`/usr/local/bin/backup-metaprompt-analytics.sh`):
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/metaprompt-analytics"
mkdir -p $BACKUP_DIR
cp /var/www/html/api/metaprompt/data/analytics.db $BACKUP_DIR/analytics-$(date +%Y%m%d_%H%M%S).db
# Alte Backups löschen (älter als 30 Tage)
find $BACKUP_DIR -name "analytics-*.db" -mtime +30 -delete
```

Cron-Job (täglich um 2 Uhr):
```bash
sudo crontab -e
# Füge hinzu:
0 2 * * * /usr/local/bin/backup-metaprompt-analytics.sh
```

## Troubleshooting

### Server startet nicht
```bash
# Prüfe Logs
pm2 logs metaprompt-analytics

# Prüfe ob Port belegt
sudo lsof -i :3030

# Prüfe .env
cat /var/www/html/api/metaprompt/.env
```

### Nginx 502 Bad Gateway
- Prüfe ob Node.js Server läuft: `pm2 status`
- Prüfe Nginx Error-Log: `sudo tail -f /var/log/nginx/error.log`
- Prüfe ob Port 3030 erreichbar: `curl http://localhost:3030/health`

### Datenbank-Fehler
```bash
# Prüfe Berechtigungen
ls -la /var/www/html/api/metaprompt/data/

# Initialisiere neu
cd /var/www/html/api/metaprompt
npm run init-db
```

## Updates

```bash
# Auf lokalem Rechner
cd analytics-backend
./deploy.sh celox

# Auf Server: Restart
pm2 restart metaprompt-analytics
```
