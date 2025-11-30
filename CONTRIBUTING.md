# Contributing to Metaprompt

Vielen Dank für dein Interesse, zu Metaprompt beizutragen! 🎉

## Code of Conduct

Dieses Projekt folgt einem Code of Conduct. Durch die Teilnahme stimmst du zu, respektvoll und inklusiv zu sein.

## Wie kann ich beitragen?

### Fehler melden

Wenn du einen Fehler findest, erstelle bitte ein [Issue](https://github.com/pepperonas/Metaprompt/issues) mit:
- Einer klaren Beschreibung des Problems
- Schritten zur Reproduktion
- Erwartetem vs. tatsächlichem Verhalten
- Screenshots (falls zutreffend)
- Systeminformationen (OS, Version)

### Feature-Vorschläge

Feature-Vorschläge sind willkommen! Erstelle ein [Issue](https://github.com/pepperonas/Metaprompt/issues) mit:
- Einer klaren Beschreibung des Features
- Begründung, warum es nützlich wäre
- Möglichen Implementierungsansätzen (optional)

### Pull Requests

1. Forke das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Pushe zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

### Entwicklungsumgebung einrichten

```bash
# Repository klonen
git clone https://github.com/pepperonas/Metaprompt.git
cd Metaprompt

# Dependencies installieren
npm install

# Development Server starten
npm start
```

### Code-Stil

- Verwende TypeScript für alle neuen Dateien
- Folge den bestehenden Code-Konventionen
- Verwende aussagekräftige Commit-Messages
- Stelle sicher, dass der Code ohne Fehler kompiliert

### Projektstruktur

```
metaprompt/
├── electron/          # Electron Main Process
├── src/              # React Frontend
│   ├── components/   # UI Komponenten
│   ├── pages/        # Seiten
│   ├── stores/       # Zustand Stores
│   ├── services/     # API Services
│   └── types/        # TypeScript Typen
├── resources/        # App Icons & Assets
└── docs/             # Dokumentation
```

### Testing

Bevor du einen Pull Request erstellst, stelle sicher, dass:
- Der Code kompiliert (`npm run build`)
- Die App startet (`npm start`)
- Keine TypeScript-Fehler vorhanden sind

### Fragen?

Bei Fragen erstelle einfach ein Issue oder kontaktiere die Maintainer.

Vielen Dank für deinen Beitrag! 🙏

