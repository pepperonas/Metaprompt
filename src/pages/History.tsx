import React, { useState, useEffect } from 'react';
import { HistoryList } from '../components/features/HistoryList';
import type { OptimizationHistory } from '../types';

const History: React.FC = () => {
  const [history, setHistory] = useState<OptimizationHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const h = await window.mrp.getHistory();
      // Konvertiere Datum-Strings zu Date-Objekten
      const converted = h.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }));
      setHistory(converted);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-text-secondary">Lade Verlauf...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Optimierungs-Verlauf</h1>
        <p className="text-text-secondary leading-relaxed">
          Übersicht über die letzten 20 Optimierungen
        </p>
      </div>

      <HistoryList history={history} />
    </div>
  );
};

export default History;

