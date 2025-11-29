import { getSettings, getMetaprompts } from './store';
import { getApiKey } from './store';
import type { OptimizationRequest, Provider } from '../src/types';

// Prüfe ob fetch verfügbar ist, sonst verwende node-fetch
let fetchFunction: typeof fetch;
try {
  if (typeof fetch !== 'undefined') {
    fetchFunction = fetch;
    console.log('[Optimizer] Using native fetch');
  } else {
    throw new Error('fetch not available');
  }
} catch {
  const nodeFetch = require('node-fetch');
  fetchFunction = nodeFetch as typeof fetch;
  console.log('[Optimizer] Using node-fetch');
}

// API-Services für Main-Prozess (verwenden fetchFunction)
const optimizeOpenAI = async (
  prompt: string,
  apiKey: string,
  model: string,
  maxTokens: number,
  temperature: number
): Promise<{ content: string; tokenUsage?: { inputTokens: number; outputTokens: number } }> => {
  console.log('[OpenAI API] Starting request:', { model, promptLength: prompt.length });
  
  const response = await fetchFunction('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[OpenAI API] Error:', errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('[OpenAI API] Response:', { hasChoices: !!data.choices, choicesLength: data.choices?.length });
  
  const content = data.choices?.[0]?.message?.content?.trim() || '';
  if (!content) {
    console.error('[OpenAI API] Empty content! Full response:', JSON.stringify(data, null, 2));
    throw new Error('Leere Antwort von OpenAI API');
  }

  return {
    content,
    tokenUsage: data.usage ? {
      inputTokens: data.usage.prompt_tokens || 0,
      outputTokens: data.usage.completion_tokens || 0,
    } : undefined,
  };
};

const optimizeAnthropic = async (
  prompt: string,
  apiKey: string,
  model: string,
  maxTokens: number,
  temperature: number
): Promise<{ content: string; tokenUsage?: { inputTokens: number; outputTokens: number } }> => {
  console.log('[Anthropic API] Starting request:', { model, promptLength: prompt.length });
  
  const response = await fetchFunction('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Anthropic API] Error:', errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('[Anthropic API] Response:', { hasContent: !!data.content });
  
  const content = data.content && Array.isArray(data.content) && data.content.length > 0
    ? data.content[0]?.text?.trim() || ''
    : '';
  
  if (!content) {
    console.error('[Anthropic API] Empty content! Full response:', JSON.stringify(data, null, 2));
    throw new Error('Leere Antwort von Anthropic API');
  }

  return {
    content,
    tokenUsage: data.usage ? {
      inputTokens: data.usage.input_tokens || 0,
      outputTokens: data.usage.output_tokens || 0,
    } : undefined,
  };
};

const optimizeGrok = async (
  prompt: string,
  apiKey: string,
  model: string,
  maxTokens: number,
  temperature: number
): Promise<{ content: string; tokenUsage?: { inputTokens: number; outputTokens: number } }> => {
  console.log('[Grok API] Starting request:', { model, promptLength: prompt.length });
  
  const response = await fetchFunction('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Grok API] Error:', errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('[Grok API] Response:', { hasChoices: !!data.choices });
  
  const content = data.choices?.[0]?.message?.content?.trim() || '';
  if (!content) {
    console.error('[Grok API] Empty content! Full response:', JSON.stringify(data, null, 2));
    throw new Error('Leere Antwort von Grok API');
  }

  return {
    content,
    tokenUsage: data.usage ? {
      inputTokens: data.usage.prompt_tokens || 0,
      outputTokens: data.usage.completion_tokens || 0,
    } : undefined,
  };
};

const optimizeGemini = async (
  prompt: string,
  apiKey: string,
  model: string,
  maxTokens: number,
  temperature: number
): Promise<{ content: string; tokenUsage?: { inputTokens: number; outputTokens: number } }> => {
  console.log('[Gemini API] Starting request:', { model, promptLength: prompt.length });
  
  const modelName = model.includes('gemini') ? model : `models/${model}`;
  const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`;
  
  const response = await fetchFunction(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Gemini API] Error:', errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('[Gemini API] Response:', { hasCandidates: !!data.candidates });
  
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  if (!content) {
    console.error('[Gemini API] Empty content! Full response:', JSON.stringify(data, null, 2));
    throw new Error('Leere Antwort von Gemini API');
  }

  return {
    content,
    tokenUsage: data.usageMetadata ? {
      inputTokens: data.usageMetadata.promptTokenCount || 0,
      outputTokens: data.usageMetadata.candidatesTokenCount || 0,
    } : undefined,
  };
};

export interface OptimizationResult {
  success: boolean;
  optimizedPrompt?: string;
  error?: string;
  tokenUsage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export const optimizePrompt = async (request: OptimizationRequest): Promise<OptimizationResult> => {
  try {
    console.log('[Optimizer] Starting optimization:', {
      provider: request.provider,
      model: request.model,
      userPromptLength: request.userPrompt?.length || 0,
      metapromptLength: request.metaprompt?.length || 0,
    });

    const settings = getSettings();
    const metaprompts = getMetaprompts();
    
    console.log('[Optimizer] Settings:', {
      activeProvider: settings.activeProvider,
      activeMetapromptId: settings.activeMetapromptId,
      metapromptsCount: metaprompts.length,
    });
    
    // Aktive Metaprompt-Vorlage laden und mit dem normalen Prompt kombinieren
    let metapromptContent = request.metaprompt;
    
    console.log('[Optimizer] Metaprompt processing:', {
      hasMetaprompt: !!request.metaprompt,
      metapromptLength: request.metaprompt?.length || 0,
      userPromptLength: request.userPrompt?.length || 0,
      metapromptEqualsUserPrompt: request.metaprompt === request.userPrompt,
      metapromptContainsPlaceholder: request.metaprompt?.includes('{user_prompt}') || false,
    });
    
    // Wenn metaprompt gleich userPrompt ist, handelt es sich um einen direkten Call (z.B. für Metaprompt-Generierung)
    if (metapromptContent === request.userPrompt) {
      // Direkter Prompt ohne Metaprompt-Vorlage verwenden
      metapromptContent = request.userPrompt;
      console.log('[Optimizer] Using direct prompt (metaprompt === userPrompt)');
    } else if (!metapromptContent || metapromptContent.trim().length === 0) {
      // Kein Metaprompt übergeben, lade aktiven Metaprompt aus Store
      const activeMetaprompt = metaprompts.find(m => m.id === settings.activeMetapromptId) ||
                               metaprompts.find(m => m.isDefault) ||
                               metaprompts[0];
      
      if (activeMetaprompt) {
        console.log('[Optimizer] Loading active metaprompt from store:', activeMetaprompt.name);
        console.log('[Optimizer] Metaprompt content preview:', activeMetaprompt.content.substring(0, 200));
        // Metaprompt-Vorlage verwenden: {user_prompt} wird durch den zu optimierenden Prompt ersetzt
        metapromptContent = activeMetaprompt.content.replace(/{user_prompt}/g, request.userPrompt);
        console.log('[Optimizer] Metaprompt after replacement length:', metapromptContent.length);
        console.log('[Optimizer] Metaprompt after replacement preview:', metapromptContent.substring(0, 300));
      } else {
        // Fallback auf Standard-Metaprompt-Vorlage
        metapromptContent = `Du bist ein Experte für Prompt Engineering. Deine Aufgabe ist es, den folgenden Prompt zu optimieren.

## Optimierungsrichtlinien:
1. Formuliere klar und präzise
2. Füge relevanten Kontext hinzu
3. Definiere das gewünschte Ausgabeformat
4. Entferne Mehrdeutigkeiten
5. Strukturiere komplexe Anfragen in Schritte

## Zu optimierender Prompt:
${request.userPrompt}

## Aufgabe:
Gib NUR den optimierten Prompt zurück, ohne Erklärungen oder Kommentare.`;
        console.log('[Optimizer] Using fallback metaprompt');
      }
    } else {
      // Metaprompt wurde übergeben, aber Platzhalter muss noch ersetzt werden
      console.log('[Optimizer] Using provided metaprompt, replacing placeholder');
      console.log('[Optimizer] Metaprompt before replacement:', metapromptContent.substring(0, 200));
      metapromptContent = metapromptContent.replace(/{user_prompt}/g, request.userPrompt);
      console.log('[Optimizer] Metaprompt after replacement length:', metapromptContent.length);
      console.log('[Optimizer] Metaprompt after replacement preview:', metapromptContent.substring(0, 300));
      
      // Prüfe ob Platzhalter noch vorhanden ist
      if (metapromptContent.includes('{user_prompt}')) {
        console.warn('[Optimizer] WARNING: Placeholder {user_prompt} still present after replacement!');
      }
    }
    
    console.log('[Optimizer] Final metaprompt content length:', metapromptContent.length);
    console.log('[Optimizer] Final metaprompt content preview:', metapromptContent.substring(0, 400));

    const apiKey = getApiKey(request.provider);
    if (!apiKey) {
      console.error('[Optimizer] No API key found for provider:', request.provider);
      return {
        success: false,
        error: `Kein API-Key für ${request.provider} konfiguriert`,
      };
    }

    console.log('[Optimizer] API key found, length:', apiKey.length);

    // Je nach Provider die entsprechende API aufrufen
    let result: { content: string; tokenUsage?: { inputTokens: number; outputTokens: number } };
    try {
      console.log('[Optimizer] Calling API for provider:', request.provider);
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
          console.error('[Optimizer] Unknown provider:', request.provider);
          return {
            success: false,
            error: `Unbekannter Provider: ${request.provider}`,
          };
      }
      
      console.log('[Optimizer] API call successful:', {
        contentLength: result.content?.length || 0,
        contentPreview: result.content?.substring(0, 200),
        hasContent: !!result.content,
        tokenUsage: result.tokenUsage,
      });
      
      // Prüfe ob Content vorhanden ist
      if (!result || !result.content || result.content.trim().length === 0) {
        console.error('[Optimizer] Empty content received from API. Result:', JSON.stringify(result, null, 2));
        return {
          success: false,
          error: 'Leere Antwort von der API erhalten. Bitte prüfe die Terminal-Logs für Details.',
        };
      }
    } catch (apiError) {
      console.error('[Optimizer] API call failed:', apiError);
      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      return {
        success: false,
        error: errorMessage,
      };
    }

    return {
      success: true,
      optimizedPrompt: result.content,
      tokenUsage: result.tokenUsage,
    };
  } catch (error) {
    console.error('[Optimizer] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unbekannter Fehler',
    };
  }
};

