export type StepType = 
  | 'intro' 
  | 'question_single' 
  | 'question_image_grid' 
  | 'question_body_interactive' 
  | 'interstitial_social_proof' 
  | 'input_text' 
  | 'question_grid_multiple'
  | 'question_list_multiple'
  | 'interstitial_stats' 
  | 'interstitial_method' 
  | 'input_number_stepper' 
  | 'interstitial_goal_confirm' 
  | 'result_page' 
  | 'interstitial_how_to_use' 
  | 'interstitial_simple'
  | 'loading_animated' 
  | 'loading_protocol'
  | 'vsl_1' 
  | 'vsl_2' 
  | 'interstitial_presell' 
  | 'interstitial_testimonials' 
  | 'sales_page';

export interface QuizState {
  nome: string;
  faixa_etaria: string;
  tipo_corpo: string;
  areas_gordura: string[];
  situacao_emocional: string;
  verdade_espelho: string;
  inimigo_emagrecimento: string;
  vitorias_urgentes: string[];
  peso_atual: number;
  altura: number;
  peso_desejado: number;
  gestacoes: string;
  rotina_diaria: string[];
  horas_sono: string;
  consumo_agua: string;
  corpo_sonho: string;
  compromisso: string;
  meta_perda?: number;
}

export interface Step {
  id: number | string;
  type: StepType;
  label: string;
  phase: number;
  progress_percent?: number;
  progress_color?: string;
  show_back_button?: boolean;
  [key: string]: any;
}

