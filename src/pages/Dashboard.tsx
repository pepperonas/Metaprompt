import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useApiKeysStore } from '../stores/useApiKeysStore';
import { useMetapromptsStore } from '../stores/useMetapromptsStore';
import { formatShortcut } from '../utils/formatShortcut';
import type { Provider } from '../types';

const Dashboard: React.FC = () => {
  const { settings, loadSettings } = useSettingsStore();
  const { keys, statuses, loadApiKey, checkStatus } = useApiKeysStore();
  const { metaprompts, loadMetaprompts } = useMetapromptsStore();

  useEffect(() => {
    loadSettings();
    loadMetaprompts();
    
    // Lade alle API-Keys und prüfe deren Status
    const loadAllKeys = async () => {
      const providers: Array<'openai' | 'anthropic' | 'grok' | 'gemini'> = ['openai', 'anthropic', 'grok', 'gemini'];
      for (const provider of providers) {
        await loadApiKey(provider);
      }
    };
    
    loadAllKeys();
  }, [loadApiKey]);

  const activeMetaprompt = metaprompts.find(m => m.id === settings?.activeMetapromptId) ||
                           metaprompts.find(m => m.isDefault) ||
                           metaprompts[0];

  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    try {
      setIsOptimizing(true);
      
      console.log('[Dashboard] Starting optimization...');
      
      // Notification: Optimierung startet
      await window.mrp.showNotification('MRP', 'Optimierung gestartet...', true);
      
      const clipboardText = await window.mrp.readClipboard();
      console.log('[Dashboard] Clipboard text length:', clipboardText?.length || 0);
      
      if (!clipboardText || clipboardText.trim().length === 0) {
        console.warn('[Dashboard] Clipboard is empty');
        await window.mrp.showNotification('MRP', 'Zwischenablage ist leer', false);
        setIsOptimizing(false);
        return;
      }

      if (!settings) {
        console.error('[Dashboard] Settings not loaded');
        setIsOptimizing(false);
        return;
      }

      console.log('[Dashboard] Optimization request:', {
        provider: settings.activeProvider,
        model: settings.defaultModel[settings.activeProvider],
        activeMetapromptId: settings.activeMetapromptId,
        activeMetapromptName: activeMetaprompt?.name,
      });

      // Optimierung über IPC im Main-Prozess durchführen (umgeht CORS-Probleme)
      const result = await window.mrp.optimize({
        userPrompt: clipboardText,
        metaprompt: activeMetaprompt?.content || '',
        provider: settings.activeProvider,
        model: settings.defaultModel[settings.activeProvider],
        maxTokens: settings.maxTokens,
        temperature: settings.temperature,
      });

      console.log('[Dashboard] Optimization result:', {
        success: result.success,
        hasOptimizedPrompt: !!result.optimizedPrompt,
        error: result.error,
      });

      if (result.success && result.optimizedPrompt) {
        await window.mrp.writeClipboard(result.optimizedPrompt);
        await window.mrp.showNotification('MRP', 'Prompt erfolgreich optimiert und in Zwischenablage kopiert!', true);
      } else {
        const errorMsg = result.error || 'Unbekannter Fehler';
        console.error('[Dashboard] Optimization failed:', errorMsg);
        await window.mrp.showNotification('MRP', `Fehler: ${errorMsg}`, false);
        alert(`Fehler bei der Optimierung: ${errorMsg}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      console.error('[Dashboard] Exception during optimization:', error);
      await window.mrp.showNotification('MRP', `Fehler: ${errorMessage}`, false);
      alert(`Fehler: ${errorMessage}`);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleProviderChange = async (provider: Provider) => {
    await useSettingsStore.getState().updateSettings({ activeProvider: provider });
  };

  const handleMetapromptChange = async (metapromptId: string) => {
    await useSettingsStore.getState().updateSettings({ activeMetapromptId: metapromptId });
    // Optional: Auch als Standard setzen
    const selectedMetaprompt = metaprompts.find(m => m.id === metapromptId);
    if (selectedMetaprompt) {
      await useMetapromptsStore.getState().setDefault(metapromptId);
    }
  };

  const providerNames: Record<Provider, string> = {
    openai: 'OpenAI',
    anthropic: 'Claude',
    grok: 'Grok',
    gemini: 'Gemini',
  };

  // Metaprompt-Optionen für Dropdown - Standard zuerst
  const metapromptOptions = [...metaprompts]
    .sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return 0;
    })
    .map(mp => ({
      value: mp.id,
      label: mp.name,
    }));

  return (
    <div className="p-6 space-y-6">
      <Card title="Aktive Metaprompt-Vorlage">
        <div className="space-y-4">
          {metaprompts.length > 0 ? (
            <>
              <Select
                label="Metaprompt auswählen"
                options={metapromptOptions}
                value={settings?.activeMetapromptId || metaprompts.find(m => m.isDefault)?.id || metaprompts[0]?.id || ''}
                onChange={(e) => handleMetapromptChange(e.target.value)}
              />
              {activeMetaprompt && (
                <div className="mt-4 pt-4 border-t border-bg-secondary">
                  <h4 className="font-semibold text-text-primary mb-2">{activeMetaprompt.name}</h4>
                  {activeMetaprompt.description && (
                    <p className="text-sm text-text-secondary mb-2">{activeMetaprompt.description}</p>
                  )}
                  <div className="mt-3">
                    <p className="text-xs text-text-secondary mb-1 font-medium">Metaprompt-Inhalt:</p>
                    <p className="text-xs text-text-secondary font-mono bg-bg-primary p-2 rounded border border-bg-secondary max-h-32 overflow-y-auto">
                      {activeMetaprompt.content.length > 300 
                        ? `${activeMetaprompt.content.substring(0, 300)}...` 
                        : activeMetaprompt.content}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              <p className="text-text-secondary mb-2">Keine Metaprompts vorhanden</p>
              <p className="text-xs text-text-secondary">
                Gehe zu "Metaprompts", um eine Vorlage zu erstellen.
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card title="Provider-Status & Auswahl">
        <div className="space-y-3">
          <p className="text-sm text-text-secondary mb-4">
            Wähle einen aktiven Provider. Nur Provider mit gültigem API-Key können ausgewählt werden.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(statuses).map(([provider, status]) => {
              const providerId = provider as Provider;
              const isValid = status.isValid;
              const isActive = settings?.activeProvider === providerId;
              const isClickable = isValid;

              return (
                <button
                  key={provider}
                  onClick={() => isClickable && handleProviderChange(providerId)}
                  disabled={!isClickable}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isActive && isValid
                      ? 'border-brand bg-brand bg-opacity-10 glow-brand'
                      : isValid
                      ? 'border-bg-secondary hover:border-brand hover:bg-opacity-5 cursor-pointer'
                      : 'border-bg-secondary opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        isValid 
                          ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                          : status.isConfigured 
                          ? 'bg-red-500' 
                          : 'bg-gray-500'
                      }`}></div>
                      <span className="font-medium text-text-primary">{providerNames[providerId]}</span>
                    </div>
                    {isActive && isValid && (
                      <span className="text-brand text-lg">●</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${
                      isValid 
                        ? 'text-green-400' 
                        : status.isConfigured 
                        ? 'text-red-400' 
                        : 'text-text-secondary'
                    }`}>
                      {isValid ? 'Gültig' : status.isConfigured ? 'Ungültig' : 'Nicht konfiguriert'}
                    </span>
                    {isActive && (
                      <span className="text-xs text-brand font-medium">Aktiv</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <Card title="Quick Actions">
        <div className="space-y-4">
          <Button onClick={handleOptimize} className="w-full" size="lg" disabled={isOptimizing}>
            {isOptimizing ? 'Optimierung läuft...' : 'Prompt jetzt optimieren'}
          </Button>
          <p className="text-sm text-text-secondary">
            Kopiere einen normalen Prompt in die Zwischenablage und klicke auf den Button, oder verwende den Shortcut:{' '}
            <span className="font-mono text-text-primary font-medium">
              {settings?.globalShortcut ? formatShortcut(settings.globalShortcut) : 'Nicht gesetzt'}
            </span>
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Der aktive Metaprompt wird verwendet, um deinen Prompt zu optimieren.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

