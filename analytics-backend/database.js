import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = process.env.DB_PATH || join(__dirname, 'analytics.db');

// Stelle sicher, dass das Verzeichnis existiert
const dbDir = dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db;
try {
  db = new Database(DB_PATH);
} catch (error) {
  console.error('[Database] Failed to open database:', error);
  throw error;
}

// WAL-Mode für bessere Performance
db.pragma('journal_mode = WAL');

// Initialisiere Schema
export function initDatabase() {
  try {
    // Events Tabelle
    db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        app_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        version TEXT NOT NULL,
        platform TEXT NOT NULL,
        locale TEXT,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_app_id ON events(app_id);
      CREATE INDEX IF NOT EXISTS idx_event_type ON events(event_type);
      CREATE INDEX IF NOT EXISTS idx_created_at ON events(created_at);
      CREATE INDEX IF NOT EXISTS idx_version ON events(version);
      CREATE INDEX IF NOT EXISTS idx_platform ON events(platform);
    `);

    // Daily Active Users View (Materialized als Tabelle für Performance)
    db.exec(`
      CREATE TABLE IF NOT EXISTS daily_active (
        date DATE PRIMARY KEY,
        unique_count INTEGER NOT NULL DEFAULT 0,
        event_count INTEGER NOT NULL DEFAULT 0,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_daily_date ON daily_active(date);
    `);

    console.log('[Database] Schema initialized');
  } catch (error) {
    console.error('[Database] Failed to initialize schema:', error);
    throw error;
  }
}

// Event speichern
export function saveEvent(appId, eventType, version, platform, locale, metadata = {}) {
  try {
    const stmt = db.prepare(`
      INSERT INTO events (app_id, event_type, version, platform, locale, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const metadataJson = JSON.stringify(metadata);
    stmt.run(appId, eventType, version, platform, locale || null, metadataJson);
    
    // Update daily active users (async, non-blocking)
    try {
      updateDailyActive();
    } catch (error) {
      console.warn('[Database] Failed to update daily active:', error);
    }
  } catch (error) {
    console.error('[Database] Failed to save event:', error);
    throw error;
  }
}

// Daily Active Users aktualisieren
function updateDailyActive() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Zähle unique app_ids für heute
    const uniqueCount = db.prepare(`
      SELECT COUNT(DISTINCT app_id) as count
      FROM events
      WHERE DATE(created_at) = ?
    `).get(today);
    
    const eventCount = db.prepare(`
      SELECT COUNT(*) as count
      FROM events
      WHERE DATE(created_at) = ?
    `).get(today);
    
    const upsert = db.prepare(`
      INSERT INTO daily_active (date, unique_count, event_count, last_updated)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(date) DO UPDATE SET
        unique_count = excluded.unique_count,
        event_count = excluded.event_count,
        last_updated = CURRENT_TIMESTAMP
    `);
    
    upsert.run(today, uniqueCount.count, eventCount.count);
  } catch (error) {
    console.warn('[Database] Error updating daily active:', error);
    // Nicht werfen, damit Event-Speicherung nicht fehlschlägt
  }
}

// Statistiken abrufen
export function getStats() {
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Heute
  const todayStats = db.prepare(`
    SELECT 
      COUNT(DISTINCT app_id) as users,
      COUNT(*) as events
    FROM events
    WHERE DATE(created_at) = ?
  `).get(today);
  
  // Diese Woche
  const weekStats = db.prepare(`
    SELECT 
      COUNT(DISTINCT app_id) as users,
      COUNT(*) as events
    FROM events
    WHERE DATE(created_at) >= ?
  `).get(weekAgo);
  
  // Dieser Monat
  const monthStats = db.prepare(`
    SELECT 
      COUNT(DISTINCT app_id) as users,
      COUNT(*) as events
    FROM events
    WHERE DATE(created_at) >= ?
  `).get(monthAgo);
  
  // Version-Verteilung
  const versions = db.prepare(`
    SELECT version, COUNT(DISTINCT app_id) as count
    FROM events
    WHERE DATE(created_at) >= ?
    GROUP BY version
    ORDER BY count DESC
  `).all(monthAgo);
  
  const versionMap = {};
  versions.forEach(v => {
    versionMap[v.version] = v.count;
  });
  
  // Plattform-Verteilung
  const platforms = db.prepare(`
    SELECT platform, COUNT(DISTINCT app_id) as count
    FROM events
    WHERE DATE(created_at) >= ?
    GROUP BY platform
    ORDER BY count DESC
  `).all(monthAgo);
  
  const platformMap = {};
  platforms.forEach(p => {
    platformMap[p.platform] = p.count;
  });
  
  return {
    today: {
      users: todayStats.users || 0,
      events: todayStats.events || 0
    },
    week: {
      users: weekStats.users || 0,
      events: weekStats.events || 0
    },
    month: {
      users: monthStats.users || 0,
      events: monthStats.events || 0
    },
    versions: versionMap,
    platforms: platformMap
  };
}

// Tägliche aktive Nutzer (letzte 30 Tage)
export function getDailyActive(days = 30) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const results = db.prepare(`
    SELECT date, unique_count, event_count
    FROM daily_active
    WHERE date >= ?
    ORDER BY date ASC
  `).all(startDate);
  
  return results;
}

// Optimierungen pro Tag (letzte 30 Tage)
export function getOptimizationsPerDay(days = 30) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const results = db.prepare(`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as count
    FROM events
    WHERE event_type = 'optimization_completed'
      AND DATE(created_at) >= ?
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `).all(startDate);
  
  return results;
}

// Alte Events löschen (älter als 90 Tage)
export function cleanupOldEvents() {
  const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  
  const result = db.prepare(`
    DELETE FROM events
    WHERE created_at < ?
  `).run(cutoffDate);
  
  console.log(`[Database] Cleaned up ${result.changes} old events`);
  return result.changes;
}

// Rate-Limiting: Prüfe wie viele Requests in letzter Minute
export function getRecentRequestCount(appId, minutes = 1) {
  const cutoff = new Date(Date.now() - minutes * 60 * 1000).toISOString();
  
  const result = db.prepare(`
    SELECT COUNT(*) as count
    FROM events
    WHERE app_id = ? AND created_at > ?
  `).get(appId, cutoff);
  
  return result.count || 0;
}

// Datenbank schließen
export function closeDatabase() {
  db.close();
}

export default db;

