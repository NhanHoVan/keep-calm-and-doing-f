import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronDown, Trash2, AlertTriangle, Calendar, Plus } from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { STATUS_CONFIG } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';

interface TaskItemProps {
  task: Task;
  level: number;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onTaskClick: (task: Task) => void;
  onAddSubtask: (parentId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  level, 
  onStatusChange, 
  onDelete, 
  onTaskClick,
  onAddSubtask
}) => {
  const { language, t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);
  const StatusIcon = STATUS_CONFIG[task.status].icon;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    onStatusChange(task.id, e.target.value as TaskStatus);
  };

  const isOverdue = task.dueDate && 
    new Date(task.dueDate) < new Date() && 
    task.status !== TaskStatus.DONE && 
    task.status !== TaskStatus.CANCELED;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const locale = language === 'vi' ? 'vi-VN' : 'en-US';
    return new Date(dateStr).toLocaleDateString(locale, { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className={`ml-${level * 4} mt-2`}>
      <div 
        onClick={() => onTaskClick(task)}
        className={`flex items-center group bg-white p-3 rounded-lg border shadow-sm transition-all cursor-pointer ${isOverdue ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100 hover:border-slate-300'}`}
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className={`p-1 hover:bg-slate-100 rounded transition-colors ${!task.subtasks?.length ? 'invisible' : ''}`}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        
        <div className={`mx-2 ${STATUS_CONFIG[task.status].color}`}>
          <StatusIcon size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-medium truncate ${task.status === TaskStatus.DONE || task.status === TaskStatus.CANCELED ? 'line-through text-slate-400' : 'text-slate-700'}`}>
              {task.title}
            </p>
            {isOverdue && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded animate-pulse">
                <AlertTriangle size={10} /> {t('task.overdue')}
              </span>
            )}
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-400">
              <Calendar size={10} />
              <span>{t('task.due')}: {formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {task.subtasks && task.subtasks.length > 0 ? (
            <span className={`status-badge ${STATUS_CONFIG[task.status].class}`}>
              {t(`task.status.${task.status.toLowerCase().replace(' ', '_')}`)}
            </span>
          ) : (
            <select 
              value={task.status}
              onClick={(e) => e.stopPropagation()}
              onChange={handleStatusChange}
              className={`status-badge border-none outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500 ${STATUS_CONFIG[task.status].class}`}
            >
              {Object.values(TaskStatus).map(status => (
                <option key={status} value={status}>{t(`task.status.${status.toLowerCase().replace(' ', '_')}`)}</option>
              ))}
            </select>
          )}
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={14} />
          </button>

          {level < 2 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddSubtask(task.id);
              }}
              className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded transition-colors opacity-0 group-hover:opacity-100"
              title="Add sub-task"
            >
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && task.subtasks && task.subtasks.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-l-2 border-slate-100 ml-5 pl-2"
          >
            {task.subtasks.map(sub => (
              <TaskItem 
                key={sub.id} 
                task={sub} 
                level={level + 1} 
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onTaskClick={onTaskClick}
                onAddSubtask={onAddSubtask}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
