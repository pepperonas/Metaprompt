import type { OptimizationRequest, Provider } from '../types';
import { optimizeOpenAI } from './api/openai';
import { optimizeAnthropic } from './api/anthropic';
import { optimizeGrok } from './api/grok';
import { optimizeGemini } from './api/gemini';

export interface OptimizationResult {
  success: boolean;
  optimizedPrompt?: string;
  error?: string;
  tokenUsage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export const optimizePromptInRenderer = async (
  request: OptimizationRequest,
  apiKey: string,
  activeMetapromptContent: string
): Promise<OptimizationResult> => {
  try {
    console.log('[Renderer Optimizer] Starting optimization:', {
      provider: request.provider,
      model: request.model,
      userPromptLength: request.userPrompt?.length || 0,
    });

    // Metaprompt-Vorlage verwenden: {user_prompt} wird durch den zu optimierenden Prompt ersetzt
    const metapromptContent = activeMetapromptContent.replace('{user_prompt}', request.userPrompt);

    console.log('[Renderer Optimizer] Metaprompt content length:', metapromptContent.length);

    // Je nach Provider die entsprechende API aufrufen
    let result: { content: string; tokenUsage?: { inputTokens: number; outputTokens: number } };
    
    switch (request.provider) {
      case 'openai':
        result = await optimizeOpenAI(metapromptContent, apiKey, request.model, request.maxTokens, request.temperature);
        break;
      case 'anthropic':
        result = await optimizeAnthropic(metapromptContent, apiKey, request.model, request.maxTokens, request.temperature);
        break;
      case 'grok':
        result = await optimizeGrok(metapromptContent, apiKey, request.model, request.maxTokens, request.temperature);
        break;
      case 'gemini':
        result = await optimizeGemini(metapromptContent, apiKey, request.model, request.maxTokens, request.temperature);
        break;
      default:
        return {
          success: false,
          error: `Unbekannter Provider: ${request.provider}`,
        };
    }

    console.log('[Renderer Optimizer] API call successful:', {
      contentLength: result.content?.length || 0,
      contentPreview: result.content?.substring(0, 200),
      hasContent: !!result.content,
    });

    if (!result.content || result.content.trim().length === 0) {
      console.error('[Renderer Optimizer] Empty content received from API');
      return {
        success: false,
        error: 'Leere Antwort von der API erhalten',
      };
    }

    return {
      success: true,
      optimizedPrompt: result.content,
      tokenUsage: result.tokenUsage,
    };
  } catch (error) {
    console.error('[Renderer Optimizer] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unbekannter Fehler',
    };
  }
};
