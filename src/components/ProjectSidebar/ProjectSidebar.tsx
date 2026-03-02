import React, { useState, useEffect, useCallback } from 'react';
import { Folder, Calendar, Trash2, GripVertical, Plus, CheckCircle2 } from 'lucide-react';
import { Project, Task, TaskStatus } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProjectSidebarProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  width: number;
  onWidthChange: (width: number) => void;
  onCreateClick: () => void;
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onDeleteProject,
  width,
  onWidthChange,
  onCreateClick,
}) => {
  const { t } = useLanguage();
  const [isResizing, setIsResizing] = useState(false);

  const calculateProgress = (tasks: Task[]): number => {
    const getAllTasks = (list: Task[]): Task[] => {
      let result: Task[] = [];
      list.forEach(t => {
        result.push(t);
        if (t.subtasks) {
          result = [...result, ...getAllTasks(t.subtasks)];
        }
      });
      return result;
    };

    const allTasks = getAllTasks(tasks);
    const activeTasks = allTasks.filter(t => t.status !== TaskStatus.CANCELED);
    if (activeTasks.length === 0) return 0;
    return Math.round((activeTasks.filter(t => t.status === TaskStatus.DONE).length / activeTasks.length) * 100);
  };

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX;
        const maxWidth = window.innerWidth / 2;
        const minWidth = 240;
        if (newWidth >= minWidth && newWidth <= maxWidth) {
          onWidthChange(newWidth);
        }
      }
    },
    [isResizing, onWidthChange]
  );

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <aside 
      className="relative bg-white border-r border-slate-200 flex flex-col h-full z-20"
      style={{ width: `${width}px` }}
    >
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Folder size={20} className="text-indigo-500" />
            {t('sidebar.projects')}
          </h2>
        </div>
        
        <button
          onClick={onCreateClick}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100 active:scale-95 text-sm"
        >
          <Plus size={18} />
          {t('sidebar.create_new')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {projects.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-sm text-slate-400 italic">{t('sidebar.no_projects')}</p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`group p-4 rounded-xl border transition-all cursor-pointer relative ${
                selectedProjectId === project.id
                  ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                  : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-bold text-sm truncate pr-6 ${
                  selectedProjectId === project.id ? 'text-indigo-900' : 'text-slate-700'
                }`}>
                  {project.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProject(project.id);
                  }}
                  className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar size={12} />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-indigo-600">
                    <CheckCircle2 size={12} />
                    <span>{calculateProgress(project.tasks)}%</span>
                  </div>
                </div>
                
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${calculateProgress(project.tasks)}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resize Handle */}
      <div
        onMouseDown={startResizing}
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-indigo-500 transition-colors group flex items-center justify-center"
      >
        <div className="opacity-0 group-hover:opacity-100 bg-indigo-500 p-0.5 rounded-full -mr-0.5">
          <GripVertical size={12} className="text-white" />
        </div>
      </div>
    </aside>
  );
};
