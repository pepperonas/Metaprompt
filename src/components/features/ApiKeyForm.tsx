import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useApiKeysStore } from '../../stores/useApiKeysStore';
import { formatCost } from '../../utils/costCalculator';
import type { Provider } from '../../types';

const API_DASHBOARD_URLS: Record<Provider, string> = {
  openai: 'https://platform.openai.com/api-keys',
  anthropic: 'https://console.anthropic.com/settings/keys',
  grok: 'https://console.x.ai/',
  gemini: 'https://aistudio.google.com/app/apikey',
};

interface ApiKeyFormProps {
  provider: Provider;
  providerName: string;
}

export const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ provider, providerName }) => {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [costs, setCosts] = useState<{ totalCost: number; requestCount: number } | null>(null);
  const [costsLoading, setCostsLoading] = useState(true);
  const { keys, setApiKey, validateApiKey, loadApiKey } = useApiKeysStore();

  React.useEffect(() => {
    loadApiKey(provider);
    loadCosts();
  }, [provider]);

  const loadCosts = async () => {
    setCostsLoading(true);
    try {
      const costData = await window.mrp.getCostsLast30Days(provider);
      console.log(`Costs for ${provider}:`, costData);
      setCosts({
        totalCost: costData.totalCost || 0,
        requestCount: costData.requestCount || 0,
      });
    } catch (error) {
      console.error('Failed to load costs:', error);
      // Setze auf 0 bei Fehler, damit die Anzeige immer sichtbar ist
      setCosts({
        totalCost: 0,
        requestCount: 0,
      });
    } finally {
      setCostsLoading(false);
    }
  };

  React.useEffect(() => {
    // Nur setzen wenn Key vorhanden ist, sonst leer lassen
    const storedKey = keys[provider];
    if (storedKey) {
      setKey(storedKey);
    } else {
      setKey(''); // Leer lassen wenn nicht konfiguriert
    }
  }, [keys, provider]);

  const handleSave = async () => {
    if (!key.trim()) {
      setError('API-Key darf nicht leer sein');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Validieren
      const isValid = await validateApiKey(provider, key.trim());
      if (!isValid) {
        setError('API-Key ist ungültig oder konnte nicht validiert werden. Bitte prüfe:\n- Der Key beginnt mit "sk-ant-" für Claude\n- Keine Leerzeichen vor/nach dem Key\n- Der Key ist in deinem Anthropic Account aktiv');
        setLoading(false);
        return;
      }

      // Speichern
      await setApiKey(provider, key.trim());
      setError('');
      alert('API-Key erfolgreich gespeichert und validiert!');
      // Kosten neu laden nach erfolgreichem Speichern
      await loadCosts();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Fehler beim Speichern';
      setError(`Validierungsfehler: ${errorMsg}`);
      console.error('API Key validation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const { statuses } = useApiKeysStore();
  const status = statuses[provider];
  const isValid = status?.isValid || false;
  const isConfigured = status?.isConfigured || false;

  return (
    <Card title={providerName}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isValid 
                ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                : isConfigured 
                ? 'bg-red-500' 
                : 'bg-gray-500'
            }`}></div>
            <span className="text-sm text-text-secondary">
              Status: {isValid ? 'Gültig' : isConfigured ? 'Ungültig' : 'Nicht konfiguriert'}
            </span>
          </div>
          {!costsLoading && costs !== null && (
            <div className="text-sm text-text-secondary">
              {costs.requestCount > 0 ? (
                <>
                  <span className="font-medium text-text-primary">{formatCost(costs.totalCost)}</span>
                  <span className="ml-1">(letzte 30 Tage, {costs.requestCount} {costs.requestCount === 1 ? 'Anfrage' : 'Anfragen'})</span>
                </>
              ) : (
                <span className="text-text-secondary">$0.00 (letzte 30 Tage)</span>
              )}
            </div>
          )}
          {costsLoading && (
            <div className="text-sm text-text-secondary">Lade Kosten...</div>
          )}
        </div>
        <Input
          type="password"
          label="API-Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder={keys[provider] ? `${providerName} API-Key eingeben...` : "API-Key eingeben"}
          error={error}
        />
        <div className="pt-2 pb-1">
          <a
            href={API_DASHBOARD_URLS[provider]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:text-brand/80 transition-colors flex items-center space-x-2 text-sm group"
          >
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="font-medium">API-Dashboard öffnen</span>
            <span className="text-text-secondary text-xs">(API-Key erstellen oder verwalten)</span>
          </a>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading || !key.trim()}
          className="w-full"
        >
          {loading ? 'Speichern...' : 'Speichern & Validieren'}
        </Button>
      </div>
    </Card>
  );
};

