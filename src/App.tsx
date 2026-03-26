import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Play, Zap, User, ChevronRight, Weight, Target, UserCircle, X, Check, AlertTriangle, Plus, Info, ChevronDown, ChevronUp, PlayCircle, PauseCircle, CheckCircle2, ExternalLink, Trash2, Bell, BellOff, Clock } from 'lucide-react';
import { useAppState } from './hooks/useAppState';

// --- Components ---

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'warning' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'bg-green-600',
    warning: 'bg-amber-500',
    error: 'bg-red-600'
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 20, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-white shadow-lg flex items-center gap-2 whitespace-nowrap ${colors[type]}`}
    >
      {type === 'success' && <Check size={18} />}
      {type === 'warning' && <AlertTriangle size={18} />}
      {type === 'error' && <X size={18} />}
      {message}
    </motion.div>
  );
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="w-full max-w-[480px] bg-white rounded-t-3xl p-6 pb-12 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500">
            <X size={20} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

const Stepper = ({ value, onChange, unit = 'kg' }: { value: number, onChange: (val: number) => void, unit?: string }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-baseline gap-2">
        <span className="text-6xl font-black text-red-600">{value}</span>
        <span className="text-2xl text-red-600/60">{unit}</span>
      </div>
      <div className="flex gap-3">
        <button onClick={() => onChange(value - 5)} className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 active:scale-95 transition-transform">-5</button>
        <button onClick={() => onChange(value - 1)} className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 active:scale-95 transition-transform">-1</button>
        <button onClick={() => onChange(value + 1)} className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 active:scale-95 transition-transform">+1</button>
        <button onClick={() => onChange(value + 5)} className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 active:scale-95 transition-transform">+5</button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const { state, updateState, resetState } = useAppState();
  const [activeTab, setActiveTab] = useState('inicio');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'warning' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setToast({ message, type });
  };

  if (!state.onboarding_completo) {
    return <Onboarding onComplete={(data) => {
      updateState({ ...data, onboarding_completo: true, dia_inicio: new Date().toISOString() });
      showToast('Bem-vinda ao Protocolo! ✨');
    }} />;
  }

  return <MainApp state={state} updateState={updateState} resetState={resetState} activeTab={activeTab} setActiveTab={setActiveTab} toast={toast} setToast={setToast} showToast={showToast} />;
}

function MainApp({ state, updateState, resetState, activeTab, setActiveTab, toast, setToast, showToast }: any) {
  // Notification Logic
  useEffect(() => {
    if (!state.notificacoes_ativas) return;

    const checkNotification = () => {
      const now = new Date();
      const [h, m] = state.lembrete_hora.split(':').map(Number);
      
      // Check if it's the exact minute
      if (now.getHours() === h && now.getMinutes() === m && !state.truque_hoje) {
        const lastNotified = localStorage.getItem('last_notified_date');
        const today = now.toISOString().split('T')[0];
        
        if (lastNotified !== today) {
          // System Notification
          if (Notification.permission === 'granted') {
            new Notification('Protocolo da Gelatina', {
              body: 'Olá! Não se esqueça do seu truque da gelatina hoje! 🔴',
              icon: 'https://picsum.photos/seed/gelatina/192/192'
            });
            localStorage.setItem('last_notified_date', today);
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission();
          }
          
          // In-app Notification (Red Modal)
          window.dispatchEvent(new CustomEvent('show-reminder-modal'));
        }
      }
    };

    const interval = setInterval(checkNotification, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [state.notificacoes_ativas, state.lembrete_hora, state.truque_hoje]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center">
      <div className="w-full max-w-[480px] flex-1 flex flex-col relative pb-24">
        <AnimatePresence>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto p-5">
          {activeTab === 'inicio' && <HomeTab state={state} updateState={updateState} showToast={showToast} />}
          {activeTab === 'aulas' && <AulasTab showToast={showToast} />}
          {activeTab === 'truque' && <TruqueTab state={state} />}
          {activeTab === 'perfil' && <PerfilTab state={state} resetState={resetState} updateState={updateState} showToast={showToast} />}
        </main>

        <nav className="fixed bottom-0 w-full max-w-[480px] bg-white border-t border-gray-100 flex justify-around items-center py-3 safe-area-bottom z-40">
          <NavItem active={activeTab === 'inicio'} onClick={() => setActiveTab('inicio')} icon={<Home size={24} />} label="Início" />
          <NavItem active={activeTab === 'aulas'} onClick={() => setActiveTab('aulas')} icon={<Play size={24} />} label="Aulas" />
          <NavItem active={activeTab === 'truque'} onClick={() => setActiveTab('truque')} icon={<Zap size={24} />} label="Truque" />
          <NavItem active={activeTab === 'perfil'} onClick={() => setActiveTab('perfil')} icon={<User size={24} />} label="Perfil" />
        </nav>
      </div>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-[#E53935]' : 'text-gray-400'}`}>
      {icon}
      <span className="text-[10px] uppercase tracking-wider">{label}</span>
    </button>
  );
}

// --- Onboarding ---

