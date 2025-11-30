import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { MetapromptEditor } from '../components/features/MetapromptEditor';
import { MetapromptGenerator } from '../components/features/MetapromptGenerator';
import { useMetapromptsStore } from '../stores/useMetapromptsStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { v4 as uuidv4 } from 'uuid';
import type { Metaprompt } from '../types';

const Metaprompts: React.FC = () => {
  const { metaprompts, loadMetaprompts, saveMetaprompt, deleteMetaprompt, setDefault, toggleFavorite, toggleActive } = useMetapromptsStore();
  const { settings, updateSettings } = useSettingsStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadMetaprompts();
  }, []);

  const editingMetaprompt = editingId ? metaprompts.find(m => m.id === editingId) : undefined;

  // Kategorien aus Metaprompts extrahieren
  const categories = useMemo(() => {
    const cats = new Set<string>();
    metaprompts.forEach(mp => {
      if (mp.category) {
        cats.add(mp.category);
      }
    });
    return Array.from(cats).sort();
  }, [metaprompts]);

  // Gefilterte und sortierte Metaprompts
  const filteredMetaprompts = useMemo(() => {
    let filtered = [...metaprompts];

    // Filter nach Kategorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(mp => mp.category === selectedCategory);
    }

    // Filter nach Suche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(mp => 
        mp.name.toLowerCase().includes(query) ||
        mp.description?.toLowerCase().includes(query) ||
        mp.content.toLowerCase().includes(query)
      );
    }

    // Sortierung: Standard-Metaprompt immer ganz oben, dann Favoriten, dann Rest
    filtered.sort((a, b) => {
      // Standard-Metaprompt immer ganz oben
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      
      // Wenn beide Standard sind oder beide nicht Standard, dann Favoriten zuerst
      if (!a.isDefault && !b.isDefault) {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
      }
      
      // Alphabetisch nach Name
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [metaprompts, selectedCategory, searchQuery]);

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
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Metaprompts</h1>
          <p className="text-text-secondary leading-relaxed max-w-2xl">
            Metaprompts sind Vorlagen, die definieren, wie normale Prompts optimiert werden sollen. 
            Erstelle mehrere Vorlagen und wähle sie im Dashboard aus.
          </p>
        </div>
        <div className="flex space-x-3 ml-6">
          <Button variant="secondary" onClick={handleGenerate}>
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Mit KI generieren</span>
            </span>
          </Button>
          <Button onClick={handleCreate}>
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Manuell erstellen</span>
            </span>
          </Button>
        </div>
      </div>

      {/* Suche und Filter */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              placeholder="Metaprompts durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <Select
              options={[
                { value: 'all', label: 'Alle Kategorien' },
                ...categories.map(cat => ({ value: cat, label: cat }))
              ]}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
          </div>
        </div>
        {filteredMetaprompts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-bg-primary">
            <p className="text-sm text-text-secondary">
              <span className="font-medium text-text-primary">{filteredMetaprompts.length}</span> Metaprompt{filteredMetaprompts.length !== 1 ? 's' : ''} gefunden
            </p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {filteredMetaprompts.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="mb-4">
                <svg className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-text-secondary mb-2 font-medium text-lg">
                {metaprompts.length === 0 
                  ? 'Keine Metaprompts vorhanden' 
                  : 'Keine Metaprompts gefunden'}
              </p>
              <p className="text-sm text-text-secondary mb-6">
                {metaprompts.length === 0 
                  ? 'Erstelle deinen ersten Metaprompt, um zu beginnen.' 
                  : 'Versuche andere Suchbegriffe oder wähle eine andere Kategorie.'}
              </p>
              {metaprompts.length === 0 && (
                <Button onClick={handleCreate}>
                  Ersten Metaprompt erstellen
                </Button>
              )}
            </div>
          </Card>
        ) : (
          filteredMetaprompts.map((mp) => {
            const isActive = settings?.activeMetapromptId === mp.id;
            return (
            <Card 
              key={mp.id}
              className={`transition-all duration-200 ${
                isActive && mp.isDefault
                  ? 'border-2 border-brand bg-brand/5 shadow-lg shadow-brand/10' 
                  : isActive && !mp.isDefault
                  ? 'border-2 border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10' 
                  : 'border border-bg-primary hover:border-bg-secondary hover:shadow-xl'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    {mp.isDefault ? (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-brand/20 text-brand rounded-md border border-brand/30 text-xs font-semibold">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Standard</span>
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={async () => {
                            try {
                              await toggleFavorite(mp.id);
                              await loadMetaprompts();
                            } catch (error) {
                              console.error('Fehler beim Setzen der Favoriten:', error);
                            }
                          }}
                          className="focus:outline-none hover:opacity-80 transition-opacity p-1 -ml-1"
                          title={mp.isFavorite ? 'Aus Favoriten entfernen' : 'Als Favorit markieren'}
                          aria-label={mp.isFavorite ? 'Aus Favoriten entfernen' : 'Als Favorit markieren'}
                        >
                          <svg 
                            className={`w-5 h-5 transition-all ${mp.isFavorite ? 'text-yellow-500 fill-current' : 'text-text-secondary hover:text-yellow-400'}`} 
                            fill={mp.isFavorite ? 'currentColor' : 'none'} 
                            stroke={mp.isFavorite ? 'none' : 'currentColor'}
                            strokeWidth={mp.isFavorite ? 0 : 1.5}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await toggleActive(mp.id);
                              await loadMetaprompts();
                            } catch (error) {
                              console.error('Fehler beim Aktivieren/Deaktivieren:', error);
                            }
                          }}
                          className="focus:outline-none hover:opacity-80 transition-opacity p-1"
                          title={mp.active !== false ? 'Deaktivieren' : 'Aktivieren'}
                          aria-label={mp.active !== false ? 'Deaktivieren' : 'Aktivieren'}
                        >
                          <svg 
                            className={`w-5 h-5 transition-all ${mp.active !== false ? 'text-green-500' : 'text-text-secondary hover:text-red-400'}`} 
                            fill="none" 
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            {mp.active !== false ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                          </svg>
                        </button>
                      </>
                    )}
                    <h3 className={`text-lg font-semibold ${mp.isDefault ? 'text-brand' : 'text-text-primary'}`}>
                      {mp.name}
                    </h3>
                    {mp.category && (
                      <span className="text-xs px-2.5 py-1 bg-bg-primary rounded-md text-text-secondary border border-bg-secondary font-medium">
                        {mp.category}
                      </span>
                    )}
                    {isActive && (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-green-500/20 text-green-400 rounded-md border border-green-500/30 text-xs font-semibold">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        <span>Aktiv</span>
                      </span>
                    )}
                  </div>
                  {mp.description && (
                    <p className="text-sm text-text-secondary mb-3 leading-relaxed">{mp.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-text-secondary">
                    <span className="flex items-center space-x-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Erstellt: {new Date(mp.createdAt).toLocaleDateString('de-DE')}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Aktualisiert: {new Date(mp.updatedAt).toLocaleDateString('de-DE')}</span>
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
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

