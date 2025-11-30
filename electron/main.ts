import { app, BrowserWindow, ipcMain, Notification } from 'electron';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import path from 'path';
import { createTray, updateTrayMenu, destroyTray } from './tray';
import { registerGlobalShortcut, unregisterAllShortcuts, registerMetapromptShortcuts } from './shortcuts';
import { getSettings, setSettings, getApiKey, setApiKey, getMetaprompts, saveMetaprompt, deleteMetaprompt, toggleFavorite, getHistory, addHistory } from './store';
import { getCostsLast30Days } from './costTracking';
import { calculateCost } from '../src/utils/costCalculator';
import { readClipboard, writeClipboard } from './clipboard';
import { optimizePrompt } from './optimizer';
import { validateApiKeyDirect } from './validateApiKey';
import { DEFAULT_METAPROMPT } from '../src/types';
import { createDefaultMetaprompts } from '../src/types/defaultMetaprompts';
import { v4 as uuidv4 } from 'uuid';
import type { Settings, Metaprompt, Provider } from '../src/types';

// Get __dirname for ES modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App-Name für macOS Dock setzen (muss sehr früh gesetzt werden, bevor app ready ist)
// Wichtig: Muss vor app.whenReady() gesetzt werden
app.setName('Metaprompt');

// Für macOS: Setze auch den Bundle-Namen über process.env (für Entwicklungsmodus)
if (process.platform === 'darwin') {
  process.env.ELECTRON_APP_NAME = 'Metaprompt';
}

