import Store from 'electron-store';
import { safeStorage } from 'electron';
import type { Settings, Metaprompt, Provider } from '../src/types';

const store = new Store<{
  settings: Settings;
  metaprompts: Metaprompt[];
  history: any[];
}>({
  name: 'mrp-config',
  defaults: {
    settings: {
      launchAtStartup: false,
      minimizeToTray: true,
      showNotifications: true,
      showOnboarding: true,  // Standardmäßig beim ersten Start anzeigen
      globalShortcut: 'CommandOrControl+Shift+O',
      metapromptNextShortcut: '',  // Optional: Standardmäßig nicht gesetzt
      metapromptPrevShortcut: '',  // Optional: Standardmäßig nicht gesetzt
      activeProvider: 'openai',
      defaultModel: {
        openai: 'gpt-4o',
        anthropic: 'claude-3-5-sonnet-20241022', // Fallback: claude-3-5-sonnet-20240229
        grok: 'grok-2-latest',
        gemini: 'gemini-1.5-pro-latest',
      },
      maxTokens: 2048,
      temperature: 0.7,
      activeMetapromptId: '',
    },
    metaprompts: [],
    history: [],
  },
});

// API Keys werden separat verschlüsselt gespeichert
const apiKeyStore = new Store<Record<Provider, string>>({
  name: 'mrp-api-keys',
  encryptionKey: safeStorage.isEncryptionAvailable() ? undefined : 'fallback-key-not-secure',
});

export const getSettings = (): Settings => {
  const currentSettings = store.get('settings') as Settings;
  
  // Migration: Aktualisiere alten Shortcut auf neuen Standard
  if (currentSettings.globalShortcut === 'CommandOrControl+Shift+M') {
    currentSettings.globalShortcut = 'CommandOrControl+Shift+O';
    store.set('settings', currentSettings);
  }
  
  // Migration: Stelle sicher, dass showOnboarding existiert (für bestehende Nutzer)
  if (currentSettings.showOnboarding === undefined) {
    currentSettings.showOnboarding = true;
    store.set('settings', currentSettings);
  }
  
  return currentSettings;
};

export const setSettings = (settings: Partial<Settings>): void => {
  const current = getSettings();
  store.set('settings', { ...current, ...settings });
};

export const getApiKey = (provider: Provider): string | null => {
  if (!safeStorage.isEncryptionAvailable()) {
    return apiKeyStore.get(provider) || null;
  }
  
  const encrypted = apiKeyStore.get(provider);
  if (!encrypted) return null;
  
  try {
    const buffer = Buffer.from(encrypted, 'base64');
    return safeStorage.decryptString(buffer);
  } catch {
    return null;
  }
};

export const setApiKey = (provider: Provider, key: string): void => {
  if (!safeStorage.isEncryptionAvailable()) {
    apiKeyStore.set(provider, key);
    return;
  }
  
  const encrypted = safeStorage.encryptString(key);
  apiKeyStore.set(provider, encrypted.toString('base64'));
};

export const getMetaprompts = (): Metaprompt[] => {
  const metaprompts = store.get('metaprompts', []) as Metaprompt[];
  
  // Migration: Setze active für bestehende Metaprompts
  let needsUpdate = false;
  const migrated = metaprompts.map(mp => {
    if (mp.active === undefined) {
      needsUpdate = true;
      // Standard-Metaprompt ist immer aktiv, alle anderen werden aktiv gesetzt (kann später deaktiviert werden)
      return { ...mp, active: mp.isDefault ? true : true };
    }
    return mp;
  });
  
  if (needsUpdate) {
    store.set('metaprompts', migrated);
    return migrated;
  }
  
  return metaprompts;
};

export const saveMetaprompt = (metaprompt: Metaprompt): void => {
  const metaprompts = getMetaprompts();
  const index = metaprompts.findIndex(m => m.id === metaprompt.id);
  
  if (index >= 0) {
    metaprompts[index] = metaprompt;
  } else {
    metaprompts.push(metaprompt);
  }
  
  store.set('metaprompts', metaprompts);
};

export const deleteMetaprompt = (id: string): void => {
  const metaprompts = getMetaprompts();
  const metapromptToDelete = metaprompts.find(m => m.id === id);
  
  // Verhindere Löschen des Standard-Metaprompts
  if (metapromptToDelete?.isDefault) {
    throw new Error('Der Standard-Metaprompt kann nicht gelöscht werden');
  }
  
  const filtered = metaprompts.filter(m => m.id !== id);
  store.set('metaprompts', filtered);
};

export const toggleFavorite = (id: string): void => {
  const metaprompts = getMetaprompts();
  const metaprompt = metaprompts.find(m => m.id === id);
  
  // Verhindere, dass der Standard-Metaprompt als Favorit gesetzt wird
  if (metaprompt?.isDefault) {
    throw new Error('Der Standard-Metaprompt kann nicht als Favorit gesetzt werden');
  }
  
  const index = metaprompts.findIndex(m => m.id === id);
  
  if (index >= 0) {
    metaprompts[index] = {
      ...metaprompts[index],
      isFavorite: !metaprompts[index].isFavorite,
      updatedAt: new Date(),
    };
    store.set('metaprompts', metaprompts);
  }
};

export const toggleActive = (id: string): void => {
  const metaprompts = getMetaprompts();
  const metaprompt = metaprompts.find(m => m.id === id);
  
  // Verhindere, dass der Standard-Metaprompt deaktiviert wird
  if (metaprompt?.isDefault) {
    throw new Error('Der Standard-Metaprompt kann nicht deaktiviert werden');
  }
  
  const index = metaprompts.findIndex(m => m.id === id);
  
  if (index >= 0) {
    metaprompts[index] = {
      ...metaprompts[index],
      active: !(metaprompts[index].active ?? true), // Default ist true wenn undefined
      updatedAt: new Date(),
    };
    store.set('metaprompts', metaprompts);
  }
};

export const getHistory = () => {
  return store.get('history', []);
};

export const addHistory = (entry: any): void => {
  const history = getHistory();
  history.unshift(entry);
  // Nur die letzten 20 Einträge behalten
  if (history.length > 20) {
    history.splice(20);
  }
  store.set('history', history);
};

export default store;

