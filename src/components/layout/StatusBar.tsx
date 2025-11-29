import React from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { formatShortcut } from '../../utils/formatShortcut';

const StatusBar: React.FC = () => {
  const { settings } = useSettingsStore();

  return (
    <footer className="bg-bg-secondary border-t border-bg-primary px-6 py-2 flex items-center justify-between text-sm text-text-secondary">
      <div className="flex items-center space-x-4">
        <span className="flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Bereit
        </span>
        {settings && settings.globalShortcut && (
          <span>
            Shortcut:{' '}
            <span className="font-mono font-medium text-text-primary">
              {formatShortcut(settings.globalShortcut)}
            </span>
          </span>
        )}
      </div>
      <span>v1.0.0</span>
    </footer>
  );
};

export default StatusBar;

