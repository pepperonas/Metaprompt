export const DEFAULT_MODELS = {
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
