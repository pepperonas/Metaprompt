# Metaprompt

Ein Desktop-Tool zur KI-gestützten Prompt-Optimierung mit Clipboard-Integration.

## Konzept

Metaprompt verwendet **Metaprompts** als Vorlagen, um normale Prompts zu optimieren. Ein Metaprompt definiert, wie ein Prompt verbessert werden soll (z.B. "Mache den Prompt präziser", "Füge Kontext hinzu", "Strukturiere für Code-Generierung"). Du kannst mehrere Metaprompts als Vorlagen speichern und nach Bedarf aktivieren.

## Features

- ✅ Unterstützung für 4 AI-Anbieter: OpenAI, Anthropic (Claude), xAI (Grok), Google (Gemini)
- ✅ Sichere API-Key-Verwaltung (verschlüsselt) mit visueller Status-Anzeige
- ✅ Metaprompt-Verwaltung: Erstelle, bearbeite und aktiviere Metaprompt-Vorlagen
- ✅ **60+ vorgefertigte Metaprompts**: Professionelle Metaprompts für verschiedene Anwendungsfälle (Software-Entwicklung, Kommunikation, Datenanalyse, Business, Marketing, Recht, Design, Bildung, Kreativ, Lifestyle und mehr)
- ✅ **KI-generierte Metaprompts**: Lass die KI Metaprompts für dich erstellen
- ✅ Global Shortcut für schnelle Optimierung (Standard: Ctrl+Shift+O / Cmd+Shift+O)
- ✅ System Tray Integration mit App-Icon
- ✅ Clipboard-Workflow: Prompt kopieren → Shortcut drücken → Optimiertes Ergebnis in Zwischenablage
- ✅ History der letzten 20 Optimierungen
- ✅ Dunkles Theme mit modernem Design
- ✅ Installer-Pakete für alle Plattformen (Windows NSIS, macOS DMG, Linux DEB/RPM/AppImage)

## Installation

### Für Endbenutzer

