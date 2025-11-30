# Changelog

## [1.3.0] - 2025-11-30

### Hinzugefügt
- **Privacy-first Analytics-System**:
  - DSGVO-konformes Analytics-Backend mit SQLite-Datenbank
  - Automatisches Tracking von App-Starts, Optimierungen und Metaprompt-Wechseln
  - Anonyme UUID pro Installation (keine IP-Adressen, keine Cookies)
  - Automatisches Cleanup von Events älter als 90 Tage
  - Admin-Dashboard mit Visualisierungen für:
    - Tägliche aktive Nutzer
    - Version-Verteilung
    - Plattform-Verteilung
    - Optimierungen pro Tag
  - Rate-Limiting (10 requests/Minute) für API-Schutz
  - Silent fail: App funktioniert auch bei Server-Ausfall
  - Deployment auf VPS mit Nginx, SSL und PM2

### Verbessert
- **Sicherheit**: Admin-Keys werden nicht mehr in Dokumentation hardcodiert
- **Dokumentation**: Umfassende Deployment-Anleitung für Analytics-Backend

## [1.1.6] - 2025-11-30

### Hinzugefügt
- **Installer-Pakete für alle Plattformen**:
  - **Windows**: NSIS One-Click Installer (`.exe`) - Automatische Installation ohne Schritt-für-Schritt-Bestätigungen
  - **macOS**: DMG Installer - Universal Build für Intel und Apple Silicon
  - **Linux**: 
    - DEB Package für Debian/Ubuntu
    - RPM Package für Fedora/RedHat
    - AppImage für portable Nutzung
- **Automatisierte GitHub Releases**: Alle Installer werden automatisch bei jedem Release-Tag erstellt und auf GitHub veröffentlicht
- **IMPORTANT_FILES.md**: Dokumentation aller wichtigen Dateien, die nicht gelöscht werden sollten

### Geändert
- **Windows Build**: Von portable `.exe` zu NSIS Installer gewechselt
- **Linux Build**: Zusätzlich zu AppImage werden jetzt auch DEB und RPM Pakete erstellt
- **GitHub Actions Workflow**: Aktualisiert für automatische Erstellung aller Installer-Pakete

### Verbessert
- **Installation**: Einfacheres Installieren auf allen Plattformen durch native Installer
- **Windows**: Desktop- und Startmenü-Verknüpfungen werden automatisch erstellt
- **Dokumentation**: Umfassende Installationsanleitungen für alle Plattformen

## [1.0.3] - 2025-01-29

### Behoben
- **Prompt-Optimierung**: API-Calls laufen jetzt korrekt im Main-Prozess (kein CORS-Problem mehr)
- **Metaprompt-Verarbeitung**: Platzhalter `{user_prompt}` wird jetzt korrekt durch den User-Prompt ersetzt
- **Notification beim Start**: System-Notification erscheint jetzt sofort beim Start der Optimierung
- **Tray-Menü**: Optimierung funktioniert jetzt korrekt über das Tray-Menü
- **Shortcut**: Optimierung funktioniert jetzt korrekt über den globalen Shortcut
- **Debug-Logs**: Umfangreiche Debug-Logs hinzugefügt für besseres Troubleshooting

### Verbessert
- **API-Services**: Direkte Implementierung im Main-Prozess für alle Provider (OpenAI, Anthropic, Grok, Gemini)
- **Fehlerbehandlung**: Verbesserte Fehlerbehandlung und Fehlermeldungen
- **Content-Extraktion**: Robustere Content-Extraktion aus API-Antworten

## [1.0.2] - 2025-11-29

### Behoben
- **Onboarding-Dialog**: Wird jetzt nur beim ersten App-Start angezeigt, nicht mehr beim Navigieren zwischen Seiten
- **Tray-Icon Verhalten**: Klick auf das Tray-Icon zeigt das Fenster jetzt immer an/fokussiert es, ohne es zu verstecken

## [1.0.1] - 2025-11-29

### Hinzugefügt
- **60+ vorgefertigte Metaprompts**: Professionelle Metaprompts werden beim ersten Start automatisch erstellt, organisiert in Kategorien:
  - Entwicklung (Software, Frontend, Backend, API, DevOps, Testing, Code-Review, etc.)
  - Kommunikation (Präsentationen, Berichte, Übersetzungen)
  - Datenanalyse (ML, Statistik, Zeitreihen, Predictive Analytics, A/B-Testing, etc.)
  - Business (Strategie, Projektmanagement, Finanzen, Verkauf, etc.)
  - Marketing (Content, SEO, Social Media, E-Mail, Produktbeschreibungen, etc.)
  - Recht (Verträge, Arbeitsrecht, DSGVO, Compliance, Markenrecht)
  - Design (Bildgenerierung, UI/UX, Logo, Web, Video, 3D, Fotografie)
  - Bildung, Kreativ, Lifestyle und mehr
- **App-Icon**: Eigenes App-Logo für Tray und Dock
- **Icon-Generierungs-Script**: Automatische Generierung von Icons in verschiedenen Formaten (ICO, ICNS, PNG)

### Geändert
- **Standard-Shortcut**: Von `Ctrl+Shift+M` auf `Ctrl+Shift+O` geändert
- **API-Keys Tab**: Alle 4 Provider werden jetzt untereinander angezeigt (statt Tabs)
- **Metaprompt-Auswahl**: Im Dashboard per Dropdown statt "Aktivieren"-Button
- **Tray-Icon**: Verwendet jetzt das App-Logo (16x16 Pixel) statt Standard-Electron-Icon

### Verbessert
- Tray-Icon-Größe korrigiert für macOS
- Icon-Pfad-Auflösung für Dev- und Production-Mode verbessert
- Doppelter App-Start im Dev-Mode behoben
- Standard-Metaprompt kann nicht gelöscht oder bearbeitet werden
- Aktiver Metaprompt wird im Metaprompts-Tab mit blauem Rahmen hervorgehoben

### Behoben
- Doppelter IPC-Handler für `app:getVersion` entfernt
- Tray-Icon wird jetzt korrekt in Dev- und Production-Mode geladen

## [1.0.0] - 2025-01-28

### Geändert
- **Konzept klargestellt**: Metaprompts sind jetzt explizit als **Vorlagen** definiert, die normale Prompts optimieren
- UI-Texte angepasst, um klar zu machen, dass Metaprompts Vorlagen sind
- README und QUICKSTART aktualisiert mit besserer Erklärung des Konzepts

### Hinzugefügt
- **KI-generierte Metaprompts**: Neue Funktion zum Generieren von Metaprompts mit KI
  - Beschreibe einen Anwendungsfall (z.B. "Code-Generierung", "Kreatives Schreiben")
  - Die KI erstellt automatisch eine passende Metaprompt-Vorlage
  - Generierte Metaprompts können direkt gespeichert und aktiviert werden

### Verbessert
- Metaprompts-Seite zeigt jetzt zwei Optionen: "Mit KI generieren" und "Manuell erstellen"
- Dashboard zeigt klar an, welche Metaprompt-Vorlage aktiv ist
- Bessere Beschreibungen in der UI für das Konzept der Metaprompts

