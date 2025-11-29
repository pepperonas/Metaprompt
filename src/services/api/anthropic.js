export const optimizeAnthropic = async (prompt, apiKey, model, maxTokens, temperature) => {
    // Stelle sicher, dass der API-Key nicht leer ist
    if (!apiKey || !apiKey.trim()) {
        throw new Error('API-Key ist leer');
    }
    // Versuche mit dem angegebenen Modell
    let response;
    try {
        response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey.trim(),
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: model,
                max_tokens: maxTokens,
                temperature,
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            }),
        });
    }
    catch (networkError) {
        throw new Error(`Netzwerkfehler: ${networkError instanceof Error ? networkError.message : 'Unbekannter Fehler'}`);
    }
    if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
            const errorData = await response.json();
            // Anthropic Fehlerstruktur kann unterschiedlich sein
            if (errorData.error?.message) {
                errorMessage = errorData.error.message;
            }
            else if (errorData.error) {
                errorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
            }
            else if (errorData.message) {
                errorMessage = errorData.message;
            }
            else if (typeof errorData === 'string') {
                errorMessage = errorData;
            }
            // Spezielle Fehlermeldungen für häufige Probleme
            if (response.status === 401) {
                errorMessage = 'Ungültiger API-Key. Bitte prüfe, ob der Key korrekt ist und mit "sk-ant-" beginnt.';
            }
            else if (response.status === 403) {
                errorMessage = 'Zugriff verweigert. Prüfe deine API-Key-Berechtigungen.';
            }
            else if (response.status === 400) {
                errorMessage = `Ungültige Anfrage: ${errorMessage}`;
            }
        }
        catch {
            // Wenn JSON-Parsing fehlschlägt, verwende Status-Text
            errorMessage = response.statusText || `HTTP ${response.status}`;
            if (response.status === 401) {
                errorMessage = 'Ungültiger API-Key (401 Unauthorized)';
            }
        }
        throw new Error(errorMessage);
    }
    const data = await response.json();
    // Anthropic gibt content als Array zurück
    if (data.content && Array.isArray(data.content) && data.content.length > 0) {
        return data.content[0]?.text?.trim() || '';
    }
    throw new Error('Ungültige Antwort von Anthropic API');
};
