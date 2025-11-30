# GitHub Actions Workflows

## Release Workflow

Der `release.yml` Workflow baut automatisch die App für alle Plattformen und erstellt ein GitHub Release.

### Trigger

Der Workflow wird automatisch ausgelöst, wenn:
- Ein Version-Tag gepusht wird (Format: `v*.*.*`, z.B. `v1.1.5`)
- Manuell über "Actions" → "Build and Release" → "Run workflow" gestartet wird

### Builds

Der Workflow erstellt Builds für:
- **macOS**: Universal Build (Intel + Apple Silicon) als DMG
- **Windows**: Portable EXE-Datei
- **Linux**: AppImage

### Release erstellen

Um ein neues Release zu erstellen:

1. Stelle sicher, dass die Version in `package.json` korrekt ist
2. Committe und pushe alle Änderungen
3. Erstelle einen Tag: `git tag v1.1.5`
4. Pushe den Tag: `git push origin v1.1.5`

Der Workflow wird automatisch gestartet und:
- Baut die App für alle Plattformen
- Erstellt ein GitHub Release mit allen Builds
- Fügt automatisch Release-Notes hinzu

### Manueller Start

Der Workflow kann auch manuell gestartet werden:
1. Gehe zu "Actions" im GitHub Repository
2. Wähle "Build and Release"
3. Klicke auf "Run workflow"
4. Wähle den Branch (normalerweise `main`)
5. Klicke auf "Run workflow"

**Hinweis**: Bei manuellem Start wird kein Release erstellt, nur die Builds werden als Artifacts verfügbar gemacht.

