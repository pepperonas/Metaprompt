import type { Provider } from '../types';

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
}

// Preise pro 1M Tokens (Stand: Dezember 2024)
// Input/Output Preise können je nach Modell variieren
const PRICING: Record<Provider, Record<string, { input: number; output: number }>> = {
  openai: {
    // GPT-4o Familie
    'gpt-4o': { input: 2.50, output: 10.00 },
    'gpt-4o-2024-08-06': { input: 2.50, output: 10.00 },
    'gpt-4o-2024-05-13': { input: 2.50, output: 10.00 },
    'gpt-4o-mini': { input: 0.15, output: 0.60 },
    'gpt-4o-mini-2024-07-18': { input: 0.15, output: 0.60 },
    // GPT-4 Turbo
    'gpt-4-turbo': { input: 10.00, output: 30.00 },
    'gpt-4-turbo-2024-04-09': { input: 10.00, output: 30.00 },
    'gpt-4-0125-preview': { input: 10.00, output: 30.00 },
    'gpt-4-1106-preview': { input: 10.00, output: 30.00 },
    // GPT-4
    'gpt-4': { input: 30.00, output: 60.00 },
    'gpt-4-0613': { input: 30.00, output: 60.00 },
    // o1 Familie
    'o1': { input: 15.00, output: 60.00 },
    'o1-preview': { input: 15.00, output: 60.00 },
    'o1-mini': { input: 3.00, output: 12.00 },
    'o1-mini-2024-09-12': { input: 3.00, output: 12.00 },
    // GPT-3.5
    'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
    'gpt-3.5-turbo-0125': { input: 0.50, output: 1.50 },
  },
  anthropic: {
    // Claude 3.5 Familie
    'claude-3-5-sonnet-20241022': { input: 3.00, output: 15.00 },
    'claude-3-5-sonnet-20240620': { input: 3.00, output: 15.00 },
    'claude-3-5-sonnet-20240229': { input: 3.00, output: 15.00 },
    'claude-3-5-sonnet': { input: 3.00, output: 15.00 },
    // Claude 3.5 Haiku
    'claude-3-5-haiku-20241022': { input: 0.80, output: 4.00 },
    'claude-3-5-haiku-20240620': { input: 0.80, output: 4.00 },
    'claude-3-5-haiku': { input: 0.80, output: 4.00 },
    // Claude 3 Opus
    'claude-3-opus-20240229': { input: 15.00, output: 75.00 },
    'claude-3-opus': { input: 15.00, output: 75.00 },
    // Claude 3 Sonnet
    'claude-3-sonnet-20240229': { input: 3.00, output: 15.00 },
    'claude-3-sonnet': { input: 3.00, output: 15.00 },
    // Claude 3 Haiku
    'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
    'claude-3-haiku': { input: 0.25, output: 1.25 },
  },
  grok: {
    // Grok-2 Familie
    'grok-2': { input: 0.50, output: 1.50 },
    'grok-2-latest': { input: 0.50, output: 1.50 },
    'grok-2-mini': { input: 0.25, output: 0.75 },
    'grok-beta': { input: 0.50, output: 1.50 },
    'grok': { input: 0.50, output: 1.50 },
  },
  gemini: {
    // Gemini 2.0 Familie
    'gemini-2.0-flash-exp': { input: 0.10, output: 0.40 },
    'gemini-2.0-flash-thinking-exp': { input: 0.10, output: 0.40 },
    // Gemini 1.5 Pro
    'gemini-1.5-pro-latest': { input: 1.25, output: 5.00 },
    'gemini-1.5-pro': { input: 1.25, output: 5.00 },
    'gemini-1.5-pro-002': { input: 1.25, output: 5.00 },
    // Gemini 1.5 Flash
    'gemini-1.5-flash-latest': { input: 0.075, output: 0.30 },
    'gemini-1.5-flash': { input: 0.075, output: 0.30 },
    'gemini-1.5-flash-002': { input: 0.075, output: 0.30 },
    'gemini-1.5-flash-8b': { input: 0.0375, output: 0.15 },
  },
};

