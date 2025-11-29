export type Provider = 'openai' | 'anthropic' | 'grok' | 'gemini';

export interface Metaprompt {
  id: string;
  name: string;
  description?: string;
  content: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  // Allgemein
  launchAtStartup: boolean;
  minimizeToTray: boolean;
  showNotifications: boolean;
  showOnboarding: boolean;  // Zeigt Onboarding-Dialog beim Start
  
  // Shortcut
  globalShortcut: string;
  metapromptNextShortcut: string;  // Optional: Shortcut zum nächsten Metaprompt
  metapromptPrevShortcut: string;  // Optional: Shortcut zum vorherigen Metaprompt
  
  // API-Verhalten
  activeProvider: Provider;
  defaultModel: Record<Provider, string>;
  maxTokens: number;
  temperature: number;
  
  // Metaprompts
  activeMetapromptId: string;
}

export interface OptimizationRequest {
  userPrompt: string;
  metaprompt: string;
  provider: Provider;
  model: string;
  maxTokens: number;
  temperature: number;
}

export type ApiError = 
  | { type: 'RATE_LIMIT'; retryAfter: number }
  | { type: 'INVALID_KEY'; provider: Provider }
  | { type: 'NETWORK_ERROR'; message: string }
  | { type: 'CONTENT_FILTER'; message: string }
  | { type: 'TIMEOUT' }
  | { type: 'UNKNOWN'; message: string };

export interface ApiKeyStatus {
  provider: Provider;
  isValid: boolean;
  isConfigured: boolean;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
}

export interface OptimizationHistory {
  id: string;
  originalPrompt: string;
  optimizedPrompt: string;
  provider: Provider;
  model: string;
  metapromptId: string;
  timestamp: Date;
  success: boolean;
  error?: string;
  tokenUsage?: TokenUsage;
  cost?: number;
}

export const DEFAULT_MODELS: Record<Provider, string> = {
  openai: 'gpt-4o',
  anthropic: 'claude-3-5-sonnet-20241022', // Falls nicht verfügbar, wird claude-3-5-sonnet-20240229 verwendet
  grok: 'grok-2-latest',
  gemini: 'gemini-1.5-pro-latest',
};

export const DEFAULT_METAPROMPT = `Du bist ein Experte für Prompt Engineering. Deine Aufgabe ist es, den folgenden Prompt zu optimieren.

## Optimierungsrichtlinien:
1. Formuliere klar und präzise
2. Füge relevanten Kontext hinzu
3. Definiere das gewünschte Ausgabeformat
4. Entferne Mehrdeutigkeiten
5. Strukturiere komplexe Anfragen in Schritte

## Zu optimierender Prompt:
{user_prompt}

## Aufgabe:
Gib NUR den optimierten Prompt zurück, ohne Erklärungen oder Kommentare.`;

