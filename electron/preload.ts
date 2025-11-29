import { contextBridge, ipcRenderer } from 'electron';
import type { Settings, Metaprompt, Provider, OptimizationRequest } from '../src/types';

contextBridge.exposeInMainWorld('mrp', {
  // Settings
  getSettings: (): Promise<Settings> => ipcRenderer.invoke('settings:get'),
  setSettings: (settings: Partial<Settings>): Promise<void> => ipcRenderer.invoke('settings:set', settings),
  
  // API Keys (verschlüsselt)
  getApiKey: (provider: Provider): Promise<string | null> => ipcRenderer.invoke('apiKey:get', provider),
  setApiKey: (provider: Provider, key: string): Promise<void> => ipcRenderer.invoke('apiKey:set', provider, key),
  validateApiKey: (provider: Provider, key: string): Promise<boolean> => ipcRenderer.invoke('apiKey:validate', provider, key),
  
  // Metaprompts
  getMetaprompts: (): Promise<Metaprompt[]> => ipcRenderer.invoke('metaprompts:get'),
  saveMetaprompt: (mp: Metaprompt): Promise<void> => ipcRenderer.invoke('metaprompts:save', mp),
  deleteMetaprompt: (id: string): Promise<void> => ipcRenderer.invoke('metaprompts:delete', id),
  
  // Optimization
  optimize: (request: OptimizationRequest): Promise<{ success: boolean; optimizedPrompt?: string; error?: string }> => 
    ipcRenderer.invoke('optimize', request),
  
  // Clipboard
  readClipboard: (): Promise<string> => ipcRenderer.invoke('clipboard:read'),
  writeClipboard: (text: string): Promise<void> => ipcRenderer.invoke('clipboard:write', text),
  
  // History
  getHistory: (): Promise<any[]> => ipcRenderer.invoke('history:get'),
  addHistory: (entry: any): Promise<void> => ipcRenderer.invoke('history:add', entry),
  
  // Cost Tracking
  getCostsLast30Days: (provider: Provider): Promise<{ provider: Provider; totalCost: number; requestCount: number; totalInputTokens: number; totalOutputTokens: number }> => 
    ipcRenderer.invoke('costs:getLast30Days', provider),
  
  // Notifications
  showNotification: (title: string, body: string, success?: boolean): Promise<void> => 
    ipcRenderer.invoke('notification:show', title, body, success),
  
  // App Info
  app: {
    getVersion: (): Promise<string> => ipcRenderer.invoke('app:getVersion'),
  },
  
  // Events
  onShortcutTriggered: (callback: () => void) => {
    ipcRenderer.on('shortcut:triggered', callback);
    return () => ipcRenderer.removeAllListeners('shortcut:triggered');
  },
  onOptimizationComplete: (callback: (result: string) => void) => {
    ipcRenderer.on('optimization:complete', (_event, result) => callback(result));
    return () => ipcRenderer.removeAllListeners('optimization:complete');
  },
  onProviderChange: (callback: (provider: Provider) => void) => {
    ipcRenderer.on('provider:change', (_event, provider) => callback(provider));
    return () => ipcRenderer.removeAllListeners('provider:change');
  },
  onMetapromptChange: (callback: (id: string) => void) => {
    ipcRenderer.on('metaprompt:change', (_event, id) => callback(id));
    return () => ipcRenderer.removeAllListeners('metaprompt:change');
  },
});

// TypeScript-Deklarationen für window.mrp
declare global {
  interface Window {
    mrp: {
      getSettings: () => Promise<Settings>;
      setSettings: (settings: Partial<Settings>) => Promise<void>;
      getApiKey: (provider: Provider) => Promise<string | null>;
      setApiKey: (provider: Provider, key: string) => Promise<void>;
      validateApiKey: (provider: Provider, key: string) => Promise<boolean>;
      getMetaprompts: () => Promise<Metaprompt[]>;
      saveMetaprompt: (mp: Metaprompt) => Promise<void>;
      deleteMetaprompt: (id: string) => Promise<void>;
      optimize: (request: OptimizationRequest) => Promise<{ success: boolean; optimizedPrompt?: string; error?: string }>;
      readClipboard: () => Promise<string>;
      writeClipboard: (text: string) => Promise<void>;
      getHistory: () => Promise<any[]>;
      addHistory: (entry: any) => Promise<void>;
      getCostsLast30Days: (provider: Provider) => Promise<{ provider: Provider; totalCost: number; requestCount: number; totalInputTokens: number; totalOutputTokens: number }>;
      showNotification: (title: string, body: string, success?: boolean) => Promise<void>;
      app: {
        getVersion: () => Promise<string>;
      };
      onShortcutTriggered: (callback: () => void) => () => void;
      onOptimizationComplete: (callback: (result: string) => void) => () => void;
      onProviderChange: (callback: (provider: Provider) => void) => () => void;
      onMetapromptChange: (callback: (id: string) => void) => () => void;
    };
  }
}

