import React from 'react';
import { Layout, Plus } from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { TaskItem } from '../TaskItem';
import { useLanguage } from '../../contexts/LanguageContext';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: () => void;
  onAddSubtask: (parentId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onStatusChange, 
  onDelete, 
  onTaskClick,
  onAddTask,
  onAddSubtask
}) => {
  const { t } = useLanguage();

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">{t('task.list_title')}</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={onAddTask}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors"
          >
            <Plus size={14} />
            {t('task.add')}
          </button>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            <span>{tasks.length} {t('task.main_tasks')}</span>
          </div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Layout size={32} />
          </div>
          <h3 className="text-slate-900 font-semibold mb-1">{t('task.no_plan')}</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            {t('task.no_plan_desc')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              level={0} 
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onTaskClick={onTaskClick}
              onAddSubtask={onAddSubtask}
            />
          ))}
        </div>
      )}
    </section>
  );
};
