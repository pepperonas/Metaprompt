/**
 * Formatiert einen Shortcut-String für die Anzeige
 * Konvertiert z.B. "CommandOrControl+Shift+M" zu "⌘ + ⇧ + M" (macOS) oder "Ctrl + ⇧ + M" (Windows/Linux)
 */
export const formatShortcut = (shortcut: string): string => {
  if (!shortcut) return '';
  
  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  
  return shortcut
    .split('+')
    .map(part => {
      const trimmed = part.trim();
      switch (trimmed) {
        case 'CommandOrControl':
          return isMac ? '⌘' : 'Ctrl';
        case 'Command':
          return '⌘';
        case 'Control':
          return 'Ctrl';
        case 'Shift':
          return '⇧';
        case 'Alt':
        case 'Option':
          return '⌥';
        default:
          return trimmed;
      }
    })
    .join(' + ');
};

