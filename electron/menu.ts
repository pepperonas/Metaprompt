import { app, Menu, BrowserWindow, shell } from 'electron';
import { getSettings, getMetaprompts } from './store';
import { triggerOptimization } from './shortcuts';
import type { Provider } from '../src/types';

let mainWindow: BrowserWindow | null = null;

export const setMainWindow = (window: BrowserWindow | null): void => {
  mainWindow = window;
};

const providerNames: Record<Provider, string> = {
  openai: 'OpenAI',
  anthropic: 'Claude',
  grok: 'Grok',
  gemini: 'Gemini',
};

const createApplicationMenu = (): Menu => {
  const settings = getSettings();
  const metaprompts = getMetaprompts();
  const activeMetaprompt = metaprompts.find(m => m.id === settings.activeMetapromptId) ||
                          metaprompts.find(m => m.isDefault) ||
                          metaprompts[0];

  // Provider Submenu
  const providerMenu = Menu.buildFromTemplate([
    {
      label: 'OpenAI',
      type: 'radio',
      checked: settings.activeProvider === 'openai',
      click: () => {
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

  // Nur aktive Metaprompts anzeigen (außer Standard, der immer aktiv ist)
  const visibleMetaprompts = metaprompts.filter(mp => 
    mp.isDefault || (mp.active !== false) // Standard ist immer sichtbar, andere nur wenn aktiv
  );
  
  // Metaprompt Submenu
  const favorites = visibleMetaprompts.filter(mp => mp.isFavorite);
  const others = visibleMetaprompts.filter(mp => !mp.isFavorite);

  const metapromptMenuItems: Electron.MenuItemConstructorOptions[] = [];

  if (favorites.length > 0) {
    favorites.forEach(mp => {
      metapromptMenuItems.push({
        label: `⭐ ${mp.name}`,
        type: 'radio',
        checked: mp.id === activeMetaprompt?.id,
        click: () => {
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('metaprompt:change', mp.id);
          }
        },
      });
    });
    
    if (others.length > 0) {
      metapromptMenuItems.push({ type: 'separator' });
    }
  }

  others.forEach(mp => {
    metapromptMenuItems.push({
      label: mp.name,
      type: 'radio',
      checked: mp.id === activeMetaprompt?.id,
      click: () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('metaprompt:change', mp.id);
        }
      },
    });
  });

  const metapromptMenu = Menu.buildFromTemplate(
    metapromptMenuItems.length > 0 ? metapromptMenuItems : [{ label: 'Keine Metaprompts', enabled: false }]
  );

  const activeProviderName = providerNames[settings.activeProvider] || settings.activeProvider;
  const activeMetapromptName = activeMetaprompt?.name || 'Keine';

  // macOS Menu Template
  if (process.platform === 'darwin') {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: app.getName(),
        submenu: [
          {
            label: `Über ${app.getName()}`,
            role: 'about',
          },
          { type: 'separator' },
          {
            label: 'Einstellungen...',
            accelerator: 'Cmd+,',
            click: () => {
              if (mainWindow) {
                if (!mainWindow.isVisible()) {
                  mainWindow.show();
                  app.dock?.show();
                  app.focus({ steal: true });
                }
                mainWindow.focus();
                mainWindow.webContents.send('navigate', 'settings');
              }
            },
          },
          { type: 'separator' },
          {
            label: 'Dienste',
            role: 'services',
            submenu: [],
          },
          { type: 'separator' },
          {
            label: `${app.getName()} ausblenden`,
            accelerator: 'Cmd+H',
            role: 'hide',
          },
          {
            label: 'Andere ausblenden',
            accelerator: 'Cmd+Option+H',
            role: 'hideOthers',
          },
          {
            label: 'Alle einblenden',
            role: 'unhide',
          },
          { type: 'separator' },
          {
            label: `${app.getName()} beenden`,
            accelerator: 'Cmd+Q',
            click: () => {
              app.quit();
            },
          },
        ],
      },
      {
        label: 'Bearbeiten',
        submenu: [
          {
            label: 'Rückgängig',
            accelerator: 'Cmd+Z',
            role: 'undo',
          },
          {
            label: 'Wiederholen',
            accelerator: 'Shift+Cmd+Z',
            role: 'redo',
          },
          { type: 'separator' },
          {
            label: 'Ausschneiden',
            accelerator: 'Cmd+X',
            role: 'cut',
          },
          {
            label: 'Kopieren',
            accelerator: 'Cmd+C',
            role: 'copy',
          },
          {
            label: 'Einfügen',
            accelerator: 'Cmd+V',
            role: 'paste',
          },
          {
            label: 'Alles auswählen',
            accelerator: 'Cmd+A',
            role: 'selectAll',
          },
        ],
      },
      {
        label: 'Ansicht',
        submenu: [
          {
            label: 'Neu laden',
            accelerator: 'Cmd+R',
            click: () => {
              if (mainWindow) {
                mainWindow.reload();
              }
            },
          },
          {
            label: 'Vollständig neu laden',
            accelerator: 'Cmd+Shift+R',
            click: () => {
              if (mainWindow) {
                mainWindow.webContents.reloadIgnoringCache();
              }
            },
          },
          { type: 'separator' },
          {
            label: 'Verkleinern',
            accelerator: 'Cmd+M',
            role: 'minimize',
          },
          {
            label: 'Vollbild',
            accelerator: 'Ctrl+Cmd+F',
            role: 'togglefullscreen',
          },
          { type: 'separator' },
          {
            label: 'Entwicklertools einblenden',
            accelerator: 'Cmd+Option+I',
            click: () => {
              if (mainWindow) {
                mainWindow.webContents.toggleDevTools();
              }
            },
          },
        ],
      },
      {
        label: 'Prompt',
        submenu: [
          {
            label: 'Prompt optimieren',
            accelerator: settings.globalShortcut,
            click: () => {
              triggerOptimization(mainWindow);
            },
          },
          { type: 'separator' },
          {
            label: `Anbieter: ${activeProviderName}`,
            submenu: providerMenu,
          },
          {
            label: `Metaprompt: ${activeMetapromptName.length > 30 ? activeMetapromptName.substring(0, 30) + '...' : activeMetapromptName}`,
            submenu: metapromptMenu,
          },
        ],
      },
      {
        label: 'Navigation',
        submenu: [
          {
            label: 'Dashboard',
            accelerator: 'Cmd+1',
            click: () => {
              if (mainWindow) {
                if (!mainWindow.isVisible()) {
                  mainWindow.show();
                  app.dock?.show();
                  app.focus({ steal: true });
                }
                mainWindow.focus();
                mainWindow.webContents.send('navigate', 'dashboard');
              }
            },
          },
          {
            label: 'Metaprompts',
            accelerator: 'Cmd+2',
            click: () => {
              if (mainWindow) {
                if (!mainWindow.isVisible()) {
                  mainWindow.show();
                  app.dock?.show();
                  app.focus({ steal: true });
                }
                mainWindow.focus();
                mainWindow.webContents.send('navigate', 'metaprompts');
              }
            },
          },
          {
            label: 'Verlauf',
            accelerator: 'Cmd+3',
            click: () => {
              if (mainWindow) {
                if (!mainWindow.isVisible()) {
                  mainWindow.show();
                  app.dock?.show();
                  app.focus({ steal: true });
                }
                mainWindow.focus();
                mainWindow.webContents.send('navigate', 'history');
              }
            },
          },
          {
            label: 'Einstellungen',
            accelerator: 'Cmd+,',
            click: () => {
              if (mainWindow) {
                if (!mainWindow.isVisible()) {
                  mainWindow.show();
                  app.dock?.show();
                  app.focus({ steal: true });
                }
                mainWindow.focus();
                mainWindow.webContents.send('navigate', 'settings');
              }
            },
          },
        ],
      },
      {
        label: 'Fenster',
        submenu: [
          {
            label: 'Minimieren',
            accelerator: 'Cmd+M',
            role: 'minimize',
          },
          {
            label: 'Schließen',
            accelerator: 'Cmd+W',
            click: () => {
              if (mainWindow) {
                const settings = getSettings();
                if (settings.minimizeToTray) {
                  mainWindow.hide();
                } else {
                  mainWindow.close();
                }
              }
            },
          },
          { type: 'separator' },
          {
            label: 'Alle Fenster in den Vordergrund bringen',
            role: 'front',
          },
        ],
      },
      {
        label: 'Hilfe',
        submenu: [
          {
            label: 'Anleitung anzeigen',
            accelerator: 'Cmd+?',
            click: () => {
              if (mainWindow) {
                if (!mainWindow.isVisible()) {
                  mainWindow.show();
                  app.dock?.show();
                  app.focus({ steal: true });
                }
                mainWindow.focus();
                mainWindow.webContents.send('show:guide');
              }
            },
          },
          {
            label: 'Onboarding anzeigen',
            click: () => {
              if (mainWindow) {
                if (!mainWindow.isVisible()) {
                  mainWindow.show();
                  app.dock?.show();
                  app.focus({ steal: true });
                }
                mainWindow.focus();
                mainWindow.webContents.send('show:onboarding');
              }
            },
          },
          { type: 'separator' },
          {
            label: 'GitHub Repository',
            click: async () => {
              await shell.openExternal('https://github.com/pepperonas/Metaprompt');
            },
          },
          {
            label: 'Fehler melden',
            click: async () => {
              await shell.openExternal('https://github.com/pepperonas/Metaprompt/issues');
            },
          },
        ],
      },
    ];

    return Menu.buildFromTemplate(template);
  }

  // Windows/Linux Menu Template
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Datei',
      submenu: [
        {
          label: 'Einstellungen',
          accelerator: 'Ctrl+,',
          click: () => {
            if (mainWindow) {
              if (!mainWindow.isVisible()) {
                mainWindow.show();
              }
              mainWindow.focus();
              mainWindow.webContents.send('navigate', 'settings');
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Beenden',
          accelerator: 'Ctrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Bearbeiten',
      submenu: [
        {
          label: 'Rückgängig',
          accelerator: 'Ctrl+Z',
          role: 'undo',
        },
        {
          label: 'Wiederholen',
          accelerator: 'Ctrl+Y',
          role: 'redo',
        },
        { type: 'separator' },
        {
          label: 'Ausschneiden',
          accelerator: 'Ctrl+X',
          role: 'cut',
        },
        {
          label: 'Kopieren',
          accelerator: 'Ctrl+C',
          role: 'copy',
        },
        {
          label: 'Einfügen',
          accelerator: 'Ctrl+V',
          role: 'paste',
        },
        {
          label: 'Alles auswählen',
          accelerator: 'Ctrl+A',
          role: 'selectAll',
        },
      ],
    },
    {
      label: 'Ansicht',
      submenu: [
        {
          label: 'Neu laden',
          accelerator: 'Ctrl+R',
          click: () => {
            if (mainWindow) {
              mainWindow.reload();
            }
          },
        },
        {
          label: 'Vollständig neu laden',
          accelerator: 'Ctrl+Shift+R',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.reloadIgnoringCache();
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Vollbild',
          accelerator: 'F11',
          role: 'togglefullscreen',
        },
        { type: 'separator' },
        {
          label: 'Entwicklertools einblenden',
          accelerator: 'Ctrl+Shift+I',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.toggleDevTools();
            }
          },
        },
      ],
    },
    {
      label: 'Prompt',
      submenu: [
        {
          label: 'Prompt optimieren',
          accelerator: settings.globalShortcut,
          click: () => {
            triggerOptimization(mainWindow);
          },
        },
        { type: 'separator' },
        {
          label: `Anbieter: ${activeProviderName}`,
          submenu: providerMenu,
        },
        {
          label: `Metaprompt: ${activeMetapromptName.length > 30 ? activeMetapromptName.substring(0, 30) + '...' : activeMetapromptName}`,
          submenu: metapromptMenu,
        },
      ],
    },
    {
      label: 'Navigation',
      submenu: [
        {
          label: 'Dashboard',
          accelerator: 'Ctrl+1',
          click: () => {
            if (mainWindow) {
              if (!mainWindow.isVisible()) {
                mainWindow.show();
              }
              mainWindow.focus();
              mainWindow.webContents.send('navigate', 'dashboard');
            }
          },
        },
        {
          label: 'Metaprompts',
          accelerator: 'Ctrl+2',
          click: () => {
            if (mainWindow) {
              if (!mainWindow.isVisible()) {
                mainWindow.show();
              }
              mainWindow.focus();
              mainWindow.webContents.send('navigate', 'metaprompts');
            }
          },
        },
        {
          label: 'Verlauf',
          accelerator: 'Ctrl+3',
          click: () => {
            if (mainWindow) {
              if (!mainWindow.isVisible()) {
                mainWindow.show();
              }
              mainWindow.focus();
              mainWindow.webContents.send('navigate', 'history');
            }
          },
        },
        {
          label: 'Einstellungen',
          accelerator: 'Ctrl+,',
          click: () => {
            if (mainWindow) {
              if (!mainWindow.isVisible()) {
                mainWindow.show();
              }
              mainWindow.focus();
              mainWindow.webContents.send('navigate', 'settings');
            }
          },
        },
      ],
    },
    {
      label: 'Fenster',
      submenu: [
        {
          label: 'Minimieren',
          accelerator: 'Ctrl+M',
          role: 'minimize',
        },
        {
          label: 'Schließen',
          accelerator: 'Ctrl+W',
          click: () => {
            if (mainWindow) {
              const settings = getSettings();
              if (settings.minimizeToTray) {
                mainWindow.hide();
              } else {
                mainWindow.close();
              }
            }
          },
        },
      ],
    },
    {
      label: 'Hilfe',
      submenu: [
        {
          label: 'Anleitung anzeigen',
          accelerator: 'F1',
          click: () => {
            if (mainWindow) {
              if (!mainWindow.isVisible()) {
                mainWindow.show();
              }
              mainWindow.focus();
              mainWindow.webContents.send('show:guide');
            }
          },
        },
        {
          label: 'Onboarding anzeigen',
          click: () => {
            if (mainWindow) {
              if (!mainWindow.isVisible()) {
                mainWindow.show();
              }
              mainWindow.focus();
              mainWindow.webContents.send('show:onboarding');
            }
          },
        },
        { type: 'separator' },
        {
          label: `Über ${app.getName()}`,
          click: () => {
            if (mainWindow) {
              if (!mainWindow.isVisible()) {
                mainWindow.show();
              }
              mainWindow.focus();
              mainWindow.webContents.send('show:about');
            }
          },
        },
        { type: 'separator' },
        {
          label: 'GitHub Repository',
          click: async () => {
            await shell.openExternal('https://github.com/pepperonas/Metaprompt');
          },
        },
        {
          label: 'Fehler melden',
          click: async () => {
            await shell.openExternal('https://github.com/pepperonas/Metaprompt/issues');
          },
        },
      ],
    },
  ];

  return Menu.buildFromTemplate(template);
};

export const createApplicationMenuBar = (window: BrowserWindow | null): void => {
  mainWindow = window;
  const menu = createApplicationMenu();
  Menu.setApplicationMenu(menu);
};

export const updateApplicationMenu = (): void => {
  const menu = createApplicationMenu();
  Menu.setApplicationMenu(menu);
};