function Onboarding({ onComplete }: { onComplete: (data: any) => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    nome: '',
    peso_atual: 75,
    meta_perda: 10
  });

  const peso_meta = data.peso_atual - data.meta_perda;

  const next = () => {
    if (step < 3) setStep(step + 1);
    else onComplete({ ...data, peso_inicial: data.peso_atual, peso_meta });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-8">
      <div className="w-full max-w-[480px] flex-1 flex flex-col">
        <div className="flex flex-col items-center mb-12">
          <img
            src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/GM.png"
            alt="Gelatina Mounjaro"
            style={{
              width: '100px',
              height: 'auto',
              display: 'block',
              margin: '0 auto 16px',
              objectFit: 'contain'
            }}
          />
          <h1 className="text-2xl font-black text-center text-gray-900 leading-tight mb-2">
            Bem-vinda ao Protocolo da Gelatina Mounjaro!
          </h1>
          <p className="text-gray-500 text-center font-medium">Vamos personalizar sua jornada</p>
        </div>

        <div className="flex justify-center gap-2 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${step === i ? 'bg-red-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-600">
                  <UserCircle size={32} />
                </div>
                <h2 className="text-xl font-black mb-2">Como posso te chamar?</h2>
                <p className="text-gray-400 text-center text-sm mb-8">Seu nome para personalizarmos sua experiência</p>
                <input
                  type="text"
                  placeholder="Digite seu nome..."
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-2xl p-4 text-center text-lg outline-none transition-all"
                  value={data.nome}
                  onChange={(e) => setData({ ...data, nome: e.target.value })}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-600">
                  <Weight size={32} />
                </div>
                <h2 className="text-xl font-black mb-2">Qual é o seu peso atual?</h2>
                <p className="text-gray-400 text-center text-sm mb-8">Isso nos ajuda a acompanhar seu progresso</p>
                <Stepper value={data.peso_atual} onChange={(val) => setData({ ...data, peso_atual: Math.max(30, val) })} />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-600">
                  <Target size={32} />
                </div>
                <h2 className="text-xl font-black mb-2">Quantos quilos quer perder?</h2>
                <p className="text-gray-400 text-center text-sm mb-8">Defina sua meta para os próximos 30 dias</p>
                <Stepper value={data.meta_perda} onChange={(val) => setData({ ...data, meta_perda: Math.max(1, val) })} />

                <div className="w-full bg-red-50 border border-red-100 rounded-2xl p-5 mt-10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-red-900/60 text-sm">🎯 Sua meta:</span>
                    <span className="text-red-600 font-black">{data.peso_atual}kg → {peso_meta}kg</span>
                  </div>
                  <p className="text-red-900/80 text-sm text-center">Perder <span className="text-red-600">{data.meta_perda}kg</span> em 30 dias</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          disabled={step === 1 && !data.nome.trim()}
          onClick={next}
          className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 mt-8"
        >
          {step === 3 ? '✨ Começar Minha Jornada' : 'Continuar ›'}
        </button>
      </div>
    </div>
  );
}

// --- Tabs ---

