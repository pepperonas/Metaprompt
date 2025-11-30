import React, { useEffect } from 'react';
import { useLicenseStore } from '../../stores/useLicenseStore';

interface SupportBadgeProps {
  onClick?: () => void;
}

export const SupportBadge: React.FC<SupportBadgeProps> = ({ onClick }) => {
  const { isLicensed, loadLicenseStatus } = useLicenseStore();
  const [mounted, setMounted] = React.useState(false);

  // Stelle sicher, dass der Status geladen ist
  useEffect(() => {
    setMounted(true);
    loadLicenseStatus().catch(err => {
      console.error('Failed to load license status in SupportBadge:', err);
    });
  }, [loadLicenseStatus]);

  // Zeige Badge immer an - auch während des Ladens
  // Wenn lizenziert: Zeige "Unterstützer" Badge
  if (mounted && isLicensed) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
        <span>💚</span>
        <span>Unterstützer</span>
      </div>
    );
  }

  // Zeige "Unterstützen" Badge (Standard, auch wenn noch nicht geladen)
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-secondary hover:bg-bg-secondary/80 text-text-secondary hover:text-text-primary transition-all duration-300 text-sm font-medium border border-transparent hover:border-brand/20"
      title="Unterstütze die Entwicklung von Metaprompt"
      type="button"
    >
      <span>☕</span>
      <span>Unterstützen</span>
    </button>
  );
};

