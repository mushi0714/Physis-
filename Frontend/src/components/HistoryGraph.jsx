import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HistoryGraph = ({ logs = [] }) => {
  const { t, i18n } = useTranslation();
  
  // Aseguramos que sea un arreglo y tomamos máximo los últimos 7 días
  const safeLogs = Array.isArray(logs) ? logs.slice(-7) : [];

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg leading-none">
          {i18n.language === 'en' ? 'Resonance History' : 'Historial de Resonancia'}
        </h3>
        <BarChart2 size={16} className="text-physis-salvia" />
      </div>

      {safeLogs.length === 0 ? (
        <p className="text-xs font-medium opacity-50 mt-auto">
          {i18n.language === 'en' 
            ? 'Awaiting resonance data. Your progress will be recorded at midnight.' 
            : 'Esperando datos de resonancia. Tu progreso se guardará a medianoche.'}
        </p>
      ) : (
        <div className="flex items-end justify-between h-24 mt-auto gap-2">
          {safeLogs.map((log, i) => {
            // Extraer solo el día del string de la fecha (ej. "2026-05-15" -> "15")
            const dayStr = log.date ? log.date.split('-')[2] : '';
            
            return (
              <div key={i} className="flex flex-col items-center flex-1 gap-2 h-full justify-end">
                {/* Contenedor de la barra */}
                <div className="w-full bg-physis-salvia/10 rounded-full h-full relative overflow-hidden flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(log.score, 5)}%` }} // Mínimo 5% para que siempre se vea un puntito
                    transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                    className="w-full bg-physis-salvia rounded-full"
                  />
                </div>
                {/* Etiqueta del día */}
                <span className="text-[10px] font-black opacity-40 uppercase">
                  {dayStr}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryGraph;