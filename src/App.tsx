import React, { useState, Suspense, lazy, useEffect } from 'react';
import { QuizState, Step } from './types';
import { QUIZ_STEPS } from './constants';
import { 
  IntroStep, 
  QuestionSingle, 
  QuestionImageGrid, 
  InputText, 
  LoadingAnimated,
  LoadingProtocol,
  QuestionBodyInteractive,
  InterstitialSocialProof,
  QuestionGridMultiple,
  QuestionListMultiple,
  InterstitialStats,
  InterstitialMethod,
  InputNumberStepper,
  InterstitialGoalConfirm,
  InterstitialSimple
} from './components/Steps';
import { ChevronLeft } from 'lucide-react';

// Lazy-loaded components for steps 22+
const ResultPage = lazy(() => import('./components/Steps').then(m => ({ default: m.ResultPage })));
const InterstitialHowToUse = lazy(() => import('./components/Steps').then(m => ({ default: m.InterstitialHowToUse })));
const VSLStep = lazy(() => import('./components/Steps').then(m => ({ default: m.VSLStep })));
const InterstitialPresell = lazy(() => import('./components/Steps').then(m => ({ default: m.InterstitialPresell })));
const InterstitialTestimonials = lazy(() => import('./components/Steps').then(m => ({ default: m.InterstitialTestimonials })));
const SalesPage = lazy(() => import('./components/Steps').then(m => ({ default: m.SalesPage })));

const INITIAL_STATE: QuizState = {
  nome: '',
  faixa_etaria: '',
  tipo_corpo: '',
  areas_gordura: [],
  situacao_emocional: '',
  verdade_espelho: '',
  inimigo_emagrecimento: '',
  vitorias_urgentes: [],
  peso_atual: 75,
  altura: 165,
  peso_desejado: 65,
  gestacoes: '',
  rotina_diaria: [],
  horas_sono: '',
  consumo_agua: '',
  corpo_sonho: '',
  compromisso: ''
};

const FLOW = [1, 100, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];

