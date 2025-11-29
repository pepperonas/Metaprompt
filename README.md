# MRP - Prompt-Optimierer

Ein Desktop-Tool zur KI-gestützten Prompt-Optimierung mit Clipboard-Integration.

## Konzept

MRP verwendet **Metaprompts** als Vorlagen, um normale Prompts zu optimieren. Ein Metaprompt definiert, wie ein Prompt verbessert werden soll (z.B. "Mache den Prompt präziser", "Füge Kontext hinzu", "Strukturiere für Code-Generierung"). Du kannst mehrere Metaprompts als Vorlagen speichern und nach Bedarf aktivieren.

## Features

- ✅ Unterstützung für 4 AI-Anbieter: OpenAI, Anthropic (Claude), xAI (Grok), Google (Gemini)
- ✅ Sichere API-Key-Verwaltung (verschlüsselt) mit visueller Status-Anzeige
- ✅ Metaprompt-Verwaltung: Erstelle, bearbeite und aktiviere Metaprompt-Vorlagen
- ✅ **7 vorgefertigte Metaprompts**: Software-Entwicklung, Kommunikation, Datenanalyse, Rechtssprechung, Business, Bildgenerierung, Bildbearbeitung
- ✅ **KI-generierte Metaprompts**: Lass die KI Metaprompts für dich erstellen
- ✅ Global Shortcut für schnelle Optimierung (Standard: Ctrl+Shift+O / Cmd+Shift+O)
- ✅ System Tray Integration mit App-Icon
- ✅ Clipboard-Workflow: Prompt kopieren → Shortcut drücken → Optimiertes Ergebnis in Zwischenablage
- ✅ History der letzten 20 Optimierungen
- ✅ Dunkles Theme mit modernem Design
- ✅ Portable Builds für Windows, macOS und Linux

## Entwicklung

### Voraussetzungen

- Node.js 18+
- npm oder yarn

### Installation

```bash
npm install
```

### Entwicklung starten

```bash
npm run electron:dev
```

Dies startet:
- Vite Dev Server auf http://localhost:5173
- Electron App

### Build

```bash
# Alle Plattformen
npm run build:all

# Spezifische Plattform
npm run build:win
npm run build:mac
npm run build:linux
```

Die Builds werden im `dist/` Verzeichnis erstellt.

## Verwendung

### 1. API-Keys konfigurieren
Gehe zu "Einstellungen" → "API-Keys" und trage deine Keys für die gewünschten Anbieter ein. Alle 4 Provider werden untereinander angezeigt, jeder mit eigenem Eingabefeld und Status-Anzeige.

### 2. Metaprompts einrichten
Metaprompts sind Vorlagen, die definieren, wie Prompts optimiert werden sollen:

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
  - **KI-generiert**: Beschreibe einen Anwendungsfall (z.B. "Code-Generierung") und lass die KI ein Metaprompt erstellen
  - **Manuell**: Erstelle eigene Metaprompts mit dem Editor
- **Metaprompts aktivieren**: Wähle einen Metaprompt im Dashboard per Dropdown aus

### 3. Prompt optimieren
1. Kopiere einen normalen Prompt in die Zwischenablage
2. Drücke `Ctrl+Shift+O` (oder `Cmd+Shift+O` auf macOS)
3. Der aktive Metaprompt wird verwendet, um deinen Prompt zu optimieren
4. Das optimierte Ergebnis wird automatisch in die Zwischenablage kopiert
5. Füge es mit `Ctrl+V` ein

### Beispiel-Workflow
- **Szenario**: Du möchtest Code-Prompts optimieren
- Wähle den Metaprompt "Software-Entwicklung" im Dashboard aus
- Kopiere einen Code-Prompt → Shortcut → Erhalte optimierten Prompt
- **Szenario**: Du möchtest kreative Texte verbessern
- Wähle den Metaprompt "Kommunikation" im Dashboard aus
- Kopiere einen Text-Prompt → Shortcut → Erhalte optimierten Prompt

## Projektstruktur

```
mrp/
├── electron/          # Electron Main Process
├── src/              # React Frontend
│   ├── components/   # UI Komponenten
│   ├── pages/        # Seiten
│   ├── stores/       # Zustand Stores
│   ├── services/     # API Services
│   ├── types/        # TypeScript Typen
│   └── utils/        # Utility-Funktionen
├── resources/        # Icons & Assets
│   ├── icons/        # Icon-Assets (SVG, PNG in verschiedenen Größen)
│   ├── icon.ico      # Windows Icon
│   ├── icon.icns     # macOS Icon
│   └── icon.png      # Linux Icon
├── dist/             # Build Output
└── dist-electron/    # Electron Build Output
```

## Technologie-Stack

- **Electron 28+** - Desktop Framework
- **React 18+** - UI Framework
- **TypeScript 5+** - Type Safety
- **Tailwind CSS 3.4+** - Styling
- **Zustand** - State Management
- **Vite** - Build Tool
- **electron-builder** - Packaging

## Versionsnummerierung

Die App verwendet **Semantische Versionierung** im Format `MAJOR.MINOR.PATCH`:

- **MAJOR**: Hauptversion für größere Änderungen
- **MINOR**: Nebenversion für neue Features
- **PATCH**: Patch-Version für Bugfixes

### Versionsrichtlinien

- Nach **9 Patches** (z.B. 0.0.9) → Minor erhöhen (0.1.0)
- Nach **9 Minors** (z.B. 0.9.x) → Major erhöhen (1.0.0)

**Beispiele:**
- `0.0.1` → `0.0.2` → ... → `0.0.9` → `0.1.0`
- `0.1.0` → `0.2.0` → ... → `0.9.0` → `1.0.0`
- `1.0.0` → `1.0.1` → ... → `1.0.9` → `1.1.0`
- `1.1.0` → `1.1.1` → ... → `1.1.9` → `1.2.0`
- `1.9.0` → `1.9.1` → ... → `1.9.9` → `2.0.0`

**Wichtig:** Diese Richtlinien müssen bei jeder Versionserhöhung befolgt werden. Siehe auch [VERSIONING.md](./VERSIONING.md) für detaillierte Informationen.

## Lizenz

MIT

## Autor

**Martin Pfeffer**

- 🌐 Website: [celox.io](https://celox.io)
- 💼 LinkedIn: [Martin Pfeffer](https://www.linkedin.com/in/martin-pfeffer-020831134/)
- 💻 GitHub: [@pepperonas](https://github.com/pepperonas)

