import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Onboarding from './components/Onboarding';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, Calendar, Zap, Leaf, Target, BookOpen } from 'lucide-react';

function App() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null); // Aquí guardaremos la respuesta del Backend
  const [loading, setLoading] = useState(false);

  // Función para conectar con el Backend
  const handleOnboardingFinish = async (formData) => {
    setLoading(true);
    try {
      // Llamada a tu API de Backend (asegúrate de que el backend esté corriendo en el puerto 3000)
      const response = await axios.post('http://localhost:3000/api/onboarding/analyze', {
        email: formData.email,
        goal: formData.goal,
        language: i18n.language // Le pasamos el idioma elegido
      });

      // Guardamos la respuesta (nicho, mensaje del agente, etc.)
      setUser(response.data.user); 
    } catch (error) {
      console.error("Error connecting to Physis Brain:", error);
      alert("Synchronization failed. Check if Backend is online.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Pantalla de Carga (Sincronización)
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

  // 2. Pantalla de Onboarding (Si no hay usuario logueado)
  if (!user) {
    return <Onboarding onFinish={handleOnboardingFinish} />;
  }

  // 3. Pantalla de Dashboard (Una vez sincronizado)
  // Definimos los iconos según el nicho que nos devolvió la IA
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
            {/* Aquí usamos el mensaje personalizado que generó Gemini en el Backend */}
            "{user.aiGreeting}"
          </h1>
        </motion.div>
      </header>

      <main className="grid grid-cols-2 gap-4 flex-grow text-physis-avellana">
        <div className="col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-white relative overflow-hidden">
          <h2 className="text-3xl font-bold tracking-tight mb-1">{t('dashboard.center')}</h2>
          <div className="flex items-center gap-2">
            <Icon size={16} className="text-physis-salvia" />
            <p className="text-sm font-medium opacity-60">{t('dashboard.homeostasis')}: 85%</p>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest opacity-30">Niche: {user.niche}</p>
        </div>

        <div className="bg-physis-blancuzco rounded-[2rem] p-6 h-40 shadow-inner flex flex-col justify-end">
          <h3 className="font-bold text-lg">{t('dashboard.protocol')}</h3>
          <p className="text-xs opacity-50">{t('dashboard.protocol_desc')}</p>
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