export default function App() {
  const [currentFlowIdx, setCurrentFlowIdx] = useState(0);
  const [state, setState] = useState<QuizState>(INITIAL_STATE);
  const [history, setHistory] = useState<number[]>([]);

  // Programmatic prefetch for late images
  useEffect(() => {
    if (currentFlowIdx < 19) return; // Prefetch starts after step 22 (flowIdx 19)

    const lateImages = [
      'https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/AeD1.webp',
      'https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/AeD2.webp',
      'https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/AeD3.webp',
      'https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/AeD4.webp',
      'https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/ANTESDEPOIS.webp',
      'https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Gelatina-Topo.webp',
      'https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Calendario-Topo.webp',
      'https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Gelatina.webp',
      'https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/GORDA.webp',
      'https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/ANTESDEPOISTOPO.webp',
      'https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Definida.webp',
      'https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Natural.webp',
    ];

    lateImages.forEach(src => {
      if (document.querySelector(`link[href="${src}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }, [currentFlowIdx]);

  const currentStepId = FLOW[currentFlowIdx];
  const baseStep = QUIZ_STEPS.find(s => s.id === currentStepId) || QUIZ_STEPS[0];
  
  // Lógica condicional para Etapas 8 e 9
  const getActiveStep = () => {
    if (baseStep.id === 8) {
      const variant = state.situacao_emocional;
      if (variant === "vergonha") return QUIZ_STEPS.find(s => s.id === "8A") || baseStep;
      if (variant === "saude") return QUIZ_STEPS.find(s => s.id === "8B") || baseStep;
      if (variant === "relac") return QUIZ_STEPS.find(s => s.id === "8C") || baseStep;
      if (variant === "rotina") return QUIZ_STEPS.find(s => s.id === "8D") || baseStep;
    } else if (baseStep.id === 9) {
      const variant = state.situacao_emocional;
      if (variant === "vergonha") return QUIZ_STEPS.find(s => s.id === "9A") || baseStep;
      if (variant === "saude") return QUIZ_STEPS.find(s => s.id === "9B") || baseStep;
      if (variant === "relac") return QUIZ_STEPS.find(s => s.id === "9C") || baseStep;
      if (variant === "rotina") return QUIZ_STEPS.find(s => s.id === "9D") || baseStep;
    }
    return baseStep;
  };

  const currentStep = getActiveStep();

  const handleNext = (data?: Partial<QuizState>) => {
    const eventMap: Record<number | string, string> = {
      1:   'quiz_iniciado',
      100: 'boas_vindas_vista',
      2:   'idade_selecionada',
      3:   'tipo_corpo_selecionado',
      4:   'areas_gordura_selecionadas',
      5:   'social_proof_vista',
      6:   'nome_capturado',
      7:   'dor_selecionada',
      8:   'verdade_selecionada',
      9:   'inimigo_selecionado',
      10:  'vitorias_selecionadas',
      12:  'metodo_visto',
      13:  'peso_atual_definido',
      14:  'altura_definida',
      15:  'peso_definido',
      16:  'meta_confirmada',
      18:  'gestacoes_selecionadas',
      19:  'rotina_selecionada',
      20:  'sono_selecionado',
      21:  'agua_selecionada',
      22:  'resultado_visto',
      23:  'como_usar_visto',
      24:  'compromisso_aceito',
      25:  'loading_completo',
      26:  'vsl1_iniciada',
      27:  'corpo_sonho_selecionado',
      28:  'presell_vista',
      29:  'depoimentos_vistos',
      30:  'vsl2_iniciada',
      31:  'vsl2_concluida',
      32:  'checkout_visto',
    };

    const currentId = FLOW[currentFlowIdx];
    if (eventMap[currentId]) {
      if ((window as any).clarity) {
        (window as any).clarity("event", eventMap[currentId]);
      }
    }

    if (data) {
      setState(prev => ({ ...prev, ...data }));
    }

    // Scroll reset for native feel
    window.scrollTo({ top: 0, behavior: 'instant' });

    setHistory(prev => [...prev, currentFlowIdx]);
    setCurrentFlowIdx(prev => Math.min(prev + 1, FLOW.length - 1));
  };

  const handleBack = () => {
    if (history.length > 0) {
      // Scroll reset for native feel
      window.scrollTo({ top: 0, behavior: 'instant' });

      const prevIdx = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentFlowIdx(prevIdx);
    }
  };

  const renderStep = () => {
    const props = { step: currentStep, state, onNext: handleNext, onBack: handleBack };
    
    switch (currentStep.type) {
      case 'intro': return <IntroStep {...props} />;
      case 'question_single': return <QuestionSingle {...props} />;
      case 'question_image_grid': return <QuestionImageGrid {...props} />;
      case 'question_body_interactive': return <QuestionBodyInteractive {...props} />;
      case 'interstitial_social_proof': return <InterstitialSocialProof {...props} />;
      case 'input_text': return <InputText {...props} />;
      case 'question_grid_multiple': return <QuestionGridMultiple {...props} />;
      case 'question_list_multiple': return <QuestionListMultiple {...props} />;
      case 'interstitial_stats': return <InterstitialStats {...props} />;
      case 'interstitial_method': return <InterstitialMethod {...props} />;
      case 'input_number_stepper': return <InputNumberStepper {...props} />;
      case 'interstitial_goal_confirm': return <InterstitialGoalConfirm {...props} />;
      case 'result_page': return <ResultPage {...props} />;
      case 'interstitial_how_to_use': return <InterstitialHowToUse {...props} />;
      case 'interstitial_simple': return <InterstitialSimple {...props} />;
      case 'loading_animated': return <LoadingAnimated {...props} />;
      case 'loading_protocol': return <LoadingProtocol {...props} />;
      case 'vsl_1': 
      case 'vsl_2': return <VSLStep {...props} />;
      case 'interstitial_presell': return <InterstitialPresell {...props} />;
      case 'interstitial_testimonials': return <InterstitialTestimonials {...props} />;
      case 'sales_page': return <SalesPage {...props} />;
      default: return (
        <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
          <h2 className="text-xl font-bold text-gray-400">Em desenvolvimento: {currentStep.type}</h2>
          <button onClick={() => handleNext()} className="bg-[#E53935] text-white px-6 py-2 rounded-lg">Pular</button>
        </div>
      );
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans">
      <div className="w-full max-w-[480px] bg-white min-h-screen shadow-xl flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
          {currentStep.show_back_button && (
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          )}
          <div className="flex-1 flex justify-center">
             <div className="h-2 w-full max-w-[200px] bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full transition-[width] duration-300 ease-out"
                  style={{ width: `${currentStep.progress_percent || 0}%`, background: currentStep.progress_color || '#E53935' }}
                />
             </div>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div key={currentStep.id}>
            <Suspense fallback={
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-[#E53935] rounded-full animate-spin" />
              </div>
            }>
              {renderStep()}
            </Suspense>
          </div>
        </main>

        {/* Footer info */}
        <footer className="p-4 text-center text-[10px] text-gray-400 border-t border-gray-50">
          © 2026 Gelatina Mounjaro • Todos os direitos reservados
        </footer>
      </div>
    </div>
  );
}
