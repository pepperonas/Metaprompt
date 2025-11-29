# Versionsrichtlinien

## Semantische Versionierung: MAJOR.MINOR.PATCH

Die App verwendet **Semantische Versionierung** im Format `MAJOR.MINOR.PATCH`:

- **MAJOR**: Hauptversion für größere Änderungen (Breaking Changes, große Refactorings)
- **MINOR**: Nebenversion für neue Features (neue Funktionen, die rückwärtskompatibel sind)
- **PATCH**: Patch-Version für Bugfixes (Fehlerbehebungen, kleine Verbesserungen)

## Versionsrichtlinien

### Patch-Erhöhung (PATCH)
- Bei Bugfixes und kleinen Verbesserungen
- **Nach 9 Patches** (z.B. 0.0.9) → Minor erhöhen (0.1.0)
- **Nach 9 Patches** (z.B. 1.0.9) → Minor erhöhen (1.1.0)

### Minor-Erhöhung (MINOR)
- Bei neuen Features, die rückwärtskompatibel sind
- **Nach 9 Minors** (z.B. 0.9.x) → Major erhöhen (1.0.0)
- **Nach 9 Minors** (z.B. 1.9.x) → Major erhöhen (2.0.0)

### Major-Erhöhung (MAJOR)
- Bei Breaking Changes oder großen Refactorings
- Kann jederzeit erfolgen, wenn notwendig

## Beispiele

### Patch-Zyklus
```
0.0.1 → 0.0.2 → 0.0.3 → ... → 0.0.9 → 0.1.0
1.0.0 → 1.0.1 → 1.0.2 → ... → 1.0.9 → 1.1.0
```

### Minor-Zyklus
```
0.1.0 → 0.2.0 → 0.3.0 → ... → 0.9.0 → 1.0.0
1.1.0 → 1.2.0 → 1.3.0 → ... → 1.9.0 → 2.0.0
```

### Vollständiger Zyklus
```
0.0.1 → 0.0.2 → ... → 0.0.9 → 0.1.0
0.1.0 → 0.1.1 → ... → 0.1.9 → 0.2.0
...
0.9.0 → 0.9.1 → ... → 0.9.9 → 1.0.0
1.0.0 → 1.0.1 → ... → 1.0.9 → 1.1.0
```

## Aktuelle Version

Die aktuelle Version ist in `package.json` definiert und wird automatisch in der App angezeigt.

## Versionierung bei Commits

Bei jeder Versionsänderung sollte:
1. Die Version in `package.json` aktualisiert werden
2. Ein entsprechender Eintrag im `CHANGELOG.md` erstellt werden
3. Die Versionsnummer in der Dokumentation aktualisiert werden (falls erwähnt)

