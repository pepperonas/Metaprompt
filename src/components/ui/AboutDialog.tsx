import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  version: string;
}

interface GuideStep {
  title: string;
  content: React.ReactNode;
  icon?: string;
}

// Wiederverwendung der Guide-Schritte
const guideSteps: GuideStep[] = [
  {
    title: 'Willkommen bei Metaprompt!',
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">
          Metaprompt ist ein Desktop-Tool zur KI-gestützten Prompt-Optimierung mit Clipboard-Integration.
        </p>
        <p className="text-text-secondary">
          Diese Anleitung zeigt dir alle wichtigen Features und wie du die App verwendest.
        </p>
      </div>
    ),
    icon: '👋',
  },
  {
    title: '1. API-Keys konfigurieren',
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">
          Zuerst musst du deine API-Keys für die gewünschten KI-Anbieter einrichten:
        </p>
        <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
          <li><strong>OpenAI</strong> (GPT-4o, GPT-4-Turbo)</li>
          <li><strong>Anthropic</strong> (Claude 3.5 Sonnet)</li>
          <li><strong>xAI</strong> (Grok-2)</li>
          <li><strong>Google</strong> (Gemini 1.5 Pro)</li>
        </ul>
        <p className="text-text-secondary">
          Gehe zu <strong>Einstellungen → API-Keys</strong> und trage deine Keys ein. Die Keys werden verschlüsselt gespeichert.
        </p>
      </div>
    ),
    icon: '🔑',
  },
  {
    title: '2. Metaprompts verstehen',
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">
          <strong>Metaprompts</strong> sind Vorlagen, die definieren, wie normale Prompts optimiert werden sollen.
        </p>
        <p className="text-text-secondary">
          Die App kommt mit <strong>60+ vorgefertigten Metaprompts</strong> in verschiedenen Kategorien:
        </p>
        <ul className="list-disc list-inside space-y-1 text-text-secondary ml-4">
          <li>Standard Optimizer (kann nicht gelöscht werden)</li>
          <li>Entwicklung (Software, Frontend, Backend, API, DevOps, Testing, etc.)</li>
          <li>Kommunikation (Präsentationen, Berichte, Übersetzungen)</li>
          <li>Datenanalyse (ML, Statistik, Zeitreihen, Predictive Analytics, etc.)</li>
          <li>Business (Strategie, Projektmanagement, Finanzen, Verkauf, etc.)</li>
          <li>Marketing (Content, SEO, Social Media, E-Mail, etc.)</li>
          <li>Recht (Verträge, Arbeitsrecht, DSGVO, Compliance, etc.)</li>
          <li>Design (Bildgenerierung, UI/UX, Logo, Web, Video, 3D, etc.)</li>
          <li>Bildung, Kreativ, Lifestyle und mehr</li>
        </ul>
        <p className="text-text-secondary">
          Du kannst auch eigene Metaprompts erstellen oder mit KI generieren lassen.
        </p>
      </div>
    ),
    icon: '📝',
  },
  {
    title: '3. Metaprompt auswählen',
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">
          Im <strong>Dashboard</strong> kannst du den aktiven Metaprompt per Dropdown auswählen.
        </p>
        <p className="text-text-secondary">
          Der aktive Metaprompt wird verwendet, um deine Prompts zu optimieren. Du kannst jederzeit zwischen verschiedenen Vorlagen wechseln.
        </p>
        <p className="text-text-secondary">
          <strong>Tipp:</strong> Der aktive Metaprompt wird auch im Tray-Icon Tooltip angezeigt.
        </p>
      </div>
    ),
    icon: '🎯',
  },
  {
    title: '4. Prompt optimieren',
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">
          So optimierst du einen Prompt:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-text-secondary ml-4">
          <li>Kopiere einen normalen Prompt in die Zwischenablage</li>
          <li>Drücke <strong>Ctrl+Shift+O</strong> (oder <strong>Cmd+Shift+O</strong> auf macOS)</li>
          <li>Der aktive Metaprompt wird verwendet, um deinen Prompt zu optimieren</li>
          <li>Das optimierte Ergebnis wird automatisch in die Zwischenablage kopiert</li>
          <li>Füge es mit <strong>Ctrl+V</strong> ein</li>
        </ol>
        <p className="text-text-secondary">
          Du kannst auch im Dashboard auf <strong>"Prompt jetzt optimieren"</strong> klicken.
        </p>
      </div>
    ),
    icon: '⚡',
  },
  {
    title: '5. Metaprompt-Wechsel Shortcuts (Optional)',
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">
          Du kannst optionale Shortcuts festlegen, um schnell zwischen Metaprompt-Vorlagen zu wechseln:
        </p>
        <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
          <li><strong>Nächste Vorlage:</strong> Wechselt zur nächsten Metaprompt-Vorlage</li>
          <li><strong>Vorherige Vorlage:</strong> Wechselt zur vorherigen Metaprompt-Vorlage</li>
        </ul>
        <p className="text-text-secondary">
          Gehe zu <strong>Einstellungen → Allgemein</strong> und lege die Shortcuts fest (optional).
        </p>
      </div>
    ),
    icon: '⌨️',
  },
  {
    title: '6. System Tray',
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">
          Metaprompt läuft im Hintergrund und erscheint im System Tray:
        </p>
        <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
          <li><strong>Linksklick:</strong> Hauptfenster öffnen/schließen</li>
          <li><strong>Rechtsklick:</strong> Kontextmenü mit Optionen</li>
          <li>Im Menü kannst du schnell zwischen Anbietern und Metaprompts wechseln</li>
        </ul>
        <p className="text-text-secondary">
          <strong>Tipp:</strong> Du kannst die App schließen, ohne sie zu beenden - sie läuft weiter im Tray.
        </p>
      </div>
    ),
    icon: '📚',
  },
];

