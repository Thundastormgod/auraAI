import React from 'react';
import { useUserStore } from '../stores/useUserStore';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProtectedLayout: React.FC = () => {
  const { session, loading } = useUserStore();

  // While the session is loading, show a full-screen loader
  // to prevent a flicker of the login page.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  // If there is no session, redirect the user to the landing page.
  if (!session) {
    return <Navigate to="/" replace />;
  }

  // If a session exists, render the nested routes (the main application).
  return <Outlet />;
};

export default ProtectedLayout;
