# MRP - Prompt-Optimierer

Ein Desktop-Tool zur KI-gestützten Prompt-Optimierung mit Clipboard-Integration.

## Konzept

MRP verwendet **Metaprompts** als Vorlagen, um normale Prompts zu optimieren. Ein Metaprompt definiert, wie ein Prompt verbessert werden soll (z.B. "Mache den Prompt präziser", "Füge Kontext hinzu", "Strukturiere für Code-Generierung"). Du kannst mehrere Metaprompts als Vorlagen speichern und nach Bedarf aktivieren.

## Features

- ✅ Unterstützung für 4 AI-Anbieter: OpenAI, Anthropic (Claude), xAI (Grok), Google (Gemini)
- ✅ Sichere API-Key-Verwaltung (verschlüsselt)
- ✅ Metaprompt-Verwaltung: Erstelle, bearbeite und aktiviere Metaprompt-Vorlagen
- ✅ **KI-generierte Metaprompts**: Lass die KI Metaprompts für dich erstellen
- ✅ Global Shortcut für schnelle Optimierung (Standard: Ctrl+Shift+M)
- ✅ System Tray Integration
- ✅ Clipboard-Workflow: Prompt kopieren → Shortcut drücken → Optimiertes Ergebnis in Zwischenablage
- ✅ History der letzten 20 Optimierungen
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
Gehe zu "API-Keys" und trage deine Keys für die gewünschten Anbieter ein.

### 2. Metaprompts einrichten
Metaprompts sind Vorlagen, die definieren, wie Prompts optimiert werden sollen:

- **Vorhandene Metaprompts verwenden**: Ein Standard-Metaprompt wird beim ersten Start erstellt
- **Neue Metaprompts erstellen**: 
  - Manuell: Erstelle eigene Metaprompts mit dem Editor
  - **KI-generiert**: Lass die KI ein Metaprompt für einen bestimmten Anwendungsfall erstellen
- **Metaprompts aktivieren**: Wähle einen Metaprompt aus und klicke auf "Aktivieren"

### 3. Prompt optimieren
1. Kopiere einen normalen Prompt in die Zwischenablage
2. Drücke `Ctrl+Shift+M` (oder `Cmd+Shift+M` auf macOS)
3. Der aktive Metaprompt wird verwendet, um deinen Prompt zu optimieren
4. Das optimierte Ergebnis wird automatisch in die Zwischenablage kopiert
5. Füge es mit `Ctrl+V` ein

### Beispiel-Workflow
- **Szenario**: Du möchtest Code-Prompts optimieren
- Erstelle oder aktiviere einen Metaprompt für "Code-Generierung"
- Kopiere einen Code-Prompt → Shortcut → Erhalte optimierten Prompt
- **Szenario**: Du möchtest kreative Texte verbessern
- Aktiviere einen anderen Metaprompt für "Kreatives Schreiben"
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
│   └── types/        # TypeScript Typen
├── resources/        # Icons & Assets
└── dist/             # Build Output
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

## Lizenz

MIT

## Autor

**Martin Pfeffer**

- 🌐 Website: [celox.io](https://celox.io)
- 💼 LinkedIn: [Martin Pfeffer](https://www.linkedin.com/in/martin-pfeffer-020831134/)
- 💻 GitHub: [@pepperonas](https://github.com/pepperonas)

