import React from 'react';
import { motion } from 'motion/react';
import { Task, TaskStatus } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProgressBarProps {
  tasks: Task[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ tasks }) => {
  const { t } = useLanguage();
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
  const progress = activeTasks.length === 0 
    ? 0 
    : Math.round((activeTasks.filter(t => t.status === TaskStatus.DONE).length / activeTasks.length) * 100);

  if (tasks.length === 0) return null;

  return (
    <div className="w-full mb-8">
      <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{t('progress.overall')}</span>
          </div>
          <span className="text-sm font-black text-indigo-600">{progress}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
          <motion.div 
            className="h-full bg-indigo-600 rounded-full shadow-[0_0_12px_rgba(79,70,229,0.4)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};
