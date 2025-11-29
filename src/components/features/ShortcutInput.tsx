import React, { useState, useEffect, useRef } from 'react';

interface ShortcutInputProps {
  value: string;
  onChange: (shortcut: string) => void;
  label?: string;
  placeholder?: string;
}

export const ShortcutInput: React.FC<ShortcutInputProps> = ({
  value,
  onChange,
  label = 'Globaler Shortcut',
  placeholder = 'Klicken zum Aufnehmen',
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Format den Shortcut für die Anzeige
    const formatShortcut = (shortcut: string) => {
      if (!shortcut) return '';
      
      return shortcut
        .split('+')
        .map(part => {
          const trimmed = part.trim();
          if (trimmed === 'CommandOrControl') {
            const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            return isMac ? '⌘' : 'Ctrl';
          }
          if (trimmed === 'Command') return '⌘';
          if (trimmed === 'Control') return 'Ctrl';
          if (trimmed === 'Shift') return '⇧';
          if (trimmed === 'Alt' || trimmed === 'Option') return '⌥';
          return trimmed;
        })
        .join(' + ');
    };

    setDisplayValue(formatShortcut(value));
  }, [value]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isRecording) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const parts: string[] = [];
      
      // Modifier keys
      if (e.metaKey || e.ctrlKey) {
        parts.push('CommandOrControl');
      } else if (e.metaKey) {
        parts.push('Command');
      } else if (e.ctrlKey) {
        parts.push('Control');
      }
      if (e.shiftKey) parts.push('Shift');
      if (e.altKey) parts.push('Alt');
      
      // Main key (ignore modifier-only presses)
      const key = e.key;
      if (key && key !== 'Meta' && key !== 'Control' && key !== 'Shift' && key !== 'Alt' && key !== 'Unidentified') {
        // Map special keys
        let mappedKey = key;
        if (key === ' ') mappedKey = 'Space';
        if (key === 'ArrowUp') mappedKey = 'Up';
        if (key === 'ArrowDown') mappedKey = 'Down';
        if (key === 'ArrowLeft') mappedKey = 'Left';
        if (key === 'ArrowRight') mappedKey = 'Right';
        if (key.length === 1 && key.match(/[a-z]/i)) {
          mappedKey = key.toUpperCase();
        }
        
        if (!parts.includes(mappedKey)) {
          parts.push(mappedKey);
        }
      }
      
      // Erlaube auch Escape zum Leeren
      if (key === 'Escape') {
        onChange('');
        setIsRecording(false);
        return;
      }
      
      if (parts.length >= 2) { // Mindestens Modifier + Taste
        const shortcut = parts.join('+');
        onChange(shortcut);
        setIsRecording(false);
      }
    };

    const handleKeyUp = () => {
      // Optional: Reset wenn alle Tasten losgelassen werden
    };

    if (isRecording) {
      window.addEventListener('keydown', handleKeyDown, true);
      window.addEventListener('keyup', handleKeyUp, true);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
    };
  }, [isRecording, onChange]);

  const handleClick = () => {
    setIsRecording(true);
  };

  const handleBlur = () => {
    // Delay um sicherzustellen, dass Key-Events verarbeitet werden
    setTimeout(() => {
      setIsRecording(false);
    }, 100);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      <div 
        ref={containerRef}
        className="relative"
        onBlur={handleBlur}
        tabIndex={0}
      >
        <div
          onClick={handleClick}
          className={`w-full px-4 py-3 bg-bg-secondary border rounded-lg text-text-primary cursor-pointer transition-all ${
            isRecording 
              ? 'border-brand ring-2 ring-brand ring-opacity-50' 
              : 'border-bg-secondary hover:border-brand'
          }`}
        >
          {isRecording ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
              <span className="text-brand font-medium">Drücke Tastenkombination...</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className={displayValue ? 'font-mono text-sm' : 'text-text-secondary'}>
                {displayValue || placeholder}
              </span>
              <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-text-secondary">
        {isRecording 
          ? 'Drücke die gewünschte Tastenkombination (z.B. ⌘ + ⇧ + M)'
          : 'Klicke auf das Feld und drücke die gewünschte Tastenkombination'}
      </p>
    </div>
  );
};

