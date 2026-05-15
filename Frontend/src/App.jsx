import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import SecureAccount from './components/SecureAccount';
import HomeostasisRing from './components/HomeostasisRing';
import ProtocolList from './components/ProtocolList';
import RhythmList from './components/RhythmList'; 
import HistoryGraph from './components/HistoryGraph';
import SettingsModal from './components/SettingsModal'; 
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Leaf, 
  Target, 
  BookOpen, 
  Activity, 
  LogOut, 
  Bell, 
  Sliders
} from 'lucide-react';

const safeRender = (val, fallback) => {
  if (!val) return fallback;
  if (typeof val === 'string' || typeof val === 'number') return String(val);
  if (typeof val === 'object') return JSON.stringify(val);
  return fallback;
};

function App() {
  const { t, i18n } = useTranslation();
  
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [isSecured, setIsSecured] = useState(false); 
  const [showLogin, setShowLogin] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
        setIsSecured(true); 
      } catch (error) {
        localStorage.removeItem('physis_token');
      } finally {
        setTimeout(() => setLoading(false), 1200);
      }
    };
    checkSession();
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === "granted");
    }
  };

  const handleUpdateGoal = async (newGoal) => {
    const token = localStorage.getItem('physis_token');
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/api/users/update-goal', 
        { goal: newGoal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.user);
    } catch (error) {
      console.error("Error updating goal:", error);
      alert("Failed to update protocol.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('physis_token');
    window.location.reload();
  };

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

  // 🌿 PANTALLA DE CARGA REDISEÑADA (ESTILO ZEN / PHYSIS)
  if (loading) {
    return (
      <div className="min-h-screen bg-physis-avena flex flex-col items-center justify-center p-10 text-center">
        {/* Animación de "Respiración" en lugar de giro mecánico */}
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
          className="mb-8"
        >
          <Sparkles size={50} className="text-physis-terracota" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h2 className="text-xl font-medium text-physis-avellana tracking-wide italic">
            {i18n.language === 'en' ? 'Preparing your center...' : 'Preparando tu centro...'}
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-physis-terracota/60 animate-pulse">
            {i18n.language === 'en' ? 'Take a deep breath' : 'Toma una respiración profunda'}
          </p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative min-h-screen bg-physis-avena">
        <div className="absolute top-6 right-6 z-50">
          <button onClick={() => setShowLogin(!showLogin)} className="text-[10px] font-black uppercase tracking-widest bg-white text-physis-terracota px-6 py-3 rounded-full border border-physis-terracota/20 shadow-lg hover:bg-physis-terracota hover:text-white transition-all">
            {showLogin ? (i18n.language === 'en' ? "Back" : "Volver") : (i18n.language === 'en' ? "Access Center" : "Acceder")}
          </button>
        </div>
        <AnimatePresence mode="wait">
          {showLogin ? (
            <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Login onLoginSuccess={handleLoginSuccess} />
            </motion.div>
          ) : (
            <motion.div key="onboarding" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Onboarding onFinish={handleOnboardingFinish} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const safeNiche = safeRender(user?.niche, 'Serenity');
  const safeGreeting = safeRender(user?.aiGreeting, 'Welcome back to your center.');
  const safeScore = typeof user?.homeostasis_score === 'number' ? user.homeostasis_score : 50;
  const safeProtocol = Array.isArray(user?.protocol) ? user.protocol : [];
  const safeRhythm = Array.isArray(user?.rhythm) ? user.rhythm : [];
  const safeLogs = Array.isArray(user?.logs) ? user.logs : [];
  const safeEmail = safeRender(user?.email, '');

  const nicheIcons = { Serenity: Leaf, Prosper: Target, Scholar: BookOpen };
  const Icon = nicheIcons[safeNiche] || Zap;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-physis-avena p-5 flex flex-col font-sans max-w-md mx-auto">
      
      <header className="mt-6 mb-8 flex flex-col gap-4">
        <div className="flex justify-between items-center w-full">
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 p-2 bg-white/60 hover:bg-white rounded-xl shadow-sm border border-white/40 transition-all active:scale-95 group"
          >
            <Sliders size={18} className="text-physis-avellana opacity-60 group-hover:text-physis-salvia transition-colors" />
            <span className="text-[9px] font-black uppercase tracking-[0.15em] opacity-50 pr-2">
              {i18n.language === 'en' ? 'Strategy' : 'Estrategia'}
            </span>
          </button>
          
          <div className="flex items-center gap-3">
            {!notificationsEnabled && (
              <div className="flex items-center gap-2">
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-[#2D2D2D] text-white text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-lg shadow-xl tooltip-pulse">
                  {i18n.language === 'en' ? 'Pulse' : 'Pulso'}
                </motion.div>
                <button onClick={requestNotificationPermission} className="p-3 bg-physis-terracota text-white rounded-full shadow-lg animate-bell-bounce">
                  <Bell size={18} />
                </button>
              </div>
            )}
            <button onClick={handleLogout} className="p-3 bg-white/40 rounded-full text-physis-avellana/40 hover:text-physis-terracota border border-white/20"><LogOut size={18} /></button>
          </div>
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/70 backdrop-blur-md p-6 rounded-[2.5rem] shadow-sm border-l-8 border-physis-salvia">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-physis-salvia" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{t('agent.name')}</span>
          </div>
          <h1 className="text-md font-medium leading-tight text-physis-avellana italic">"{safeGreeting}"</h1>
        </motion.div>
      </header>

      <AnimatePresence>
        {!isSecured && safeEmail && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8">
            <SecureAccount email={safeEmail} onComplete={() => setIsSecured(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="grid grid-cols-2 gap-4 flex-grow text-physis-avellana pb-10 overflow-visible">
        <div className="col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-white relative overflow-hidden flex flex-col group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Icon size={120} /></div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">{t('dashboard.center')}</h2>
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-2"><Icon size={20} className="text-physis-salvia" /><span className="text-sm font-bold opacity-60 uppercase tracking-widest">{t('dashboard.homeostasis')}</span></div>
              <p className="text-xs font-medium opacity-50 max-w-[150px]">{i18n.language === 'en' ? 'Keep your protocols updated.' : 'Mantén tus protocolos al día.'}</p>
            </div>
            <HomeostasisRing score={safeScore} />
          </div>
          <p className="mt-6 text-[9px] font-black uppercase tracking-[0.4em] opacity-20">Synergy Type: {safeNiche}</p>
        </div>

        <div className="bg-physis-blancuzco rounded-[2rem] p-6 min-h-[10rem] shadow-inner flex flex-col border border-white/20">
          <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-lg leading-none">{t('dashboard.protocol')}</h3><Zap size={16} className="text-physis-terracota" /></div>
          <ProtocolList protocol={safeProtocol} email={safeEmail} onTaskComplete={handleTaskComplete} />
        </div>

        <div className="bg-physis-blancuzco rounded-[2rem] p-6 min-h-[10rem] shadow-inner flex flex-col border border-white/20">
          <div className="flex items-center justify-between mb-2"><h3 className="font-bold text-lg leading-none">{t('dashboard.rhythm')}</h3><Activity size={16} className="text-physis-salvia" /></div>
          <RhythmList rhythm={safeRhythm} />
        </div>

        <div className="col-span-2 bg-physis-blancuzco rounded-[2.5rem] p-8 shadow-inner flex flex-col min-h-[14rem] border border-white/20"><HistoryGraph logs={safeLogs} /></div>
      </main>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
            onUpdateGoal={handleUpdateGoal} 
          />
        )}
      </AnimatePresence>

      <footer className="py-4 text-center"><p className="text-[8px] font-black uppercase tracking-[0.5em] opacity-20">Physis Alpha v1.0.4</p></footer>
    </motion.div>
  );
}

export default App;