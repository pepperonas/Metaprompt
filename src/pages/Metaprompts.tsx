import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MetapromptEditor } from '../components/features/MetapromptEditor';
import { MetapromptGenerator } from '../components/features/MetapromptGenerator';
import { useMetapromptsStore } from '../stores/useMetapromptsStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { v4 as uuidv4 } from 'uuid';
import type { Metaprompt } from '../types';

const Metaprompts: React.FC = () => {
  const { metaprompts, loadMetaprompts, saveMetaprompt, deleteMetaprompt, setDefault } = useMetapromptsStore();
  const { settings, updateSettings } = useSettingsStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    loadMetaprompts();
  }, []);

  const editingMetaprompt = editingId ? metaprompts.find(m => m.id === editingId) : undefined;

  const handleSave = async (mp: Metaprompt) => {
    // Wenn neuer Metaprompt, ID generieren
    if (!mp.id) {
      mp.id = uuidv4();
      mp.createdAt = new Date();
    }
    
    // Stelle sicher, dass nur der Standard-Metaprompt isDefault sein kann
    const existingMetaprompt = metaprompts.find(m => m.id === mp.id);
    const isStandardMetaprompt = existingMetaprompt?.isDefault || false;
    
    // Wenn es der Standard-Metaprompt ist, behalte isDefault bei
    // Wenn es kein Standard-Metaprompt ist, entferne isDefault
    mp.isDefault = isStandardMetaprompt;
    
    // Verhindere, dass ein anderer Metaprompt als Standard markiert wird
    if (mp.isDefault && !isStandardMetaprompt) {
      alert('Nur der Standard-Metaprompt kann als Standard markiert werden.');
      mp.isDefault = false;
    }
    
    mp.updatedAt = new Date();
    
    await saveMetaprompt(mp);
    if (mp.isDefault) {
      await setDefault(mp.id);
      await updateSettings({ activeMetapromptId: mp.id });
    }
    setShowEditor(false);
    setEditingId(null);
    await loadMetaprompts(); // Reload to get updated list
  };

  const handleCreate = () => {
    setEditingId(null);
    setShowEditor(true);
    setShowGenerator(false);
  };

  const handleGenerate = () => {
    setShowGenerator(true);
    setShowEditor(false);
    setEditingId(null);
  };

  const handleGenerated = async (name: string, description: string, content: string) => {
    const newMetaprompt: Metaprompt = {
      id: uuidv4(),
      name,
      description,
      content,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await saveMetaprompt(newMetaprompt);
    await loadMetaprompts();
    setShowGenerator(false);
    
    // Hinweis: Metaprompt kann im Dashboard aktiviert werden
    alert('Metaprompt wurde erstellt. Du kannst ihn im Dashboard aktivieren.');
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    const metaprompt = metaprompts.find(m => m.id === id);
    
    // Verhindere Löschen des Standard-Metaprompts
    if (metaprompt?.isDefault) {
      alert('Der Standard-Metaprompt kann nicht gelöscht werden.');
      return;
    }
    
    if (confirm('Metaprompt wirklich löschen?')) {
      try {
        await deleteMetaprompt(id);
        await loadMetaprompts();
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Fehler beim Löschen');
      }
    }
  };


  if (showEditor) {
    return (
      <div className="p-6">
        <MetapromptEditor
          metaprompt={editingMetaprompt}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false);
            setEditingId(null);
          }}
        />
      </div>
    );
  }

  if (showGenerator) {
    return (
      <div className="p-6">
        <MetapromptGenerator
          onGenerated={handleGenerated}
          onCancel={() => setShowGenerator(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Metaprompts</h2>
          <p className="text-text-secondary">
            Metaprompts sind Vorlagen, die definieren, wie normale Prompts optimiert werden sollen. 
            Erstelle mehrere Vorlagen und wähle sie im Dashboard aus.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={handleGenerate}>
            Mit KI generieren
          </Button>
          <Button onClick={handleCreate}>Manuell erstellen</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {metaprompts.length === 0 ? (
          <Card>
            <p className="text-text-secondary text-center py-8">Keine Metaprompts vorhanden</p>
          </Card>
        ) : (
          // Sortiere: Standard-Metaprompt zuerst
          [...metaprompts].sort((a, b) => {
            if (a.isDefault && !b.isDefault) return -1;
            if (!a.isDefault && b.isDefault) return 1;
            return 0;
          }).map((mp) => {
            const isActive = settings?.activeMetapromptId === mp.id;
            return (
            <Card 
              key={mp.id}
              className={`${
                mp.isDefault 
                  ? 'border-2 border-brand bg-brand bg-opacity-5' 
                  : isActive 
                  ? 'border-2 border-blue-500 bg-blue-500 bg-opacity-5' 
                  : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {mp.isDefault && (
                      <svg className="w-5 h-5 text-brand" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    <h3 className={`text-lg font-semibold ${mp.isDefault ? 'text-brand' : 'text-text-primary'}`}>
                      {mp.name}
                    </h3>
                    {mp.isDefault && (
                      <span className="text-xs px-3 py-1 bg-brand text-white rounded-full font-medium shadow-lg shadow-brand/50">
                        Standard
                      </span>
                    )}
                  </div>
                  {mp.description && (
                    <p className="text-sm text-text-secondary mb-2">{mp.description}</p>
                  )}
                  <p className="text-xs text-text-secondary">
                    Erstellt: {new Date(mp.createdAt).toLocaleDateString('de-DE')} | 
                    Aktualisiert: {new Date(mp.updatedAt).toLocaleDateString('de-DE')}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  {settings?.activeMetapromptId === mp.id && (
                    <span className="text-xs px-3 py-1 bg-green-500 bg-opacity-30 text-green-300 rounded border border-green-500/50 font-medium">
                      Aktiv
                    </span>
                  )}
                  {!mp.isDefault && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(mp.id)}
                      >
                        Bearbeiten
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(mp.id)}
                      >
                        Löschen
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Metaprompts;

