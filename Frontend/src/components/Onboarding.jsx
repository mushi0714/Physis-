import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';

const Onboarding = ({ onFinish }) => {
  const { i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: '', goal: '' });

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
  };

  return (
    <div className="min-h-screen bg-physis-avena flex flex-col p-8 max-w-md mx-auto relative overflow-hidden font-sans">
      {/* Selector de Idioma Estilizado */}
      <button 
        onClick={toggleLanguage}
        className="absolute top-8 right-8 flex items-center gap-2 text-[10px] font-bold opacity-30 hover:opacity-100 transition-all uppercase tracking-[0.2em] z-50 text-physis-avellana"
      >
        <Globe size={12} />
        {i18n.language === 'en' ? 'ES' : 'EN'}
      </button>

      <div className="mt-20 flex-grow">
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2 mb-4">
               <Sparkles size={18} className="text-physis-terracota" />
               <span className="text-[10px] font-black tracking-widest opacity-40 uppercase text-physis-avellana">
                 Physis Sync
               </span>
            </div>

            {step === 1 ? (
              <>
                <h1 className="text-4xl font-bold text-physis-avellana mb-6 leading-tight">
                  {i18n.language === 'en' ? 'Identify yourself.' : 'Identifícate.'}
                </h1>
                <p className="text-physis-avellana/60 text-sm mb-8">
                  {i18n.language === 'en' 
                    ? 'Start your resonance with the biological center.' 
                    : 'Inicia tu resonancia con el centro biológico.'}
                </p>
                <input 
                  type="email"
                  placeholder="email@example.com"
                  className="w-full bg-white/50 border border-gray-200 p-5 rounded-xl focus:outline-none focus:ring-2 focus:ring-physis-terracota transition-all mb-6 text-physis-avellana placeholder-gray-400 font-medium"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-physis-avellana mb-6 leading-tight">
                  {i18n.language === 'en' ? 'What is your goal?' : '¿Cuál es tu objetivo?'}
                </h1>
                <p className="text-physis-avellana/60 text-sm mb-8">
                  {i18n.language === 'en' 
                    ? 'Describe your intent clearly for the AI analysis.' 
                    : 'Describe tu intención con claridad para el análisis de la IA.'}
                </p>
                <textarea 
                  placeholder={i18n.language === 'en' ? "I seek clarity..." : "Busco claridad..."}
                  className="w-full bg-white/50 border border-gray-200 p-5 rounded-xl focus:outline-none focus:ring-2 focus:ring-physis-terracota transition-all h-40 mb-6 text-physis-avellana placeholder-gray-400 font-medium resize-none"
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* BOTÓN ESTÁNDAR PHYSIS UNIFICADO */}
      <button
        onClick={() => step === 1 ? setStep(2) : onFinish(formData)}
        className="bg-physis-terracota text-white w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-md hover:bg-opacity-90 hover:shadow-lg transition-all active:scale-95 mb-4"
      >
        <span>{step === 1 
          ? (i18n.language === 'en' ? 'Next' : 'Siguiente') 
          : (i18n.language === 'en' ? 'Initialize' : 'Inicializar')}
        </span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default Onboarding;