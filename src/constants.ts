import { Step } from './types';

export const QUIZ_STEPS: Step[] = [
  {
    id: 1,
    type: 'intro',
    label: 'Tela de Entrada',
    phase: 1,
    progress_percent: 0,
    progress_color: '#E53935',
    show_back_button: false,
    headline: "O Ritual da Gelatina Mounjaro: ingrediente de centavos está fazendo mulheres não sentirem fome",
    subtext: "Descubra como ativar seu metabolismo e perder até 12kg em 30 dias com a Gelatina Mounjaro!",
    cta_text: "Quero saber se funciona para mim!"
  },
  {
    id: 100,
    type: 'interstitial_simple',
    label: 'Início da Jornada',
    phase: 1,
    progress_percent: 2,
    progress_color: '#E53935',
    show_back_button: true,
    headline: "Vamos começar sua jornada! 🚀",
    subtext: "Responda algumas perguntas rápidas para personalizar seu plano.",
    cta_text: "Vamos lá! 💪"
  },
  {
    id: 2,
    type: 'question_single',
    label: 'Faixa Etária',
    phase: 1,
    progress_percent: 5,
    progress_color: '#E53935',
    show_back_button: true,
    question: "Qual a sua idade?",
    subtext: "Selecione sua faixa etária.",
    options: [
      { emoji: "🌹", label: "18 - 29 anos", value: "18-29" },
      { emoji: "🌷", label: "30 - 39 anos", value: "30-39" },
      { emoji: "🌻", label: "40 - 49 anos", value: "40-49" },
      { emoji: "🌻", label: "50+ anos", value: "50+" }
    ],
    saves_to: "faixa_etaria"
  },
  {
    id: 3,
    type: 'question_image_grid',
    label: 'Classificação do Corpo',
    phase: 1,
    progress_percent: 10,
    progress_color: '#E53935',
    show_back_button: true,
    question: "Como você classifica seu corpo?",
    subtext: "Escolha opção que melhor te descreve",
    options: [
      { image: "https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Medio.webp", label: "Médio", value: "medio", img_id: "corpo_medio" },
      { image: "https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Plus.webp", label: "Plus Size", value: "plus_size", img_id: "corpo_plus_size" },
      { image: "https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Acima.webp", label: "Acima do peso", value: "acima_peso", img_id: "corpo_acima_peso" },
      { image: "https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Sobrepeso.webp", label: "Sobrepeso", value: "sobrepeso", img_id: "corpo_sobrepeso" }
    ],
    saves_to: "tipo_corpo"
  },
  {
    id: 4,
    type: 'question_body_interactive',
    label: 'Áreas para Perder Gordura',
    phase: 1,
    progress_percent: 15,
    progress_color: '#E53935',
    show_back_button: true,
    question: "Quais as áreas que você mais quer perder gordura?",
    subtext: "Toque nas áreas do corpo que deseja melhorar.",
    options: [
      { label: "Papada", value: "papada", position: { top: "18%", right: "10%" } },
      { label: "Braços", value: "bracos", position: { top: "32%", left: "5%" } },
      { label: "Cintura", value: "cintura", position: { top: "44%", left: "5%" } },
      { label: "Barriga", value: "barriga", position: { top: "44%", right: "10%" } },
      { label: "Culotes", value: "culotes", position: { top: "56%", right: "5%" } },
      { label: "Glúteos", value: "gluteos", position: { top: "56%", left: "8%" } },
      { label: "Coxas", value: "coxas", position: { top: "68%", right: "10%" } },
      { label: "Corpo Todo", value: "corpo_todo", position: { bottom: "8%", left: "50%", transform: "translateX(-50%)" } }
    ],
    saves_to: "areas_gordura"
  },
  {
    id: 5,
    type: 'interstitial_social_proof',
    label: 'Prova Social - Mídia',
    phase: 1,
    progress_percent: 20,
    progress_color: '#E53935',
    show_back_button: true,
    headline: "Sim, até as famosas já usaram!⭐",
    subtext: "A Gelatina Mounjaro é tendência entre celebridades e influenciadoras.",
    article: {
      title: "A GELEIA REDUTORA!",
      body: "Após eliminar 60kg em apenas 16 semanas, Jojo Todynho rompe o silêncio sobre o famoso ritual da geleia do tiktok que \"desliga\" a fome e está substituindo injeções caríssimas.",
      image: "https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/NOT.webp",
      img_id: "midia_g1"
    }
  },
  {
    id: 6,
    type: 'input_text',
    label: 'Captura de Nome',
    phase: 1,
    progress_percent: 25,
    progress_color: '#E53935',
    show_back_button: true,
    question: "Qual é o seu primeiro nome?",
    subtext: "Para personalizarmos seu protocolo",
    placeholder: "Digite seu nome aqui...",
    saves_to: "nome"
  },
  {
    id: 7,
    type: 'question_single',
    label: 'Situação Emocional',
    phase: 1,
    progress_percent: 30,
    progress_color: '#E53935',
    show_back_button: true,
    question: "**{nome}**, o que mais te incomoda no seu corpo hoje?",
    options: [
      { emoji: "🩷", label: "Vergonha de se olhar", sublabel: "Evita o espelho e não tira mais fotos", value: "vergonha" },
      { emoji: "😔", label: "Afeta minha saúde", sublabel: "Sinto dores e cansaço por qualquer esforço bobo", value: "saude" },
      { emoji: "👗", label: "Afeta meus relacionamentos", sublabel: "Evita encontros para não ter que escolher roupa", value: "relac" },
      { emoji: "✅", label: "Afeta minha rotina", sublabel: "Tarefas simples viraram um sacrifício diário", value: "rotina" }
    ],
    saves_to: "situacao_emocional"
  },
  {
    id: 8,
    type: 'question_single',
    label: 'Verdade no Espelho',
    phase: 1,
    progress_percent: 35,
    progress_color: '#E53935',
    show_back_button: true,
    question: "Quando você se olha no espelho hoje, qual é a sua verdade?",
    subtext: "Seja 100% sincera consigo mesma.",
    options: [
      { emoji: "😢", label: "Me sinto triste e evito me olhar", value: "triste" },
      { emoji: "🥺", label: "Sinto que essa não sou eu", value: "nao_sou_eu" },
      { emoji: "😤", label: "Cansada de tentar e falhar", value: "cansada" },
      { emoji: "💪", label: "Estou Trabalhando nisso", value: "trabalhando" }
    ],
    saves_to: "verdade_espelho"
  },
  {
    id: 9,
    type: 'question_single',
    label: 'Inimigos do Emagrecimento',
    phase: 1,
    progress_percent: 40,
    progress_color: '#E53935',
    show_back_button: true,
    question: "Qual desses \"Inimigos\" está travando o seu emagrecimento hoje?",
    subtext: "97,9% das mulheres sofrem com pelo menos 2 desses bloqueios.",
    options: [
      { emoji: "🍫", label: "Fome fora de controle", sublabel: "\"Não consigo parar de beliscar.\"", value: "fome" },
      { emoji: "🛏️", label: "Cansaço extremo", sublabel: "Meu metabolismo não tem força para queimar nada", value: "cansaco" },
      { emoji: "😔", label: "Falta de foco", sublabel: "Sempre desisto porque o resultado demora", value: "foco" },
      { emoji: "⏰", label: "Falta de tempo", sublabel: "Minha rotina me impede de fazer dieta", value: "tempo" },
      { emoji: "⚠️", label: "Bloqueio Hormonal", sublabel: "Sinto meu corpo inflamado e inchado", value: "hormonal" }
    ],
    saves_to: "inimigo_emagrecimento"
  },
  {
    id: 10,
    type: 'question_grid_multiple',
    label: 'Vitórias Urgentes',
    phase: 1,
    progress_percent: 45,
    progress_color: '#E53935',
    show_back_button: true,
    question: "Qual dessas vitórias é a mais Urgente para você?",
    subtext: "Selecione Todas que irão te fazer felizes como Nunca",
    options: [
      { emoji: "🛒", label: "Comprar a roupa que eu quero", value: "roupa" },
      { emoji: "👙", label: "Ir à praia sem importar com nada", value: "praia" },
      { emoji: "🪶", label: "Leveza total ao caminhar", value: "leveza" },
      { emoji: "😛", label: "Calar a boca das 'amigas'", value: "amigas" },
      { emoji: "🏃", label: "Parar de fugir das fotos", value: "fotos" },
      { emoji: "👗", label: "Entrar naquela calça 38/40", value: "calca" }
    ],
    saves_to: "vitorias_urgentes"
  },
  {
    id: 12,
    type: 'interstitial_method',
    label: 'Como o Método Funciona',
    phase: 1,
    progress_percent: 55,
    progress_color: '#E53935',
    show_back_button: true,
    headline: "Ótimo, {nome}! Veja como funciona",
    subtext: "A Gelatina Mounjaro ativa a queima de gordura natural com ingredientes caseiros que você prepara em minutos",
    timeline: [
      { step: 1, icon: "👗", title: "Antes", desc: "Gordura acumulada e metabolismo lento" },
      { step: 2, icon: "🍓", title: "Gelatina Mounjaro", desc: "Receita caseira simples e poderosa" },
      { step: 3, icon: "🧍", title: "Queima natural ativada", desc: "Metabolismo acelerado sem dietas" },
      { step: 4, icon: "👙", title: "Corpo dos sonhos!", desc: "Resultado visível em poucas semanas", highlight: true }
    ]
  },
  {
    id: 13,
    type: 'input_number_stepper',
    label: 'Peso Atual',
    phase: 1,
    progress_percent: 60,
    progress_color: '#E53935',
    show_back_button: true,
    question: "Qual é seu peso atual?",
    subtext: "Seja sincera para um resultado preciso",
    default_value: 75,
    unit: "kg",
    saves_to: "peso_atual"
  },
  {
    id: 14,
    type: 'input_number_stepper',
    label: 'Altura',
    phase: 1,
    progress_percent: 65,
    progress_color: '#E53935',
    show_back_button: true,
    question: "Qual é sua altura?",
    subtext: "Precisamos disso para calcular seu IMC",
    default_value: 165,
    unit: "cm",
    saves_to: "altura"
  },
  {
    id: 15,
    type: 'input_number_stepper',
    label: 'Peso Desejado',
    phase: 1,
    progress_percent: 70,
    progress_color: '#E53935',
    show_back_button: true,
    question: "Qual é seu peso desejado?",
    subtext: "Qual o peso que você sonha alcançar?",
    default_value: 65,
    unit: "kg",
    saves_to: "peso_desejado"
  },
  {
    id: 16,
    type: 'interstitial_goal_confirm',
    label: 'Confirmação do Objetivo',
    phase: 1,
    progress_percent: 75,
    progress_color: '#E53935',
    show_back_button: true,
    headline: "Esse é um ótimo objetivo, {nome}! ❤️",
    motivational_text: "Agora vamos ajustar o próximo passo para você começar a perceber diferença já nos primeiros dias."
  },
  {
    id: 17,
    type: 'interstitial_goal_confirm',
    label: 'Confirmação Extra',
    phase: 1,
    progress_percent: 78,
    progress_color: '#E53935',
    show_back_button: true,
    headline: "Estamos quase lá, {nome}!",
    motivational_text: "Sua meta de peso é perfeitamente possível com o protocolo correto."
  },
  {
    id: 18,
    type: 'question_single',
    label: 'Gestações',
    phase: 1,
    progress_percent: 80,
    progress_color: '#E53935',
    show_back_button: true,
    question: "Quantas gestações você já teve?",
    options: [
      { emoji: "🚫", label: "Nunca estive grávida", value: "0" },
      { emoji: "1️⃣", label: "1 gestação", value: "1" },
      { emoji: "2️⃣", label: "2 gestações", value: "2" },
      { emoji: "3️⃣", label: "3 ou mais gestações", value: "3+" }
    ],
    saves_to: "gestacoes"
  },
  {
    id: 19,
    type: 'question_list_multiple',
    label: 'Rotina Diária',
    phase: 1,
    progress_percent: 82,
    progress_color: '#E53935',
    show_back_button: true,
    question: "Como é a sua **rotina** no dia a dia?",
    subtext: "Selecione todas as opções que fazem parte da sua rotina.",
    options: [
      { emoji: "🏢", label: "Trabalho fora de casa", value: "fora_casa" },
      { emoji: "🏠", label: "Trabalho em home office", value: "home_office" },
      { emoji: "👩‍👧", label: "Cuido da casa/familia", value: "casa_familia" },
      { emoji: "📚", label: "Estudo", value: "estudo" }
    ],
    saves_to: "rotina_diaria"
  },
  {
    id: 20,
    type: 'question_single',
    label: 'Horas de Sono',
    phase: 1,
    progress_percent: 84,
    progress_color: '#E53935',
    show_back_button: true,
    question: "Quantas horas você **dorme** por noite?",
    subtext: "O sono é essencial para o emagrecimento.",
    options: [
      { emoji: "🥴", label: "Menos de 5 horas", value: "<5" },
      { emoji: "🛏️", label: "5 a 7 horas", value: "5-7" },
      { emoji: "😊", label: "7 a 9 horas", value: "7-9" },
      { emoji: "💤", label: "Mais de 9 horas", value: ">9" }
    ],
    saves_to: "horas_sono"
  },
  {
    id: 21,
    type: 'question_single',
    label: 'Consumo de Água',
    phase: 1,
    progress_percent: 86,
    progress_color: '#E53935',
    show_back_button: true,
    question: "Quanta **água** você bebe por dia?",
    subtext: "A hidratação acelera resultados.",
    options: [
      { emoji: "🧃", label: "Quase nada", value: "quase_nada" },
      { emoji: "💧", label: "Menos de 1 litro", value: "<1L" },
      { emoji: "🌊", label: "1 a 2 litros", value: "1-2L" },
      { emoji: "💠", label: "Mais de 2 litros", value: ">2L" }
    ],
    saves_to: "consumo_agua"
  },
  {
    id: 22,
    type: 'result_page',
    label: 'Resultado da Análise',
    phase: 1,
    show_back_button: false,
    headline: "Resultado da sua análise, {nome}",
    benefits: [
      { emoji: "🌿", text: "Receita 100% Natural" },
      { emoji: "🔥", text: "Ativa o GLP-1 do seu corpo" },
      { emoji: "🍓", text: "Queima de Gordura localizada" },
      { emoji: "⚡", text: "Regula o seu Metabolismo" },
      { emoji: "🌬️", text: "Leveza e corpo Desinchado" },
      { emoji: "🧃", text: "Menos impulsos por doces" },
      { emoji: "⏱️", text: "Fácil de fazer e seguir" }
    ]
  },
  {
    id: 23,
    type: 'interstitial_how_to_use',
    label: 'Como Usar',
    phase: 1,
    progress_percent: 88,
    progress_color: '#E53935',
    show_back_button: true,
    headline: "Como usar a Gelatina Mounjaro",
    instructions: [
      { emoji: "⏱️", title: "Prepare a gelatina", subtitle: "Receita simples do app" },
      { emoji: "🥄", title: "Consuma 2x ao dia", subtitle: "Manhã e antes de dormir" },
      { emoji: "📅", title: "Siga por 30 dias", subtitle: "Protocolo completo" }
    ]
  },
  {
    id: 24,
    type: 'question_single',
    label: 'Compromisso',
    phase: 1,
    progress_percent: 90,
    progress_color: '#E53935',
    show_back_button: true,
    question: "Você se compromete a seguir o protocolo por pelo menos 7 dias?",
    options: [
      { emoji: "✅", label: "Sim, me comprometo!", sublabel: "Quero ver resultados reais", value: "comprometo" },
      { emoji: "🚀", label: "Quero começar hoje", sublabel: "Estou pronta para mudar", value: "hoje" },
      { emoji: "💪", label: "Quero tentar!", sublabel: "Vou dar meu melhor", value: "tentar" }
    ],
    saves_to: "compromisso"
  },
  {
    id: 25,
    type: 'loading_animated',
    label: 'Carregamento do Perfil',
    phase: 1,
    headline: "Analisando o perfil de {nome}...",
    steps: [
      { label: "Analisando suas respostas", delay_ms: 0 },
      { label: "Calculando seu déficit calórico", delay_ms: 800 },
      { label: "Selecionando ingredientes ideais", delay_ms: 1600 },
      { label: "Protocolo personalizado pronto!", delay_ms: 2400 }
    ]
  },
  {
    id: 26,
    type: 'vsl_1',
    label: 'Primeira VSL',
    phase: 1,
    headline: "Agora assista a explicação rápida de 1 Minuto e entenda por que esse método está chamando atenção 👀",
    video_id: "6pfbLq5fL0M",
    cta_text: "Entendi, quero continuar! 😄"
  },
  {
    id: 27,
    type: 'question_image_grid',
    label: 'Corpo dos Sonhos',
    phase: 1,
    progress_percent: 92,
    progress_color: '#E53935',
    show_back_button: true,
    question: "Qual o corpo dos seus sonhos?",
    options: [
      { image: "https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Definida.webp", label: "Em forma e definida", value: "definida", img_id: "corpo_definido" },
      { image: "https://gkaoozgpeeeympskbcxq.supabase.co/storage/v1/object/public/IMGs/Natural.webp", label: "Natural e saudável", value: "natural", img_id: "corpo_natural" }
    ],
    saves_to: "corpo_sonho"
  },
  {
    id: 28,
    type: 'interstitial_presell',
    label: 'Confirmação de Meta - Pre-sell',
    phase: 1,
    progress_percent: 95,
    progress_color: '#E53935',
    show_back_button: true,
    headline: "Gostaria de perder entre {min} e {max} em poucas semanas?"
  },
  {
    id: 29,
    type: 'interstitial_testimonials',
    label: 'Depoimentos - Transformações',
    phase: 1,
    progress_percent: 98,
    progress_color: '#E53935',
    show_back_button: true,
    headline: "Histórias de Transformação",
    testimonials: [
      { name: "Giovanna, 34", city: "São Paulo, SP", loss: "-7kg", text: "Bizarro... Perdi 7kg em 3 semanas!", image_before: "https://picsum.photos/seed/user1a/200/300", image_after: "https://picsum.photos/seed/user1b/200/300", img_id_before: "giovanna_antes", img_id_after: "giovanna_depois" },
      { name: "Sandra, 39", city: "Rio de Janeiro, RJ", loss: "-9kg", text: "Minha barriga sumiu! Não acredito!", image_before: "https://picsum.photos/seed/user2a/200/300", image_after: "https://picsum.photos/seed/user2b/200/300", img_id_before: "sandra_antes", img_id_after: "sandra_depois" },
      { name: "Claudia, 35", city: "Curitiba, PR", loss: "-8kg", text: "Voltei a usar minhas roupas antigas!", image_before: "https://picsum.photos/seed/user3a/200/300", image_after: "https://picsum.photos/seed/user3b/200/300", img_id_before: "claudia_antes", img_id_after: "claudia_depois" },
      { name: "Patricia, 31", city: "Belo Horizonte, MG", loss: "-11kg", text: "Quem usa tem resultado!", image_before: "https://picsum.photos/seed/user4a/200/300", image_after: "https://picsum.photos/seed/user4b/200/300", img_id_before: "patricia_antes", img_id_after: "patricia_depois" }
    ]
  },
  {
    id: 30,
    type: 'vsl_2',
    label: 'Segunda VSL - Final',
    phase: 1,
    headline: "{nome}, Seu protocolo foi feito com Sucesso!",
    video_id: "XtsDHN_0yQ0",
    cta_text: "Pegar meu Plano!"
  },
  {
    id: 31,
    type: 'loading_protocol',
    label: 'Carregamento Final - Pre-Oferta',
    phase: 1,
    headline: "Seu protocolo da Gelatina Mounjaro de 30 dias está pronto!",
    steps: [
      { label: "Perfil metabólico analisado", delay_ms: 0 },
      { label: "Meta de peso calculada", delay_ms: 600 },
      { label: "Compatibilidade verificada", delay_ms: 1200 },
      { label: "Protocolo de 30 dias montado", delay_ms: 1800 },
      { label: "Bônus exclusivos selecionados", delay_ms: 2400 },
      { label: "Oferta especial preparada", delay_ms: 3000 }
    ]
  },
  {
    id: 32,
    type: 'sales_page',
    label: 'Página de Vendas - Oferta Final',
    phase: 1,
    headline: "{nome}, seu Plano da Gelatina de 30 dias foi Gerado com Sucesso!",
    price: "R$ 27",
    original_price: "R$ 97,00"
  },

  // ETAPAS CONDICIONAIS 8A-D (Baseadas em situacao_emocional)
  {
    id: '8A',
    type: 'question_single',
    label: 'Verdade no Espelho',
    phase: 2,
    progress_percent: 45,
    show_back_button: true,
    question: "Qual dessas situações mais te causa desconforto hoje?",
    subtext: "Seja 100% sincera consigo mesma.",
    options: [
      { emoji: "👗", label: "Evitar festas e eventos", value: "evitar_festas" },
      { emoji: "🛍️", label: "Dificuldade em comprar roupas", value: "comprar_roupas" },
      { emoji: "🙈", label: "Vergonha de se despir", value: "vergonha_despir" },
      { emoji: "😮", label: "Medo de julgamentos", value: "medo_julgamento" }
    ],
    saves_to: "verdade_espelho"
  },
  {
    id: '8B',
    type: 'question_single',
    label: 'Verdade no Espelho',
    phase: 2,
    progress_percent: 45,
    show_back_button: true,
    question: "Qual desses sintomas mais te preocupa no momento?",
    subtext: "Seja 100% sincera consigo mesma.",
    options: [
      { emoji: "🦴", label: "Dores nas articulações", value: "dores" },
      { emoji: "🔋", label: "Cansaço excessivo", value: "cansaco" },
      { emoji: "🩺", label: "Exames alterados", value: "exames" },
      { emoji: "✨", label: "Dificuldade de respirar", value: "respirar" }
    ],
    saves_to: "verdade_espelho"
  },
  {
    id: '8C',
    type: 'question_single',
    label: 'Verdade no Espelho',
    phase: 2,
    progress_percent: 45,
    show_back_button: true,
    question: "Como o excesso de peso tem afetado sua vida social?",
    subtext: "Seja 100% sincera consigo mesma.",
    options: [
      { emoji: "🏠", label: "Menos vontade de sair", value: "menos_sair" },
      { emoji: "🤝", label: "Insegurança com parceiro", value: "inseguranca" },
      { emoji: "📸", label: "Evito fotos em grupo", value: "evito_fotos" },
      { emoji: "💔", label: "Sinto-me menos atraente", value: "menos_atraente" }
    ],
    saves_to: "verdade_espelho"
  },
  {
    id: '8D',
    type: 'question_single',
    label: 'Verdade no Espelho',
    phase: 2,
    progress_percent: 45,
    show_back_button: true,
    question: "Qual é o seu maior desafio na rotina atual?",
    subtext: "Seja 100% sincera consigo mesma.",
    options: [
      { emoji: "🍳", label: "Falta de tempo para cozinhar", value: "falta_tempo" },
      { emoji: "😴", label: "Sono de má qualidade", value: "sono_ruim" },
      { emoji: "🛋️", label: "Sedentarismo forçado", value: "sedentarismo" },
      { emoji: "🤯", label: "Estresse no trabalho", value: "estresse" }
    ],
    saves_to: "verdade_espelho"
  },

  // ETAPAS CONDICIONAIS 9A-D (Baseadas em situacao_emocional)
  {
    id: '9A',
    type: 'question_single',
    label: 'Inimigos do Emagrecimento',
    phase: 2,
    progress_percent: 50,
    show_back_button: true,
    question: "O que você mais deseja recuperar ao emagrecer?",
    subtext: "97,9% das mulheres sofrem com pelo menos 2 desses bloqueios.",
    options: [
      { emoji: "✨", label: "Autoestima elevada", value: "autoestima" },
      { emoji: "💃", label: "Liberdade para vestir o que quiser", value: "liberdade" },
      { emoji: "🪞", label: "Confiança no espelho", value: "confianca" },
      { emoji: "🧘", label: "Paz de espírito", value: "paz" }
    ],
    saves_to: "inimigo_emagrecimento"
  },
  {
    id: '9B',
    type: 'question_single',
    label: 'Inimigos do Emagrecimento',
    phase: 2,
    progress_percent: 50,
    show_back_button: true,
    question: "Qual é o seu maior objetivo de saúde?",
    subtext: "97,9% das mulheres sofrem com pelo menos 2 desses bloqueios.",
    options: [
      { emoji: "⏳", label: "Viver mais e melhor", value: "viver_mais" },
      { emoji: "⚡", label: "Ter mais disposição", value: "disposicao" },
      { emoji: "📉", label: "Normalizar exames", value: "exames_ok" },
      { emoji: "💊", label: "Reduzir medicamentos", value: "menos_remedios" }
    ],
    saves_to: "inimigo_emagrecimento"
  },
  {
    id: '9C',
    type: 'question_single',
    label: 'Inimigos do Emagrecimento',
    phase: 2,
    progress_percent: 50,
    show_back_button: true,
    question: "O que mudaria nos seus relacionamentos com o novo corpo?",
    subtext: "97,9% das mulheres sofrem com pelo menos 2 desses bloqueios.",
    options: [
      { emoji: "🔥", label: "Mais segurança na intimidade", value: "intimidade" },
      { emoji: "🥳", label: "Vontade de socializar", value: "socializar" },
      { emoji: "👶", label: "Ser exemplo para os filhos", value: "exemplo" },
      { emoji: "🥰", label: "Sentir-se desejada", value: "desejada" }
    ],
    saves_to: "inimigo_emagrecimento"
  },
  {
    id: '9D',
    type: 'question_single',
    label: 'Inimigos do Emagrecimento',
    phase: 2,
    progress_percent: 50,
    show_back_button: true,
    question: "Como seria sua rotina ideal com mais leveza?",
    subtext: "97,9% das mulheres sofrem com pelo menos 2 desses bloqueios.",
    options: [
      { emoji: "🌅", label: "Acordar com energia", value: "energia" },
      { emoji: "🏃", label: "Ter prazer em se exercitar", value: "exercicio" },
      { emoji: "🥗", label: "Organização alimentar", value: "organizacao" },
      { emoji: "🧘", label: "Menos estresse diário", value: "menos_estresse" }
    ],
    saves_to: "inimigo_emagrecimento"
  }
];
