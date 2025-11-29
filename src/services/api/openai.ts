export interface ApiResponse {
  content: string;
  tokenUsage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export const optimizeOpenAI = async (
  prompt: string,
  apiKey: string,
  model: string,
  maxTokens: number,
  temperature: number
): Promise<ApiResponse> => {
  console.log('[OpenAI API] Starting request:', {
    model,
    promptLength: prompt.length,
    maxTokens,
    temperature,
  });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: maxTokens,
        temperature,
      }),
    });

    console.log('[OpenAI API] Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[OpenAI API] Error response:', errorText);
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { error: { message: errorText || 'Unknown error' } };
      }
      throw new Error(error.error?.message || `HTTP ${response.status}: ${errorText}`);
    }

    const responseText = await response.text();
    console.log('[OpenAI API] Raw response length:', responseText.length);
    console.log('[OpenAI API] Raw response preview:', responseText.substring(0, 1000));
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[OpenAI API] JSON parse error:', parseError);
      throw new Error(`Ungültige JSON-Antwort von OpenAI API: ${responseText.substring(0, 500)}`);
    }
    
    console.log('[OpenAI API] Parsed response:', JSON.stringify(data, null, 2));
    console.log('[OpenAI API] Response structure:', {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length || 0,
      hasUsage: !!data.usage,
      firstChoice: data.choices?.[0],
    });
    
    // Standard OpenAI API Struktur: data.choices[0].message.content
    let content = '';
    
    if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
      const firstChoice = data.choices[0];
      
      if (firstChoice.message) {
        if (typeof firstChoice.message === 'string') {
          content = firstChoice.message.trim();
        } else if (firstChoice.message.content) {
          content = String(firstChoice.message.content).trim();
        } else if (firstChoice.message.text) {
          content = String(firstChoice.message.text).trim();
        }
      }
      
      // Prüfe finish_reason für Fehlerfälle
      if (!content && firstChoice.finish_reason) {
        console.warn('[OpenAI API] Content empty but finish_reason:', firstChoice.finish_reason);
        if (firstChoice.finish_reason === 'length') {
          throw new Error('Antwort wurde wegen max_tokens abgeschnitten. Bitte erhöhe max_tokens.');
        } else if (firstChoice.finish_reason === 'content_filter') {
          throw new Error('Antwort wurde von Content-Filter blockiert.');
        } else if (firstChoice.finish_reason === 'stop') {
          // stop ist normal, aber Content sollte vorhanden sein
          console.warn('[OpenAI API] finish_reason is stop but no content');
        }
      }
    }
    
    console.log('[OpenAI API] Extracted content:', {
      length: content.length,
      preview: content.substring(0, 200),
      isEmpty: !content || content.length === 0,
    });
    
    if (!content || content.length === 0) {
      const errorDetails = {
        hasChoices: !!data.choices,
        choicesLength: data.choices?.length,
        firstChoice: data.choices?.[0],
        message: data.choices?.[0]?.message,
        finishReason: data.choices?.[0]?.finish_reason,
        fullResponse: data,
      };
      console.error('[OpenAI API] Empty content! Details:', JSON.stringify(errorDetails, null, 2));
      throw new Error(`Leere Antwort von OpenAI API. Bitte prüfe die Terminal-Logs für Details.`);
    }
    
    const usage = data.usage;
    
    return {
      content,
      tokenUsage: usage ? {
        inputTokens: usage.prompt_tokens || 0,
        outputTokens: usage.completion_tokens || 0,
      } : undefined,
    };
  } catch (error) {
    console.error('[OpenAI API] Exception:', error);
    throw error;
  }
};

