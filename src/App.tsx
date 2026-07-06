import { useState, useEffect } from 'react';
import { AdminPollManager } from './components/AdminPollManager';
import { ParticipantView } from './components/ParticipantView';
import { LoadingScreen } from './components/LoadingScreen';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User, signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, LayoutDashboard, UserCircle, LogOut } from 'lucide-react';

export default function App() {
  const [pollId, setPollId] = useState<string | null>(null);
  const [mode, setMode] = useState<'selection' | 'admin' | 'participant'>('selection');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminInitializing, setIsAdminInitializing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('pollId');
    if (id) {
      setPollId(id);
      setMode('participant');
    }
  }, []);

  useEffect(() => {
    if (mode === 'admin' && user) {
      setIsAdminInitializing(true);
      const timer = setTimeout(() => setIsAdminInitializing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [mode, user]);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setMode('admin');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
    setMode('selection');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (mode === 'admin') {
    if (!user) {
      handleGoogleSignIn();
      return null;
    }
    if (isAdminInitializing) return <LoadingScreen />;
    return <AdminPollManager user={user} onSignOut={handleSignOut} />;
  }

  if (mode === 'participant' && pollId) {
    return <ParticipantView pollId={pollId} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-full text-sm font-bold text-indigo-700 border border-indigo-100"
          >
            <Sparkles className="w-4 h-4" />
            COACHED!
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]"
          >
            Involucra a tu <br />
            <span className="text-indigo-600">audiencia hoy.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 max-w-md leading-relaxed"
          >
            La forma profesional de organizar sesiones interactivas para eventos.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-10 rounded-[2rem] shadow-xl border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-8">Consola de Acceso</h2>
          
          <div className="space-y-4">
            <button 
              onClick={() => {
                if (user) setMode('admin');
                else handleGoogleSignIn();
              }}
              className="w-full p-6 bg-white border border-slate-200 hover:border-indigo-600 hover:bg-slate-50 rounded-xl transition-all group text-left flex items-center gap-5 shadow-sm"
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{user ? `Panel de ${user.displayName?.split(' ')[0]}` : 'Administrador del Evento'}</h3>
                <p className="text-sm text-slate-500">Gestiona preguntas y ve las respuestas</p>
              </div>
            </button>

            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-bold tracking-widest">o participa</span>
              </div>
            </div>

            <button 
              onClick={() => {
                const id = prompt('Introduce el ID de la Sesión:');
                if (id) {
                  setPollId(id);
                  setMode('participant');
                }
              }}
              className="w-full p-6 bg-slate-900 border border-transparent hover:bg-slate-800 rounded-xl transition-all group text-left flex items-center gap-5 shadow-lg"
            >
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <UserCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Unirse como Participante</h3>
                <p className="text-sm text-slate-400">Envía tus respuestas en tiempo real</p>
              </div>
            </button>
          </div>
          
          <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-center gap-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Infraestructura en la Nube Online
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
