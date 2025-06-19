import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAscentStore, Ascent } from '../stores/useAscentStore';
import { useUserStore } from '@/stores/useUserStore';
import { AscentCard } from '../components/AscentCard';
import { CreateAscentModal } from '../components/CreateAscentModal';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Loader2 } from 'lucide-react';

const Index = () => {
  const {
    ascents,
    loadAscents,
    loading,
    updateAscentStatus,
    deleteAscent
  } = useAscentStore();
  const { signOut } = useUserStore();
  const navigate = useNavigate();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [ascentToDelete, setAscentToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadAscents();
  }, [loadAscents]);

  const handleStatusChange = (id: string, status: Ascent['status']) => {
    updateAscentStatus(id, status);
  };

  const handleDeleteAscent = async () => {
    if (ascentToDelete) {
      await deleteAscent(ascentToDelete);
      setAscentToDelete(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:p-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Aura
            </h1>
            <div className="flex items-center gap-4">
              <Button onClick={() => setCreateModalOpen(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Begin New Ascent
              </Button>
              <Button variant="outline" onClick={signOut}>Sign Out</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        {loading && ascents.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : ascents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ascents.map(ascent => (
              <AscentCard 
                key={ascent.id} 
                ascent={ascent} 
                onSelect={() => navigate(`/app/ascent/${ascent.id}`)}
                onStatusChange={handleStatusChange}
                onDelete={(id) => setAscentToDelete(id)}
                on3DView={(id) => navigate(`/app/ascent/${id}/3d`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-800">No Ascents Yet</h2>
            <p className="mt-2 text-slate-500">Your journey of a thousand miles begins with a single step.</p>
            <Button onClick={() => setCreateModalOpen(true)} className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Ascent
            </Button>
          </div>
        )}
      </main>

            <CreateAscentModal open={isCreateModalOpen} onOpenChange={setCreateModalOpen} />

      <AlertDialog open={!!ascentToDelete} onOpenChange={() => setAscentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the ascent
              and all of its associated milestones.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAscentToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAscent} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