let mainWindow: BrowserWindow | null = null;
let isQuitting = false;

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#1A1C27',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    frame: true,
    titleBarOverlay: process.platform === 'darwin' ? {
      color: '#2C2E3B',
      symbolColor: '#FFFFFF',
      height: 40,
    } : undefined,
    title: 'Metaprompt',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true,
    },
  });

  // Entwicklung: Vite Dev Server
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // Production: Statische Dateien
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Fenster schließen → Minimieren in Tray
  mainWindow.on('close', (event) => {
    const settings = getSettings();
    if (!isQuitting && settings.minimizeToTray) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Tray erstellen
  createTray(mainWindow);

  // Global Shortcuts registrieren
  const settings = getSettings();
  registerGlobalShortcut(settings.globalShortcut, mainWindow);
  registerMetapromptShortcuts(mainWindow);
};

app.whenReady().then(() => {
  // Stelle sicher, dass der App-Name gesetzt ist (für macOS Dock)
  // Muss nach app.whenReady() nochmal gesetzt werden für macOS
  app.setName('Metaprompt');
  
  // Für macOS: Benachrichtigungsberechtigung anfordern
  if (process.platform === 'darwin') {
    // macOS 10.14+ benötigt explizite Berechtigung für Benachrichtigungen
    if (Notification.isSupported()) {
      // Versuche eine Test-Benachrichtigung zu senden (falls Berechtigung fehlt, wird sie angefordert)
      try {
        const testNotification = new Notification({
          title: 'Metaprompt',
          body: 'Bereit',
          silent: true, // Stumm, nur um Berechtigung zu prüfen/anfordern
        });
        // Nicht anzeigen, nur erstellen um Berechtigung zu prüfen
        console.log('[Main] Notification permission checked');
      } catch (error) {
        console.warn('[Main] Notification permission issue:', error);
      }
    }
  }
  
  // Für macOS: Aktualisiere den Dock-Namen
  if (process.platform === 'darwin') {
    // Setze den Namen nochmal nach app ready
    app.setName('Metaprompt');
    // Optional: Dock-Icon setzen falls vorhanden
    try {
      // Prüfe verschiedene mögliche Pfade für das Icon
      // macOS bevorzugt .icns, aber .png funktioniert auch
      const possibleIconPaths = [
        path.join(__dirname, '../../resources/icon.icns'),
        path.join(__dirname, '../../resources/icon.png'),
        path.join(process.cwd(), 'resources/icon.icns'),
        path.join(process.cwd(), 'resources/icon.png'),
        path.join(app.getAppPath(), 'resources/icon.icns'),
        path.join(app.getAppPath(), 'resources/icon.png'),
      ];
      
      const { nativeImage } = require('electron');
      let iconSet = false;
      
      for (const iconPath of possibleIconPaths) {
        try {
          const icon = nativeImage.createFromPath(iconPath);
          if (!icon.isEmpty()) {
            app.dock?.setIcon(iconPath);
            iconSet = true;
            console.log(`✅ Dock-Icon gesetzt: ${iconPath}`);
            break;
          }
        } catch (e) {
          // Weiter zum nächsten Pfad
          continue;
        }
      }
      
      if (!iconSet) {
        // Kein Icon gefunden, verwende Standard-Icon
        console.log('⚠️  Kein Custom-Icon gefunden, verwende Standard-Icon');
      }
    } catch (e) {
      // Icon nicht gefunden, ignorieren
      console.log('⚠️  Fehler beim Setzen des Dock-Icons:', e);
    }
  }
  
  createWindow();

  // Standard-Metaprompt und vorgefertigte Metaprompts erstellen falls noch keine existieren
  const metaprompts = getMetaprompts();
  const defaultMetapromptExists = metaprompts.some(m => m.isDefault);
  
  if (!defaultMetapromptExists) {
    const defaultMetaprompt: Metaprompt = {
      id: uuidv4(),
      name: 'Standard Optimizer',
      description: 'Standard-Metaprompt für Prompt-Optimierung',
      content: DEFAULT_METAPROMPT,
      category: undefined, // Standard-Metaprompt hat keine spezifische Kategorie
      isDefault: true,
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    saveMetaprompt(defaultMetaprompt);
    
    // Als aktiv setzen falls noch kein aktiver Metaprompt gesetzt ist
    const settings = getSettings();
    if (!settings.activeMetapromptId) {
      setSettings({ activeMetapromptId: defaultMetaprompt.id });
    }
  }
  
  // Vorgefertigte Metaprompts hinzufügen (nur wenn sie noch nicht existieren)
  const existingNames = new Set(metaprompts.map(m => m.name));
  const defaultMetaprompts = createDefaultMetaprompts();
  
  defaultMetaprompts.forEach(mp => {
    if (!existingNames.has(mp.name)) {
      saveMetaprompt(mp);
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  isQuitting = true;
  unregisterAllShortcuts();
  destroyTray();
});

// IPC Handlers

// Settings
ipcMain.handle('settings:get', () => getSettings());
ipcMain.handle('settings:set', (_event, settings: Partial<Settings>) => {
  setSettings(settings);
  updateTrayMenu(mainWindow);
  
  // Shortcuts neu registrieren falls geändert
  if (settings.globalShortcut !== undefined) {
    registerGlobalShortcut(settings.globalShortcut, mainWindow);
  }
  if (settings.metapromptNextShortcut !== undefined || settings.metapromptPrevShortcut !== undefined) {
    registerMetapromptShortcuts(mainWindow);
  }
});

// API Keys
ipcMain.handle('apiKey:get', (_event, provider: Provider) => getApiKey(provider));
ipcMain.handle('apiKey:set', (_event, provider: Provider, key: string) => {
  setApiKey(provider, key);
});

ipcMain.handle('apiKey:validate', async (_event, provider: Provider, key: string) => {
  // Temporär setzen für Validierung
  const oldKey = getApiKey(provider);
  setApiKey(provider, key);
  
  try {
    // Direkte Validierung ohne Optimizer-Umweg
    const validation = await validateApiKeyDirect(provider, key);
    
    if (!validation.valid) {
      // Alten Key wiederherstellen falls Validierung fehlschlägt
      if (oldKey) {
        setApiKey(provider, oldKey);
      }
      console.error(`API Key validation failed for ${provider}:`, validation.error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('API Key validation error:', error);
    // Alten Key wiederherstellen
    if (oldKey) {
      setApiKey(provider, oldKey);
    }
    return false;
  }
});

// Metaprompts
ipcMain.handle('metaprompts:get', () => getMetaprompts());
ipcMain.handle('metaprompts:save', (_event, mp: Metaprompt) => {
  saveMetaprompt(mp);
  updateTrayMenu(mainWindow);
});
ipcMain.handle('metaprompts:delete', (_event, id: string) => {
  const metaprompts = getMetaprompts();
  const metaprompt = metaprompts.find(m => m.id === id);
  
  // Verhindere Löschen des Standard-Metaprompts
  if (metaprompt?.isDefault) {
    throw new Error('Der Standard-Metaprompt kann nicht gelöscht werden');
  }
  
  deleteMetaprompt(id);
  updateTrayMenu(mainWindow);
});
ipcMain.handle('metaprompts:toggleFavorite', (_event, id: string) => {
  toggleFavorite(id);
  updateTrayMenu(mainWindow);
});

// Notifications
ipcMain.handle('notification:show', async (_event, title: string, body: string, success: boolean = true) => {
  try {
    if (Notification.isSupported()) {
      const notification = new Notification({
        title,
        body,
        urgency: success ? 'normal' : 'critical',
        silent: false,
      });
      
      notification.show();
      console.log(`[Main] Notification shown: ${title} - ${body}`);
      
      // Event-Handler für Debugging
      notification.on('click', () => {
        console.log('[Main] Notification clicked');
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      });
    } else {
      console.warn('[Main] Notifications not supported on this platform');
    }
  } catch (error) {
    console.error('[Main] Error showing notification:', error);
  }
});

// Optimization
ipcMain.handle('optimize', async (_event, request: any) => {
  console.log('[Main] Optimization IPC handler called:', {
    provider: request.provider,
    model: request.model,
    userPromptLength: request.userPrompt?.length || 0,
  });
  
  // Notification: Optimierung startet (immer beim Start)
  if (Notification.isSupported()) {
    new Notification({
      title: 'Metaprompt',
      body: 'Optimierung gestartet...',
      urgency: 'normal',
    }).show();
  }
  
  let result;
  try {
    result = await optimizePrompt(request);
    console.log('[Main] Optimization completed:', {
      success: result.success,
      hasOptimizedPrompt: !!result.optimizedPrompt,
      error: result.error,
    });
  } catch (error) {
    console.error('[Main] Optimization error:', error);
    result = {
      success: false,
      error: error instanceof Error ? error.message : 'Unbekannter Fehler',
    };
  }
  
  // Notification: Optimierung abgeschlossen
  if (Notification.isSupported()) {
    if (result.success && result.optimizedPrompt) {
      new Notification({
        title: 'Metaprompt',
        body: 'Prompt erfolgreich optimiert!',
        urgency: 'normal',
      }).show();
    } else {
      new Notification({
        title: 'Metaprompt',
        body: `Fehler: ${result.error || 'Unbekannter Fehler'}`,
        urgency: 'critical',
      }).show();
    }
  }
  
  // In History speichern
  if (result.success && result.optimizedPrompt) {
    const tokenUsage = result.tokenUsage;
    const cost = tokenUsage ? calculateCost(request.provider, request.model, tokenUsage) : undefined;
    
    console.log(`[Main] Saving optimization to history:`, {
      provider: request.provider,
      model: request.model,
      tokenUsage,
      cost,
    });
    
    addHistory({
      id: uuidv4(),
      originalPrompt: request.userPrompt,
      optimizedPrompt: result.optimizedPrompt,
      provider: request.provider,
      model: request.model,
      metapromptId: getSettings().activeMetapromptId,
      timestamp: new Date(),
      success: true,
      tokenUsage,
      cost,
    });
  } else {
    addHistory({
      id: uuidv4(),
      originalPrompt: request.userPrompt,
      optimizedPrompt: '',
      provider: request.provider,
      model: request.model,
      metapromptId: getSettings().activeMetapromptId,
      timestamp: new Date(),
      success: false,
      error: result.error,
    });
  }
  
  return result;
});

// Clipboard
ipcMain.handle('clipboard:read', () => readClipboard());
ipcMain.handle('clipboard:write', (_event, text: string) => writeClipboard(text));

// History
ipcMain.handle('history:get', () => getHistory());
ipcMain.handle('history:add', (_event, entry: any) => addHistory(entry));

// Cost Tracking
ipcMain.handle('costs:getLast30Days', (_event, provider: Provider) => {
  return getCostsLast30Days(provider);
});

// App Info
ipcMain.handle('app:getVersion', () => {
  try {
    // Versuche verschiedene mögliche Pfade für package.json
    const possiblePaths = [
      join(__dirname, '../../package.json'), // Development
      join(process.resourcesPath, 'app/package.json'), // Production (packaged)
      join(app.getAppPath(), 'package.json'), // Production (alternative)
      join(__dirname, '../../../package.json'), // Alternative path
    ];
    
    for (const packagePath of possiblePaths) {
      try {
        if (existsSync(packagePath)) {
          const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
          console.log(`[Main] Version loaded from: ${packagePath} -> ${packageJson.version}`);
          return packageJson.version;
        }
      } catch (e) {
        // Weiter zum nächsten Pfad
        continue;
      }
    }
    
    // Fallback: Versuche es mit app.getVersion() von Electron
    const appVersion = app.getVersion();
    if (appVersion && appVersion !== '1.0.0') {
      console.log(`[Main] Version from app.getVersion(): ${appVersion}`);
      return appVersion;
    }
    
    console.warn('[Main] Could not find package.json, using fallback version');
    return '1.0.0'; // Fallback
  } catch (error) {
    console.error('[Main] Error getting version:', error);
    return '1.0.0'; // Fallback
  }
});

// Navigation
ipcMain.on('navigate', (_event, page: string) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('navigate', page);
  }
});

