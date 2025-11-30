import React from 'react';
import { Card } from '../ui/Card';
import type { OptimizationHistory } from '../../types';

interface HistoryListProps {
  history: OptimizationHistory[];
}

export const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-text-secondary mb-2 font-medium text-lg">Keine Optimierungen vorhanden</p>
          <p className="text-sm text-text-secondary">
            Deine Optimierungen werden hier angezeigt, sobald du deinen ersten Prompt optimierst.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((entry) => (
        <Card key={entry.id} className="hover:shadow-xl transition-shadow duration-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-bg-primary">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  entry.success ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-text-secondary">
                  {new Date(entry.timestamp).toLocaleString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-md ${
                entry.success 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {entry.success ? 'Erfolg' : 'Fehler'}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">Original Prompt</p>
              <div className="bg-bg-primary p-3 rounded-lg border border-bg-secondary">
                <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap break-words">{entry.originalPrompt}</p>
              </div>
            </div>
            {entry.success && entry.optimizedPrompt && (
              <div>
                <p className="text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">Optimierter Prompt</p>
                <div className="bg-bg-primary p-3 rounded-lg border border-bg-secondary">
                  <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap break-words">{entry.optimizedPrompt}</p>
                </div>
              </div>
            )}
            {entry.error && (
              <div>
                <p className="text-xs font-semibold text-red-400 mb-2 uppercase tracking-wide">Fehler</p>
                <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/30">
                  <p className="text-sm text-red-400 leading-relaxed">{entry.error}</p>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-4 pt-2 border-t border-bg-primary text-xs text-text-secondary">
              <span className="flex items-center space-x-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="font-medium">{entry.provider}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <span>{entry.model}</span>
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

