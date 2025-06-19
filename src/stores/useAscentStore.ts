
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useUserStore } from './useUserStore';

export interface Ascent {
  id: string;
  user_id: string;
  title: string;
  description: string;
  motivation_statement: string;
  status: 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  ascent_id: string;
  user_id: string;
  title: string;
  sequence_order: number;
  status: 'pending' | 'completed';
  validation_type: 'personal' | 'ai_assisted' | 'ally_pact';
  created_at: string;
}

interface AscentState {
  ascents: Ascent[];
  milestones: { [ascentId: string]: Milestone[] };
  loading: boolean;
  
  // Actions
  loadAscents: () => Promise<void>;
  loadMilestones: (ascentId: string) => Promise<void>;
  createAscent: (ascentData: Partial<Ascent>) => Promise<Ascent>;
  generateMilestones: (ascentId: string, ascentTitle: string) => Promise<void>;
  updateAscentStatus: (id: string, status: Ascent['status']) => Promise<void>;
  updateMilestoneStatus: (id: string, status: Milestone['status']) => Promise<void>;
  deleteAscent: (ascentId: string) => Promise<void>;
}

export const useAscentStore = create<AscentState>((set, get) => ({
  ascents: [],
  milestones: {},
  loading: false,

  loadAscents: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('ascents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ ascents: data || [] });
    } catch (error) {
      console.error('Error loading ascents:', error);
    } finally {
      set({ loading: false });
    }
  },

  loadMilestones: async (ascentId: string) => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('ascent_id', ascentId)
        .order('sequence_order', { ascending: true });

      if (error) throw error;
      
      const { milestones } = get();
      set({ 
        milestones: { 
          ...milestones, 
          [ascentId]: data || [] 
        } 
      });
    } catch (error) {
      console.error('Error loading milestones:', error);
    }
  },

  createAscent: async (ascentData) => {
    try {
      set({ loading: true });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated for ascent creation');

      const { data, error } = await supabase
        .from('ascents')
        .insert([{
          ...ascentData,
          user_id: user.id,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      const { ascents } = get();
      set({ ascents: [data, ...ascents] });
      
      return data;
    } catch (error) {
      console.error('Error creating ascent:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  generateMilestones: async (ascentId, ascentTitle) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase.functions.invoke('suggest-milestones', {
        body: { ascentTitle }
      });

      if (error) throw error;
      const milestones = data.milestones.map((m: any, index: number) => ({ ...m, ascent_id: ascentId, user_id: useUserStore.getState().session?.user.id, status: 'not_started', sequence_order: index + 1 }));
      set((state) => ({ milestones: { ...state.milestones, [ascentId]: milestones } }));
    } catch (error) {
      console.error('Error generating milestones:', error);
    } finally {
      set({ loading: false });
    }
  },

  updateAscentStatus: async (id: string, status: Ascent['status']) => {
    try {
      const { error } = await supabase
        .from('ascents')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      const { ascents } = get();
      set({
        ascents: ascents.map(ascent => 
          ascent.id === id ? { ...ascent, status } : ascent
        )
      });
    } catch (error) {
      console.error('Error updating ascent status:', error);
      throw error;
    }
  },

  updateMilestoneStatus: async (id: string, status: Milestone['status']) => {
    try {
      const { error } = await supabase
        .from('milestones')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      const { milestones } = get();
      const updatedMilestones = { ...milestones };
      
      // Update the milestone in the appropriate ascent's milestone array
      Object.keys(updatedMilestones).forEach(ascentId => {
        updatedMilestones[ascentId] = updatedMilestones[ascentId].map(milestone =>
          milestone.id === id ? { ...milestone, status } : milestone
        );
      });

      set({ milestones: updatedMilestones });
    } catch (error) {
      console.error('Error updating milestone status:', error);
      throw error;
    }
  },

  deleteAscent: async (ascentId: string) => {
    try {
      set({ loading: true });
      const { error } = await supabase
        .from('ascents')
        .delete()
        .eq('id', ascentId);

      if (error) throw error;

      // Update local state on success
      set((state) => ({
        ascents: state.ascents.filter((ascent) => ascent.id !== ascentId),
        milestones: Object.fromEntries(
          Object.entries(state.milestones).filter(([key]) => key !== ascentId)
        ),
      }));

    } catch (error) {
      console.error('Error deleting ascent:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
