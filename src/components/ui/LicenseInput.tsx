import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';

interface LicenseInputProps {
  onActivate: (key: string) => Promise<boolean>;
  onCancel: () => void;
}

export const LicenseInput: React.FC<LicenseInputProps> = ({ onActivate, onCancel }) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!licenseKey.trim()) {
      setError('Bitte gib einen Lizenzschlüssel ein.');
      return;
    }

    setIsValidating(true);
    try {
      const success = await onActivate(licenseKey.trim());
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          onCancel();
        }, 1500);
      } else {
        setError('Ungültiger Lizenzschlüssel. Bitte überprüfe die Eingabe.');
      }
    } catch (err) {
      setError('Fehler beim Aktivieren der Lizenz. Bitte versuche es erneut.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase();
    // Entferne alle Zeichen außer Buchstaben, Zahlen und Bindestriche
    value = value.replace(/[^A-Z0-9-]/g, '');
    // Format: MP-XXXX-XXXX
    if (value.length > 3 && value[2] !== '-') {
      value = value.slice(0, 3) + '-' + value.slice(3);
    }
    if (value.length > 8 && value[7] !== '-') {
      value = value.slice(0, 8) + '-' + value.slice(8);
    }
    // Maximal 15 Zeichen (MP-XXXX-XXXX)
    if (value.length > 15) {
      value = value.slice(0, 15);
    }
    setLicenseKey(value);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="license-key" className="block text-sm font-medium text-text-primary mb-2">
          Lizenzschlüssel
        </label>
        <Input
          id="license-key"
          type="text"
          value={licenseKey}
          onChange={handleKeyChange}
          placeholder="MP-XXXX-XXXX"
          className="font-mono text-center"
          disabled={isValidating || success}
          autoFocus
        />
        <p className="mt-1 text-xs text-text-secondary">
          Format: MP-XXXX-XXXX (8 Hex-Zeichen)
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-sm text-green-400">✓ Lizenz erfolgreich aktiviert!</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isValidating || success}
          className="flex-1"
        >
          Abbrechen
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isValidating || success || !licenseKey.trim()}
          className="flex-1 min-h-[48px]"
        >
          {isValidating ? 'Aktiviere...' : success ? 'Aktiviert!' : 'Aktivieren'}
        </Button>
      </div>
    </form>
  );
};

