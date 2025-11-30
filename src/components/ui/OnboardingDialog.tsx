import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';

interface OnboardingStep {
  title: string;
  content: React.ReactNode;
  icon?: string;
}

interface OnboardingDialogProps {
  isOpen: boolean;
  onClose: (dontShowAgain: boolean) => void;
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: 'Willkommen bei Metaprompt!',
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">
          Metaprompt ist ein Desktop-Tool zur KI-gestützten Prompt-Optimierung mit Clipboard-Integration.
        </p>
        <p className="text-text-secondary">
          In diesem kurzen Walkthrough zeigen wir dir alle wichtigen Features und wie du die App einrichtest.
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
          Die App läuft im Hintergrund im System Tray:
        </p>
        <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
          <li><strong>Linksklick</strong> auf das Tray-Icon: Fenster öffnen/schließen</li>
          <li><strong>Rechtsklick</strong> auf das Tray-Icon: Kontextmenü mit Optionen</li>
          <li><strong>Hovern</strong> über das Tray-Icon: Zeigt den Namen der aktiven Vorlage</li>
        </ul>
        <p className="text-text-secondary">
          Das Fenster kann geschlossen werden und die App läuft weiter im Hintergrund.
        </p>
      </div>
    ),
    icon: '🔔',
  },
  {
    title: '7. History & Weitere Features',
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">
          Weitere nützliche Features:
        </p>
        <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
          <li><strong>History:</strong> Zeigt die letzten 20 Optimierungen mit Vorher/Nachher</li>
          <li><strong>Metaprompts verwalten:</strong> Erstelle, bearbeite oder lösche Metaprompts</li>
          <li><strong>KI-generierte Metaprompts:</strong> Lass die KI Metaprompts für dich erstellen</li>
          <li><strong>Provider wechseln:</strong> Wähle zwischen verschiedenen KI-Anbietern</li>
        </ul>
        <p className="text-text-secondary">
          Viel Erfolg beim Optimieren deiner Prompts! 🚀
        </p>
      </div>
    ),
    icon: '📚',
  },
];

export const OnboardingDialog: React.FC<OnboardingDialogProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const step = onboardingSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === onboardingSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose(dontShowAgain);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose(dontShowAgain);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        // Verhindere Schließen beim Klick außerhalb
        if (e.target === e.currentTarget) {
          // Optional: Schließen beim Klick außerhalb erlauben
          // handleSkip();
        }
      }}
    >
      <Card className="max-w-2xl w-full mx-4 h-[600px] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-bg-primary flex-shrink-0">
          <div className="flex items-center space-x-3">
            {step.icon && <span className="text-2xl">{step.icon}</span>}
            <h2 className="text-xl font-bold text-text-primary">{step.title}</h2>
          </div>
          <button
            onClick={handleSkip}
            className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded hover:bg-bg-primary"
            aria-label="Schließen"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div 
          className="flex-1 overflow-y-auto px-6 py-4 onboarding-scrollable" 
          style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: '#2C2E3B #1A1C27'
          }}
        >
          {step.content}
        </div>

        {/* Progress - Fixed */}
        <div className="border-t border-bg-primary px-6 py-3 flex-shrink-0">
          <div className="w-full bg-bg-secondary rounded-full h-2 mb-2">
            <div
              className="bg-brand h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
          <div className="text-sm text-text-secondary text-center">
            Schritt {currentStep + 1} von {onboardingSteps.length}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="border-t border-bg-primary px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrevious}
              disabled={isFirstStep}
              variant="secondary"
            >
              Zurück
            </Button>
            <div className="flex items-center gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-4 h-4 text-brand bg-bg-secondary border-bg-primary rounded focus:ring-brand"
                />
                <span className="text-sm text-text-secondary whitespace-nowrap">
                  Nicht mehr anzeigen
                </span>
              </label>
              <div className="flex space-x-2">
                {!isLastStep && (
                  <Button
                    onClick={handleSkip}
                    variant="secondary"
                  >
                    Schließen
                  </Button>
                )}
                <Button onClick={handleNext}>
                  {isLastStep ? 'Fertig' : 'Weiter'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

