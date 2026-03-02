import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, LogIn, Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { authApi } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
import GoogleOneTap from '../../components/Auth/GoogleOneTap';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const user = await authApi.login();
      login(user);
      navigate('/dashboard');
    } catch (err) {
      console.error("Login failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    try {
      setIsLoading(true);
      const user = await authApi.loginWithGoogle(credential);
      login(user);
      navigate('/dashboard');
    } catch (err) {
      console.error("Google login failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-4">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('app.title')}</h1>
          <p className="text-slate-500 text-sm mt-2">{t('login.tagline')}</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-xl">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              </div>
            )}
            <GoogleOneTap 
              onSuccess={handleGoogleSuccess} 
              onError={(err) => console.error("Google One Tap Error:", err)} 
            />
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-bold tracking-widest">{t('login.demo')}</span>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <LogIn size={18} />
                {t('login.enter')}
              </>
            )}
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          {t('login.terms')}
        </p>
      </motion.div>
    </div>
  );
};
