import { useNavigate } from 'react-router-dom';
import { User as UserIcon, LogOut, Settings } from 'lucide-react';
import { User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

interface UserMenuProps {
  user: User;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
        <p className="text-[10px] text-slate-400 font-medium mt-1">{user.email}</p>
      </div>
      
      <div className="relative group">
        <button className="w-10 h-10 rounded-xl overflow-hidden border-2 border-slate-50 shadow-sm group-hover:border-indigo-100 transition-all">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm">
              {getInitials(user.name)}
            </div>
          )}
        </button>
        
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100 z-50">
          <button className="w-full flex items-center gap-2 p-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
            <UserIcon size={16} />
            {t('auth.profile')}
          </button>
          <button className="w-full flex items-center gap-2 p-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
            <Settings size={16} />
            {t('auth.settings')}
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 p-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1"
          >
            <LogOut size={16} />
            {t('auth.sign_out')}
          </button>
        </div>
      </div>
    </div>
  );
};
