import React, { useState, useEffect } from 'react';
import { Textarea } from '../ui/Textarea';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { Metaprompt } from '../../types';

interface MetapromptEditorProps {
  metaprompt?: Metaprompt;
  onSave: (mp: Metaprompt) => Promise<void>;
  onCancel: () => void;
}

export const MetapromptEditor: React.FC<MetapromptEditorProps> = ({
  metaprompt,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (metaprompt) {
      setName(metaprompt.name);
      setDescription(metaprompt.description || '');
      setContent(metaprompt.content);
    }
  }, [metaprompt]);

  const handleSave = async () => {
    if (!name.trim() || !content.trim()) {
      return;
    }

    setLoading(true);
    try {
      // Stelle sicher, dass nur der Standard-Metaprompt isDefault sein kann
      const finalIsDefault = metaprompt?.isDefault || false;
      
      const mp: Metaprompt = {
        id: metaprompt?.id || '', // Wird in der Page-Komponente gesetzt wenn leer
        name: name.trim(),
        description: description.trim() || undefined,
        content: content.trim(),
        isDefault: finalIsDefault,
        createdAt: metaprompt?.createdAt || new Date(),
        updatedAt: new Date(),
      };
      await onSave(mp);
    } catch (error) {
      console.error('Failed to save metaprompt:', error);
      alert('Fehler beim Speichern des Metaprompts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Metaprompt-Name..."
        />
        <Input
          label="Beschreibung (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Kurze Beschreibung..."
        />
        <Textarea
          label="Inhalt"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Metaprompt-Inhalt... (Verwende {user_prompt} als Platzhalter)"
          rows={12}
          className="font-mono text-sm"
        />
        {metaprompt?.isDefault && (
          <div className="flex items-center p-3 bg-brand bg-opacity-10 border border-brand rounded-lg">
            <svg className="w-5 h-5 text-brand mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-brand font-medium">
              Dies ist der Standard-Metaprompt und kann nicht geändert werden.
            </span>
          </div>
        )}
        <div className="flex space-x-2">
          <Button onClick={handleSave} disabled={loading || !name.trim() || !content.trim()}>
            {loading ? 'Speichern...' : 'Speichern'}
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Abbrechen
          </Button>
        </div>
      </div>
    </Card>
  );
};

