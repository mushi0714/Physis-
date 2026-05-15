import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SettingsModal = ({ isOpen, onClose, onUpdateGoal }) => {
  const { i18n } = useTranslation();
  const [newGoal, setNewGoal] = useState('');
  const [updating, setUpdating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    setUpdating(true);
    await onUpdateGoal(newGoal);
    setUpdating(false);
    setNewGoal('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-physis-avellana/30 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl border border-white relative text-physis-avellana"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-physis-avellana/40 hover:text-physis-terracota transition-colors">
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-physis-salvia" />
          <h3 className="font-bold text-xl tracking-tight">
            {i18n.language === 'en' ? 'Evolution Center' : 'Centro de Evolución'}
          </h3>
        </div>
        
        <p className="text-xs font-medium opacity-60 mb-6 leading-relaxed">
          {i18n.language === 'en' 
            ? 'Has your path changed? Type your new goal and Physis Brain will remap your entire daily protocol.' 
            : '¿Ha cambiado tu camino? Describe tu nueva meta y el Cerebro Physis recalculará todo tu protocolo diario.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder={i18n.language === 'en' ? "e.g., Learn professional focus tools..." : "ej., Dominar herramientas de enfoque profesional..."}
            className="w-full h-24 px-4 py-3 bg-physis-blancuzco border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-physis-salvia text-sm font-medium resize-none placeholder-gray-400"
            required
            disabled={updating}
          />

          <button
            type="submit"
            disabled={updating}
            className="w-full py-4 bg-physis-avellana text-white font-bold rounded-2xl shadow-md hover:bg-opacity-95 transition-all text-xs uppercase tracking-widest disabled:opacity-50"
          >
            {updating 
              ? (i18n.language === 'en' ? 'RE-MAPPING SYNAPSE...' : 'RECALCULANDO SINAPSIS...') 
              : (i18n.language === 'en' ? 'Update Strategy' : 'Actualizar Estrategia')}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SettingsModal;