import { globalShortcut, app } from 'electron';
import { getSettings, setSettings, getMetaprompts } from './store';
import { readClipboard, writeClipboard } from './clipboard';
import { optimizePrompt } from './optimizer';
import { showNotification } from './notifications';
import { BrowserWindow } from 'electron';
import { updateTrayMenu } from './tray';

// Zentrale Funktion zum Auslösen der Optimierung (wird von Shortcut und Tray verwendet)
export const triggerOptimization = async (mainWindow: BrowserWindow | null): Promise<void> => {
  try {
    // Notification: Optimierung startet
    showNotification('MRP', 'Optimierung gestartet...', true);
    
    const clipboardText = readClipboard();
    
    if (!clipboardText || clipboardText.trim().length === 0) {
      showNotification('MRP', 'Zwischenablage ist leer', false);
      return;
    }

    const settings = getSettings();
    
    // Optimierung durchführen
    const result = await optimizePrompt({
      userPrompt: clipboardText,
      metaprompt: '', // Wird aus Store geladen
      provider: settings.activeProvider,
      model: settings.defaultModel[settings.activeProvider],
      maxTokens: settings.maxTokens,
      temperature: settings.temperature,
    });

    if (result.success && result.optimizedPrompt) {
      writeClipboard(result.optimizedPrompt);
      showNotification('MRP', 'Prompt erfolgreich optimiert', true);
      
      // Event an Renderer senden
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('optimization:complete', result.optimizedPrompt);
      }
    } else {
      showNotification('MRP', `Fehler: ${result.error || 'Unbekannter Fehler'}`, false);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    showNotification('MRP', `Fehler: ${message}`, false);
  }
};

let currentShortcut: string | null = null;
let currentNextShortcut: string | null = null;
let currentPrevShortcut: string | null = null;

export const registerGlobalShortcut = (shortcut: string, mainWindow: BrowserWindow | null): boolean => {
  // Alten Shortcut entfernen
  if (currentShortcut) {
    globalShortcut.unregister(currentShortcut);
  }

  // Neuen Shortcut registrieren
  const registered = globalShortcut.register(shortcut, async () => {
    await triggerOptimization(mainWindow);
  });

  if (registered) {
    currentShortcut = shortcut;
  }

  return registered;
};

export const unregisterGlobalShortcut = (): void => {
  if (currentShortcut) {
    globalShortcut.unregister(currentShortcut);
    currentShortcut = null;
  }
};

export const unregisterAllShortcuts = (): void => {
  globalShortcut.unregisterAll();
  currentShortcut = null;
  currentNextShortcut = null;
  currentPrevShortcut = null;
};

// Metaprompt-Wechsel-Funktionen
const switchToNextMetaprompt = (mainWindow: BrowserWindow | null): void => {
  const metaprompts = getMetaprompts();
  if (metaprompts.length === 0) return;

  const settings = getSettings();
  const currentIndex = metaprompts.findIndex(m => m.id === settings.activeMetapromptId);
  
  let nextIndex: number;
  if (currentIndex === -1 || currentIndex === metaprompts.length - 1) {
    // Zum ersten Metaprompt wechseln (wraparound)
    nextIndex = 0;
  } else {
    nextIndex = currentIndex + 1;
  }

  const nextMetaprompt = metaprompts[nextIndex];
  setSettings({ activeMetapromptId: nextMetaprompt.id });
  updateTrayMenu(mainWindow);
  
  // Event an Renderer senden
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('metaprompt:change', nextMetaprompt.id);
  }
  
  showNotification('MRP', `Metaprompt: ${nextMetaprompt.name}`, true);
};

const switchToPrevMetaprompt = (mainWindow: BrowserWindow | null): void => {
  const metaprompts = getMetaprompts();
  if (metaprompts.length === 0) return;

  const settings = getSettings();
  const currentIndex = metaprompts.findIndex(m => m.id === settings.activeMetapromptId);
  
  let prevIndex: number;
  if (currentIndex === -1 || currentIndex === 0) {
    // Zum letzten Metaprompt wechseln (wraparound)
    prevIndex = metaprompts.length - 1;
  } else {
    prevIndex = currentIndex - 1;
  }

  const prevMetaprompt = metaprompts[prevIndex];
  setSettings({ activeMetapromptId: prevMetaprompt.id });
  updateTrayMenu(mainWindow);
  
  // Event an Renderer senden
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('metaprompt:change', prevMetaprompt.id);
  }
  
  showNotification('MRP', `Metaprompt: ${prevMetaprompt.name}`, true);
};

// Registriere Metaprompt-Wechsel-Shortcuts
export const registerMetapromptShortcuts = (mainWindow: BrowserWindow | null): void => {
  const settings = getSettings();
  
  // Alte Shortcuts entfernen
  if (currentNextShortcut) {
    globalShortcut.unregister(currentNextShortcut);
    currentNextShortcut = null;
  }
  if (currentPrevShortcut) {
    globalShortcut.unregister(currentPrevShortcut);
    currentPrevShortcut = null;
  }
  
  // Neue Shortcuts registrieren (nur wenn gesetzt)
  if (settings.metapromptNextShortcut && settings.metapromptNextShortcut.trim() !== '') {
    const registered = globalShortcut.register(settings.metapromptNextShortcut, () => {
      switchToNextMetaprompt(mainWindow);
    });
    if (registered) {
      currentNextShortcut = settings.metapromptNextShortcut;
    }
  }
  
  if (settings.metapromptPrevShortcut && settings.metapromptPrevShortcut.trim() !== '') {
    const registered = globalShortcut.register(settings.metapromptPrevShortcut, () => {
      switchToPrevMetaprompt(mainWindow);
    });
    if (registered) {
      currentPrevShortcut = settings.metapromptPrevShortcut;
    }
  }
};

