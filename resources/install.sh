#!/bin/bash
# Installer Script für Metaprompt.app
# Entfernt automatisch das Quarantäne-Attribut nach dem Kopieren

APP_PATH="/Applications/Metaprompt.app"

# Prüfe ob die App existiert
if [ -d "$APP_PATH" ]; then
    echo "Entferne Quarantäne-Attribut von Metaprompt.app..."
    xattr -d com.apple.quarantine "$APP_PATH" 2>/dev/null || true
    echo "✅ Metaprompt.app ist jetzt bereit zum Starten!"
    echo ""
    echo "Du kannst die App jetzt normal starten:"
    echo "1. Öffne den Applications-Ordner"
    echo "2. Doppelklicke auf Metaprompt.app"
else
    echo "⚠️  Metaprompt.app wurde nicht in /Applications gefunden."
    echo "Bitte kopiere die App zuerst nach /Applications."
fi
