import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { LicenseInput } from './LicenseInput';
import { useLicenseStore } from '../../stores/useLicenseStore';

interface SupportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const LEMONSQUEEZY_URL = 'https://celox.lemonsqueezy.com/buy/836b10a3-bb22-4b62-bbca-f0a13fcfc824';

export const SupportDialog: React.FC<SupportDialogProps> = ({ isOpen, onClose }) => {
  const [showLicenseInput, setShowLicenseInput] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const { activateLicense, dismissDialog, dismissDialogPermanently, dialogShownCount } = useLicenseStore();

  useEffect(() => {
    if (isOpen) {
      setShowLicenseInput(false);
      setDontShowAgain(false);
    }
  }, [isOpen]);

  const handleSupport = () => {
    // Öffne LemonSqueezy Checkout
    window.mrp.app.openExternal(LEMONSQUEEZY_URL);
  };

  const handleLicenseActivate = async (key: string) => {
    return await activateLicense(key);
  };

  const handleRemindLater = async () => {
    await dismissDialog(7);
    onClose();
  };

  const handleDontShowAgain = async () => {
    if (dontShowAgain) {
      await dismissDialogPermanently();
    }
    onClose();
  };

  // Zeige "Nicht mehr zeigen" Checkbox erst nach 5x Anzeige
  const showDontShowAgainCheckbox = dialogShownCount >= 5;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-lg w-full mx-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Dir gefällt Metaprompt?
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-bg-secondary"
              aria-label="Schließen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          {!showLicenseInput ? (
            <div className="space-y-4">
              <div className="prose prose-invert max-w-none">
                <p className="text-text-secondary leading-relaxed">
                  Hey! Du nutzt Metaprompt jetzt seit über einem Monat. Freut mich, dass dir die App gefällt!
                </p>
                <p className="text-text-secondary leading-relaxed mt-3">
                  Ich entwickle Metaprompt in meiner Freizeit als Open-Source-Projekt. Wenn du die Entwicklung unterstützen möchtest, kannst du für einmalig 20€ eine Lizenz erwerben.
                </p>
                <p className="text-text-secondary leading-relaxed mt-3">
                  Keine Sorge – die App funktioniert auch ohne Lizenz uneingeschränkt weiter. Aber deine Unterstützung hilft mir, neue Features zu entwickeln und die App zu verbessern.
                </p>
                <p className="text-text-secondary mt-4 font-medium">
                  – Martin
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <Button
                  variant="primary"
                  onClick={handleSupport}
                  className="w-full min-h-[48px]"
                >
                  Jetzt unterstützen (20€)
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => setShowLicenseInput(true)}
                  className="w-full min-h-[48px]"
                >
                  Lizenzschlüssel eingeben
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleRemindLater}
                    className="flex-1 min-h-[48px]"
                  >
                    Später erinnern
                  </Button>
                </div>

                {showDontShowAgainCheckbox && (
                  <div className="pt-2 border-t border-bg-secondary">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                        className="w-4 h-4 rounded border-bg-secondary bg-bg-primary text-brand focus:ring-brand focus:ring-offset-0 focus:ring-offset-bg-primary cursor-pointer"
                      />
                      <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                        Nicht mehr zeigen
                      </span>
                    </label>
                    {dontShowAgain && (
                      <Button
                        variant="secondary"
                        onClick={handleDontShowAgain}
                        className="w-full mt-3 min-h-[48px]"
                      >
                        Bestätigen
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Lizenzschlüssel eingeben
                </h3>
                <p className="text-sm text-text-secondary">
                  Hast du bereits eine Lizenz gekauft? Gib hier deinen Lizenzschlüssel ein.
                </p>
              </div>
              <LicenseInput
                onActivate={handleLicenseActivate}
                onCancel={() => setShowLicenseInput(false)}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

