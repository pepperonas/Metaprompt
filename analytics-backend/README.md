# Metaprompt Analytics Backend

Privacy-first Analytics-System für die Metaprompt Electron-App.

## Features

- ✅ DSGVO-konform: Keine IP-Adressen, keine Cookies
- ✅ Anonyme UUID pro Installation
- ✅ Rate-Limiting (10 requests/Minute)
- ✅ Auto-Cleanup (Events älter als 90 Tage)
- ✅ SQLite-Datenbank (kein separater DB-Server nötig)

## Installation

```bash
npm install
```

## Konfiguration

Kopiere `.env.example` zu `.env` und passe an:

```bash
cp .env.example .env
```

Wichtig: Setze einen starken `ADMIN_KEY`!

## Datenbank initialisieren

```bash
npm run init-db
```

Oder automatisch beim ersten Start.

## Server starten

```bash
npm start
```

Development mit Auto-Reload:

```bash
npm run dev
```

## API Endpoints

**Basis-URL**: `https://metaprompt.celox.io/api/metaprompt`

### POST /track
Trackt ein Event.

**Request:**
```json
{
  "appId": "uuid-v4",
  "event": "app_launched",
  "version": "1.2.0",
  "platform": "darwin",
  "locale": "de-DE",
  "metadata": {}
}
```

**Response:**
```json
{ "ok": true }
```

### GET /stats?key=ADMIN_KEY
Haupt-Statistiken (Heute, Diese Woche, Dieser Monat, Versionen, Plattformen).

**Response:**
```json
{
  "today": { "users": 142, "events": 891 },
  "week": { "users": 523, "events": 4201 },
  "month": { "users": 1847, "events": 18420 },
  "versions": { "1.2.0": 65, "1.1.0": 28 },
  "platforms": { "darwin": 45, "win32": 48, "linux": 7 }
}
```

### GET /stats/daily?key=ADMIN_KEY&days=30
Tägliche aktive Nutzer für die letzten N Tage.

### GET /stats/versions?key=ADMIN_KEY
Verteilung der App-Versionen.

### GET /stats/platforms?key=ADMIN_KEY
Verteilung der Betriebssysteme.

### GET /stats/optimizations?key=ADMIN_KEY&days=30
Optimierungen pro Tag für die letzten N Tage.

### GET /health
Health-Check-Endpoint (kein Admin-Key erforderlich).

## Admin Dashboard

Das Dashboard ist unter `/admin/index.html` verfügbar.

Zugriff: `https://metaprompt.celox.io/admin?key=ADMIN_KEY`

## Docker

```bash
docker build -t metaprompt-analytics .
docker run -d \
  -p 3030:3030 \
  -v $(pwd)/data:/app/data \
  -e ADMIN_KEY=your-secret-key \
  -e DB_PATH=/app/data/analytics.db \
  metaprompt-analytics
```

## Deployment auf VPS

Siehe `DEPLOYMENT.md` für detaillierte Anleitung.

## DSGVO-Hinweis

Dieses System speichert:
- ✅ Anonyme App-ID (UUID)
- ✅ Event-Typ
- ✅ App-Version
- ✅ Plattform (OS)
- ✅ Locale
- ✅ Timestamp

**Nicht gespeichert:**
- ❌ IP-Adressen
- ❌ Persönliche Daten
- ❌ Cookies
- ❌ Geräte-IDs

Alle Events werden nach 90 Tagen automatisch gelöscht.

