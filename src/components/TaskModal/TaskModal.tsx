import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, BookOpen, Save } from 'lucide-react';
import Markdown from 'react-markdown';
import { Task, TaskStatus } from '../../types';
import { STATUS_CONFIG } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  isNew?: boolean;
  onSaveNew?: (task: Partial<Task>) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ 
  task, 
  onClose, 
  onStatusChange, 
  onUpdate,
  isNew = false,
  onSaveNew
}) => {
  const { language, t } = useLanguage();
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDetails, setEditedDetails] = useState('');
  const [editedStartDate, setEditedStartDate] = useState('');
  const [editedEndDate, setEditedEndDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (task) {
      setEditedTitle(task.title || '');
      setEditedDetails(task.details || '');
      setEditedStartDate(task.startDate || '');
      setEditedEndDate(task.endDate || '');
      setIsEditing(isNew);
    }
  }, [task, isNew]);

  if (!task) return null;

  const handleSave = () => {
    const updates = { 
      title: editedTitle, 
      details: editedDetails,
      startDate: editedStartDate,
      endDate: editedEndDate
    };
    
    if (isNew && onSaveNew) {
      onSaveNew(updates);
    } else {
      onUpdate(task.id, updates);
    }
    setIsEditing(false);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return t('common.not_set');
    const locale = language === 'vi' ? 'vi-VN' : 'en-US';
    return new Date(dateStr).toLocaleString(locale, { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3 flex-1">
              <div className={`p-2 rounded-xl bg-white shadow-sm ${STATUS_CONFIG[task.status].color}`}>
                {React.createElement(STATUS_CONFIG[task.status].icon, { size: 24 })}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-xl font-bold text-slate-900 leading-tight w-full bg-transparent border-b-2 border-indigo-500 focus:outline-none"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">{task.title}</h2>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {task.subtasks && task.subtasks.length > 0 ? (
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${STATUS_CONFIG[task.status].class}`}>
                      {t(`task.status.${task.status.toLowerCase().replace(' ', '_')}`)}
                    </span>
                  ) : (
                    <select 
                      value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer ${STATUS_CONFIG[task.status].class}`}
                    >
                      {Object.values(TaskStatus).map(status => (
                        <option key={status} value={status}>{t(`task.status.${status.toLowerCase().replace(' ', '_')}`)}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <button 
                  onClick={handleSave}
                  className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-md"
                  title={t('common.save')}
                >
                  <Save size={20} />
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 text-xs font-bold uppercase"
                >
                  {t('task.edit')}
                </button>
              )}
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto space-y-8">
            {/* Time Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Calendar size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{t('task.start_time')}</span>
                </div>
                {isEditing ? (
                  <input
                    type="datetime-local"
                    value={editedStartDate}
                    onChange={(e) => setEditedStartDate(e.target.value)}
                    className="w-full bg-transparent border-b border-indigo-200 focus:border-indigo-500 outline-none text-sm font-semibold text-slate-700"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-700">{formatDate(task.startDate)}</p>
                )}
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Clock size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{t('task.end_time')}</span>
                </div>
                {isEditing ? (
                  <input
                    type="datetime-local"
                    value={editedEndDate}
                    onChange={(e) => setEditedEndDate(e.target.value)}
                    className="w-full bg-transparent border-b border-indigo-200 focus:border-indigo-500 outline-none text-sm font-semibold text-slate-700"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-700">{formatDate(task.endDate)}</p>
                )}
              </div>
            </div>

            {/* Detailed Content */}
            <div>
              <div className="flex items-center gap-2 text-slate-900 mb-3">
                <BookOpen size={18} className="text-indigo-500" />
                <h3 className="font-bold">{t('task.execution_plan')}</h3>
              </div>
              {isEditing ? (
                <textarea
                  value={editedDetails}
                  onChange={(e) => setEditedDetails(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-indigo-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm h-64 resize-none font-mono"
                  placeholder={t('task.details_placeholder')}
                />
              ) : (
                <div className="markdown-body prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  <Markdown>{task.details || t('task.no_details')}</Markdown>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
            {isEditing && (
              <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-all active:scale-95"
              >
                {t('common.cancel')}
              </button>
            )}
            <button 
              onClick={isEditing ? handleSave : onClose}
              className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95"
            >
              {isEditing ? t('task.save_changes') : t('task.close')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