export const calculateCost = (provider: Provider, model: string, usage: TokenUsage): number => {
  const providerPricing = PRICING[provider];
  if (!providerPricing) {
    console.warn(`[CostCalculator] No pricing found for provider: ${provider}`);
    return 0;
  }

  // Versuche exaktes Modell-Match
  let pricing = providerPricing[model];
  
  if (!pricing) {
    // Fallback-Logik für ähnliche Modelle
    const modelLower = model.toLowerCase();
    
    if (provider === 'openai') {
      if (modelLower.includes('o1-mini')) {
        pricing = providerPricing['o1-mini'];
      } else if (modelLower.includes('o1')) {
        pricing = providerPricing['o1'];
      } else if (modelLower.includes('gpt-4o-mini')) {
        pricing = providerPricing['gpt-4o-mini'];
      } else if (modelLower.includes('gpt-4o')) {
        pricing = providerPricing['gpt-4o'];
      } else if (modelLower.includes('gpt-4-turbo')) {
        pricing = providerPricing['gpt-4-turbo'];
      } else if (modelLower.includes('gpt-4')) {
        pricing = providerPricing['gpt-4'];
      } else if (modelLower.includes('gpt-3.5')) {
        pricing = providerPricing['gpt-3.5-turbo'];
      }
    } else if (provider === 'anthropic') {
      if (modelLower.includes('claude-3-5-haiku')) {
        pricing = providerPricing['claude-3-5-haiku-20241022'];
      } else if (modelLower.includes('claude-3-5-sonnet')) {
        pricing = providerPricing['claude-3-5-sonnet-20241022'];
      } else if (modelLower.includes('claude-3-opus')) {
        pricing = providerPricing['claude-3-opus-20240229'];
      } else if (modelLower.includes('claude-3-sonnet')) {
        pricing = providerPricing['claude-3-sonnet-20240229'];
      } else if (modelLower.includes('claude-3-haiku')) {
        pricing = providerPricing['claude-3-haiku-20240307'];
      } else if (modelLower.includes('claude-3-5')) {
        pricing = providerPricing['claude-3-5-sonnet-20241022'];
      }
    } else if (provider === 'gemini') {
      if (modelLower.includes('2.0-flash') || modelLower.includes('2.0')) {
        pricing = providerPricing['gemini-2.0-flash-exp'];
      } else if (modelLower.includes('pro')) {
        pricing = providerPricing['gemini-1.5-pro-latest'];
      } else if (modelLower.includes('flash')) {
        pricing = providerPricing['gemini-1.5-flash-latest'];
      }
    } else if (provider === 'grok') {
      if (modelLower.includes('mini')) {
        pricing = providerPricing['grok-2-mini'];
      } else {
        pricing = providerPricing['grok-2-latest'];
      }
    }
    
    // Fallback auf erstes verfügbares Modell
    if (!pricing) {
      const firstModel = Object.values(providerPricing)[0];
      pricing = firstModel || { input: 0, output: 0 };
      console.warn(`[CostCalculator] No exact match for model "${model}", using fallback pricing`);
    }
  }

  // Berechne Kosten: (inputTokens / 1M) * inputPrice + (outputTokens / 1M) * outputPrice
  const inputCost = (usage.inputTokens / 1_000_000) * pricing.input;
  const outputCost = (usage.outputTokens / 1_000_000) * pricing.output;
  const totalCost = inputCost + outputCost;
  
  console.log(`[CostCalculator] Provider: ${provider}, Model: ${model}, Input: ${usage.inputTokens}, Output: ${usage.outputTokens}, Cost: $${totalCost.toFixed(6)}`);
  
  return totalCost;
};

export const formatCost = (cost: number): string => {
  if (cost < 0.01) {
    return '< $0.01';
  }
  return `$${cost.toFixed(4)}`;
};

