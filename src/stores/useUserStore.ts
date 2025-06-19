
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  full_name: string | null;
  preferred_llm: string;
  updated_at: string;
}

interface UserState {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  
  // Actions
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  updatePreferredLLM: (llm: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadProfile: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  session: null,
  profile: null,
  loading: false,

  setSession: (session) => set({ session }),
  
  setProfile: (profile) => set({ profile }),

  updatePreferredLLM: async (llm: string) => {
    try {
      set({ loading: true });
      const { session } = get();
      if (!session?.user?.id) throw new Error('No user session');

      const { error } = await supabase
        .from('profiles')
        .update({ preferred_llm: llm, updated_at: new Date().toISOString() })
        .eq('id', session.user.id);

      if (error) throw error;

      // Update local state
      const { profile } = get();
      if (profile) {
        set({ profile: { ...profile, preferred_llm: llm } });
      }
    } catch (error) {
      console.error('Error updating preferred LLM:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ session: null, profile: null });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  loadProfile: async () => {
    try {
      set({ loading: true });
      const { session } = get();
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        set({ profile: data });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      set({ loading: false });
    }
  },
}));
