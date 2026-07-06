import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export function LoadingScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6"
    >
      <motion.div
        animate={{ scale: [0.9, 1.1, 0.9], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Sparkles className="w-16 h-16 text-indigo-600 mb-6" />
      </motion.div>
      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Configurando</h2>
      <p className="text-slate-500 mt-2">Preparando todo para tu sesión...</p>
    </motion.div>
  );
}
