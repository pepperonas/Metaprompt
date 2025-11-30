import Store from 'electron-store';
import { app } from 'electron';
import { v4 as uuidv4 } from 'uuid';

interface AnalyticsData {
  appId: string | null;
  lastVersion: string | null;
}

const analyticsStore = new Store<AnalyticsData>({
  name: 'mrp-analytics',
  defaults: {
    appId: null,
    lastVersion: null,
  },
});

const API_URL = process.env.ANALYTICS_URL || 'https://metaprompt.celox.io/api/metaprompt';
const API_ENABLED = process.env.ANALYTICS_ENABLED !== 'false'; // Default: enabled

// Für Development: Lokaler Server
// const API_URL = process.env.ANALYTICS_URL || 'http://localhost:3000';

/**
 * Gibt die App-ID zurück oder erstellt eine neue
 */
export const getOrCreateAppId = (): string => {
  let appId = analyticsStore.get('appId');
  
  if (!appId) {
    appId = uuidv4();
    analyticsStore.set('appId', appId);
    console.log('[Analytics] Generated new app ID:', appId);
  }
  
  return appId;
};

/**
 * Trackt ein Event (silent fail bei Fehlern)
 */
export const trackEvent = async (
  eventType: string,
  metadata: Record<string, any> = {}
): Promise<void> => {
  if (!API_ENABLED) {
    return;
  }
  
  try {
    const appId = getOrCreateAppId();
    const version = app.getVersion();
    const platform = process.platform;
    const locale = app.getLocale();
    
    const payload = {
      appId,
      event: eventType,
      version,
      platform,
      locale,
      metadata,
    };
    
    // Timeout nach 2 Sekunden
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`${API_URL}/api/metaprompt/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn('[Analytics] Failed to track event:', response.status);
    }
  } catch (error) {
    // Silent fail - App funktioniert weiterhin
    if (error instanceof Error && error.name !== 'AbortError') {
      console.warn('[Analytics] Error tracking event:', error.message);
    }
  }
};

/**
 * Trackt App-Start
 */
export const trackAppLaunch = async (): Promise<void> => {
  const currentVersion = app.getVersion();
  const lastVersion = analyticsStore.get('lastVersion');
  
  // Prüfe ob Update
  if (lastVersion && lastVersion !== currentVersion) {
    await trackEvent('app_updated', {
      fromVersion: lastVersion,
      toVersion: currentVersion,
    });
  }
  
  // Track Launch
  await trackEvent('app_launched');
  
  // Speichere aktuelle Version
  analyticsStore.set('lastVersion', currentVersion);
};

/**
 * Trackt erfolgreiche Prompt-Optimierung
 */
export const trackOptimization = async (metadata?: {
  provider?: string;
  metapromptId?: string;
  success?: boolean;
}): Promise<void> => {
  await trackEvent('optimization_completed', metadata || {});
};

/**
 * Trackt Metaprompt-Wechsel
 */
export const trackMetapromptSwitch = async (metapromptId: string): Promise<void> => {
  await trackEvent('metaprompt_switched', {
    metapromptId,
  });
};

/**
 * Prüft ob Analytics aktiviert ist
 */
export const isAnalyticsEnabled = (): boolean => {
  return API_ENABLED;
};

