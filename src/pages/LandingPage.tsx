import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Target, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 text-slate-800">
      {/* Header */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-2xl bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Aura
        </div>
        <nav className="flex items-center gap-4">
          <Link to="/auth">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full px-6">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 text-center mt-20 sm:mt-32">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Turn Intention into Achievement
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-600">
          Aura is your AI achievement ally. We help you define your goals, create actionable roadmaps, and stay accountable every step of the way.
        </p>
        <Link to="/auth">
          <Button size="lg" className="mt-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow">
            Start Your First Ascent
          </Button>
        </Link>
      </main>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-24 sm:py-32">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-white rounded-full shadow-md border border-slate-200">
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-800">AI Milestone Architect</h3>
            <p className="mt-2 text-slate-500">
              Describe your goal in plain English. Our AI will instantly generate a clear, step-by-step roadmap for you.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-4 bg-white rounded-full shadow-md border border-slate-200">
              <Target className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-800">Intelligent Focus Core</h3>
            <p className="mt-2 text-slate-500">
              Use flexible timers and an AI Focus Guard to create the perfect environment for deep, uninterrupted work.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-4 bg-white rounded-full shadow-md border border-slate-200">
              <ShieldCheck className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-800">The Validation Pact™</h3>
            <p className="mt-2 text-slate-500">
              Go beyond checking boxes. Validate your progress with AI, an accountability partner, or mindful self-reflection.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-slate-500">
        <p>&copy; {new Date().getFullYear()} Aura. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
