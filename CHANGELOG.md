# Changelog

## [1.0.1] - 2025-11-29

### Hinzugefügt
- **7 vorgefertigte Metaprompts**: Professionelle Metaprompts werden beim ersten Start automatisch erstellt
  - Software-Entwicklung
  - Kommunikation
  - Datenanalyse
  - Rechtssprechung
  - Business
  - Bildgenerierung
  - Bildbearbeitung
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

