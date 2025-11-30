import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { 
  initDatabase, 
  saveEvent, 
  getStats, 
  getDailyActive, 
  getOptimizationsPerDay,
  cleanupOldEvents,
  getRecentRequestCount
} from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'change-me-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Rate Limiting für Track-Endpoint (10 requests/Minute pro IP)
const trackLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 Minute
  max: 10,
  message: { error: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting für Health Checks
    return req.path === '/health';
  },
});

// Rate Limiting für App-ID (zusätzlich)
const appIdLimiter = (req, res, next) => {
  try {
    const appId = req.body?.appId;
    if (!appId) {
      return next();
    }
    
    const recentCount = getRecentRequestCount(appId, 1);
    if (recentCount >= 10) {
      return res.status(429).json({ error: 'Rate limit exceeded for app_id' });
    }
    
    next();
  } catch (error) {
    console.warn('[Server] Error in appIdLimiter:', error);
    // Bei Fehler trotzdem durchlassen (silent fail)
    next();
  }
};

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Track Event
app.post('/api/track', trackLimiter, appIdLimiter, (req, res) => {
  try {
    const { appId, event, version, platform, locale, metadata } = req.body;
    
    // Validierung
    if (!appId || !event || !version || !platform) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // UUID-Format prüfen (einfach)
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(appId)) {
      return res.status(400).json({ error: 'Invalid app_id format' });
    }
    
    // Event speichern
    saveEvent(appId, event, version, platform, locale, metadata || {});
    
    res.json({ ok: true });
  } catch (error) {
    console.error('[Server] Error tracking event:', error);
    // Silent fail - antworte trotzdem mit 200, damit App weiter funktioniert
    res.json({ ok: false, error: 'Failed to save event' });
  }
});

// Admin: Statistiken
app.get('/stats', (req, res) => {
  const key = req.query.key;
  
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const stats = getStats();
    res.json(stats);
  } catch (error) {
    console.error('[Server] Error getting stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Tägliche aktive Nutzer
app.get('/stats/daily', (req, res) => {
  const key = req.query.key;
  
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const days = parseInt(req.query.days) || 30;
    const data = getDailyActive(days);
    res.json(data);
  } catch (error) {
    console.error('[Server] Error getting daily stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Version-Verteilung
app.get('/stats/versions', (req, res) => {
  const key = req.query.key;
  
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const stats = getStats();
    res.json(stats.versions);
  } catch (error) {
    console.error('[Server] Error getting version stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Plattform-Verteilung
app.get('/stats/platforms', (req, res) => {
  const key = req.query.key;
  
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const stats = getStats();
    res.json(stats.platforms);
  } catch (error) {
    console.error('[Server] Error getting platform stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Optimierungen pro Tag
app.get('/stats/optimizations', (req, res) => {
  const key = req.query.key;
  
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const days = parseInt(req.query.days) || 30;
    const data = getOptimizationsPerDay(days);
    res.json(data);
  } catch (error) {
    console.error('[Server] Error getting optimization stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Server starten
function startServer() {
  // Datenbank initialisieren
  try {
    initDatabase();
  } catch (error) {
    console.error('[Server] Failed to initialize database:', error);
    process.exit(1);
  }
  
  // Alte Events aufräumen (beim Start)
  try {
    cleanupOldEvents();
  } catch (error) {
    console.warn('[Server] Failed to cleanup old events:', error);
  }
  
  // Regelmäßige Cleanup (täglich)
  setInterval(() => {
    try {
      cleanupOldEvents();
    } catch (error) {
      console.warn('[Server] Failed to cleanup old events:', error);
    }
  }, 24 * 60 * 60 * 1000); // 24 Stunden
  
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`[Server] Analytics server running on http://127.0.0.1:${PORT}`);
    console.log(`[Server] Admin key: ${ADMIN_KEY.substring(0, 8)}...`);
    console.log(`[Server] Database: ${process.env.DB_PATH || './analytics.db'}`);
  });
}

startServer();

