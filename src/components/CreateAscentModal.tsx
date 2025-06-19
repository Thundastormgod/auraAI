
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAscentStore } from '../stores/useAscentStore';
import { toast } from '@/components/ui/use-toast';
import { Sparkles, Target, Heart } from 'lucide-react';

interface CreateAscentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateAscentModal: React.FC<CreateAscentModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [motivationStatement, setMotivationStatement] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { createAscent, generateMilestones } = useAscentStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please provide a title for your ascent.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      
      const newAscent = await createAscent({
        title: title.trim(),
        description: description.trim(),
        motivation_statement: motivationStatement.trim(),
      });

      // Generate AI milestones in the background
      generateMilestones(newAscent.id, title).catch(console.error);

      toast({
        title: "Ascent Created! ✨",
        description: "Your journey begins now. AI is generating personalized milestones for you.",
      });

      // Reset form, close modal, and navigate
      setTitle('');
      setDescription('');
      setMotivationStatement('');
      onOpenChange(false);
      navigate(`/app/ascent/${newAscent.id}`);
      
    } catch (error) {
      console.error('Error creating ascent:', error);
      toast({
        title: "Creation Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-white to-blue-50/30">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Begin Your Ascent
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Define your goal and let AI help you break it into achievable milestones
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2 text-slate-700 font-medium">
              <Target className="w-4 h-4" />
              What do you want to achieve?
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Launch my freelance design business"
              className="border-slate-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700 font-medium">
              Tell us more (optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your goal in more detail..."
              className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivation" className="flex items-center gap-2 text-slate-700 font-medium">
              <Heart className="w-4 h-4" />
              Why does this matter to you?
            </Label>
            <Textarea
              id="motivation"
              value={motivationStatement}
              onChange={(e) => setMotivationStatement(e.target.value)}
              placeholder="This will help keep you motivated when things get challenging..."
              className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 min-h-[80px]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !title.trim()}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                'Create Ascent'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
