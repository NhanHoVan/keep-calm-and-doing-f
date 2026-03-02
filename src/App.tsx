import { useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthContext } from './contexts/AuthContext';
import { AppRoute } from './routes/AppRoute';
import { Loader2 } from 'lucide-react';

export default function App() {
  const auth = useContext(AuthContext);

  if (auth?.loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Checking session...</p>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppRoute />
      </BrowserRouter>
    </LanguageProvider>
  );
}
