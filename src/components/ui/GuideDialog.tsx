import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';

interface GuideStep {
  title: string;
  content: React.ReactNode;
  icon?: string;
}

interface GuideDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Wiederverwendung der Onboarding-Schritte als Anleitung
const guideSteps: GuideStep[] = [
  {
    title: 'Willkommen bei Metaprompt!',
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">
          Metaprompt ist ein Desktop-Tool zur KI-gestützten Prompt-Optimierung mit 60+ vorgefertigten Metaprompts, 
          Unterstützung für mehrere KI-Provider und nahtloser Clipboard-Integration.
        </p>
        <p className="text-text-secondary">
          Diese Anleitung zeigt dir alle wichtigen Features und wie du die App optimal verwendest.
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
          <strong>Metaprompts</strong> sind KI-gestützte Vorlagen, die definieren, wie deine Prompts optimiert werden sollen.
        </p>
        <p className="text-text-secondary">
          Die App kommt mit <strong>60+ vorgefertigten Metaprompts</strong> in verschiedenen Kategorien. 
          Per Default sind die wichtigsten 10 aktiviert, alle anderen kannst du bei Bedarf aktivieren:
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
          Du kannst eigene Metaprompts erstellen, mit KI generieren lassen oder Metaprompts als Favoriten markieren, 
          damit sie in der Auswahl ganz oben erscheinen.
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
          Favoriten-Metaprompts erscheinen ganz oben in der Liste.
        </p>
        <p className="text-text-secondary">
          Der aktive Metaprompt wird verwendet, um deine Prompts zu optimieren. Du kannst jederzeit zwischen verschiedenen Vorlagen wechseln.
        </p>
        <p className="text-text-secondary">
          <strong>Tipp:</strong> Nur aktive Metaprompts werden in der Auswahl angezeigt. Du kannst Metaprompts in der Metaprompts-Seite aktivieren oder deaktivieren.
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
          <li><strong>Rechtsklick:</strong> Kontextmenü mit schnellem Zugriff auf Provider, Metaprompts und Navigation</li>
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

export const GuideDialog: React.FC<GuideDialogProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = guideSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === guideSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
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
    onClose();
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
          className="flex-1 overflow-y-auto px-6 py-4 guide-scrollable" 
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
              style={{ width: `${((currentStep + 1) / guideSteps.length) * 100}%` }}
            />
          </div>
          <div className="text-sm text-text-secondary text-center">
            Schritt {currentStep + 1} von {guideSteps.length}
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
            <div className="flex space-x-2">
              <Button
                onClick={handleSkip}
                variant="secondary"
              >
                Schließen
              </Button>
              <Button onClick={handleNext}>
                {isLastStep ? 'Fertig' : 'Weiter'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

