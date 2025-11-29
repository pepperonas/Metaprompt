import { Tray, Menu, nativeImage, app, BrowserWindow } from 'electron';
import path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { getSettings, getMetaprompts } from './store';
import { triggerOptimization } from './shortcuts';
import type { Provider } from '../src/types';

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        // Optimierung direkt auslösen
        triggerOptimization(mainWindow);
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
  // Icon laden und auf Tray-Größe skalieren
  // macOS Tray-Icons sollten 16x16 Pixel sein (für normale Displays)
  // Für Retina-Displays wird automatisch @2x verwendet
  
  let icon = nativeImage.createEmpty();
  
  // Bestimme die richtigen Pfade je nach Dev/Production-Mode
  const isDev = !app.isPackaged;
  
  // Mögliche Icon-Pfade (in Reihenfolge der Priorität)
  const possibleIconPaths: string[] = [];
  
  if (isDev) {
    // Development-Mode: Pfade relativ zum Projekt-Root
    // __dirname zeigt auf dist-electron/electron im Dev-Mode
    const projectRoot = path.resolve(__dirname, '../..');
    possibleIconPaths.push(
      path.join(process.cwd(), 'resources/icons/icon-16.png'),
      path.join(process.cwd(), 'resources/icons/icon-32.png'),
      path.join(process.cwd(), 'resources/icon.png'),
      path.join(projectRoot, 'resources/icons/icon-16.png'),
      path.join(projectRoot, 'resources/icons/icon-32.png'),
      path.join(projectRoot, 'resources/icon.png'),
      path.join(__dirname, '../../resources/icons/icon-16.png'),
      path.join(__dirname, '../../resources/icons/icon-32.png'),
      path.join(__dirname, '../../resources/icon.png')
    );
    console.log(`🔍 Dev-Mode: Suche Icons in projectRoot=${projectRoot}, cwd=${process.cwd()}, __dirname=${__dirname}`);
  } else {
    // Production-Mode: Pfade relativ zur App
    possibleIconPaths.push(
      path.join(process.resourcesPath, 'icon.icns'),
      path.join(process.resourcesPath, 'icon.png'),
      path.join(app.getAppPath(), 'resources/icon.icns'),
      path.join(app.getAppPath(), 'resources/icon.png'),
      path.join(__dirname, '../../resources/icon.icns'),
      path.join(__dirname, '../../resources/icon.png')
    );
  }
  
  // Versuche Icons in der Reihenfolge zu laden
  console.log(`🔍 Suche Tray-Icon in ${possibleIconPaths.length} möglichen Pfaden...`);
  for (const iconPath of possibleIconPaths) {
    try {
      if (existsSync(iconPath)) {
        console.log(`  ✓ Gefunden: ${iconPath}`);
        const loadedIcon = nativeImage.createFromPath(iconPath);
        if (!loadedIcon.isEmpty()) {
          const originalSize = loadedIcon.getSize();
          // Skaliere auf 16x16 Pixel - das ist die Standard-Tray-Icon-Größe
          // macOS wird es automatisch für Retina-Displays anpassen
          icon = loadedIcon.resize({ width: 16, height: 16 });
          console.log(`✅ Tray-Icon geladen: ${iconPath} (Original: ${originalSize.width}x${originalSize.height} → 16x16)`);
          break;
        } else {
          console.log(`  ⚠️  Icon ist leer: ${iconPath}`);
        }
      } else {
        console.log(`  ✗ Nicht gefunden: ${iconPath}`);
      }
    } catch (error) {
      console.log(`  ✗ Fehler beim Laden: ${iconPath} - ${error}`);
      // Weiter zum nächsten Pfad
      continue;
    }
  }
  
  // Fallback: Template-Icon falls kein Custom-Icon gefunden wurde
  if (icon.isEmpty()) {
    try {
      icon = nativeImage.createFromNamedImage('NSApplicationIcon', 0);
      console.log('⚠️  Verwende Standard-Template-Icon');
    } catch {
      icon = nativeImage.createEmpty();
      console.log('⚠️  Kein Icon gefunden');
    }
  }
  
  // Stelle sicher, dass das Icon die richtige Größe hat
  if (!icon.isEmpty()) {
    const size = icon.getSize();
    // Wenn das Icon größer als 16x16 ist, skaliere es runter
    if (size.width > 16 || size.height > 16) {
      icon = icon.resize({ width: 16, height: 16 });
    }
  }

  tray = new Tray(icon);
  
  // Tooltip mit aktuellem Metaprompt-Namen aktualisieren
  const updateTooltip = () => {
    const settings = getSettings();
    const metaprompts = getMetaprompts();
    const activeMetaprompt = metaprompts.find(m => m.id === settings.activeMetapromptId) ||
                            metaprompts.find(m => m.isDefault) ||
                            metaprompts[0];
    
    if (activeMetaprompt) {
      tray?.setToolTip(`MRP - Prompt-Optimierer\nAktive Vorlage: ${activeMetaprompt.name}`);
    } else {
      tray?.setToolTip('MRP - Prompt-Optimierer');
    }
  };
  
  updateTooltip();

  // Menü aktualisieren
  const updateMenu = () => {
    if (tray) {
      tray.setContextMenu(createTrayMenu(mainWindow));
      // Tooltip auch aktualisieren
      const settings = getSettings();
      const metaprompts = getMetaprompts();
      const activeMetaprompt = metaprompts.find(m => m.id === settings.activeMetapromptId) ||
                              metaprompts.find(m => m.isDefault) ||
                              metaprompts[0];
      
      if (activeMetaprompt) {
        tray.setToolTip(`MRP - Prompt-Optimierer\nAktive Vorlage: ${activeMetaprompt.name}`);
      } else {
        tray.setToolTip('MRP - Prompt-Optimierer');
      }
    }
  };

  updateMenu();

  // Linksklick: Fenster immer öffnen/anzeigen
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        // Wenn Fenster bereits sichtbar ist, nur fokussieren
        mainWindow.focus();
      } else {
        // Wenn Fenster versteckt ist, anzeigen und fokussieren
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
    // Tooltip auch aktualisieren
    const settings = getSettings();
    const metaprompts = getMetaprompts();
    const activeMetaprompt = metaprompts.find(m => m.id === settings.activeMetapromptId) ||
                            metaprompts.find(m => m.isDefault) ||
                            metaprompts[0];
    
    if (activeMetaprompt) {
      tray.setToolTip(`MRP - Prompt-Optimierer\nAktive Vorlage: ${activeMetaprompt.name}`);
    } else {
      tray.setToolTip('MRP - Prompt-Optimierer');
    }
  }
};

export const destroyTray = (): void => {
  if (tray) {
    tray.destroy();
    tray = null;
  }
};

