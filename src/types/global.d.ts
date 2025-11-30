import type { Settings, Metaprompt, Provider, OptimizationRequest } from './index';

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
      toggleFavorite: (id: string) => Promise<void>;
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

export {};
