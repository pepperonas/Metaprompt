import { Tray, Menu, nativeImage, app, BrowserWindow } from 'electron';
import path from 'path';
import { getSettings, getMetaprompts } from './store';
import type { Provider } from '../src/types';

let tray: Tray | null = null;

const createTrayMenu = (mainWindow: BrowserWindow | null): Menu => {
  const settings = getSettings();
  const metaprompts = getMetaprompts();
  const activeMetaprompt = metaprompts.find(m => m.id === settings.activeMetapromptId) ||
                          metaprompts.find(m => m.isDefault) ||
                          metaprompts[0];

  const providerMenu = Menu.buildFromTemplate([
    {
      label: 'OpenAI',
      type: 'radio',
      checked: settings.activeProvider === 'openai',
      click: () => {
        // Wird über IPC gehandhabt
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('provider:change', 'openai');
        }
      },
    },
    {
      label: 'Claude',
      type: 'radio',
      checked: settings.activeProvider === 'anthropic',
      click: () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('provider:change', 'anthropic');
        }
      },
    },
    {
      label: 'Grok',
      type: 'radio',
      checked: settings.activeProvider === 'grok',
      click: () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('provider:change', 'grok');
        }
      },
    },
    {
      label: 'Gemini',
      type: 'radio',
      checked: settings.activeProvider === 'gemini',
      click: () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('provider:change', 'gemini');
        }
      },
    },
  ]);

  const metapromptMenu = Menu.buildFromTemplate(
    metaprompts.map(mp => ({
      label: mp.name,
      type: 'radio',
      checked: mp.id === activeMetaprompt?.id,
      click: () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('metaprompt:change', mp.id);
        }
      },
    }))
  );

  return Menu.buildFromTemplate([
    {
      label: `Prompt optimieren (${settings.globalShortcut})`,
      click: () => {
        // Shortcut-Event simulieren
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('shortcut:triggered');
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Aktiver Anbieter',
      submenu: providerMenu,
    },
    {
      label: 'Aktiver Metaprompt',
      submenu: metapromptMenu.length > 0 ? metapromptMenu : [{ label: 'Keine Metaprompts', enabled: false }],
    },
    { type: 'separator' },
    {
      label: 'Einstellungen',
      click: () => {
        if (mainWindow) {
          if (mainWindow.isVisible()) {
            mainWindow.focus();
          } else {
            mainWindow.show();
          }
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Beenden',
      click: () => {
        app.quit();
      },
    },
  ]);
};

export const createTray = (mainWindow: BrowserWindow | null): void => {
  // Icon laden (Fallback falls kein Icon vorhanden)
  const iconPath = path.join(__dirname, '../../resources/icon.png');
  let icon = nativeImage.createEmpty();
  
  try {
    icon = nativeImage.createFromPath(iconPath);
    if (icon.isEmpty()) {
      // Fallback: Einfaches Template-Icon
      icon = nativeImage.createFromNamedImage('NSApplicationIcon', 0);
    }
  } catch {
    icon = nativeImage.createFromNamedImage('NSApplicationIcon', 0);
  }

  tray = new Tray(icon);
  tray.setToolTip('MRP - Prompt-Optimierer');

  // Menü aktualisieren
  const updateMenu = () => {
    if (tray) {
      tray.setContextMenu(createTrayMenu(mainWindow));
    }
  };

  updateMenu();

  // Linksklick: Fenster öffnen
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });

  // Rechtsklick: Kontextmenü
  tray.on('right-click', () => {
    if (tray) {
      tray.popUpContextMenu();
    }
  });

  // Menü bei Änderungen aktualisieren
  if (mainWindow) {
    mainWindow.on('focus', updateMenu);
  }
};

export const updateTrayMenu = (mainWindow: BrowserWindow | null): void => {
  if (tray) {
    tray.setContextMenu(createTrayMenu(mainWindow));
  }
};

export const destroyTray = (): void => {
  if (tray) {
    tray.destroy();
    tray = null;
  }
};

