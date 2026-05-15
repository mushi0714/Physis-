import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Square, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DeepFocusModal = ({ isOpen, onClose, task, onComplete }) => {
  const { i18n } = useTranslation();
  
  // Función para extraer los minutos del texto de la IA (ej: "5 min" o "10 min" -> 5 o 10)
  const parseMinutes = (durationStr) => {
    if (!durationStr) return 5; // Fallback por defecto de 5 min
    const match = String(durationStr).match(/\d+/);
    return match ? parseInt(match[0], 10) : 5;
  };

  const totalMinutes = parseMinutes(task?.duration);
  const totalSeconds = totalMinutes * 60;

  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Efecto del conteo regresivo
  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
      handleFinish();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  // Si cambia la tarea, reiniciamos el reloj
  useEffect(() => {
    if (task) {
      setSecondsLeft(parseMinutes(task.duration) * 60);
      setIsActive(false);
      setIsFinished(false);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleFinish = () => {
    onComplete(task);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  // Formatear segundos a MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-physis-avellana/40 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl border border-white relative text-physis-avellana flex flex-col items-center"
      >
        {/* Botón Cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 text-physis-avellana/30 hover:text-physis-terracota transition-colors"
          disabled={isFinished}
        >
          <X size={20} />
        </button>

        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-physis-terracota bg-physis-terracota/10 px-3 py-1 rounded-full mb-3">
          Deep Focus
        </span>

        <h3 className="font-bold text-lg text-center leading-tight max-w-[220px] mb-6">
          {task.title}
        </h3>

        {/* Círculo / Barra de Progreso Visual */}
        <div className="w-40 h-40 rounded-full bg-physis-blancuzco flex flex-col items-center justify-center relative border border-gray-100 shadow-inner mb-8">
          <AnimatePresence mode="wait">
            {isFinished ? (
              <motion.div 
                key="done"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-physis-salvia flex flex-col items-center"
              >
                <CheckCircle size={44} />
                <span className="text-[10px] font-black uppercase tracking-widest mt-2">
                  {i18n.language === 'en' ? 'Aligned' : 'Alineado'}
                </span>
              </motion.div>
            ) : (
              <motion.span 
                key="time"
                className="text-4xl font-mono font-bold tracking-tighter"
              >
                {formatTime(secondsLeft)}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Anillo de progreso dinámico perimetral */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="76"
              className="stroke-physis-salvia transition-all duration-300"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={477}
              strokeDashoffset={477 - (477 * progress) / 100}
            />
          </svg>
        </div>

        {/* Controles de Tiempo */}
        {!isFinished && (
          <div className="flex items-center gap-4 w-full justify-center">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`p-4 rounded-2xl flex items-center justify-center transition-all ${
                isActive ? 'bg-physis-avellana text-white' : 'bg-physis-salvia text-white shadow-md'
              }`}
            >
              {isActive ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>

            <button
              onClick={() => {
                setIsActive(false);
                setSecondsLeft(totalSeconds);
              }}
              className="p-4 bg-physis-blancuzco border border-gray-200 text-physis-avellana/60 rounded-2xl hover:text-physis-terracota"
            >
              <Square size={20} fill="currentColor" className="scale-75" />
            </button>

            <button
              onClick={() => {
                setIsActive(false);
                setIsFinished(true);
                handleFinish();
              }}
              className="px-4 py-4 bg-white border border-physis-salvia/30 text-physis-salvia rounded-2xl text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-physis-salvia/5"
            >
              {i18n.language === 'en' ? 'Skip to End' : 'Forzar Hito'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DeepFocusModal;