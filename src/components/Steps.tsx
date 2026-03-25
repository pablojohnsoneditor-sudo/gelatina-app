import React from 'react';
import { QuizState, Step } from '../types';
import { Check, ArrowRight, Lock, ChevronDown, ShieldCheck, CreditCard, Star, X, ArrowDown } from 'lucide-react';

interface StepProps {
  step: Step;
  state: QuizState;
  onNext: (data?: any) => void;
  onBack: () => void;
}

const QUOTES_DEP: Record<string, string[]> = {
  vergonha: [
    "Voltei a me olhar no espelho e sorrir!",
    "Finalmente uso as roupas que ficavam guardadas!",
    "Parei de fugir das fotos — que libertação!",
    "Me sinto bonita de novo, não acredito!"
  ],
  saude: [
    "Minha energia voltou do zero ao máximo!",
    "Não sinto mais aquele cansaço constante!",
    "Voltei a fazer tudo que amava sem dor!",
    "Me sinto 10 anos mais jovem por dentro!"
  ],
  relac: [
    "Voltei a sair e me sentir confiante!",
    "Meu relacionamento melhorou muito!",
    "Não me escondo mais nas fotos em grupo!",
    "Finalmente me sinto bem em qualquer lugar!"
  ],
  rotina: [
    "Resultado real sem mudar minha rotina!",
    "Simples de fazer e funcionou de verdade!",
    "Em 2 minutos por dia — inacreditável!",
    "Finalmente algo que encaixa na minha vida!"
  ]
};

const PERFIS_DEP = [
  {
    nome:   "Giovanna",
    idade:  29,
    cidade: "São Paulo, SP",
    img:    "https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/AeD1.webp"
  },
  {
    nome:   "Sandra",
    idade:  48,
    cidade: "Rio de Janeiro, RJ",
    img:    "https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/AeD2.webp"
  },
  {
    nome:   "Claudia",
    idade:  34,
    cidade: "Belo Horizonte, MG",
    img:    "https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/AeD3.webp"
  },
  {
    nome:   "Patricia",
    idade:  27,
    cidade: "Curitiba, PR",
    img:    "https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/AeD4.webp"
  }
];

const MARCADORES_POS: Record<string, { top: string; left: string } | null> = {
  papada:     { top: "17%", left: "50%" },
  bracos:     { top: "33%", left: "27%" },
  cintura:    { top: "48%", left: "35%" },
  barriga:    { top: "44%", left: "50%" },
  gluteos:    { top: "58%", left: "38%" },
  culotes:    { top: "52%", left: "62%" },
  coxas:      { top: "75%", left: "55%" },
  corpo_todo: null
};

function calcKgDep(meta: number, index: number) {
  const bases = [0.30, 0.35, 0.32, 0.38];
  const kg = Math.round((meta || 10) * bases[index]);
  return Math.min(Math.max(kg, 3), (meta || 10));
}

function getDepoimentos(S: QuizState) {
  const dor  = S.situacao_emocional || "vergonha";
  const meta = (S.peso_atual - S.peso_desejado) || 10;
  const quotes = QUOTES_DEP[dor] || QUOTES_DEP["vergonha"];

  return PERFIS_DEP.map((p, i) => ({
    nome:   p.nome,
    idade:  p.idade,
    cidade: p.cidade,
    img:    p.img,
    kg:     calcKgDep(meta, i),
    quote:  quotes[i]
  }));
}

