import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useUserStore } from './stores/useUserStore';

// Page Imports
import Index from './pages/Index';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import AscentDetail from './pages/AscentDetail';
import AscentDetail3D from './pages/AscentDetail3D';

// Component Imports
import Auth from './components/Auth';
import ProtectedLayout from './components/ProtectedLayout';

const queryClient = new QueryClient();

const App = () => {
  const { setSession, loadProfile } = useUserStore();

  useEffect(() => {
    // Set initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadProfile();
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          loadProfile();
        } 
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setSession, loadProfile]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Routes */}
            <Route path="/app" element={<ProtectedLayout />}>
              <Route index element={<Index />} />
              <Route path="ascent/:ascentId" element={<AscentDetail />} />
              <Route path="ascent/:ascentId/3d" element={<AscentDetail3D />} />
              {/* Add other protected routes here, e.g., /app/settings */}
            </Route>

            {/* Catch-all Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
