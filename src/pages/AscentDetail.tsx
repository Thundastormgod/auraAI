import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAscentStore, Ascent } from '../stores/useAscentStore';
import Gantt from 'frappe-gantt';
import '../../node_modules/frappe-gantt/dist/frappe-gantt.css';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Helper to format date for Gantt chart (YYYY-MM-DD)
const formatDateForGantt = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const AscentDetail = () => {
  const { ascentId } = useParams<{ ascentId: string }>();
  const ganttRef = useRef<SVGSVGElement | null>(null);
  const ganttInstance = useRef<Gantt | null>(null);

  const { ascents, milestones, loadAscents, loadMilestones, loading } = useAscentStore();
  const [ascent, setAscent] = useState<Ascent | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    if (ascents.length === 0) {
      loadAscents();
    }
    if (ascentId) {
      loadMilestones(ascentId);
    }
  }, [ascentId, ascents.length, loadAscents, loadMilestones]);

  useEffect(() => {
    const currentAscent = ascents.find(a => a.id === ascentId);
    if (currentAscent) {
      setAscent(currentAscent);
      const ascentMilestones = milestones[ascentId!] || [];
      
      if (ascentMilestones.length > 0) {
        let lastEndDate = new Date(currentAscent.created_at);
        const ganttTasks = ascentMilestones
          .sort((a, b) => a.sequence_order - b.sequence_order)
          .map((milestone, index, arr) => {
            const startDate = new Date(lastEndDate);
            if (index > 0) {
                startDate.setDate(startDate.getDate() + 1);
            }
            
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 7);
            
            lastEndDate = endDate;

            return {
              id: milestone.id,
              name: milestone.title,
              start: formatDateForGantt(startDate),
              end: formatDateForGantt(endDate),
              progress: milestone.status === 'completed' ? 100 : 0,
              dependencies: index > 0 ? arr[index - 1].id : undefined,
            };
          });
        setTasks(ganttTasks);
      }
    }
  }, [ascentId, ascents, milestones]);

  useEffect(() => {
    if (ganttRef.current && tasks.length > 0 && !ganttInstance.current) {
      ganttInstance.current = new Gantt(ganttRef.current, tasks, {
        header_height: 50,
        column_width: 30,
        step: 24,
        view_modes: ['Day', 'Week', 'Month'],
        bar_height: 20,
        bar_corner_radius: 3,
        arrow_curve: 5,
        padding: 18,
        view_mode: 'Week',
        date_format: 'YYYY-MM-DD',
        custom_popup_html: (task) => {
          return `
            <div class="p-2 bg-white rounded-md shadow-lg border">
              <h5 class="font-semibold text-sm mb-1">${task.name}</h5>
              <p class="text-xs text-slate-500">
                ${task.progress}% complete
              </p>
            </div>
          `;
        },
      });
    }
  }, [tasks]);

  if (loading && !ascent) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!ascent) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-slate-800">Ascent not found</h2>
        <p className="mt-2 text-slate-500">The goal you're looking for doesn't exist or couldn't be loaded.</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/app">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Ascents
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4 -ml-4">
          <Link to="/app">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Ascents
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-slate-800">{ascent.title}</h1>
        <p className="mt-2 text-slate-600 max-w-2xl">{ascent.description}</p>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Milestone Plan</h2>
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 text-sm"> 
          {tasks.length > 0 ? (
            <svg ref={ganttRef}></svg>
          ) : (
            <div className="text-center text-slate-500 py-8">
              {loading ? <Loader2 className="h-6 w-6 mx-auto text-blue-500 animate-spin" /> : 'No milestones found for this ascent.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AscentDetail;