const HighlightText: React.FC<{ text: string }> = React.memo(({ text }) => {
  if (!text || typeof text !== 'string') return null;
  
  const keywords = [
    'Gelatina Mounjaro', 'fome', 'gordura', 'emagrecimento', 'emagrecer',
    'protocolo', 'ritual', 'método', 'resultado', 'resultados', 'corpo', 'peso', 'meta',
    'GLP-1', 'metabolismo', 'queima', 'queimar', '7 dias', '30 dias'
  ];
  
  // Use lookarounds to ensure whole word matches, including accented characters
  // This prevents breaking words in the middle and ensures correct spacing
  const pattern = new RegExp(`(\\*\\*[^*]+\\*\\*|(?<![a-zA-ZÀ-Ú0-9])(?:${keywords.join('|')})(?![a-zA-ZÀ-Ú0-9])|(?<![a-zA-ZÀ-Ú0-9])[A-ZÀ-Ú]{2,}(?![a-zA-ZÀ-Ú0-9])|\\d+(?:[.,]\\d+)?(?:kg|%)?)`, 'gi');
  
  const parts = text.split(pattern);
  
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        
        // Handle **highlight** syntax
        if (part.startsWith('**') && part.endsWith('**')) {
          const cleanPart = part.slice(2, -2);
          return (
            <span key={i} className="text-primary">{cleanPart}</span>
          );
        }

        const isMatch = keywords.some(k => k.toLowerCase() === part.toLowerCase()) || 
                       /^[A-ZÀ-Ú]{2,}$/.test(part) || 
                       /^\d+(?:[.,]\d+)?(?:kg|%)?$/.test(part);
        if (isMatch) {
          return (
            <span key={i} className="text-primary">{part}</span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
});

export const IntroStep: React.FC<StepProps> = ({ step, onNext }) => (
  <div className="flex flex-col items-center text-center space-y-6">
    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
      <HighlightText text={step.headline} />
    </h1>
    <img src="https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/GM.webp" alt="Hero" style={{ width: 'min(290px, 78vw)', height: 'auto', aspectRatio: '1/1', display: 'block', margin: '0 auto', objectFit: 'contain' }} referrerPolicy="no-referrer" data-img-id="hero" loading="eager" fetchPriority="high" />
    <p className="text-gray-600 text-sm px-4">
      <HighlightText text={step.subtext} />
    </p>
    <button 
      onClick={() => onNext()}
      className="w-full bg-[#E53935] text-white font-bold py-4 rounded-xl shadow-lg hover:scale-105 transition-transform"
    >
      {step.cta_text}
    </button>
    <div className="flex flex-row justify-center space-x-4 text-xs text-gray-500">
      <span>✓ 100% Caseiro</span>
      <span>✓ 115.000+ mulheres</span>
    </div>
  </div>
);

export const InterstitialSimple: React.FC<StepProps> = ({ step, onNext }) => (
  <div className="flex flex-col items-center text-center space-y-6 py-4">
    <img 
      src="https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/GM.webp" 
      alt="Logo" 
      className="mx-auto mb-3"
      style={{ width: '150px', height: 'auto', display: 'block', objectFit: 'contain' }} 
      referrerPolicy="no-referrer" 
      data-img-id="logo" 
      loading="eager" 
      fetchPriority="high" 
    />
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-gray-900 leading-tight">
        <HighlightText text={step.headline} />
      </h2>
      <p className="text-gray-600 text-sm px-4">
        <HighlightText text={step.subtext} />
      </p>
    </div>
    <button 
      onClick={() => onNext()}
      className="w-full bg-[#E53935] text-white font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
    >
      {step.cta_text}
    </button>
  </div>
);

export const QuestionSingle: React.FC<StepProps> = ({ step, state, onNext }) => {
  const questionText = step.question.replace('{nome}', state.nome || 'Amiga');
  const isCompromisso = step.saves_to === 'compromisso';
  
  return (
    <div className="flex flex-col space-y-6">
      {isCompromisso && (
        <>
          <div className="w-full flex justify-center mt-3">
            <img 
              src="https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/ANTESDEPOISTOPO.webp"
              className="w-full h-auto rounded-xl shadow-md"
              alt="Destaque"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex justify-center mt-3 mb-2">
            <span className="px-4 py-2 rounded-full text-white text-sm font-medium bg-[#E53935]">
              🔒 Para liberar seu plano preciso saber!
            </span>
          </div>
        </>
      )}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900">
          <HighlightText text={questionText} />
        </h1>
        {step.subtext && (
          <p className="text-sm text-muted mt-2">
            {step.subtext}
          </p>
        )}
      </div>
      <div className="grid gap-3">
        {step.options.map((opt: any) => (
          <button
            key={opt.value}
            onClick={() => onNext({ [step.saves_to]: opt.value })}
            className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-[#E53935] hover:bg-red-50 transition-all text-left group"
          >
            <span className="text-2xl mr-4">{opt.emoji}</span>
            <div className="flex-1">
              <div className="font-bold text-gray-800">{opt.label}</div>
              {opt.sublabel && <div className="text-xs text-gray-500">{opt.sublabel}</div>}
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#E53935]" />
          </button>
        ))}
      </div>
    </div>
  );
};

export const QuestionImageGrid: React.FC<StepProps> = ({ step, onNext }) => (
  <div className="flex flex-col space-y-6">
    <div className="text-center space-y-2">
      <h2 className="text-xl font-bold text-gray-900">
        <HighlightText text={step.question} />
      </h2>
      {step.subtext && <p className="text-sm text-gray-500"><HighlightText text={step.subtext} /></p>}
    </div>
    <div className="grid grid-cols-2 gap-4">
      {step.options.map((opt: any) => (
        <button
          key={opt.value}
          onClick={() => onNext({ [step.saves_to]: opt.value })}
          className="relative group overflow-hidden rounded-2xl border-2 border-transparent hover:border-[#E53935] transition-all"
        >
          <img src={opt.image} alt={opt.label} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }} referrerPolicy="no-referrer" data-img-id={opt.img_id} loading="lazy" decoding="async" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <span className="text-white font-bold text-sm">{opt.label}</span>
          </div>
        </button>
      ))}
    </div>
  </div>
);

export const InputText: React.FC<StepProps> = ({ step, onNext }) => {
  const [value, setValue] = React.useState('');
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900">
          <HighlightText text={step.question} />
        </h2>
        {step.subtext && <p className="text-sm text-gray-500"><HighlightText text={step.subtext} /></p>}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={step.placeholder}
        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E53935] outline-none transition-all"
      />
      <button
        disabled={!value.trim()}
        onClick={() => onNext({ [step.saves_to]: value })}
        className="w-full bg-[#E53935] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
      >
        Continuar
      </button>
    </div>
  );
};

export const LoadingProtocol: React.FC<StepProps> = ({ step, state, onNext }) => {
  const [progress, setProgress] = React.useState(0);
  const [currentStepIdx, setCurrentStepIdx] = React.useState(0);
  const headline = step.headline.replace('{nome}', state.nome || 'Amiga');
  const hasCalledNext = React.useRef(false);

  React.useEffect(() => {
    const duration = 5000; // 5 seconds
    const intervalTime = 50;
    const increment = 100 / (duration / intervalTime);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          if (!hasCalledNext.current) {
            hasCalledNext.current = true;
            setTimeout(() => onNext(), 800);
          }
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onNext]);

  React.useEffect(() => {
    const stepCount = step.steps?.length || 0;
    if (stepCount === 0) return;

    const stepInterval = setInterval(() => {
      setCurrentStepIdx(prev => (prev < stepCount - 1 ? prev + 1 : prev));
    }, 4500 / stepCount);

    return () => clearInterval(stepInterval);
  }, [step.steps]);

  return (
    <div className="flex flex-col items-center space-y-8 py-4">
      {/* 1. Banner no topo */}
      <div className="w-full bg-green-50 border-2 border-green-500 rounded-2xl p-4 text-center shadow-sm">
        <h2 className="text-lg font-bold text-green-700 leading-tight">
          <HighlightText text={headline} />
        </h2>
      </div>

      {/* 2. Ícone central */}
      <div className="relative">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center animate-bounce">
          <ArrowDown className="w-10 h-10 text-[#E53935]" />
        </div>
        <div className="absolute -inset-2 border-2 border-dashed border-red-200 rounded-full animate-spin-slow" />
      </div>

      {/* 3. Lista de etapas (checklist) */}
      <div className="w-full space-y-3 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        {step.steps?.map((s: any, idx: number) => (
          <div key={idx} className="flex items-center space-x-3 transition-all duration-500">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors duration-300 ${idx < currentStepIdx ? 'bg-green-500 text-white' : idx === currentStepIdx ? 'bg-yellow-100 text-yellow-600 animate-pulse' : 'bg-gray-100 text-gray-300'}`}>
              {idx < currentStepIdx ? <Check className="w-4 h-4" /> : idx === currentStepIdx ? '⏳' : '○'}
            </div>
            <span className={`text-sm ${idx < currentStepIdx ? 'text-gray-900 font-medium' : idx === currentStepIdx ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* 4. BARRA DE PROGRESSO */}
      <div className="w-full space-y-2">
        <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <span>Processando Protocolo</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200 p-1">
          <div 
            className="h-full bg-gradient-to-r from-[#E53935] to-[#ff6b6b] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 5. TEXTO FINAL */}
      <div className="text-center">
        <p className="text-sm text-gray-500 animate-pulse italic">
          Aguarde enquanto finalizamos tudo para você...
        </p>
      </div>
    </div>
  );
};

export const LoadingAnimated: React.FC<StepProps> = ({ step, state, onNext }) => {
  const [progress, setProgress] = React.useState(0);
  const [currentStepIdx, setCurrentStepIdx] = React.useState(0);
  const headline = step.headline.replace('{nome}', state.nome || 'Amiga');

  const hasCalledNext = React.useRef(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          if (!hasCalledNext.current) {
            hasCalledNext.current = true;
            setTimeout(() => onNext(), 500);
          }
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onNext]);

  React.useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIdx(prev => (prev < step.steps.length - 1 ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(stepInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-10">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-100"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={440}
            strokeDashoffset={440 - (440 * progress) / 100}
            className="text-[#E53935] transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-[#E53935]">{progress}%</span>
        </div>
      </div>
      <div className="text-center space-y-4 w-full">
        <h2 className="text-xl font-bold text-gray-900">
          <HighlightText text={headline} />
        </h2>
        <div className="space-y-3">
          {step.steps.map((s: any, idx: number) => (
            <div key={idx} className="flex items-center space-x-3 text-sm">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${idx <= currentStepIdx ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {idx < currentStepIdx ? <Check className="w-4 h-4" /> : idx === currentStepIdx ? '●' : ''}
              </div>
              <span className={idx === currentStepIdx ? 'font-bold text-gray-900' : 'text-gray-500'}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const QuestionBodyInteractive: React.FC<StepProps> = ({ step, onNext }) => {
  const [selected, setSelected] = React.useState<string[]>([]);
  
  function togArea(v: string) {
    setSelected(prev => {
      if (prev.includes(v)) {
        return prev.filter(item => item !== v);
      } else {
        return [...prev, v];
      }
    });
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900"><HighlightText text={step.question} /></h2>
        <p className="text-sm text-gray-500"><HighlightText text={step.subtext} /></p>
      </div>
      <div 
        id="body-wrap"
        style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '320px', margin: '0 auto' }}
        className="bg-gray-100 rounded-[12px] overflow-hidden flex items-center justify-center"
      >
        <img 
          src="https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/CORPO%20TODO.webp" 
          alt="Body" 
          style={{ width: '100%', height: 'auto', aspectRatio: 'auto', display: 'block', objectFit: 'contain' }}
          className="rounded-[12px]" 
          referrerPolicy="no-referrer"
          data-img-id="antes_depois_cartoon"
          loading="lazy"
          decoding="async"
        />
        
        {/* Marcadores Dinâmicos baseados no estado 'selected' */}
        <div className="absolute inset-0 pointer-events-none">
          {selected.map(v => {
            const pos = MARCADORES_POS[v];
            if (!pos) return null;
            return (
              <div 
                key={`mc_${v}`}
                className="marcador"
                style={{
                  position: 'absolute',
                  top: pos.top,
                  left: pos.left,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
              />
            );
          })}
          
          {/* Caso especial: Corpo Todo */}
          {selected.includes('corpo_todo') && Object.entries(MARCADORES_POS).map(([key, pos]) => {
            if (key === 'corpo_todo' || !pos) return null;
            return (
              <div 
                key={`mc_all_${key}`}
                className="marcador"
                style={{
                  position: 'absolute',
                  top: pos.top,
                  left: pos.left,
                  transform: 'translate(-50%, -50%)',
                  opacity: 0.9,
                  width: '22px',
                  height: '22px',
                  zIndex: 9
                }}
              />
            );
          })}
        </div>

        <div className="absolute inset-0">
          {step.options.map((opt: any) => (
            <button
              key={opt.value}
              onClick={() => togArea(opt.value)}
              style={opt.position || {}}
              className={`absolute px-3 py-1.5 rounded-full text-[10px] font-bold transition-all shadow-md whitespace-nowrap hover:scale-105 active:scale-95 ${
                selected.includes(opt.value) 
                  ? 'bg-green-500 text-white border-green-500 scale-110 hover:scale-115 sel' 
                  : 'bg-white text-gray-800 border border-gray-200 hover:border-green-300'
              } ${!opt.position ? 'relative m-1' : ''}`}
            >
              {selected.includes(opt.value) && '✓ '}
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      
      {selected.length > 0 && (
        <div className="text-center text-green-600 text-xs font-bold animate-pulse">
          Regiões selecionadas com sucesso!
        </div>
      )}

      <button
        disabled={selected.length === 0}
        onClick={() => onNext({ [step.saves_to]: selected })}
        className="w-full bg-[#E53935] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:hover:scale-100"
      >
        Continuar
      </button>
    </div>
  );
};

export const InterstitialSocialProof: React.FC<StepProps> = ({ step, onNext }) => (
  <div className="flex flex-col space-y-6">
    <div className="text-center space-y-2">
      <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider">
        <HighlightText text={step.headline} />
      </h2>
      <p className="text-sm text-gray-500">
        <HighlightText text={step.subtext} />
      </p>
    </div>
    
    <div style={{ width: '100%' }}>
      <img
        src={step.article.image}
        alt="News"
        style={{ width: '100%', height: 'auto', display: 'block' }}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        data-img-id={step.article.img_id}
      />
    </div>

    <button
      onClick={() => onNext()}
      className="w-full bg-[#E53935] text-white font-bold py-4 rounded-xl shadow-lg transition-all"
    >
      Continuar
    </button>
  </div>
);

export const QuestionGridMultiple: React.FC<StepProps> = ({ step, onNext }) => {
  const [selected, setSelected] = React.useState<string[]>([]);
  
  const toggle = (val: string) => {
    setSelected(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-lg font-bold text-gray-900">{step.question}</h2>
        <p className="text-xs text-gray-500">{step.subtext}</p>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {step.options.map((opt: any) => (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all aspect-[1/0.75] hover:scale-[1.02] hover:shadow-md active:scale-[0.98] ${
              selected.includes(opt.value) 
                ? 'border-[#E53935] bg-red-50' 
                : 'border-gray-100 bg-white hover:border-red-200'
            }`}
          >
            <span className="text-3xl mb-1">{opt.emoji}</span>
            <span className="text-xs font-bold text-center text-gray-800 leading-tight">{opt.label}</span>
          </button>
        ))}
      </div>
      <button
        disabled={selected.length === 0}
        onClick={() => onNext({ [step.saves_to]: selected })}
        className="w-full bg-[#E53935] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:hover:scale-100"
      >
        Continuar
      </button>
    </div>
  );
};

export const QuestionListMultiple: React.FC<StepProps> = ({ step, state, onNext }) => {
  const [selected, setSelected] = React.useState<string[]>([]);
  const questionText = step.question.replace('{nome}', state.nome || 'Amiga');

  const toggle = (val: string) => {
    setSelected(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900">
          <HighlightText text={questionText} />
        </h1>
        {step.subtext && (
          <p className="text-sm text-muted mt-2">
            {step.subtext}
          </p>
        )}
      </div>
      <div className="grid gap-3">
        {step.options.map((opt: any) => (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={`flex items-center p-4 rounded-xl border-2 transition-all text-left group ${
              selected.includes(opt.value) 
                ? 'border-[#E53935] bg-red-50' 
                : 'border-gray-200 bg-white hover:border-red-200'
            }`}
          >
            <span className="text-2xl mr-4">{opt.emoji}</span>
            <div className="flex-1">
              <div className="font-bold text-gray-800">{opt.label}</div>
              {opt.sublabel && <div className="text-xs text-gray-500">{opt.sublabel}</div>}
            </div>
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
              selected.includes(opt.value)
                ? 'bg-[#E53935] border-[#E53935]'
                : 'border-gray-300 bg-white'
            }`}>
              {selected.includes(opt.value) && <Check className="w-4 h-4 text-white" />}
            </div>
          </button>
        ))}
      </div>
      <button
        disabled={selected.length === 0}
        onClick={() => onNext({ [step.saves_to]: selected })}
        className="w-full bg-[#E53935] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
      >
        Continuar
      </button>
    </div>
  );
};

export const InterstitialStats: React.FC<StepProps> = ({ step, onNext }) => {
  const [animated, setAnimated] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          <HighlightText text={step.headline} />
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          <HighlightText text={step.subtext} />
        </p>
      </div>
      <div className="space-y-6">
        {step.stats.map((stat: any, idx: number) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-gray-700 uppercase">{stat.label}</span>
              <span className="text-xl font-black" style={{ color: stat.color }}>{stat.value}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: animated ? `${stat.value}%` : '0%',
                  backgroundColor: stat.color,
                  transition: `width 1s ease-out ${idx * 0.2}s`
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => onNext()}
        className="w-full bg-[#E53935] text-white font-bold py-4 rounded-xl shadow-lg transition-all"
      >
        Quero conquistar meus objetivos
      </button>
    </div>
  );
};

export const InterstitialMethod: React.FC<StepProps> = ({ step, state, onNext }) => {
  const nome = state.nome || 'Amiga';
  
  const stepImages = [
    "https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Antes.webp",
    "https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Gelatina.webp",
    "https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Queima-natural-ativada.webp",
    "https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Corpo-dos-sonhos.webp"
  ];

  return (
    <div className="flex flex-col space-y-3 py-2">
      {/* 1) Título */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
          Ótimo, <span className="text-[#E53935]">{nome}</span>! Veja como funciona 🎉
        </h2>
        
        {/* 2) Descrição */}
        <p className="text-sm text-gray-500 px-4 font-medium">
          A <span className="text-[#E53935] font-bold">Gelatina Mounjaro</span> ativa a <span className="text-[#E53935] font-bold">queima de gordura</span> natural com ingredientes caseiros
        </p>
      </div>

      {/* 3) Seção de benefícios */}
      <div className="bg-gray-100 p-4 rounded-2xl flex justify-between items-center border border-gray-200 h-12">
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-700">
          <div className="bg-green-100 p-1 rounded-full text-green-600"><Check className="w-3.5 h-3.5" /></div>
          <span>Fácil</span>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-700">
          <div className="bg-green-100 p-1 rounded-full text-green-600"><Check className="w-3.5 h-3.5" /></div>
          <span>2x ao dia</span>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-700">
          <div className="bg-green-100 p-1 rounded-full text-green-600"><Check className="w-3.5 h-3.5" /></div>
          <span>100% natural</span>
        </div>
      </div>

      {/* 4) Fluxo visual de etapas */}
      <div className="flex flex-col items-center space-y-1">
        {step.timeline.map((item: any, idx: number) => (
          <React.Fragment key={idx}>
            <div className={`w-full flex items-center p-4 rounded-2xl border transition-all h-20 shadow-sm ${
              item.highlight 
                ? 'bg-green-50 border-green-300 ring-1 ring-green-200' 
                : 'bg-white border-gray-100'
            }`}>
              <div className="relative flex-shrink-0 mr-4">
                <img 
                  src={stepImages[idx]} 
                  alt={item.title}
                  className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {idx + 1}
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className={`font-bold text-sm leading-none mb-1.5 ${item.highlight ? 'text-green-700' : 'text-gray-900'}`}>
                  {item.title}
                </div>
                <div className="text-xs text-gray-600 leading-tight font-medium">
                  {item.desc}
                </div>
              </div>
            </div>
            
            {/* Indicador visual (seta) */}
            {idx < step.timeline.length - 1 && (
              <div className="flex justify-center w-full py-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Caixa Vermelha (IMPORTANTE) */}
      <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-center shadow-sm">
        <p className="text-xs text-red-900 font-bold leading-relaxed">
          💡 Receita caseira que ativa o <span className="font-black">GLP-1</span>, o mesmo hormônio do Mounjaro, de forma 100% natural!
        </p>
      </div>

      {/* 6) CTA (botão) */}
      <button
        onClick={() => onNext()}
        className="w-full bg-gradient-to-r from-[#E53935] to-[#FF5252] text-white font-bold py-4 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 mt-2"
      >
        <span className="text-base">Entendi! Continuar 🚀</span>
      </button>
    </div>
  );
};

export const InputNumberStepper: React.FC<StepProps> = ({ step, state, onNext }) => {
  const [value, setValue] = React.useState(step.default_value);
  
  const adjust = (delta: number) => {
    setValue(prev => Math.max(1, prev + delta));
  };

  const meta = state.peso_atual - value;

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900">{step.question}</h2>
        <p className="text-sm text-gray-500">{step.subtext}</p>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex flex-col items-center">
          <div className="text-6xl font-black text-[#E53935] flex items-baseline">
            {value}
            <span className="text-xl ml-1 text-gray-400 font-bold">{step.unit}</span>
          </div>
          
          {step.saves_to === 'peso_desejado' && meta > 0 && (
            <div className="mt-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center shadow-sm border border-green-200">
              Meta: perder {meta} kg 🎯
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <button onClick={() => adjust(-5)} className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200">-5</button>
          <button onClick={() => adjust(-1)} className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200">-</button>
          <button onClick={() => adjust(1)} className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200">+</button>
          <button onClick={() => adjust(5)} className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200">+5</button>
        </div>
      </div>
      <button
        onClick={() => onNext({ [step.saves_to]: value })}
        className="w-full bg-[#E53935] text-white font-bold py-4 rounded-xl shadow-lg transition-all"
      >
        Continuar
      </button>
    </div>
  );
};

export const InterstitialGoalConfirm: React.FC<StepProps> = ({ step, state, onNext }) => {
  const headline = step.headline.replace('{nome}', state.nome || 'Amiga');
  const meta = state.peso_atual - state.peso_desejado;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      <img 
        src="https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Gelatina-Topo.webp" 
        className="w-full h-auto object-contain rounded-2xl shadow-md mb-4" 
        alt="Meta e Objetivo"
        referrerPolicy="no-referrer"
      />
      
      <div className="w-full bg-red-50 p-6 rounded-3xl border border-red-100 text-center space-y-4">
        <h2 className="text-xl font-bold text-red-900">
          <HighlightText text={headline} />
        </h2>
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <div className="text-xs text-gray-500 uppercase font-bold">Atual</div>
            <div className="text-2xl font-black text-gray-900">{state.peso_atual}kg</div>
          </div>
          <ArrowRight className="w-6 h-6 text-red-400" />
          <div className="text-center">
            <div className="text-xs text-gray-500 uppercase font-bold">Meta</div>
            <div className="text-2xl font-black text-[#E53935]">{state.peso_desejado}kg</div>
          </div>
        </div>
        <div className="bg-white py-2 px-4 rounded-full inline-block text-sm font-bold text-[#E53935] shadow-sm">
          🎯 Meta: perder {meta}kg
        </div>
      </div>
      <p className="text-sm text-gray-600 text-center leading-relaxed">
        <HighlightText text={step.motivational_text} />
      </p>
      <button
        onClick={() => onNext()}
        className="w-full bg-[#E53935] text-white font-bold py-4 rounded-xl shadow-lg transition-all"
      >
        Ok, Vamos lá! 🚀
      </button>
    </div>
  );
};

export const ResultPage: React.FC<StepProps> = ({ step, state, onNext }) => {
  const imc = (state.peso_atual / Math.pow(state.altura / 100, 2)).toFixed(1);
  const imcValue = parseFloat(imc);
  
  let imcCategory = "Normal";
  if (imcValue < 18.5) imcCategory = "Abaixo do peso";
  else if (imcValue < 25) imcCategory = "Normal";
  else if (imcValue < 30) imcCategory = "Sobrepeso";
  else if (imcValue < 35) imcCategory = "Obesidade Grau I";
  else if (imcValue < 40) imcCategory = "Obesidade Grau II";
  else imcCategory = "Obesidade Grau III";

  return (
    <div className="flex flex-col space-y-3">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          Resultado da sua <span className="text-primary">análise</span>, <span className="text-primary">{state.nome || 'Amiga'}</span>
        </h1>
      </div>

      {/* Card Principal IMC + Alertas */}
      <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm">
        <div className="flex flex-col items-center mb-2">
          <span className="text-5xl font-black text-primary mb-1">{imc}</span>
          <span className="text-lg font-bold text-gray-700">Seu IMC: {imcCategory}</span>
        </div>
        
        <div className="border-t border-gray-50 pt-3">
          <p className="text-xs font-bold text-gray-400 mb-2 tracking-wider">⚠️ Sinais de alerta identificados</p>
          <div className="grid grid-cols-1 gap-1.5">
            <div className="flex items-center text-sm text-red-600 font-medium bg-red-50/50 py-1.5 px-2 rounded-xl">
              <X className="w-4 h-4 mr-2 text-red-500" /> Metabolismo desacelerado
            </div>
            <div className="flex items-center text-sm text-red-600 font-medium bg-red-50/50 py-1.5 px-2 rounded-xl">
              <X className="w-4 h-4 mr-2 text-red-500" /> Risco de gordura visceral
            </div>
            <div className="flex items-center text-sm text-red-600 font-medium bg-red-50/50 py-1.5 px-2 rounded-xl">
              <X className="w-4 h-4 mr-2 text-red-500" /> Hormônios desregulados
            </div>
          </div>
        </div>
      </div>

      {/* Caixa Verde Solução */}
      <div className="bg-green-50 border border-green-100 p-2.5 rounded-2xl">
        <p className="text-sm text-green-800 font-medium text-center">
          O segredo para secar: ativar o GLP-1 com o protocolo da Gelatina Mounjaro!
        </p>
      </div>

      {/* Benefícios Compactos */}
      <div className="grid grid-cols-1 gap-1.5">
        <p className="mt-2 font-semibold">
          Benefícios da Gelatina Mounjaro👇
        </p>
        {step.benefits?.map((benefit: any, idx: number) => (
          <div key={idx} className="flex items-center py-1.5 px-3 bg-green-50/30 rounded-xl border border-green-50">
            <Check className="w-4 h-4 text-green-500 mr-3 shrink-0" />
            <span className="text-sm text-gray-700 font-medium">{benefit.text}</span>
          </div>
        ))}
      </div>

      {/* Prova Social */}
      <div className="bg-gray-50 rounded-3xl p-3 border border-gray-100">
        <div className="mb-2">
          <img 
            src="https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/ANTESDEPOIS.webp" 
            alt="Resultado" 
            className="w-full h-auto object-cover rounded-xl border-2 border-white shadow-sm"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-900">"Perdi 12kg em 5 semanas!"</p>
          <p className="text-xs text-gray-500 mb-1">Maria, 32 anos - São Paulo</p>
          <div className="flex justify-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-1">
        <button
          onClick={() => onNext()}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-[0.98]"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export const InterstitialHowToUse: React.FC<StepProps> = ({ step, onNext }) => (
  <div className="flex flex-col space-y-8">
    <div className="text-center space-y-2">
      <h2 className="text-2xl font-bold text-gray-900">
        <HighlightText text={step.headline} />
      </h2>
      <p className="text-sm text-gray-500"><HighlightText text="Simples, pratico e eficaz" /></p>
    </div>
    <div className="w-full max-w-md mx-auto mt-4 mb-4">
      <img 
        src="https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Calendario-Topo.webp"
        className="w-full h-auto object-contain rounded-xl shadow-md"
        alt="Como Usar a Gelatina"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="space-y-4">
      {step.instructions.map((item: any, idx: number) => (
        <div key={idx} className="flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="text-3xl mr-4">{item.emoji}</div>
          <div>
            <div className="font-bold text-gray-900"><HighlightText text={item.title} /></div>
            <div className="text-xs text-gray-500"><HighlightText text={item.subtitle} /></div>
          </div>
        </div>
      ))}
    </div>
    <div className="flex items-center justify-between">
      <div className="flex-1 bg-blue-50 p-3 rounded-xl text-center">
        <div className="text-xl">🌅</div>
        <div className="text-[10px] font-bold text-blue-800 uppercase">Manhã</div>
      </div>
      <span className="mx-1 text-gray-400">→</span>
      <div className="flex-1 bg-yellow-50 p-3 rounded-xl text-center">
        <div className="text-xl">☀️</div>
        <div className="text-[10px] font-bold text-yellow-800 uppercase">Dia</div>
      </div>
      <span className="mx-1 text-gray-400">→</span>
      <div className="flex-1 bg-red-50 p-3 rounded-xl text-center">
        <div className="text-xl">🌙</div>
        <div className="text-[10px] font-bold text-red-800 uppercase">Noite</div>
      </div>
    </div>
    <button
      onClick={() => onNext()}
      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
    >
      ✅ Sim, eu me comprometo!
    </button>
  </div>
);

export const VSLStep: React.FC<StepProps> = ({ step, onNext }) => {
  const isVSL1 = step.type === 'vsl_1';
  const playerId = isVSL1 ? '69be3871137969468e791820' : '69be390f237e0fc6aebdccf2';
  const [showButton, setShowButton] = React.useState(false);

  // Timer automático de 75 segundos ao carregar a página
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 75000); // 1 minuto e 15 segundos

    return () => clearTimeout(timer);
  }, []);

  const vtubrHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; overflow: hidden; }
        vturb-smartplayer { display: block; width: 100%; }
      </style>
    </head>
    <body>
      <vturb-smartplayer id="vid-${playerId}" style="display:block;width:100%;"></vturb-smartplayer>
      <script type="text/javascript">
        var s = document.createElement("script");
        s.src = "https://scripts.converteai.net/936a89ee-2ce4-4007-a60f-9d25da087ec8/players/${playerId}/v4/player.js";
        s.async = true;
        document.head.appendChild(s);
      </script>
    </body>
    </html>
  `;

  return (
    <div className="flex flex-col items-center">
      {/* 1. Título */}
      <h1 className="text-center text-xl font-semibold leading-relaxed px-2 text-gray-900 mb-3">
        Assista essa <span className="text-[#E53935] font-bold">explicação rápida</span> de <span className="text-[#E53935] font-bold">1 minuto</span> e <span className="italic">descubra</span> por que esse método está chamando tanta atenção 👀
      </h1>

      {/* 2. Vídeo centralizado */}
      <div className="w-full max-w-[320px] rounded-xl overflow-hidden aspect-[9/16] bg-black shadow-xl mb-6">
        <iframe
          srcDoc={vtubrHTML}
          className="w-full h-full border-none block"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>

      {/* 3. Botão (Aparece após 75s) */}
      <div className="w-full min-h-[80px] flex items-center justify-center">
        {showButton && (
          <button
            onClick={() => {
              if ((window as any).clarity) {
                (window as any).clarity("event", isVSL1 ? "vsl1_concluida" : "vsl2_concluida");
              }
              onNext();
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all animate-bounce"
          >
            {isVSL1 ? 'Entendi, quero continuar! 😄' : 'Pegar meu Plano!'}
          </button>
        )}
      </div>
    </div>
  );
};

export const InterstitialPresell: React.FC<StepProps> = ({ step, state, onNext }) => {
  const meta = state.peso_atual - state.peso_desejado;
  const headline = step.headline.replace('{min}', `${meta - 2}`).replace('{max}', `${meta + 3}`);

  return (
    <div className="flex flex-col items-center space-y-8 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-4xl">🎯</div>
      <h2 className="text-2xl font-bold text-gray-900">
        <HighlightText text={headline} />
      </h2>
      <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
        <p className="text-sm text-red-800">
          <HighlightText text="Baseado no seu perfil, esse resultado e totalmente alcancavel com a Gelatina Mounjaro!" />
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 w-full">
        <div className="space-y-1">
          <div className="text-xl font-black text-[#E53935]">97%</div>
          <div className="text-[10px] text-gray-400 uppercase font-bold">Sucesso</div>
        </div>
        <div className="space-y-1">
          <div className="text-xl font-black text-green-500">30</div>
          <div className="text-[10px] text-gray-400 uppercase font-bold">Dias</div>
        </div>
        <div className="space-y-1">
          <div className="text-xl font-black text-[#E53935]">12kg</div>
          <div className="text-[10px] text-gray-400 uppercase font-bold">Máximo</div>
        </div>
      </div>
      <button
        onClick={() => onNext()}
        className="w-full bg-[#E53935] text-white font-bold py-4 rounded-xl shadow-lg transition-all"
      >
        Sim, quero perder peso!
      </button>
    </div>
  );
};

export const InterstitialTestimonials: React.FC<StepProps> = ({ step, state, onNext }) => {
  const deps = getDepoimentos(state);

  return (
    <div className="flex flex-col space-y-8 pb-24">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          <HighlightText text={step.headline} />
        </h2>
        <p className="text-sm text-gray-500"><HighlightText text="Veja quem ja transformou o corpo" /></p>
      </div>

      <div className="space-y-10">
        {deps.map((d, i) => (
          <div key={i} style={{
            background:'#fff',
            border:'1.5px solid #E5E7EB',
            borderRadius:'12px',
            overflow:'hidden',
            marginBottom:'16px',
            position:'relative',
          }}>

            {/* Badge kg — DINÂMICO */}
            <div style={{
              position:'absolute',
              top:'10px',
              right:'10px',
              background:'#16A34A',
              color:'#fff',
              fontSize:'12px',
              fontWeight:'800',
              padding:'3px 10px',
              borderRadius:'99px',
              zIndex:2,
            }}>-{d.kg}kg</div>

            {/* Imagem ÚNICA antes+depois — FIXA */}
            <img
              src={d.img}
              alt={`Antes e depois ${d.nome}`}
              style={{
                width: '100%',
                aspectRatio: '1/1',
                objectFit: 'cover',
                display: 'block'
              }}
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
            />

            {/* Informações — DINÂMICAS */}
            <div style={{padding:'12px 14px'}}>

              <div style={{
                color:'#E53935',
                fontSize:'15px',
                fontWeight:'800',
                marginBottom:'2px',
              }}>{d.nome}, {d.idade}</div>

              <div style={{
                color:'#6B7280',
                fontSize:'12px',
                fontWeight:'700',
                marginBottom:'6px',
              }}>{d.cidade}</div>

              <div style={{
                color:'#F59E0B',
                fontSize:'14px',
                marginBottom:'8px',
              }}>⭐⭐⭐⭐⭐</div>

              <div style={{
                fontSize:'14px',
                fontWeight:'700',
                fontStyle:'italic',
                color:'#1F2937',
                borderLeft:'3px solid #E53935',
                paddingLeft:'10px',
                lineHeight:'1.5',
              }}>"{d.quote}"</div>

            </div>
          </div>
        ))}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-50 flex justify-center">
        <div className="w-full max-w-[448px]">
          <button
            onClick={() => onNext()}
            className="w-full bg-[#E53935] text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:scale-105"
          >
            Pegar meu protocolo
          </button>
        </div>
      </div>
    </div>
  );
};

export const SalesPage: React.FC<StepProps> = ({ step, state }) => {
  const headline = step.headline.replace('{nome}', state.nome || 'Amiga');
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [timeLeft, setTimeLeft] = React.useState(600); // 10 minutes in seconds

  const scrollToCheckout = () => {
    const element = document.getElementById('checkout-section');
    if (element) {
      const offset = 20; // Pequeno offset para alinhamento perfeito
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    if (window.location.hash === '#checkout-section') {
      setTimeout(scrollToCheckout, 500);
    }
  }, []);

  const handleCompra = () => {
    if ((window as any).clarity) (window as any).clarity("event", "compra_clicada");
    window.open('https://checkout.payt.com.br/9d5868b5cd899ff9dfe300d97f116963', '_blank');
  };

  React.useEffect(() => {
    if (timeLeft <= 0) {
      setTimeLeft(600); // Reset timer when it expires
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const faq = [
    { q: "A Gelatina Mounjaro realmente funciona?", a: "Sim! O protocolo foi desenvolvido para ativar o hormônio GLP-1 naturalmente, o mesmo princípio de medicamentos famosos, mas de forma 100% natural e segura." },
    { q: "Quanto tempo leva para ver resultados?", a: "Muitas usuárias relatam desinchaço nos primeiros 3 a 5 dias. A perda de peso significativa ocorre entre a 2ª e 4ª semana seguindo o passo a passo." },
    { q: "É seguro? Tem efeitos colaterais?", a: "Totalmente seguro. Por ser baseado em ingredientes naturais e alimentos comuns, não possui os efeitos colaterais de medicamentos sintéticos." },
    { q: "Como vou receber o protocolo?", a: "Imediatamente após a confirmação do pagamento, você receberá um e-mail com seus dados de acesso ao nosso aplicativo exclusivo." },
    { q: "E se não funcionar para mim?", a: "Oferecemos 30 dias de garantia incondicional. Se você não ver resultados ou não gostar do método, devolvemos seu dinheiro." },
    { q: "O pagamento é seguro?", a: "Sim, utilizamos a mesma tecnologia de segurança dos grandes bancos (SSL). Seus dados estão 100% protegidos." },
    { q: "Preciso comprar ingredientes caros?", a: "Não! Todos os ingredientes são encontrados facilmente em qualquer supermercado e são muito acessíveis." }
  ];

  return (
    <div className="flex flex-col space-y-8 pb-20">
      <div className={`p-3 rounded-xl flex items-center justify-center space-x-2 text-xs font-bold transition-colors ${timeLeft < 60 ? 'bg-red-600 text-white animate-pulse' : 'bg-red-50 text-red-600'}`}>
        <span>⏰ Seu protocolo expira em: {formatTime(timeLeft)}</span>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
          Plano da Gelatina de <span className="text-[#E53935]">30 dias</span> foi <span className="underline decoration-[#E53935] decoration-2 underline-offset-4">Gerado com Sucesso!</span>
        </h2>
        <p className="text-sm text-gray-600 font-medium italic">
          "Ele é exclusivo e gerado uma única vez, não saia desta página para não perdê-lo"
        </p>
      </div>

      {/* 1. CARTOON ANTES/DEPOIS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative rounded-2xl overflow-hidden shadow-md border border-gray-100">
          <img 
            src="https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/GORDA.webp" 
            alt="Antes" 
            style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }} 
            referrerPolicy="no-referrer" 
            data-img-id="antes_depois_cartoon" 
            loading="lazy"
            decoding="async"
          />
          <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            Antes 🖼️
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden shadow-md border-2 border-green-500">
          <img 
            src="https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Natural.webp" 
            alt="Depois" 
            style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }} 
            referrerPolicy="no-referrer" 
            data-img-id="antes_depois_cartoon" 
            loading="lazy"
            decoding="async"
          />
          <div className="absolute top-2 left-2 bg-[#16A34A] text-white text-[10px] font-bold px-2 py-1 rounded-full">
            Depois ⭐
          </div>
        </div>
      </div>

      {/* 2. ANTECIPAÇÃO DE RESULTADOS */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold text-[#E53935] uppercase tracking-widest">Seu Plano Exclusivo</span>
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            Protocolo de 30 dias personalizado 🎯
          </h3>
        </div>
        
        <p className="text-sm text-gray-600 text-center font-medium">
          Seguindo o protocolo certinho, veja o que vai acontecer:
        </p>

        <div className="space-y-3">
          {[
            { s: "SEMANA 1 🌿", d: "Desinche e primeiros resultados", h: false },
            { s: "SEMANA 2 🔥", d: "Perda de até 3 kg", h: false },
            { s: "SEMANA 3 ⚡", d: "Perda de 5 a 7 kg", h: false },
            { s: "SEMANA 4 🏆", d: "Perda de 9 a 12 kg", h: true }
          ].map((item, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${item.h ? 'bg-red-50 border border-red-100' : 'bg-gray-50'}`}>
              <div className="flex flex-col">
                <span className={`text-[10px] font-black uppercase ${item.h ? 'text-[#E53935]' : 'text-gray-400'}`}>{item.s}</span>
                <span className="text-sm font-bold text-gray-800">{item.d}</span>
              </div>
              {item.h && <span className="bg-[#16A34A] text-white text-[10px] font-black px-2 py-1 rounded-md">META</span>}
            </div>
          ))}
        </div>
        <div className="text-center pt-3 border-t border-gray-100">
          <span className="text-sm font-black text-[#16A34A]">Resultado esperado: -9 a 12 kg em 30 dias</span>
        </div>
      </div>

      <button 
        onClick={scrollToCheckout}
        className="w-full bg-[#16A34A] hover:bg-green-700 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 text-xl"
      >
        Quero Garantir!
      </button>

      <div id="checkout-section" className="bg-white border-2 border-[#E53935] rounded-3xl overflow-hidden shadow-xl">
        <div className="bg-[#E53935] text-white text-center py-2 text-xs font-bold uppercase tracking-widest">
          Seu Plano Exclusivo
        </div>
        <div className="p-6 space-y-6">
          <div className="text-center space-y-1">
            <div className="text-lg font-bold text-gray-800 leading-tight">
              <span className="text-[#E53935]">Gelatina Mounjaro</span> <span className="text-gray-600">+ APP Protocolo Completo</span>
            </div>
            <div className="text-xs text-gray-400 uppercase font-bold tracking-widest">ACESSO VITALÍCIO</div>
          </div>
          <img 
            src="https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Gelatina.webp" 
            alt="Product" 
            style={{ width: '100%', maxWidth: '280px', height: 'auto', aspectRatio: '1/1', display: 'block', margin: '12px auto', objectFit: 'contain' }} 
            referrerPolicy="no-referrer" 
            data-img-id="produto_geleia" 
            loading="lazy"
            decoding="async"
          />
          
          {/* 3. LISTA COMPLETA DE INCLUDES */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-700 font-medium"><span className="inc-i text-green-600">✔</span> <span>Receita completa da Gelatina Mounjaro</span></div>
            <div className="flex items-center text-sm text-gray-700 font-medium"><span className="inc-i text-green-600">✔</span> <span>Protocolo de 30 dias passo a passo</span></div>
            <div className="flex items-center text-sm text-gray-700 font-medium"><span className="inc-i text-green-600">✔</span> <span>Acesso ao Aplicativo Exclusivo</span></div>
            <div className="flex items-center text-sm text-gray-700 font-medium"><span className="inc-i text-green-600">✔</span> <span>Lista completa dos ingredientes</span></div>
            <div className="flex items-center text-sm text-gray-700 font-medium"><span className="inc-i text-green-600">✔</span> <span>Dicas para acelerar resultados</span></div>
            <div className="flex items-center text-sm text-gray-700 font-medium"><span className="inc-i text-green-600">✔</span> <span>Acesso vitalício ao app</span></div>
          </div>

          {/* 4. SEÇÃO DE BÔNUS */}
          <div className="bg-red-50 p-4 rounded-2xl space-y-3 border border-red-100">
            <div className="text-xs font-bold text-gray-900 flex items-center"><span className="inc-i">🎁</span> Bônus 1: Receitas doces saudáveis</div>
            <div className="text-xs font-bold text-gray-900 flex items-center"><span className="inc-i">🎁</span> Bônus 2: Plano alimentar opcional</div>
            <div className="text-xs font-bold text-gray-900 flex items-center"><span className="inc-i">🎁</span> Bônus 3: Guia de rotina</div>
          </div>

          <div className="pt-4 border-t border-gray-100 text-center space-y-0">
            <div className="text-sm text-gray-400 font-medium">De <span className="line-through">{step.original_price}</span> por apenas</div>
            <div className="text-[80px] sm:text-[100px] font-black text-[#E53935] leading-none tracking-tighter drop-shadow-md py-4">
              {step.price}
            </div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] opacity-80">Acesso Imediato e Vitalício</div>
          </div>
          <button 
            onClick={handleCompra}
            className="w-full bg-[#16A34A] hover:bg-green-700 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 text-xl uppercase"
          >
            QUERO COMEÇAR AGORA
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-3xl space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-white">30</div>
          <h4 className="font-bold text-gray-900"><HighlightText text="Garantia de Reembolso" /></h4>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          <HighlightText text="Confiamos tanto na formula que oferecemos 30 dias corridos. Se voce nao gostar, reembolsaremos cada centavo. RISCO ZERO PARA VOCE!" />
        </p>
      </div>

      {/* 5. SEGUNDO BOTÃO CTA */}
      <button 
        onClick={handleCompra}
        className="w-full bg-[#16A34A] hover:bg-green-700 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 text-xl uppercase"
      >
        QUERO COMEÇAR AGORA
      </button>

      {/* 6. FAQ ACCORDION */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 text-center"><HighlightText text="Perguntas Frequentes ❓" /></h3>
        <div className="space-y-2">
          {faq.map((item, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 bg-white text-left"
              >
                <span className="text-sm font-bold text-gray-800"><HighlightText text={item.q} /></span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="overflow-hidden">
                  <div className="p-4 bg-gray-50 text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                    <HighlightText text={item.a} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 7. FOOTER FINAL */}
      <div className="pt-8 border-t border-gray-100 space-y-6 text-center">
        <div className="flex justify-center items-center space-x-4">
          <div className="flex flex-col items-center space-y-1">
            <Lock className="w-5 h-5 text-gray-400" />
            <span className="text-[8px] font-bold text-gray-400 uppercase">Compra Segura</span>
          </div>
          <div className="h-8 w-px bg-gray-100" />
          <div className="flex flex-col items-center space-y-1">
            <ShieldCheck className="w-5 h-5 text-gray-400" />
            <span className="text-[8px] font-bold text-gray-400 uppercase">Dados Protegidos</span>
          </div>
          <div className="h-8 w-px bg-gray-100" />
          <div className="flex flex-col items-center space-y-1">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <span className="text-[8px] font-bold text-gray-400 uppercase">Pix ou Cartão</span>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 px-8">
          <HighlightText text="Compra 100% segura. Seus dados estão protegidos por criptografia SSL." />
        </p>
      </div>
    </div>
  );
};
