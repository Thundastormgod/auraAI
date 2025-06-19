
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, PlayCircle, PauseCircle, Box, LayoutGrid } from 'lucide-react';
import { Ascent } from '../stores/useAscentStore';

interface AscentCardProps {
  ascent: Ascent;
  onSelect: (ascent: Ascent) => void;
  onStatusChange: (id: string, status: Ascent['status']) => void;
  onDelete: (id: string) => void;
  on3DView: (id: string) => void;
}

export const AscentCard: React.FC<AscentCardProps> = ({ 
  ascent, 
  onSelect, 
  onStatusChange,
  onDelete,
  on3DView 
}) => {
  const getStatusColor = (status: Ascent['status']) => {
    switch (status) {
      case 'active': return 'bg-gradient-to-r from-blue-500 to-purple-600';
      case 'paused': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'completed': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Ascent['status']) => {
    switch (status) {
      case 'active': return <PlayCircle className="w-4 h-4" />;
      case 'paused': return <PauseCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-slate-50 to-blue-50/30 border-0 shadow-md hover:shadow-xl hover:-translate-y-1"
      onClick={() => onSelect(ascent)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {ascent.title}
            </CardTitle>
            <CardDescription className="mt-2 text-slate-600">
              {ascent.description}
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(ascent.status)} text-white border-0 px-3 py-1`}>
            <div className="flex items-center gap-1">
              {getStatusIcon(ascent.status)}
              <span className="capitalize">{ascent.status}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {ascent.motivation_statement && (
          <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-l-4 border-purple-400">
            <p className="text-sm italic text-slate-700 font-medium">
              "{ascent.motivation_statement}"
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              Created {new Date(ascent.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity">
            {ascent.status === 'active' && (
              <Button
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(ascent.id, 'paused');
                }}
                className="text-xs"
              >
                Pause
              </Button>
            )}
            {ascent.status === 'paused' && (
              <Button
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(ascent.id, 'active');
                }}
                className="text-xs"
              >
                Resume
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(ascent);
              }}
              className="text-xs"
            >
              <LayoutGrid className="w-4 h-4 mr-1" /> 2D View
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                on3DView(ascent.id);
              }}
              className="text-xs"
            >
              <Box className="w-4 h-4 mr-1" /> 3D View
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(ascent.id);
              }}
              className="text-xs"
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