export const AboutDialog: React.FC<AboutDialogProps> = ({ isOpen, onClose, version }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'guide'>('about');
  const [guideStep, setGuideStep] = useState(0);

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const currentGuideStep = guideSteps[guideStep];
  const isFirstStep = guideStep === 0;
  const isLastStep = guideStep === guideSteps.length - 1;

  const handleGuideNext = () => {
    if (isLastStep) {
      setActiveTab('about');
      setGuideStep(0);
    } else {
      setGuideStep(guideStep + 1);
    }
  };

  const handleGuidePrevious = () => {
    if (!isFirstStep) {
      setGuideStep(guideStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col" style={{ minHeight: '600px', height: 'auto' }}>
        {/* Tabs */}
        <div className="flex border-b border-bg-secondary">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'about'
                ? 'text-brand border-b-2 border-brand'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Über
          </button>
          <button
            onClick={() => {
              setActiveTab('guide');
              setGuideStep(0);
            }}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'guide'
                ? 'text-brand border-b-2 border-brand'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Anleitung
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[400px]">
          {activeTab === 'about' ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-text-primary mb-2">Metaprompt</h2>
                <p className="text-text-secondary mb-1">Prompt-Optimierer</p>
                <p className="text-sm text-text-secondary">Version {version}</p>
              </div>

              <div className="border-t border-bg-secondary pt-4">
                <p className="text-sm text-text-secondary text-center mb-4">
                  © {currentYear} Martin Pfeffer
                </p>
                
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <a
                    href="https://www.linkedin.com/in/martin-pfeffer-020831134/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-text-secondary hover:text-brand transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-sm">LinkedIn</span>
                  </a>
                  
                  <a
                    href="https://github.com/pepperonas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-text-secondary hover:text-brand transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm">GitHub</span>
                  </a>
                </div>

                <div className="text-center">
                  <a
                    href="https://celox.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:text-brand/80 transition-colors font-medium"
                  >
                    celox.io
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 min-h-[400px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {currentGuideStep.icon && <span className="text-3xl">{currentGuideStep.icon}</span>}
                  <h2 className="text-2xl font-bold text-text-primary">{currentGuideStep.title}</h2>
                </div>
              </div>

              <div className="mb-6">
                {currentGuideStep.content}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-bg-secondary rounded-full h-2">
                  <div
                    className="bg-brand h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((guideStep + 1) / guideSteps.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-text-secondary mt-2 text-center">
                  Schritt {guideStep + 1} von {guideSteps.length}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-bg-secondary p-4 flex items-center justify-between">
          {activeTab === 'guide' ? (
            <>
              <Button
                onClick={handleGuidePrevious}
                disabled={isFirstStep}
                variant="secondary"
              >
                Zurück
              </Button>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    setActiveTab('about');
                    setGuideStep(0);
                  }}
                  variant="secondary"
                >
                  Schließen
                </Button>
                <Button onClick={handleGuideNext}>
                  {isLastStep ? 'Fertig' : 'Weiter'}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex justify-center w-full">
              <Button onClick={onClose} variant="secondary">
                Schließen
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