Lade die neueste Version von [GitHub Releases](https://github.com/pepperonas/metaprompt/releases) herunter:

#### macOS
1. Lade `Metaprompt-{version}-macOS.dmg` herunter
2. Öffne die DMG-Datei
3. Ziehe `Metaprompt.app` nach `Applications`
4. Starte die App aus dem Applications-Ordner

#### Windows
1. Lade `Metaprompt-{version}-Windows-Setup.exe` herunter
2. Führe die Setup-Datei aus
3. Folge dem Installationsassistenten (One-Click Installation)
4. Die App wird automatisch im Startmenü und auf dem Desktop verlinkt

#### Linux

**Debian/Ubuntu:**
1. Lade `Metaprompt-{version}-Linux.deb` herunter
2. Installation: `sudo dpkg -i Metaprompt-*.deb`
   - Oder: Doppelklick im Datei-Manager

**Fedora/RedHat:**
1. Lade `Metaprompt-{version}-Linux.rpm` herunter
2. Installation: `sudo rpm -i Metaprompt-*.rpm`
   - Oder: Doppelklick im Datei-Manager

**AppImage (Portable):**
1. Lade `Metaprompt-{version}-*.AppImage` herunter
2. Mache die Datei ausführbar: `chmod +x Metaprompt-*.AppImage`
3. Starte die App: `./Metaprompt-*.AppImage`

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
npm run dev
```

Dies startet:
- Vite Dev Server auf http://localhost:5173
- Electron App (automatisch via vite-plugin-electron)
- Hot Module Replacement (HMR) für React-Komponenten
- Automatisches Neuladen bei Änderungen im Electron-Code

### Build

```bash
# Alle Plattformen
npm run build:all

# Spezifische Plattform
npm run build:win    # Erstellt Windows Installer (.exe)
npm run build:mac    # Erstellt macOS DMG Installer
npm run build:linux  # Erstellt Linux DEB, RPM und AppImage
```

Die Builds werden im `dist/` Verzeichnis erstellt:

- **Windows**: `Metaprompt-{version}-Windows-Setup.exe` (NSIS Installer)
- **macOS**: `Metaprompt-{version}-macOS.dmg` (DMG Installer)
- **Linux**:
  - `Metaprompt-{version}-Linux.deb` (Debian/Ubuntu)
  - `Metaprompt-{version}-Linux.rpm` (Fedora/RedHat)
  - `Metaprompt-{version}-*.AppImage` (Portable)

## Verwendung

### 1. API-Keys konfigurieren
Gehe zu "Einstellungen" → "API-Keys" und trage deine Keys für die gewünschten Anbieter ein. Alle 4 Provider werden untereinander angezeigt, jeder mit eigenem Eingabefeld und Status-Anzeige.

### 2. Metaprompts einrichten
Metaprompts sind Vorlagen, die definieren, wie Prompts optimiert werden sollen:

- **Vorgefertigte Metaprompts**: 60+ professionelle Metaprompts werden beim ersten Start automatisch erstellt, organisiert in Kategorien:
  - **Standard Optimizer** (kann nicht gelöscht werden)
  - **Entwicklung**: Software-Entwicklung, Frontend, Backend, API-Design, DevOps, Testing, Code-Review, Technische Dokumentation, Datenbank-Design
  - **Kommunikation**: Präsentationen, Berichte, Übersetzungen
  - **Datenanalyse**: Datenanalyse, Machine Learning, Statistik, Zeitreihen, Predictive Analytics, Datenbereinigung, A/B-Testing, Datenvisualisierung
  - **Business**: Business-Strategie, Projektmanagement, Finanzanalyse, Kundenanalyse, Verkaufsstrategien, Business-Optimierung, Business-Plan-Erstellung, Strategische Planung
  - **Marketing**: Content-Marketing, SEO, Social-Media, E-Mail-Marketing, Produktbeschreibungen, Werbetexte
  - **Recht**: Rechtssprechung, Vertragsrecht, Arbeitsrecht, Datenschutz & DSGVO, Compliance, Markenrecht
  - **Design**: Bildgenerierung, Bildbearbeitung, UI/UX-Design, Logo-Design, Web-Design, Grafik-Design, Video-Produktion, 3D-Modellierung, Fotografie
  - **Bildung**: Lernmaterialien, Prüfungsfragen, Zusammenfassungen
  - **Kreativ**: Kreatives Schreiben, Drehbücher, Songtexte
  - **Lifestyle**: Rezepte, Reiseplanung, Fitness & Gesundheit, Persönliche Entwicklung
  - **Visualisierung**: Mindmap-Erstellung, Datenvisualisierung (Charts)
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
├── electron/                    # Electron Main Process (TypeScript Source)
│   ├── main.ts                  # Electron Entry Point
│   ├── preload.ts             # Preload Script (IPC Bridge)
│   ├── store.ts               # electron-store Configuration
│   ├── tray.ts                # System Tray Integration
│   ├── shortcuts.ts           # Global Shortcut Registration
│   ├── clipboard.ts           # Clipboard Operations
│   ├── notifications.ts       # Native Notifications
│   ├── optimizer.ts           # Prompt Optimization Logic
│   ├── validateApiKey.ts      # API Key Validation
│   └── costTracking.ts       # Cost Tracking (optional)
├── src/                        # React Frontend (TypeScript)
│   ├── main.tsx               # React Entry Point
│   ├── App.tsx                # Root Component
│   ├── components/            # UI Komponenten
│   │   ├── ui/                # Reusable UI Components
│   │   ├── layout/            # Layout Components
│   │   └── features/          # Feature Components
│   ├── pages/                 # Seiten (Dashboard, ApiKeys, etc.)
│   ├── stores/                 # Zustand Stores
│   ├── services/               # API Services
│   │   └── api/                # Provider-specific API Clients
│   ├── types/                  # TypeScript Typen
│   ├── utils/                  # Utility-Funktionen
│   └── styles/                 # Global Styles (Tailwind)
├── resources/                  # Icons & Assets
│   ├── icons/                  # Icon-Assets (SVG, PNG in verschiedenen Größen)
│   ├── icon.ico                # Windows Icon
│   ├── icon.icns               # macOS Icon
│   ├── icon.png                # Linux Icon
│   └── Info.plist              # macOS App Configuration
├── .github/                    # GitHub Configuration
│   └── workflows/              # GitHub Actions
│       └── release.yml         # Automated Release Workflow
├── dist/                        # Build Output (Frontend)
├── dist-electron/              # Electron Build Output (wird ignoriert)
├── electron-builder.yml        # Electron Builder Configuration
├── vite.config.ts              # Vite Configuration
├── tsconfig.json               # TypeScript Configuration
├── tsconfig.electron.json      # Electron-specific TypeScript Config
├── tailwind.config.js          # Tailwind CSS Configuration
├── postcss.config.js           # PostCSS Configuration
├── package.json                # Project Dependencies & Scripts
└── README.md                   # Diese Datei
```

### Wichtige Dateien (NICHT löschen!)

**Source-Dateien (werden in Git versioniert):**
- `electron/*.ts` - Alle Electron Main Process Dateien
- `src/**/*.tsx` / `src/**/*.ts` - Alle React Frontend Dateien
- `resources/**` - Alle Icons und Assets
- `electron-builder.yml` - Build-Konfiguration
- `vite.config.ts` - Vite/Electron Integration
- `package.json` - Dependencies und Scripts
- `tsconfig*.json` - TypeScript Konfigurationen
- `tailwind.config.js` - Tailwind CSS Konfiguration

**Build-Output (werden ignoriert, nicht in Git):**
- `dist/` - Frontend Build Output
- `dist-electron/` - Electron Build Output
- `node_modules/` - Dependencies

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

## Wichtige Hinweise

### Dateien-Schutz

⚠️ **WICHTIG**: Source-Dateien in `electron/` und `src/` müssen in Git versioniert werden!

Siehe [IMPORTANT_FILES.md](./IMPORTANT_FILES.md) für eine vollständige Liste aller wichtigen Dateien, die nicht gelöscht werden sollten.

### Build-Output

Die Verzeichnisse `dist/` und `dist-electron/` werden bei jedem Build neu erstellt und sind in `.gitignore`. Diese können gelöscht werden, ohne dass Source-Code verloren geht.

### Wiederherstellung nach versehentlichem Löschen

Falls wichtige Dateien verloren gehen:

```bash
# Alle Dateien aus einem Commit wiederherstellen
git checkout <commit-hash> -- .

# Spezifische Datei wiederherstellen
git checkout <commit-hash> -- <file-path>
```

## Lizenz

MIT

## Autor

**Martin Pfeffer**

- 🌐 Website: [celox.io](https://celox.io)
- 💼 LinkedIn: [Martin Pfeffer](https://www.linkedin.com/in/martin-pfeffer-020831134/)
- 💻 GitHub: [@pepperonas](https://github.com/pepperonas)

