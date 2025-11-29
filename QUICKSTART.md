# Quick Start Guide

## Installation & Setup

1. **Dependencies installieren:**
   ```bash
   npm install
   ```

2. **Entwicklung starten:**
   ```bash
   npm run electron:dev
   ```

## Erste Schritte

### 1. API-Keys konfigurieren

1. Öffne die App (sie startet im System Tray)
2. Klicke auf das Tray-Icon, um das Hauptfenster zu öffnen
3. Gehe zu "Einstellungen" → "API-Keys"
4. Alle 4 Provider werden untereinander angezeigt
5. Trage deinen API-Key für den gewünschten Anbieter ein
6. Klicke auf "Speichern & Validieren"
7. Der Status wird durch einen farbigen Punkt angezeigt (🟢 grün = gültig, 🔴 rot = ungültig, ⚪ grau = nicht konfiguriert)

### 2. Metaprompts einrichten

Metaprompts sind **Vorlagen**, die definieren, wie normale Prompts optimiert werden sollen:

- **Vorgefertigte Metaprompts**: 7 professionelle Metaprompts werden beim ersten Start automatisch erstellt:
  - Standard Optimizer (kann nicht gelöscht werden)
  - Software-Entwicklung
  - Kommunikation
  - Datenanalyse
  - Rechtssprechung
  - Business
  - Bildgenerierung
  - Bildbearbeitung
- **Neue Metaprompts erstellen**:
  - **Mit KI generieren**: Beschreibe einen Anwendungsfall (z.B. "Code-Generierung", "Kreatives Schreiben") und lass die KI eine passende Vorlage erstellen
  - **Manuell erstellen**: Erstelle eigene Metaprompts mit dem Editor
- **Metaprompts aktivieren**: Wähle einen Metaprompt im Dashboard per Dropdown aus

**Tipp**: Erstelle mehrere Metaprompts für verschiedene Anwendungsfälle und wechsle sie im Dashboard nach Bedarf.

### 3. Prompt optimieren

Der aktive Metaprompt wird als Vorlage verwendet, um deinen normalen Prompt zu optimieren.

**Methode 1: Global Shortcut**
1. Kopiere einen normalen Prompt in die Zwischenablage
2. Drücke `Ctrl+Shift+O` (oder `Cmd+Shift+O` auf macOS)
3. Der aktive Metaprompt wird verwendet, um deinen Prompt zu optimieren
4. Das optimierte Ergebnis wird automatisch in die Zwischenablage kopiert
5. Füge es mit `Ctrl+V` ein

**Methode 2: Dashboard**
1. Öffne das Dashboard
2. Kopiere einen normalen Prompt in die Zwischenablage
3. Klicke auf "Prompt jetzt optimieren"

**Beispiel-Workflow:**
- Für Code-Prompts: Aktiviere einen Metaprompt für "Code-Generierung"
- Für kreative Texte: Aktiviere einen anderen Metaprompt für "Kreatives Schreiben"
- Wechsle zwischen Metaprompts je nach Bedarf

## Build für Produktion

```bash
# Windows Portable
npm run build:win

# macOS Universal Binary
npm run build:mac

# Linux AppImage
npm run build:linux

# Alle Plattformen
npm run build:all
```

Die Builds werden im `dist/` Verzeichnis erstellt.

## Troubleshooting

### App startet nicht
- Stelle sicher, dass alle Dependencies installiert sind: `npm install`
- Prüfe die Konsole auf Fehler

### Global Shortcut funktioniert nicht
- Prüfe, ob der Shortcut bereits von einer anderen App verwendet wird
- Ändere den Shortcut in den Einstellungen

### API-Key wird nicht akzeptiert
- Stelle sicher, dass der Key korrekt kopiert wurde (keine Leerzeichen)
- Prüfe, ob der Key für den richtigen Anbieter ist
- Teste den Key direkt in der API-Dokumentation

### Metaprompt wird nicht verwendet
- Stelle sicher, dass ein Metaprompt im Dashboard ausgewählt ist
- Prüfe im Dashboard, ob der richtige Metaprompt im Dropdown ausgewählt ist
- Der aktive Metaprompt wird im Metaprompts-Tab mit blauem Rahmen hervorgehoben

## Nächste Schritte

- Erstelle eigene Metaprompts für spezifische Anwendungsfälle
- Experimentiere mit verschiedenen AI-Anbietern
- Nutze die History, um erfolgreiche Optimierungen zu analysieren

