import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import SecureAccount from './components/SecureAccount';
import HomeostasisRing from './components/HomeostasisRing';
import ProtocolList from './components/ProtocolList';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, Calendar, Zap, Leaf, Target, BookOpen } from 'lucide-react';

function App() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); // Empezamos en true para verificar sesión
  
  const [isSecured, setIsSecured] = useState(false); 
  const [showLogin, setShowLogin] = useState(false);

  // EFECTO DE PERSISTENCIA: Se ejecuta al abrir la app
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('physis_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data.user);
        setIsSecured(true); // Si tiene token y funciona, la cuenta ya es segura
      } catch (error) {
        console.error("Session expired or invalid");
        localStorage.removeItem('physis_token');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleOnboardingFinish = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/onboarding/analyze', {
        email: formData.email,
        goal: formData.goal,
        language: i18n.language 
      });

      setUser(response.data.user); 
      setIsSecured(false); 
    } catch (error) {
      console.error("Error connecting to Physis Brain:", error);
      alert("Synchronization failed. Check if Backend is online.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsSecured(true); 
  };

  const handleTaskComplete = () => {
    setUser(prev => ({
      ...prev,
      homeostasis_score: Math.min((prev.homeostasis_score || 50) + 5, 100)
    }));
  };

  // Pantalla de Carga (Sincronización o Verificación de Sesión)
  if (loading) {
    return (
      <div className="min-h-screen bg-physis-avena flex flex-col items-center justify-center p-10 text-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-6"
        >
          <Sparkles size={40} className="text-physis-terracota" />
        </motion.div>
        <h2 className="text-xl font-bold text-physis-avellana animate-pulse">
          {i18n.language === 'en' ? 'Synchronizing with Physis Brain...' : 'Sincronizando con el Cerebro Physis...'}
        </h2>
      </div>
    );
  }

  // Pantalla de Entrada (Onboarding / Login)
  if (!user) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute top-6 right-6 z-50">
          <button 
            onClick={() => setShowLogin(!showLogin)}
            className="text-sm font-bold bg-white text-physis-terracota px-5 py-2.5 rounded-full border border-physis-terracota/20 shadow-md hover:bg-physis-terracota hover:text-white transition-all active:scale-95"
          >
            {showLogin ? (i18n.language === 'en' ? "New? Start Onboarding" : "¿Nuevo? Iniciar Onboarding") : (i18n.language === 'en' ? "Have an account? Login" : "¿Ya tienes cuenta? Iniciar Sesión")}
          </button>
        </div>

        {showLogin ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
          <Onboarding onFinish={handleOnboardingFinish} />
        )}
      </div>
    );
  }

  // Dashboard
  const nicheIcons = { Serenity: Leaf, Prosper: Target, Scholar: BookOpen };
  const Icon = nicheIcons[user.niche] || Zap;

  return (
    <div className="min-h-screen bg-physis-avena p-5 flex flex-col font-sans max-w-md mx-auto">
      <header className="mt-6 mb-8">
        <motion.div 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/70 backdrop-blur-md p-5 rounded-[2rem] shadow-sm border-l-8 border-physis-salvia"
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-physis-salvia" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{t('agent.name')}</span>
          </div>
          <h1 className="text-md font-medium leading-tight text-physis-avellana italic">
            "{user.aiGreeting}"
          </h1>
        </motion.div>
      </header>

      <AnimatePresence>
        {!isSecured && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <SecureAccount 
              email={user.email} 
              onComplete={() => setIsSecured(true)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="grid grid-cols-2 gap-4 flex-grow text-physis-avellana">
        <div className="col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-white relative overflow-hidden flex flex-col">
          <h2 className="text-3xl font-bold tracking-tight mb-1">{t('dashboard.center')}</h2>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={20} className="text-physis-salvia" />
                <span className="text-sm font-bold opacity-60 uppercase tracking-widest">{t('dashboard.homeostasis')}</span>
              </div>
              <p className="text-xs font-medium opacity-50 max-w-[150px]">
                {i18n.language === 'en' ? 'Keep your protocols updated to increase sync.' : 'Mantén tus protocolos al día para elevar tu sincronización.'}
              </p>
            </div>
            
            <HomeostasisRing score={user.homeostasis_score || 50} />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-widest opacity-30">Niche: {user.niche}</p>
        </div>

        <div className="bg-physis-blancuzco rounded-[2rem] p-6 min-h-[10rem] shadow-inner flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg leading-none">{t('dashboard.protocol')}</h3>
            <Zap size={16} className="text-physis-terracota" />
          </div>
          
          {user.protocol && user.protocol.length > 0 ? (
            <ProtocolList 
              protocol={user.protocol} 
              email={user.email} 
              onTaskComplete={handleTaskComplete} 
            />
          ) : (
            <p className="text-xs opacity-50 mt-auto">{t('dashboard.protocol_desc')}</p>
          )}
        </div>

        <div className="bg-physis-blancuzco rounded-[2rem] p-6 h-40 shadow-inner flex flex-col justify-end">
          <h3 className="font-bold text-lg">{t('dashboard.rhythm')}</h3>
          <p className="text-xs opacity-50">{t('dashboard.rhythm_desc')}</p>
        </div>
      </main>
    </div>
  );
}

export default App;