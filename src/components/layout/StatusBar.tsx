import React from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { formatShortcut } from '../../utils/formatShortcut';

const StatusBar: React.FC = () => {
  const { settings } = useSettingsStore();
  const [version, setVersion] = React.useState('1.0.0');

  React.useEffect(() => {
    window.mrp.app.getVersion().then(setVersion);
  }, []);

  return (
    <footer className="bg-bg-secondary border-t border-bg-primary px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-text-secondary">
        <div className="flex items-center space-x-6">
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-medium">Bereit</span>
          </span>
          {settings && settings.globalShortcut && (
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-text-secondary">Shortcut:</span>
              <span className="font-mono font-semibold text-text-primary bg-bg-primary px-2 py-0.5 rounded border border-bg-secondary">
                {formatShortcut(settings.globalShortcut)}
              </span>
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-text-secondary">Version</span>
          <span className="font-semibold text-text-primary">v{version}</span>
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;

