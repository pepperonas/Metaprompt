#!/bin/bash
# Launcher-Script für Metaprompt.app
# Entfernt automatisch das Quarantäne-Attribut und startet die App

APP_PATH="/Applications/Metaprompt.app"
APP_BINARY="$APP_PATH/Contents/MacOS/Metaprompt"

# Prüfe ob die App existiert
if [ ! -d "$APP_PATH" ]; then
    osascript -e 'display dialog "Metaprompt.app wurde nicht in /Applications gefunden." buttons {"OK"} default button "OK" with icon stop'
    exit 1
fi

# Entferne Quarantäne-Attribut (stumm, falls nicht vorhanden)
xattr -d com.apple.quarantine "$APP_PATH" 2>/dev/null || true

# Starte die App
open "$APP_PATH"
