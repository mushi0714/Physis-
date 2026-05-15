import React, { useState } from 'react';
import { CheckCircle2, Circle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DeepFocusModal from './DeepFocusModal';

const safeText = (val, fallback) => {
  if (!val) return fallback;
  if (typeof val === 'string' || typeof val === 'number') return String(val);
  if (typeof val === 'object') return JSON.stringify(val);
  return fallback;
};

const ProtocolList = ({ protocol = [], email, onTaskComplete }) => {
  // Estado local para rastrear cuáles tareas de la base de datos están hechas
  const [dbCompletedIds, setDbCompletedIds] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isFocusOpen, setIsFocusOpen] = useState(false);

  const playSuccessSound = () => {
    const audio = new Audio('/sounds/success.mp3');
    audio.volume = 0.4;
    audio.play().catch(e => console.log("Audio feedback ready"));
  };

  const handleTaskClick = (task) => {
    // Si ya está completada (por DB o localmente), no hacemos nada
    if (task.status === 'COMPLETED' || dbCompletedIds.includes(task.id)) return;

    // Si está pendiente, abrimos el modo Deep Focus
    setSelectedTask(task);
    setIsFocusOpen(true);
  };

  const handleDeepFocusComplete = async (task) => {
    try {
      const token = localStorage.getItem('physis_token');
      
      // Llamada oficial al backend para actualizar el hito y subir la homeostasis del User
      await axios.patch(`http://localhost:3000/api/users/milestones/${task.id}/complete`, 
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDbCompletedIds((prev) => [...prev, task.id]);
      playSuccessSound();
      if (onTaskComplete) onTaskComplete();
    } catch (error) {
      console.error("Error committing milestone status:", error);
    }
  };

  const safeProtocol = Array.isArray(protocol) ? protocol : [];

  if (safeProtocol.length === 0) {
    return (
      <p className="text-xs font-medium opacity-50 mt-4">
        No active protocols found. Maintain your center.
      </p>
    );
  }

  return (
    <div className="space-y-3 mt-2">
      {safeProtocol.map((task, index) => {
        if (!task) return null;
        
        // Verificamos el estado real combinando backend y cambios instantáneos
        const isDone = task.status === 'COMPLETED' || dbCompletedIds.includes(task.id);
        
        return (
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileTap={!isDone ? { scale: 0.98 } : {}}
            key={task.id || index}
            onClick={() => handleTaskClick(task)}
            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer group ${
              isDone 
                ? 'bg-physis-salvia/20 border-physis-salvia/30 shadow-inner cursor-default' 
                : 'bg-white/40 border-white/20 hover:bg-white/60 shadow-sm'
            }`}
          >
            <div className={isDone ? 'text-physis-salvia' : 'text-gray-400 group-hover:text-physis-salvia transition-colors'}>
              {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            </div>
            
            <div className="flex flex-col overflow-hidden flex-grow">
              <span className={`text-sm font-bold leading-tight truncate transition-all ${isDone ? 'text-physis-avellana/50 line-through' : 'text-physis-avellana'}`}>
                {safeText(task.title, 'Protocol Task')}
              </span>
              <span className="text-[10px] uppercase tracking-widest font-black opacity-40 flex items-center gap-1 mt-0.5">
                {!isDone && <Zap size={10} className="text-physis-terracota animate-pulse" />}
                {safeText(task.duration, '5 MIN')}
              </span>
            </div>
          </motion.div>
        );
      })}

      {/* MODAL DE DEEP FOCUS INTERCONECTADO */}
      <AnimatePresence>
        {isFocusOpen && (
          <DeepFocusModal
            isOpen={isFocusOpen}
            onClose={() => setIsFocusOpen(false)}
            task={selectedTask}
            onComplete={handleDeepFocusComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProtocolList;