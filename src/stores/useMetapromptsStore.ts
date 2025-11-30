import { create } from 'zustand';
import type { Metaprompt } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface MetapromptsStore {
  metaprompts: Metaprompt[];
  loading: boolean;
  loadMetaprompts: () => Promise<void>;
  saveMetaprompt: (mp: Metaprompt) => Promise<void>;
  deleteMetaprompt: (id: string) => Promise<void>;
  createMetaprompt: (name: string, content: string, description?: string) => Promise<Metaprompt>;
  setDefault: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
}

export const useMetapromptsStore = create<MetapromptsStore>((set, get) => ({
  metaprompts: [],
  loading: false,
  
  loadMetaprompts: async () => {
    set({ loading: true });
    try {
      const metaprompts = await window.mrp.getMetaprompts();
      set({ metaprompts, loading: false });
    } catch (error) {
      console.error('Failed to load metaprompts:', error);
      set({ loading: false });
    }
  },
  
  saveMetaprompt: async (mp: Metaprompt) => {
    try {
      await window.mrp.saveMetaprompt(mp);
      const metaprompts = get().metaprompts;
      const index = metaprompts.findIndex(m => m.id === mp.id);
      
      if (index >= 0) {
        set({
          metaprompts: metaprompts.map(m => m.id === mp.id ? mp : m),
        });
      } else {
        set({ metaprompts: [...metaprompts, mp] });
      }
    } catch (error) {
      console.error('Failed to save metaprompt:', error);
      throw error;
    }
  },
  
  deleteMetaprompt: async (id: string) => {
    try {
      await window.mrp.deleteMetaprompt(id);
      set((state) => ({
        metaprompts: state.metaprompts.filter(m => m.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete metaprompt:', error);
      throw error;
    }
  },
  
  createMetaprompt: async (name: string, content: string, description?: string) => {
    const newMetaprompt: Metaprompt = {
      id: uuidv4(),
      name,
      content,
      description,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await get().saveMetaprompt(newMetaprompt);
    return newMetaprompt;
  },
  
  setDefault: async (id: string) => {
    const metaprompts = get().metaprompts;
    
    // Finde den Standard-Metaprompt
    const standardMetaprompt = metaprompts.find(m => m.isDefault);
    const targetMetaprompt = metaprompts.find(m => m.id === id);
    
    if (!targetMetaprompt) {
      throw new Error('Metaprompt nicht gefunden');
    }
    
    // Nur der Standard-Metaprompt kann als Standard gesetzt werden
    if (!targetMetaprompt.isDefault && standardMetaprompt) {
      throw new Error('Nur der Standard-Metaprompt kann als Standard markiert werden');
    }
    
    // Wenn der Standard-Metaprompt als Standard gesetzt wird, aktualisiere nur ihn
    if (targetMetaprompt.isDefault) {
      const updated = metaprompts.map(m => ({
        ...m,
        isDefault: m.id === id,
        updatedAt: m.id === id ? new Date() : m.updatedAt,
      }));
      
      for (const mp of updated) {
        await get().saveMetaprompt(mp);
      }
      
      set({ metaprompts: updated });
    }
  },
  
  toggleFavorite: async (id: string) => {
    try {
      await window.mrp.toggleFavorite(id);
      const metaprompts = get().metaprompts;
      const updated = metaprompts.map(m => 
        m.id === id 
          ? { ...m, isFavorite: !m.isFavorite, updatedAt: new Date() }
          : m
      );
      set({ metaprompts: updated });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw error;
    }
  },
  
  toggleActive: async (id: string) => {
    try {
      await window.mrp.toggleActive(id);
      const metaprompts = get().metaprompts;
      const updated = metaprompts.map(m => 
        m.id === id 
          ? { ...m, active: !(m.active !== false), updatedAt: new Date() } // Default ist true wenn undefined
          : m
      );
      set({ metaprompts: updated });
    } catch (error) {
      console.error('Failed to toggle active:', error);
      throw error;
    }
  },
}));

