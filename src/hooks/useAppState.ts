import { useState, useEffect } from 'react';

export interface WeightEntry {
  date: string;
  peso: number;
}

export interface RitualEntry {
  date: string;
  completed: boolean;
}

export interface AppState {
  nome: string;
  peso_inicial: number;
  peso_atual: number;
  meta_perda: number;
  peso_meta: number;
  dia_inicio: string | null;
  historico_peso: WeightEntry[];
  historico_truque: RitualEntry[];
  truque_hoje: boolean;
  lembrete_hora: string; // "HH:mm"
  notificacoes_ativas: boolean;
  ultima_data: string | null;
  sequencia: number;
  onboarding_completo: boolean;
}

const INITIAL_STATE: AppState = {
  nome: '',
  peso_inicial: 75,
  peso_atual: 75,
  meta_perda: 10,
  peso_meta: 65,
  dia_inicio: null,
  historico_peso: [],
  historico_truque: [],
  truque_hoje: false,
  lembrete_hora: '08:00',
  notificacoes_ativas: false,
  ultima_data: null,
  sequencia: 0,
  onboarding_completo: false,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('protocolo_gelatina_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure historico_truque exists
        if (!parsed.historico_truque) parsed.historico_truque = [];

        // Reset check
        const today = new Date().toISOString().split('T')[0];
        if (parsed.ultima_data && parsed.ultima_data !== today) {
          // Record previous day status in history
          const lastEntry = parsed.historico_truque[parsed.historico_truque.length - 1];
          if (!lastEntry || lastEntry.date !== parsed.ultima_data) {
            parsed.historico_truque.push({
              date: parsed.ultima_data,
              completed: parsed.truque_hoje
            });
            // Keep only last 30 days
            if (parsed.historico_truque.length > 30) {
              parsed.historico_truque.shift();
            }
          }

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          // Se a última data não foi ontem OU se ontem o truque não foi feito, reseta a sequência
          if (parsed.ultima_data !== yesterdayStr || !parsed.truque_hoje) {
            parsed.sequencia = 0;
          }

          parsed.truque_hoje = false;
          parsed.ultima_data = today;
        } else if (!parsed.ultima_data) {
          parsed.ultima_data = today;
        }
        return parsed;
      } catch (e) {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('protocolo_gelatina_state', JSON.stringify(state));
  }, [state]);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState(INITIAL_STATE);
    localStorage.removeItem('protocolo_gelatina_state');
  };

  return { state, updateState, resetState };
}
