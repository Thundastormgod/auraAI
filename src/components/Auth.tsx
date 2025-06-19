import React, { useEffect } from 'react';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useUserStore();

  useEffect(() => {
    if (session) {
      navigate('/app');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Welcome to Aura
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Sign in or create an account to begin your ascent.
        </p>
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'github']}
          theme="light"
        />
      </div>
    </div>
  );
};

export default Auth;
