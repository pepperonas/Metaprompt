import React, { useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { ApiKeyForm } from '../components/features/ApiKeyForm';
import { ShortcutInput } from '../components/features/ShortcutInput';
import { useSettingsStore } from '../stores/useSettingsStore';
import { formatShortcut } from '../utils/formatShortcut';
import type { Provider } from '../types';

const Settings: React.FC = () => {
  const { settings, loadSettings, updateSettings } = useSettingsStore();
  const [localSettings, setLocalSettings] = React.useState(settings);
  const [activeTab, setActiveTab] = React.useState<'general' | 'api-keys'>('general');

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  if (!localSettings) {
    return (
      <div className="p-6">
        <p className="text-text-secondary">Lade Einstellungen...</p>
      </div>
    );
  }

  const handleSave = async () => {
    if (localSettings) {
      await updateSettings(localSettings);
    }
  };

  const handleChange = (key: keyof typeof localSettings, value: any) => {
    if (localSettings) {
      setLocalSettings({ ...localSettings, [key]: value });
    }
  };

  const providerNames: Record<Provider, string> = {
    openai: 'OpenAI (GPT-4o, GPT-4-Turbo)',
    anthropic: 'Anthropic (Claude 3.5 Sonnet, Claude 3 Opus)',
    grok: 'xAI (Grok-2)',
    gemini: 'Google (Gemini 1.5 Pro, Gemini 1.5 Flash)',
  };

  const providers: Provider[] = ['openai', 'anthropic', 'grok', 'gemini'];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Einstellungen</h2>
        <p className="text-text-secondary">
          {activeTab === 'api-keys' 
            ? 'Konfiguriere deine API-Keys für die verschiedenen Anbieter. Die Keys werden verschlüsselt gespeichert.'
            : 'Konfiguriere das Verhalten der Anwendung und verwalte deine API-Keys'}
        </p>
      </div>

      <Tabs 
        tabs={[
          { id: 'general', label: 'Allgemein' },
          { id: 'api-keys', label: 'API-Keys' },
        ]} 
        activeTab={activeTab} 
        onTabChange={(id) => setActiveTab(id as 'general' | 'api-keys')} 
      />

      {activeTab === 'general' && (
        <>
          <Card title="Allgemein">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Beim Start minimieren</label>
              <p className="text-xs text-text-secondary">App startet im System Tray</p>
            </div>
            <input
              type="checkbox"
              checked={localSettings.minimizeToTray}
              onChange={(e) => handleChange('minimizeToTray', e.target.checked)}
              className="w-4 h-4 text-brand bg-bg-secondary border-bg-primary rounded focus:ring-brand"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Benachrichtigungen anzeigen</label>
              <p className="text-xs text-text-secondary">System-Benachrichtigungen bei Optimierungen</p>
            </div>
            <input
              type="checkbox"
              checked={localSettings.showNotifications}
              onChange={(e) => handleChange('showNotifications', e.target.checked)}
              className="w-4 h-4 text-brand bg-bg-secondary border-bg-primary rounded focus:ring-brand"
            />
          </div>
        </div>
      </Card>

      <Card title="Globaler Shortcut">
        <div className="space-y-4">
          <ShortcutInput
            label="Tastenkombination"
            value={localSettings.globalShortcut}
            onChange={(shortcut) => handleChange('globalShortcut', shortcut)}
          />
          <div className="mt-4 p-3 bg-bg-primary rounded-lg border border-bg-secondary">
            <p className="text-xs text-text-secondary mb-2">
              <strong>Aktueller Shortcut:</strong>{' '}
              <span className="font-mono text-text-primary font-medium">
                {formatShortcut(localSettings.globalShortcut)}
              </span>
            </p>
            <p className="text-xs text-text-secondary">
              Dieser Shortcut wird global registriert und funktioniert auch wenn die App nicht im Fokus ist.
            </p>
          </div>
        </div>
      </Card>

      <Card title="Metaprompt-Wechsel Shortcuts">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary mb-4">
            Optional: Lege Shortcuts fest, um schnell zwischen Metaprompt-Vorlagen zu wechseln.
          </p>
          <ShortcutInput
            label="Nächste Vorlage"
            value={localSettings.metapromptNextShortcut || ''}
            onChange={(shortcut) => handleChange('metapromptNextShortcut', shortcut)}
            placeholder="Nicht gesetzt"
          />
          <ShortcutInput
            label="Vorherige Vorlage"
            value={localSettings.metapromptPrevShortcut || ''}
            onChange={(shortcut) => handleChange('metapromptPrevShortcut', shortcut)}
            placeholder="Nicht gesetzt"
          />
          <div className="mt-4 p-3 bg-bg-primary rounded-lg border border-bg-secondary">
            <p className="text-xs text-text-secondary mb-2">
              <strong>Hinweis:</strong> Diese Shortcuts sind optional. Wenn nicht gesetzt, kannst du die Vorlage im Dashboard auswählen.
            </p>
            <p className="text-xs text-text-secondary">
              Der aktive Metaprompt wird auch im Tray-Icon Tooltip angezeigt.
            </p>
          </div>
        </div>
      </Card>

      <Card title="API-Verhalten">
        <div className="space-y-4">
          <Input
            type="number"
            label="Max Tokens"
            value={localSettings.maxTokens}
            onChange={(e) => handleChange('maxTokens', parseInt(e.target.value) || 2048)}
            min={1}
            max={4096}
          />
          <Input
            type="number"
            label="Temperature"
            value={localSettings.temperature}
            onChange={(e) => handleChange('temperature', parseFloat(e.target.value) || 0.7)}
            min={0}
            max={1}
            step={0.1}
          />
        </div>
      </Card>

          <Button onClick={handleSave} className="w-full">
            Einstellungen speichern
          </Button>
        </>
      )}

      {activeTab === 'api-keys' && (
        <>
          {providers.map((provider) => (
            <ApiKeyForm 
              key={provider} 
              provider={provider} 
              providerName={providerNames[provider]} 
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Settings;

