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
  const { statuses, loadApiKey } = useApiKeysStore();
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
      await window.mrp.showNotification('Metaprompt', 'Optimierung gestartet...', true);
      
      const clipboardText = await window.mrp.readClipboard();
      console.log('[Dashboard] Clipboard text length:', clipboardText?.length || 0);
      
      if (!clipboardText || clipboardText.trim().length === 0) {
        console.warn('[Dashboard] Clipboard is empty');
        await window.mrp.showNotification('Metaprompt', 'Zwischenablage ist leer', false);
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
        await window.mrp.showNotification('Metaprompt', 'Prompt erfolgreich optimiert und in Zwischenablage kopiert!', true);
      } else {
        const errorMsg = result.error || 'Unbekannter Fehler';
        console.error('[Dashboard] Optimization failed:', errorMsg);
        await window.mrp.showNotification('Metaprompt', `Fehler: ${errorMsg}`, false);
        alert(`Fehler bei der Optimierung: ${errorMsg}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      console.error('[Dashboard] Exception during optimization:', error);
      await window.mrp.showNotification('Metaprompt', `Fehler: ${errorMessage}`, false);
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
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-secondary">
          Verwalte deine Metaprompts, wähle Provider und optimiere Prompts mit einem Klick.
        </p>
      </div>

      <Card title="Aktive Metaprompt-Vorlage">
        <div className="space-y-5">
          {metaprompts.length > 0 ? (
            <>
              <div>
                <Select
                  label="Metaprompt auswählen"
                  options={metapromptOptions}
                  value={settings?.activeMetapromptId || metaprompts.find(m => m.isDefault)?.id || metaprompts[0]?.id || ''}
                  onChange={(e) => handleMetapromptChange(e.target.value)}
                />
              </div>
              {activeMetaprompt && (
                <div className="mt-5 pt-5 border-t border-bg-primary">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-text-primary mb-1.5">{activeMetaprompt.name}</h4>
                      {activeMetaprompt.description && (
                        <p className="text-sm text-text-secondary leading-relaxed">{activeMetaprompt.description}</p>
                      )}
                    </div>
                    {activeMetaprompt.isDefault && (
                      <span className="ml-3 px-2.5 py-1 text-xs font-medium bg-brand/20 text-brand rounded-md border border-brand/30">
                        Standard
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">Metaprompt-Inhalt</p>
                    <div className="bg-bg-primary p-3 rounded-lg border border-bg-secondary max-h-40 overflow-y-auto">
                      <p className="text-xs text-text-secondary font-mono leading-relaxed whitespace-pre-wrap">
                        {activeMetaprompt.content.length > 400 
                          ? `${activeMetaprompt.content.substring(0, 400)}...` 
                          : activeMetaprompt.content}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="mb-4">
                <svg className="w-12 h-12 text-text-secondary mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-text-secondary mb-2 font-medium">Keine Metaprompts vorhanden</p>
              <p className="text-sm text-text-secondary">
                Gehe zu <span className="text-brand font-medium">Metaprompts</span>, um eine Vorlage zu erstellen.
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card title="Provider-Status & Auswahl">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            Wähle einen aktiven Provider. Nur Provider mit gültigem API-Key können ausgewählt werden.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className={`p-5 rounded-xl border-2 transition-all duration-200 text-left group ${
                    isActive && isValid
                      ? 'border-brand bg-brand/10 shadow-lg shadow-brand/20'
                      : isValid
                      ? 'border-bg-primary hover:border-brand/50 hover:bg-brand/5 cursor-pointer active:scale-[0.98]'
                      : 'border-bg-primary opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full transition-all ${
                        isValid 
                          ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                          : status.isConfigured 
                          ? 'bg-red-500 shadow-lg shadow-red-500/30' 
                          : 'bg-gray-500'
                      }`}></div>
                      <span className="font-semibold text-text-primary">{providerNames[providerId]}</span>
                    </div>
                    {isActive && isValid && (
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 bg-brand rounded-full animate-pulse"></span>
                        <span className="text-xs text-brand font-semibold">Aktiv</span>
                      </div>
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
                    {isValid && !isActive && (
                      <span className="text-xs text-text-secondary group-hover:text-brand transition-colors">
                        Klicken zum Aktivieren
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <Card title="Quick Actions">
        <div className="space-y-5">
          <div>
            <Button 
              onClick={handleOptimize} 
              className="w-full" 
              size="lg" 
              disabled={isOptimizing}
            >
              {isOptimizing ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Optimierung läuft...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Prompt jetzt optimieren</span>
                </span>
              )}
            </Button>
          </div>
          <div className="bg-bg-primary rounded-lg p-4 border border-bg-secondary">
            <div className="space-y-2">
              <p className="text-sm text-text-secondary leading-relaxed">
                <strong className="text-text-primary">So funktioniert's:</strong> Kopiere einen normalen Prompt in die Zwischenablage und klicke auf den Button oder verwende den Shortcut.
              </p>
              <div className="flex items-center space-x-2 pt-2 border-t border-bg-secondary">
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Shortcut:</span>
                <span className="font-mono text-sm text-text-primary font-semibold bg-bg-secondary px-2.5 py-1 rounded border border-bg-primary">
                  {settings?.globalShortcut ? formatShortcut(settings.globalShortcut) : 'Nicht gesetzt'}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-2">
                Der aktive Metaprompt wird verwendet, um deinen Prompt zu optimieren.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

