import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';

const Onboarding = ({ onFinish }) => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: '', goal: '' });

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
  };

  return (
    <div className="min-h-screen bg-physis-avena flex flex-col p-8 max-w-md mx-auto relative overflow-hidden">
      <button 
        onClick={toggleLanguage}
        className="absolute top-8 right-8 flex items-center gap-2 text-[10px] font-bold opacity-30 hover:opacity-100 transition-all uppercase tracking-[0.2em] z-50"
      >
        <Globe size={12} />
        {i18n.language === 'en' ? 'ES' : 'EN'}
      </button>

      <div className="mt-20 flex-grow">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={step}>
          <div className="flex items-center gap-2 mb-4">
             <Sparkles size={18} className="text-physis-terracota" />
             <span className="text-[10px] font-black tracking-widest opacity-40 uppercase">Physis Sync</span>
          </div>

          {step === 1 ? (
            <>
              <h1 className="text-4xl font-bold text-physis-avellana mb-6">
                {i18n.language === 'en' ? 'Identify yourself.' : 'Identifícate.'}
              </h1>
              <input 
                type="email"
                placeholder="email@example.com"
                className="w-full bg-white/50 border-b-2 border-physis-avellana/20 p-4 rounded-2xl focus:outline-none focus:border-physis-terracota transition-all mb-6"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-physis-avellana mb-6">
                {i18n.language === 'en' ? 'What is your goal?' : '¿Cuál es tu objetivo?'}
              </h1>
              <textarea 
                placeholder={i18n.language === 'en' ? "I seek clarity..." : "Busco claridad..."}
                className="w-full bg-white/50 border-b-2 border-physis-avellana/20 p-4 rounded-2xl focus:outline-none focus:border-physis-salvia transition-all h-32 mb-6"
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
              />
            </>
          )}
        </motion.div>
      </div>

      <button
        onClick={() => step === 1 ? setStep(2) : onFinish(formData)}
        className="bg-physis-avellana text-white w-full py-5 rounded-[2rem] font-bold flex items-center justify-center gap-3 shadow-xl"
      >
        <span>{step === 1 ? 'Next' : 'Initialize'}</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default Onboarding;