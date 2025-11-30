# Wichtige Dateien - Nicht löschen!

Diese Dateien sind kritisch für das Projekt und sollten **NIEMALS** gelöscht werden.

## Source-Dateien (Müssen in Git sein)

### Electron Main Process
- ✅ `electron/main.ts` - Electron Entry Point
- ✅ `electron/preload.ts` - IPC Bridge zwischen Main und Renderer
- ✅ `electron/store.ts` - Datenpersistenz (electron-store)
- ✅ `electron/tray.ts` - System Tray Integration
- ✅ `electron/shortcuts.ts` - Global Shortcut Handling
- ✅ `electron/clipboard.ts` - Clipboard Operations
- ✅ `electron/notifications.ts` - Native Notifications
- ✅ `electron/optimizer.ts` - Prompt Optimization Logic
- ✅ `electron/validateApiKey.ts` - API Key Validation
- ✅ `electron/costTracking.ts` - Cost Tracking (optional)

### React Frontend
- ✅ `src/main.tsx` - React Entry Point
- ✅ `src/App.tsx` - Root Component
- ✅ `src/pages/*.tsx` - Alle Seiten-Komponenten
- ✅ `src/components/**/*.tsx` - Alle UI-Komponenten
- ✅ `src/stores/*.ts` - Zustand State Management
- ✅ `src/services/**/*.ts` - API Services
- ✅ `src/types/*.ts` - TypeScript Typen
- ✅ `src/utils/*.ts` - Utility-Funktionen
- ✅ `src/styles/globals.css` - Global Styles

### Konfigurationsdateien
- ✅ `package.json` - Dependencies und Scripts
- ✅ `electron-builder.yml` - Electron Builder Konfiguration
- ✅ `vite.config.ts` - Vite/Electron Integration
- ✅ `tsconfig.json` - TypeScript Hauptkonfiguration
- ✅ `tsconfig.electron.json` - Electron TypeScript Config
- ✅ `tsconfig.node.json` - Node.js TypeScript Config
- ✅ `tailwind.config.js` - Tailwind CSS Konfiguration
- ✅ `postcss.config.js` - PostCSS Konfiguration
- ✅ `index.html` - HTML Entry Point

### Assets & Resources
- ✅ `resources/icon.ico` - Windows Icon
- ✅ `resources/icon.icns` - macOS Icon
- ✅ `resources/icon.png` - Linux Icon
- ✅ `resources/icons/*` - Alle Icon-Varianten
- ✅ `resources/Info.plist` - macOS App Configuration

### Dokumentation
- ✅ `README.md` - Hauptdokumentation
- ✅ `CHANGELOG.md` - Versionshistorie
- ✅ `QUICKSTART.md` - Schnellstart-Anleitung
- ✅ `META_TEMPLATES.md` - Metaprompt-Dokumentation
- ✅ `THEME.md` - Design-System Dokumentation
- ✅ `VERSIONING.md` - Versionsrichtlinien
- ✅ `APP_ICON.md` - Icon-Generierung Dokumentation

### GitHub & CI/CD
- ✅ `.github/workflows/release.yml` - Automated Release Workflow
- ✅ `.gitignore` - Git Ignore Rules
- ✅ `.npmrc` - npm Konfiguration

## Build-Output (Werden ignoriert, können gelöscht werden)

- ❌ `dist/` - Frontend Build Output (wird bei jedem Build neu erstellt)
- ❌ `dist-electron/` - Electron Build Output (wird bei jedem Build neu erstellt)
- ❌ `node_modules/` - Dependencies (werden mit `npm install` neu installiert)

## Checkliste vor Git-Operationen

Vor `git checkout`, `git reset` oder anderen Operationen, die den Working Directory ändern:

1. ✅ Alle uncommitted Änderungen committed?
2. ✅ Wichtige Dateien in Git versioniert?
3. ✅ Backup erstellt (optional, aber empfohlen)?

## Wiederherstellung nach versehentlichem Löschen

Falls wichtige Dateien verloren gehen:

```bash
# Zu einem früheren Commit zurückgehen
git checkout <commit-hash> -- <file-path>

# Alle Dateien aus einem Commit wiederherstellen
git checkout <commit-hash> -- .

# Zu einem Branch zurückkehren
git checkout <branch-name>
```

## Regelmäßige Backups

Empfohlen: Regelmäßige Commits und Pushes zu einem Remote-Repository (GitHub, GitLab, etc.)

```bash
# Regelmäßig committen
git add .
git commit -m "Wichtige Änderungen"
git push origin main
```
