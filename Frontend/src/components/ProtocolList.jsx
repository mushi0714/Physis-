import React, { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

const safeText = (val, fallback) => {
  if (!val) return fallback;
  if (typeof val === 'string' || typeof val === 'number') return String(val);
  if (typeof val === 'object') return JSON.stringify(val);
  return fallback;
};

const ProtocolList = ({ protocol = [], email, onTaskComplete }) => {
  const [completedTasks, setCompletedTasks] = useState([]);

  // Escudo de seguridad
  const safeProtocol = Array.isArray(protocol) ? protocol : [];

  const handleToggle = async (task, index) => {
    if (completedTasks.includes(index)) return;
    try {
      setCompletedTasks([...completedTasks, index]);
      if (onTaskComplete) onTaskComplete();
    } catch (error) {
      console.error("Error completing task", error);
    }
  };

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

        const isDone = completedTasks.includes(index);
        
        return (
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            key={index}
            onClick={() => handleToggle(task, index)}
            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer group ${
              isDone ? 'bg-physis-salvia/20 border-physis-salvia/30' : 'bg-white/40 border-white/20 hover:bg-white/60'
            }`}
          >
            <div className={isDone ? 'text-physis-salvia' : 'text-gray-400 group-hover:text-physis-salvia transition-colors'}>
              {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className={`text-sm font-bold leading-tight truncate transition-all ${isDone ? 'text-physis-avellana/50 line-through' : 'text-physis-avellana'}`}>
                {safeText(task.title, 'Protocol Task')}
              </span>
              <span className="text-[10px] uppercase tracking-widest font-black opacity-40">
                {safeText(task.duration, '5 MIN')}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProtocolList;