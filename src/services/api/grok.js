export const optimizeGrok = async (prompt, apiKey, model, maxTokens, temperature) => {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
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
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
        throw new Error(error.error?.message || `HTTP ${response.status}`);
    }
    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || '';
};