function HomeTab({ state, updateState, showToast }: { state: any, updateState: any, showToast: any }) {
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState(state.peso_atual);
  const [showPrep, setShowPrep] = useState(false);
  const [prepView, setPrepView] = useState<'options' | 'ingredients' | 'steps'>('options');
  const [isPwaBannerVisible, setIsPwaBannerVisible] = useState(true);

  useEffect(() => {
    const handleShowReminder = () => setIsReminderModalOpen(true);
    window.addEventListener('show-reminder-modal', handleShowReminder);
    return () => window.removeEventListener('show-reminder-modal', handleShowReminder);
  }, []);

  const diasNoProtocolo = state.dia_inicio ? Math.floor((new Date().getTime() - new Date(state.dia_inicio).getTime()) / (1000 * 3600 * 24)) + 1 : 1;
  const kgPerdidos = (state.peso_inicial - state.peso_atual).toFixed(1);
  const progressoPercent = Math.min(100, Math.max(0, (parseFloat(kgPerdidos) / state.meta_perda) * 100)).toFixed(0);

  const handleSaveWeight = () => {
    updateState({
      peso_atual: newWeight,
      historico_peso: [...state.historico_peso, { date: new Date().toISOString(), peso: newWeight }]
    });
    setIsWeightModalOpen(false);
    showToast('Peso atualizado com sucesso!');
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-black text-gray-900">Olá, {state.nome}! 👋</h1>
        {state.truque_hoje ? (
          <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black w-fit">
            <Check size={14} /> ✅ Truque feito hoje! ✨
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black w-fit">
            <AlertTriangle size={14} /> ⚠️ Ainda não fez o truque hoje
          </div>
        )}
      </header>

      {isPwaBannerVisible && (
        <div className="bg-green-600 rounded-2xl p-4 text-white relative flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
            📱
          </div>
          <div className="flex-1">
            <h3 className="font-black">Instalar App</h3>
            <p className="text-xs opacity-80">Instale para acesso rápido e offline</p>
          </div>
          <button className="bg-white text-green-700 px-4 py-2 rounded-xl text-xs font-black">⬇️ Instalar Agora</button>
          <button onClick={() => setIsPwaBannerVisible(false)} className="absolute -top-2 -right-2 bg-white text-gray-400 p-1 rounded-full shadow-md">
            <X size={14} />
          </button>
        </div>
      )}

      {!state.notificacoes_ativas && (
        <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white">
            <Bell size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-red-900">Ativar Lembrete?</h3>
            <p className="text-[10px] text-red-900/60">Não perca o truque da gelatina diário!</p>
          </div>
          <button
            onClick={() => {
              Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                  updateState({ notificacoes_ativas: true });
                  showToast('Lembrete ativado! 🔔');
                } else {
                  showToast('Permissão necessária', 'warning');
                }
              });
            }}
            className="bg-red-600 text-white px-3 py-2 rounded-xl text-[10px] font-black"
          >
            Ativar
          </button>
        </div>
      )}

      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-6 text-white shadow-xl shadow-red-600/20">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <span className="text-white/60 text-xs uppercase tracking-wider">Seu Progresso</span>
            <h2 className="text-xl font-black">Dia {diasNoProtocolo} de 30</h2>
          </div>
          <button onClick={() => setIsWeightModalOpen(true)} className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2">
            <Plus size={16} /> Peso
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard icon="📅" value={`${diasNoProtocolo} dias`} />
          <StatCard icon="🔥" value={`${state.sequencia} seguidos`} />
          <StatCard icon="📉" value={`${kgPerdidos}kg perdidos`} />
          <StatCard icon="⚖️" value={`${state.peso_atual}kg atual`} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-black">
            <span>Meta: -{state.meta_perda}kg</span>
            <span>{progressoPercent}%</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressoPercent}%` }}
              className="h-full bg-white rounded-full"
            />
          </div>
          <div className="flex justify-between text-[10px] opacity-60">
            <span>{state.peso_inicial}kg</span>
            <span>Meta: {state.peso_meta}kg</span>
          </div>
        </div>
      </div>

      <div id="preparo-section" className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col items-center text-center gap-4">
          <img
            src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/GM.png"
            alt="Gelatina Mounjaro"
            style={{
              width: '48px',
              height: 'auto',
              objectFit: 'contain',
              display: 'inline-block',
              verticalAlign: 'middle',
              marginRight: '8px'
            }}
          />
          <div>
            <h3 className="text-lg font-black text-gray-900">Ativar o Protocolo da Gelatina: Sua Receita está Pronta!</h3>
            <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-black mt-2">
              <img
                src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/GM.png"
                alt="Gelatina Mounjaro"
                style={{
                  width: '16px',
                  height: 'auto',
                  objectFit: 'contain',
                  marginRight: '4px'
                }}
              />
              Dia {diasNoProtocolo} de 30
              <img
                src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/GM.png"
                alt="Gelatina Mounjaro"
                style={{
                  width: '16px',
                  height: 'auto',
                  objectFit: 'contain',
                  marginLeft: '4px'
                }}
              />
            </div>
          </div>

          <div className="flex gap-1.5">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < diasNoProtocolo ? 'bg-red-600' : 'bg-gray-200'}`} />
            ))}
          </div>

          <button
            onClick={() => setShowPrep(!showPrep)}
            className="w-full bg-red-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-red-600/10 active:scale-95 transition-all"
          >
            {showPrep ? 'FECHAR PREPARO ↑' : 'INICIAR PREPARO →'}
          </button>
        </div>

        {showPrep && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-8 pt-8 border-t border-gray-100"
          >
            {prepView === 'options' && (
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                  <img
                    src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/GM.png"
                    alt="Gelatina Mounjaro"
                    style={{
                      width: '48px',
                      height: 'auto',
                      objectFit: 'contain'
                    }}
                  />
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-black">Vamos Preparar?</h4>
                  <p className="text-sm text-gray-400">Escolha por onde quer começar</p>
                </div>
                <div className="w-full flex flex-col gap-3">
                  <button
                    onClick={() => setPrepView('ingredients')}
                    className="w-full p-4 rounded-2xl border-2 border-gray-100 flex flex-col items-start gap-1 text-left active:bg-gray-50"
                  >
                    <span className="font-black text-gray-900">📋 Ver Ingredientes ›</span>
                    <span className="text-xs text-gray-400">Confira a lista completa antes de começar</span>
                  </button>
                  <button
                    onClick={() => setPrepView('steps')}
                    className="w-full p-4 rounded-2xl bg-red-600 text-white flex flex-col items-start gap-1 text-left active:scale-95 transition-all"
                  >
                    <span className="font-black">🍳 Preparar Receita ›</span>
                    <span className="text-xs opacity-80">Já tenho tudo, bora começar!</span>
                  </button>
                </div>
              </div>
            )}

            {prepView === 'ingredients' && (
              <IngredientsView onStart={() => setPrepView('steps')} onClose={() => setPrepView('options')} />
            )}

            {prepView === 'steps' && (
              <StepsView onComplete={() => {
                updateState({ 
                  truque_hoje: true,
                  sequencia: state.sequencia + 1
                });
                setShowPrep(false);
                setPrepView('options');
                showToast('Truque concluído! Parabéns! 🏆');
              }} onClose={() => setPrepView('options')} />
            )}
          </motion.div>
        )}
      </div>

      <Modal isOpen={isWeightModalOpen} onClose={() => setIsWeightModalOpen(false)} title="Atualizar Peso">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Peso anterior: <span className="text-gray-900 font-black">{state.peso_atual}kg</span></p>
          </div>
          <Stepper value={newWeight} onChange={(val) => setNewWeight(Math.max(30, val))} />
          <button
            onClick={handleSaveWeight}
            className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-600/20 active:scale-95 transition-all"
          >
            Salvar
          </button>
        </div>
      </Modal>

      <Modal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} title={
        <div className="flex items-center gap-2">
          Hora do Truque!
          <img
            src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/GM.png"
            alt="Gelatina Mounjaro"
            style={{
              width: '24px',
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>
      }>
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
            <img
              src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/GM.png"
              alt="Gelatina Mounjaro"
              style={{
                width: '48px',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
          <div>
            <h4 className="text-xl font-black text-gray-900">Não esqueça de hoje!</h4>
            <p className="text-sm text-gray-500 mt-2">Sua gelatina metabólica está esperando para acelerar seu dia.</p>
          </div>
          <button
            onClick={() => {
              setIsReminderModalOpen(false);
              setShowPrep(true);
              const el = document.getElementById('preparo-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-600/20 active:scale-95 transition-all"
          >
            🍳 Preparar Agora
          </button>
          <button
            onClick={() => setIsReminderModalOpen(false)}
            className="text-gray-400 text-sm font-black"
          >
            Lembrar mais tarde
          </button>
        </div>
      </Modal>
    </div>
  );
}

function StatCard({ icon, value }: { icon: string, value: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex flex-col items-center gap-1">
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-black">{value}</span>
    </div>
  );
}

function IngredientsView({ onStart, onClose }: { onStart: () => void, onClose: () => void }) {
  const [checked, setChecked] = useState<number[]>([]);
  const [showOptional, setShowOptional] = useState(false);

  const essentials = [
    "Água quente (não fervendo) — 1 xícara",
    "Água fria — ½ xícara",
    "Extrato de chá verde — 1 colher de chá",
    "Extrato de gengibre — 1 colher de chá",
    "Cúrcuma em pó + pimenta preta — 1 col. chá + ¼ col. chá",
    "Gelatina incolor sem sabor e sem açúcar — 1 envelope (12g)"
  ];

  const optionals = [
    "Limão — algumas gotas",
    "Mel — 1 colher de chá",
    "Stévia — a gosto"
  ];

  const toggle = (i: number) => {
    if (checked.includes(i)) setChecked(checked.filter(c => c !== i));
    else setChecked([...checked, i]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-xl font-black">Ingredientes</h4>
          <p className="text-xs text-gray-400">Confira se você tem tudo</p>
        </div>
        <span className="text-red-600 font-black">{checked.length}/6 essenciais</span>
      </div>

      <div className="flex flex-col gap-3">
        {essentials.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${checked.includes(i) ? 'border-red-600 bg-red-50' : 'border-gray-100'}`}
          >
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${checked.includes(i) ? 'bg-red-600 border-red-600 text-white' : 'border-gray-200'}`}>
              {checked.includes(i) && <Check size={16} />}
            </div>
            <span className={`text-sm font-medium ${checked.includes(i) ? 'text-red-900' : 'text-gray-600'}`}>{item}</span>
          </button>
        ))}
      </div>

      <button onClick={() => setShowOptional(!showOptional)} className="text-red-600 text-sm font-black flex items-center gap-2">
        {showOptional ? '- Esconder opcionais' : '+ Ver opcionais'}
      </button>

      {showOptional && (
        <div className="flex flex-col gap-3">
          {optionals.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-50 text-gray-400">
              <div className="w-6 h-6 rounded-lg border-2 border-gray-100" />
              <span className="text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        <InfoCard icon="📦" label="Rendimento" value="10-14 cubos" />
        <InfoCard icon="⏱️" label="Preparo" value="10 min" />
        <InfoCard icon="🔧" label="Utensílios" value="Panela, Fouet" />
      </div>

      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3">
        <AlertTriangle className="text-red-600 shrink-0" size={20} />
        <p className="text-xs text-red-900/80 leading-relaxed">
          <span className="font-black text-red-600 uppercase">🔴 Cuidado:</span> não use gelatina colorida nem com açúcar. Escolha APENAS a incolor sem açúcar!
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <button onClick={onClose} className="flex-1 py-4 rounded-2xl border-2 border-gray-100 font-black text-gray-400">Fechar</button>
        <button onClick={onStart} className="flex-[2] py-4 rounded-2xl bg-red-600 text-white font-black shadow-lg shadow-red-600/10">🍳 Iniciar Preparo ›</button>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: string, label: string, value: string }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-3 flex flex-col items-center text-center gap-1">
      <span className="text-lg">{icon}</span>
      <span className="text-[10px] text-gray-400 uppercase">{label}</span>
      <span className="text-[10px] font-black text-gray-900">{value}</span>
    </div>
  );
}

function StepsView({ onComplete, onClose }: { onComplete: () => void, onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const steps = [
    {
      title: "Hidrate a Gelatina",
      icon: "💧",
      text: "Em uma tigela, misture 1 envelope de gelatina incolor em pó com ½ xícara de água fria. Mexa bem até que os grânulos se dissolvam completamente (cerca de 2-3 minutos). A mistura ficará espessa.",
      tip: "Mexa por 2-3 minutos para hidratar completamente",
      duration: 180
    },
    {
      title: "Aqueça a Base Ativa",
      icon: "🔥",
      text: "Em uma panela em fogo baixo, adicione a água quente, o extrato de chá verde, o gengibre, a cúrcuma e a pimenta preta. Mexa por 1-2 minutos para unificar os ingredientes.",
      warning: "IMPORTANTE: Não deixe ferver!",
      duration: 120
    },
    {
      title: "Combine e Finalize",
      icon: "✨",
      text: "Despeje a gelatina hidratada na panela com a base aquecida. Bata com um batedor (fouet) por 1 minuto até a mistura ficar homogênea e sem grumos. Este é o momento para provar e adicionar os opcionais.",
      tip: "Misture bem para evitar grumos",
      duration: 60
    },
    {
      title: "Molde e Gele",
      icon: "🧊",
      text: "Com cuidado, despeje o líquido final em sua forma (bandeja de gelo de silicone é ideal). Leve à geladeira e deixe firmar por 2 a 4 horas, ou até que os cubos estejam completamente sólidos.",
      tip: "Use formas de silicone para facilitar a remoção",
      duration: 0
    },
    {
      title: "Armazene Corretamente",
      icon: "📦",
      text: "Uma vez firmes, remova os cubos da forma e guarde-os em um recipiente hermeticamente fechado na geladeira. Eles se manterão frescos e potentes por até 7 dias.",
      tip: "Consuma 1 cubo por dia, preferencialmente em jejum pela manhã",
      duration: 0
    }
  ];

  useEffect(() => {
    let interval: any;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && isTimerActive) {
      setIsTimerActive(false);
      // Play sound or vibrate
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const startTimer = (duration: number) => {
    setTimer(duration);
    setIsTimerActive(true);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m.toString().padStart(2, '0')}:${rs.toString().padStart(2, '0')}`;
  };

  const [isCelebrating, setIsCelebrating] = useState(false);

  if (isCelebrating) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 gap-6 text-center"
      >
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600">
          <CheckCircle2 size={64} />
        </div>
        <div>
          <h4 className="text-2xl font-black text-gray-900">
            <img
              src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/GM.png"
              alt="Gelatina Mounjaro"
              style={{
                width: '48px',
                height: 'auto',
                objectFit: 'contain',
                display: 'inline-block',
                verticalAlign: 'middle',
                marginRight: '8px'
              }}
            />
            Protocolo Concluído!
          </h4>
          <p className="text-gray-500">Seu metabolismo agradece. ✨</p>
        </div>
        <button
          onClick={onComplete}
          className="w-full bg-red-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-red-600/20 active:scale-95 transition-all"
        >
          🏆 Voltar ao Início
        </button>
      </motion.div>
    );
  }

  const stepData = steps[currentStep];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-xl font-black">Preparo</h4>
          <p className="text-xs text-gray-400">Siga o passo a passo</p>
        </div>
        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-400"><X size={18} /></button>
      </div>

      <div className="flex justify-between items-center px-4 relative">
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-100 -translate-y-1/2 -z-10" />
        {steps.map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all z-10 ${
              i === currentStep ? 'bg-red-600 text-white scale-125' :
              i < currentStep ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}
          >
            {i < currentStep ? <Check size={14} /> : i + 1}
          </div>
        ))}
      </div>

      <motion.div
        key={currentStep}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{stepData.icon}</span>
          <h5 className="text-lg font-black text-gray-900">{stepData.title}</h5>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{stepData.text}</p>

        {stepData.tip && (
          <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-xs flex gap-2">
            <Info size={16} className="shrink-0" />
            <span><span className="font-black">Dica:</span> {stepData.tip}</span>
          </div>
        )}

        {stepData.warning && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs flex gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            <span><span className="font-black">IMPORTANTE:</span> {stepData.warning}</span>
          </div>
        )}

        {stepData.duration > 0 && (
          <div className="flex flex-col items-center gap-4 py-6 bg-gray-50 rounded-3xl">
            <span className="text-5xl font-black text-red-600 tabular-nums">{formatTime(timer || stepData.duration)}</span>
            <button
              onClick={() => isTimerActive ? setIsTimerActive(false) : startTimer(timer || stepData.duration)}
              className={`px-8 py-3 rounded-2xl font-black flex items-center gap-2 transition-all ${isTimerActive ? 'bg-amber-100 text-amber-700' : 'bg-green-600 text-white'}`}
            >
              {isTimerActive ? <><PauseCircle size={20} /> Pausar</> : <><PlayCircle size={20} /> Iniciar Timer</>}
            </button>
          </div>
        )}
      </motion.div>

      <div className="flex gap-3 pt-4">
        <button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(currentStep - 1)}
          className="w-12 h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-gray-400 disabled:opacity-30"
        >
          ‹
        </button>
        {currentStep === steps.length - 1 ? (
          <button onClick={() => setIsCelebrating(true)} className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black shadow-lg shadow-red-600/10">🏆 Concluir Preparo</button>
        ) : (
          <button onClick={() => { setCurrentStep(currentStep + 1); setTimer(0); setIsTimerActive(false); }} className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black shadow-lg shadow-red-600/10">Próximo Passo ›</button>
        )}
      </div>
    </div>
  );
}

function AulasTab({ showToast }: { showToast: any }) {
  const [selectedModule, setSelectedModule] = useState(1);
  const [viewingVideo, setViewingVideo] = useState<any | null>(null);

  const modules = [
    { id: 1, title: "Truque da Gelatina", sub: "Vídeo-aulas do protocolo", badge: "▶️ 1 aula", color: "bg-red-600" },
    { id: 2, title: "Protocolo Antiflacidez", sub: "Recupere a tonicidade", badge: "▶️ 1 aula", color: "bg-pink-500" }
  ];

  const aulas = {
    1: [
      { id: "aula1_1", title: "O Protocolo da Gelatina Metabólica", duration: "12:45", desc: "Você dará o primeiro passo para dominar o Truque da Gelatina e entender como foi gerado seu protocolo e receita personalizada.", videoId: "hMP9cJyE7FA" }
    ],
    2: [
      { id: "aula2_1", title: "Protocolo Antiflacidez", duration: "15:00", desc: "Esta aula é um guia prático e direto focado na recuperação da tonicidade da pele corporal, fugindo de promessas milagrosas.", videoId: "SXDrCi3udR0" }
    ]
  };

  return (
    <AnimatePresence>
      {viewingVideo ? (
        <motion.div
          key="player"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col gap-6"
        >
          <motion.button 
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => setViewingVideo(null)} 
            className="flex items-center gap-2 text-gray-400 font-black w-fit"
          >
            ‹ Voltar
          </motion.button>
          
          <motion.div 
            layoutId={`video-container-${viewingVideo.id}`}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative z-10"
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube-nocookie.com/embed/${viewingVideo.videoId}?rel=0&modestbranding=1&autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-2"
          >
            <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black w-fit">Aula 1 • {viewingVideo.duration}</div>
            <h3 className="text-xl font-black text-gray-900">{viewingVideo.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{viewingVideo.desc}</p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col gap-6"
        >
          <header>
            <h1 className="text-2xl font-black text-gray-900">✨ Aulas</h1>
            <p className="text-sm text-gray-400">Escolha um módulo para começar sua transformação</p>
          </header>

          <div className="grid grid-cols-2 gap-4">
            {modules.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedModule(m.id)}
                className={`p-4 rounded-3xl flex flex-col items-start text-left transition-all border-2 ${selectedModule === m.id ? `border-transparent ${m.color} text-white shadow-lg` : 'border-gray-100 bg-white text-gray-900'}`}
              >
                <span className="text-xs font-black mb-1 flex items-center">
                  {m.id === 1 ? (
                    <img
                      src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/GM.png"
                      alt="Gelatina Mounjaro"
                      style={{
                        width: '48px',
                        height: 'auto',
                        objectFit: 'contain',
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        marginRight: '8px'
                      }}
                    />
                  ) : '📚'} 
                  {m.title}
                </span>
                <span className={`text-[10px] mb-3 ${selectedModule === m.id ? 'opacity-80' : 'text-gray-400'}`}>{m.sub}</span>
                <span className={`text-[10px] font-black px-2 py-1 rounded-full ${selectedModule === m.id ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>{m.badge}</span>
              </button>
            ))}
          </div>

          <div className={`rounded-3xl p-6 text-white ${selectedModule === 1 ? 'bg-red-600' : 'bg-pink-500'}`}>
            <h3 className="text-lg font-black mb-2">{modules.find(m => m.id === selectedModule)?.title}</h3>
            <p className="text-xs opacity-80 leading-relaxed">
              {selectedModule === 1 ? 'Assista às vídeo-aulas e aprenda todo o protocolo da gelatina metabólica passo a passo.' : 'Aprenda técnicas para recuperar a tonicidade da pele com nutrição celular real.'}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {aulas[selectedModule as keyof typeof aulas].map(aula => (
              <div key={aula.id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex flex-col gap-4">
                <motion.div 
                  layoutId={`video-container-${aula.id}`}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  className="relative aspect-video bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden group cursor-pointer"
                  onClick={() => setViewingVideo(aula)}
                >
                  <div className={`absolute inset-0 opacity-20 ${selectedModule === 1 ? 'bg-red-600' : 'bg-pink-500'}`} />
                  <Play size={48} className={`${selectedModule === 1 ? 'text-red-600' : 'text-pink-500'} group-active:scale-90 transition-transform`} fill="currentColor" />
                  <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg font-black">⏱️ {aula.duration}</div>
                </motion.div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase">Aula 1</span>
                  <h4 className="font-black text-gray-900">{aula.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2">{aula.desc}</p>
                </div>
                <button
                  onClick={() => setViewingVideo(aula)}
                  className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 ${selectedModule === 1 ? 'bg-red-50 text-red-600' : 'bg-pink-50 text-pink-500'}`}
                >
                  ▶️ Clique para assistir
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => window.open('https://google.com', '_blank')}
            className="w-full bg-red-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-red-600/10 active:scale-95 transition-all"
          >
            🎁 Acessar meus bônus
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TruqueTab({ state }: { state: any }) {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const diasNoProtocolo = state.dia_inicio ? Math.floor((new Date().getTime() - new Date(state.dia_inicio).getTime()) / (1000 * 3600 * 24)) + 1 : 1;
  const kgPerdidos = (state.peso_inicial - state.peso_atual).toFixed(1);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-gray-900">
          <img
            src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/GM.png"
            alt="Gelatina Mounjaro"
            style={{
              width: '48px',
              height: 'auto',
              objectFit: 'contain',
              display: 'inline-block',
              verticalAlign: 'middle',
              marginRight: '8px'
            }}
          />
          Truque da Gelatina
        </h1>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black transition-colors ${state.truque_hoje ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {state.truque_hoje ? (
            <><CheckCircle2 size={14} /> RITUAL CONCLUÍDO</>
          ) : (
            <><Clock size={14} /> RITUAL PENDENTE</>
          )}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4 col-span-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-gray-900">🏆 Progresso do Protocolo</h3>
            <span className="text-xs font-black text-red-600">Dia {diasNoProtocolo}/30</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(diasNoProtocolo / 30) * 100}%` }}
              className="h-full bg-red-600 rounded-full" 
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <MiniStat label="kg off" value={kgPerdidos} />
            <MiniStat label="kg atual" value={state.peso_atual} />
            <MiniStat label="Meta" value={state.peso_meta} />
          </div>
        </div>

        <div className="bg-red-600 rounded-3xl p-6 text-white shadow-lg shadow-red-600/20 flex flex-col justify-between aspect-square">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <img
              src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/GM.png"
              alt="Gelatina Mounjaro"
              style={{
                width: '24px',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
          <div>
            <span className="text-4xl font-black leading-none">{state.sequencia}</span>
            <p className="text-[10px] font-black opacity-80 uppercase mt-1">Dias Seguidos</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between aspect-square">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
            <Target size={20} />
          </div>
          <div>
            <span className="text-2xl font-black text-gray-900 leading-none">{30 - diasNoProtocolo}</span>
            <p className="text-[10px] font-black text-gray-400 uppercase mt-1">Dias Restantes</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-gray-900">📊 Histórico Semanal</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-600" />
              <span className="text-[9px] font-black text-gray-400 uppercase">Sucesso</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-200" />
              <span className="text-[9px] font-black text-gray-400 uppercase">Falha</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-end justify-between h-24 px-2">
          {Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dateStr = d.toISOString().split('T')[0];
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const entry = state.historico_truque?.find((e: any) => e.date === dateStr);
            const completed = isToday ? state.truque_hoje : (entry?.completed || false);
            const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' }).charAt(0).toUpperCase();

            return (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="relative w-full flex flex-col items-center group">
                  {/* Bar */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: completed ? '100%' : '20%' }}
                    className={`w-2 rounded-full transition-all duration-500 ${completed ? 'bg-red-600 shadow-lg shadow-red-600/20' : 'bg-gray-100'}`}
                    style={{ height: completed ? '60px' : '12px' }}
                  />
                  {/* Tooltip on hover (optional, but good for UX) */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {completed ? 'Concluído' : 'Pendente'}
                  </div>
                </div>
                <span className={`text-[9px] font-black ${isToday ? 'text-red-600' : 'text-gray-400'} uppercase`}>{dayName}</span>
              </div>
            );
          })}
        </div>
        
        <div className="bg-red-50 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-red-600 shrink-0">
            <img
              src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/GM.png"
              alt="Gelatina Mounjaro"
              style={{
                width: '24px',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] text-red-900 font-black">
              Meta da Semana: {state.historico_truque?.filter((e: any) => {
                const d = new Date(e.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return d > weekAgo && e.completed;
              }).length + (state.truque_hoje ? 1 : 0)}/7 dias
            </p>
            <p className="text-[9px] text-red-900/60 leading-tight">
              Mantenha as barras vermelhas para maximizar os resultados.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Accordion
          isOpen={openAccordion === 0}
          onClick={() => setOpenAccordion(openAccordion === 0 ? null : 0)}
          icon="🍳"
          title="Sua Receita Personalizada"
          color="bg-red-50 text-red-600"
        >
          <div className="flex flex-col gap-4">
            <h4 className="font-black text-gray-900">Desvendando os 4 Pilares da Aceleração Metabólica</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Este não é apenas um alimento; é um composto bioativo projetado para funcionar em harmonia. Cada ingrediente tem um papel específico, mas sua combinação cria um efeito metabólico amplificado.</p>
            <div className="grid gap-3">
              <PilarCard color="bg-red-50" border="border-red-100" icon="🌱" title="A BASE | Gelatina Pura" sub="Saciedade e Reparo" text="Fonte rica em glicina e alanina, aminoácidos que promovem a sensação de saciedade e apoiam a saúde intestinal." />
              <PilarCard color="bg-green-50" border="border-green-100" icon="🔥" title="O AMPLIFICADOR | Chá Verde" sub="Queima de Gordura" text="Acelera o metabolismo e auxilia o corpo a utilizar a gordura como fonte de energia." />
              <PilarCard color="bg-orange-50" border="border-orange-100" icon="⚡" title="O ACELERADOR | Gengibre" sub="Efeito Termogênico" text="Aumenta a temperatura corporal, impulsionando o gasto calórico. Também contribui para a saciedade." />
              <PilarCard color="bg-purple-50" border="border-purple-100" icon="🛡️" title="O SUSTENTADOR | Cúrcuma" sub="Anti-inflamatório" text="Reduz a inflamação crônica associada ao ganho de peso. A piperina é crucial para a absorção." />
            </div>
          </div>
        </Accordion>

        <Accordion
          isOpen={openAccordion === 1}
          onClick={() => setOpenAccordion(openAccordion === 1 ? null : 1)}
          icon="📅"
          title="Seu Protocolo Diário"
          color="bg-orange-50 text-orange-600"
        >
          <div className="flex flex-col gap-4">
            <h4 className="font-black text-gray-900">Como usar no dia a dia</h4>
            <div className="grid gap-3">
              <ProtocoloItem icon="📍" title="Dosagem" text="Um cubo por dia. Comece com um e ouça seu corpo. Mais de um pode acelerar o metabolismo de forma muito intensa." />
              <ProtocoloItem icon="⏰" title="Horário Ideal" text="Manhã, em jejum. Ajuda a ativar o metabolismo para o dia todo. Se preferir, pode ser consumido junto com o jantar." />
              <ProtocoloItem icon="💧" title="Sinergia" text="Beba muita água. Os resultados são potencializados com foco em alimentos integrais." />
              <ProtocoloItem icon="📅" title="Duração" text="30 a 90 dias. Use diariamente para resultados ótimos. Após atingir seu objetivo, mantenha com 2 a 3 cubos por semana." />
            </div>
          </div>
        </Accordion>

        <Accordion
          isOpen={openAccordion === 2}
          onClick={() => setOpenAccordion(openAccordion === 2 ? null : 2)}
          icon="💡"
          title="Dicas de Sucesso"
          color="bg-purple-50 text-purple-600"
        >
          <div className="grid gap-3">
            <DicaCard icon="💧" title="Hidratação" text="Beba pelo menos 400ml de água junto com a gelatina para maximizar o efeito de saciedade." />
            <DicaCard icon="⏰" title="30 min antes" text="O melhor momento para tomar é 30 minutos antes das refeições principais." />
            <DicaCard icon="🌿" title="Fibras" text="Adicionar uma colher de chia ou linhaça potencializa o efeito de saciedade." />
            <DicaCard icon="🌙" title="Ritual noturno" text="Tomar antes de dormir ajuda a evitar a fome noturna e melhora o sono." />
          </div>
        </Accordion>
      </div>

      <div className="bg-red-50 border border-red-100 rounded-3xl p-5 flex gap-3">
        <AlertTriangle className="text-red-600 shrink-0" size={24} />
        <p className="text-xs text-red-900/80 leading-relaxed">
          <span className="font-black text-red-600 uppercase">🔴 Cuidado:</span> não use gelatina colorida nem com açúcar. Ela tem muitas calorias e acaba com o protocolo. Escolha APENAS a incolor sem açúcar para dar certo!
        </p>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string, value: any }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] text-gray-400 uppercase">{label}</span>
      <span className="text-xs font-black text-gray-900">{value}</span>
    </div>
  );
}

function Accordion({ isOpen, onClick, icon, title, color, children }: { isOpen: boolean, onClick: () => void, icon: string, title: string, color: string, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <button onClick={onClick} className="w-full p-5 flex items-center justify-between active:bg-gray-50 transition-colors">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${color}`}>{icon}</div>
          <span className="font-black text-gray-900">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-gray-300" /> : <ChevronDown size={20} className="text-gray-300" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 pb-5"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PilarCard({ color, border, icon, title, sub, text }: any) {
  return (
    <div className={`${color} ${border} border rounded-2xl p-4 flex flex-col gap-2`}>
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <h5 className="text-xs font-black text-gray-900 uppercase tracking-tight">{title}</h5>
      </div>
      <span className="text-[10px] font-black uppercase text-red-600">Função: {sub}</span>
      <p className="text-[11px] text-gray-600 leading-relaxed">{text}</p>
    </div>
  );
}

function ProtocoloItem({ icon, title, text }: any) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 flex gap-4">
      <span className="text-xl">{icon}</span>
      <div className="flex flex-col gap-1">
        <h5 className="text-xs font-black text-gray-900 uppercase">{title}</h5>
        <p className="text-[11px] text-gray-500 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function DicaCard({ icon, title, text }: any) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 flex items-start gap-4">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">{icon}</div>
      <div className="flex flex-col gap-0.5">
        <h5 className="text-xs font-black text-gray-900">{title}</h5>
        <p className="text-[11px] text-gray-500 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function PerfilTab({ state, resetState, updateState, showToast }: { state: any, resetState: any, updateState: any, showToast: any }) {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(state.nome);

  const diasNoProtocolo = state.dia_inicio ? Math.floor((new Date().getTime() - new Date(state.dia_inicio).getTime()) / (1000 * 3600 * 24)) + 1 : 1;
  const kgPerdidos = (state.peso_inicial - state.peso_atual).toFixed(1);
  const progressoPercent = Math.min(100, Math.max(0, (parseFloat(kgPerdidos) / state.meta_perda) * 100)).toFixed(0);

  const getMotivacao = (p: number) => {
    if (p <= 25) return "Continue firme! Cada dia conta! 💪";
    if (p <= 50) return "Você está no caminho certo! 🔥";
    if (p <= 75) return "Incrível! Mais da metade da meta! ⭐";
    if (p < 100) return "Quase lá! Não para agora! 🏆";
    return "Meta atingida! Você é incrível! 🎉";
  };

  const handleSaveName = () => {
    updateState({ nome: tempName });
    setIsEditingName(false);
    showToast('Nome atualizado!');
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-black text-gray-900">👤 Configurações</h1>
      </header>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-black">
          {state.nome.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 flex flex-col gap-1">
          {isEditingName ? (
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-gray-50 border-b-2 border-red-600 outline-none px-2 py-1 text-sm font-black"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
              />
              <button onClick={handleSaveName} className="text-green-600"><Check size={20} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-gray-900">{state.nome}</h3>
              <button onClick={() => setIsEditingName(true)} className="text-gray-300"><Plus size={16} className="rotate-45" /></button>
            </div>
          )}
          <span className="text-xs text-red-600 font-black">Meta: -{state.meta_perda}kg</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-6">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <img
            src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/GM.png"
            alt="Gelatina Mounjaro"
            style={{
              width: '16px',
              height: 'auto',
              objectFit: 'contain'
            }}
          />
          Seu Resumo
        </h3>

        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-xl font-black text-gray-900">{state.peso_inicial}kg → {state.peso_atual}kg</span>
            <span className="text-[10px] text-gray-400 uppercase">Peso inicial • Peso atual</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xl font-black text-red-600">-{kgPerdidos}kg</span>
            <span className="text-[10px] text-gray-400 uppercase">kg perdidos</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-gray-900">Dia {diasNoProtocolo} de 30 no protocolo</span>
            <span className="text-xs font-black text-red-600">{progressoPercent}% da meta</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 rounded-full" style={{ width: `${progressoPercent}%` }} />
          </div>
          <p className="text-sm text-center font-black text-gray-900 mt-2">{getMotivacao(parseInt(progressoPercent))}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${state.notificacoes_ativas ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
                {state.notificacoes_ativas ? <Bell size={20} /> : <BellOff size={20} />}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-gray-900">Lembrete Diário</span>
                <span className="text-xs text-gray-400">{state.notificacoes_ativas ? `Ativado para ${state.lembrete_hora}` : 'Desativado'}</span>
              </div>
            </div>
            <button
              onClick={() => {
                if (!state.notificacoes_ativas) {
                  Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                      updateState({ notificacoes_ativas: true });
                      showToast('Notificações ativadas! 🔔');
                    } else {
                      showToast('Permissão negada para notificações', 'error');
                    }
                  });
                } else {
                  updateState({ notificacoes_ativas: false });
                  showToast('Notificações desativadas');
                }
              }}
              className={`w-12 h-6 rounded-full relative transition-colors ${state.notificacoes_ativas ? 'bg-red-600' : 'bg-gray-200'}`}
            >
              <motion.div
                animate={{ x: state.notificacoes_ativas ? 24 : 4 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>

          {state.notificacoes_ativas && (
            <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
              <Clock size={18} className="text-red-600" />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-xs font-black text-gray-900">Horário do Lembrete</span>
                <input
                  type="time"
                  value={state.lembrete_hora}
                  onChange={(e) => updateState({ lembrete_hora: e.target.value })}
                  className="bg-gray-50 border-none rounded-lg px-3 py-1 text-sm font-black text-red-600 outline-none"
                />
              </div>
            </div>
          )}

          {state.notificacoes_ativas && (
            <button
              onClick={() => {
                if (Notification.permission === 'granted') {
                  new Notification('Protocolo da Gelatina', {
                    body: 'Este é um teste do seu lembrete diário! 🔴',
                    icon: 'https://picsum.photos/seed/gelatina-red/192/192'
                  });
                  showToast('Notificação de teste enviada! 🔔');
                } else {
                  showToast('Permissão de notificação necessária', 'warning');
                }
              }}
              className="w-full py-3 rounded-xl bg-red-50 text-red-600 text-xs font-black active:bg-red-100 transition-colors"
            >
              🧪 Testar Notificação Agora
            </button>
          )}
        </div>

        <ProfileItem icon={<PlayCircle size={20} />} title="Instalar App" sub="Instale na sua tela inicial para acesso rápido" />
      </div>

      <button
        onClick={() => setIsResetModalOpen(true)}
        className="w-full py-5 rounded-2xl border-2 border-red-100 text-red-600 font-black flex items-center justify-center gap-2 active:bg-red-50 transition-colors"
      >
        <Trash2 size={20} /> Resetar progresso
      </button>

      <Modal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} title="Tem certeza?">
        <div className="flex flex-col gap-6">
          <p className="text-gray-500 text-center leading-relaxed">Isso irá apagar todo o seu progresso. Esta ação não pode ser desfeita.</p>
          <div className="flex gap-3">
            <button onClick={() => setIsResetModalOpen(false)} className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-600 font-black">Cancelar</button>
            <button onClick={() => { resetState(); setIsResetModalOpen(false); }} className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black">Sim, resetar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ProfileItem({ icon, title, sub }: any) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 active:bg-gray-50 transition-colors">
      <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">{icon}</div>
      <div className="flex flex-col">
        <span className="text-sm font-black text-gray-900">{title}</span>
        <span className="text-xs text-gray-400">{sub}</span>
      </div>
    </div>
  );
}
