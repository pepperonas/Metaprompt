export const optimizeGemini = async (prompt, apiKey, model, maxTokens, temperature) => {
    // Gemini API verwendet einen anderen Endpoint-Format
    const modelName = model.includes('gemini') ? model : `models/${model}`;
    const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: prompt,
                        },
                    ],
                },
            ],
            generationConfig: {
                maxOutputTokens: maxTokens,
                temperature,
            },
        }),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
        throw new Error(error.error?.message || `HTTP ${response.status}`);
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
};
