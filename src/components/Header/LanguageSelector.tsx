import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="relative group/lang">
      <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-500 flex items-center gap-1">
        <Globe size={20} />
      </button>
      
      <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all transform origin-top-right scale-95 group-hover/lang:scale-100 z-50">
        <button 
          onClick={() => setLanguage('en')}
          className={`w-full flex items-center justify-between p-2 text-sm rounded-xl transition-colors ${language === 'en' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          {t('common.english')}
          {language === 'en' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
        </button>
        <button 
          onClick={() => setLanguage('vi')}
          className={`w-full flex items-center justify-between p-2 text-sm rounded-xl transition-colors ${language === 'vi' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          {t('common.vietnamese')}
          {language === 'vi' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
        </button>
      </div>
    </div>
  );
};
