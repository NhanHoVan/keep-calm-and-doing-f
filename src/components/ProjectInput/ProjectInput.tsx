import React from 'react';
import { Sparkles, Clock, Plus, Loader2, AlertCircle } from 'lucide-react';

import { useLanguage } from '../../contexts/LanguageContext';

interface ProjectInputProps {
  title: string;
  setTitle: (val: string) => void;
  idea: string;
  setIdea: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string | null;
}

export const ProjectInput: React.FC<ProjectInputProps> = ({
  title,
  setTitle,
  idea,
  setIdea,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onGenerate,
  isGenerating,
  error
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t('project.title')}</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('project.title_placeholder')}
          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm font-medium"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t('project.idea')}</label>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder={t('project.idea_placeholder')}
          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none h-32 text-sm font-medium"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t('project.start')}</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t('project.end')}</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm font-medium"
            />
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 active:scale-95"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              {t('project.generating')}
            </>
          ) : (
            <>
              <Sparkles size={20} />
              {t('project.generate')}
            </>
          )}
        </button>
        
        {error && (
          <p className="text-sm text-rose-500 font-bold flex items-center gap-2 mt-4 justify-center">
            <AlertCircle size={16} /> {error}
          </p>
        )}
      </div>
    </div>
  );
};
