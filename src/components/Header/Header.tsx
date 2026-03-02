import React from 'react';
import { Layout } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { UserMenu } from './UserMenu';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  user?: any;
}

export const Header: React.FC<HeaderProps> = () => {
  const { t } = useLanguage();
  const { user, loading } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 z-30 shrink-0">
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Layout size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{t('app.title')}</h1>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          {loading ? (
            <div className="w-10 h-10 bg-slate-50 rounded-xl animate-pulse" />
          ) : user ? (
            <UserMenu user={user} />
          ) : null}
        </div>
      </div>
    </header>
  );
};
