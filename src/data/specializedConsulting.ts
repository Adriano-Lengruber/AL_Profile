export type SpecializedConsultingService = {
  slug: string;
  title: string;
  audience: string;
  description: string;
  idealFor: string;
  deliverable: string;
  badges: string[];
  features: string[];
  iconKey: 'workstation' | 'vps' | 'developer' | 'bi';
  iconColor: string;
  iconBg: string;
  border: string;
  cover: string;
  ctaTitle: string;
  ctaDescription: string;
  outcomes: string[];
  miniCaseTitle: string;
  miniCaseDescription: string;
  miniCaseMetrics: string[];
};

export const specializedConsultingServices: SpecializedConsultingService[] = [
  {
    slug: 'workstations-pro-ia-dados',
    title: 'Workstations Pro para IA & Dados',
    audience: 'IA • Ciência de Dados • Criadores',
    description: 'Projeto estações de trabalho sob medida para quem precisa de desempenho real em IA, ciência de dados, criação de conteúdo e workloads intensivos. O foco é equilibrar performance, possibilidade de upgrade, confiabilidade e investimento inteligente.',
    idealFor: 'Profissionais que precisam montar ou evoluir uma máquina realmente compatível com o seu perfil de uso.',
    deliverable: 'Definição da configuração ideal, orientação de compra, checklist técnico e plano de evolução.',
    badges: ['Alta Performance', 'GPU Ready', 'Setup Sob Medida'],
    features: [
      'Dimensionamento de CPU, GPU, RAM e armazenamento por perfil de uso',
      'Planejamento térmico, consumo, upgrade e longevidade do equipamento',
      'Configuração pensada para produtividade, estabilidade e custo-benefício',
    ],
    iconKey: 'workstation',
    iconColor: 'text-cyber-gold',
    iconBg: 'bg-cyber-gold/15',
    border: 'hover:border-cyber-gold/30 hover:shadow-cyber-gold/10',
    cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    ctaTitle: 'Monte uma workstation sem desperdício',
    ctaDescription: 'Receba uma visão prática de configuração ideal, prioridades de investimento e caminho de evolução do seu setup.',
    outcomes: [
      'Evita compra exagerada ou subdimensionada para o seu workload',
      'Organiza prioridades entre desempenho, upgrade e custo-beneficio',
      'Deixa clara a rota de evolucao antes de investir em hardware',
    ],
    miniCaseTitle: 'Cenario comum',
    miniCaseDescription: 'Profissionais que alternam entre IA, analise de dados e criacao acabam investindo em componentes desalinhados. A consultoria organiza o setup certo para o tipo de carga, janela de upgrade e limite real de investimento.',
    miniCaseMetrics: ['CPU/GPU dimensionados por uso', 'Plano de upgrade definido', 'Compra com menos retrabalho'],
  },
  {
    slug: 'vps-pessoal-profissional',
    title: 'VPS Pessoal ou Profissional',
    audience: 'Cloud • Self-Hosted • Deploy',
    description: 'Estruturo VPS sob medida para aplicações, automações, bots, sites, APIs ou ambientes privados, com configuração orientada ao objetivo do cliente. A entrega inclui transparência total, documentação operacional no próprio ambiente e transferência integral dos acessos.',
    idealFor: 'Empresas e profissionais que querem infraestrutura enxuta, segura e pronta para uso sem depender de pacotes genéricos.',
    deliverable: 'Servidor provisionado, stack configurada, segurança inicial aplicada e acessos totalmente em posse do cliente.',
    badges: ['Linux', 'Docker', 'Acessos do Cliente'],
    features: [
      'Configuração precisa das aplicações escolhidas para o cenário de uso',
      'Organização de usuários, domínios, SSL, backups e boas práticas de segurança',
      'Entrega final com transparência sobre contas, logins e estrutura implantada',
    ],
    iconKey: 'vps',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-400/15',
    border: 'hover:border-cyan-400/30 hover:shadow-cyan-400/10',
    cover: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    ctaTitle: 'Estruture sua VPS do jeito certo',
    ctaDescription: 'Saia de setups improvisados e ganhe uma infraestrutura documentada, segura e realmente sua.',
    outcomes: [
      'Reduz dependencia de configuracoes improvisadas e sem historico',
      'Entrega stack pronta com acessos, organizacao e seguranca inicial',
      'Deixa operacao mais previsivel para sites, APIs, bots e automacoes',
    ],
    miniCaseTitle: 'Cenario comum',
    miniCaseDescription: 'Empresas e profissionais costumam subir aplicacoes em VPS com pouca organizacao, sem backup confiavel ou dominio bem configurado. A consultoria estrutura a base operacional para reduzir risco e facilitar manutencao.',
    miniCaseMetrics: ['Stack documentada', 'SSL e dominios organizados', 'Acessos sob controle do cliente'],
  },
  {
    slug: 'personal-developer',
    title: 'Personal Developer',
    audience: 'Produto Sob Medida • Full Stack',
    description: 'Consultoria e desenvolvimento do início ao fim para projetos personalizados, pensados especificamente para a realidade de uma pessoa, empresa ou gestor. A prioridade é construir a solução certa com a stack mais atual, sem perder de vista viabilidade, manutenção e retorno sobre o investimento.',
    idealFor: 'Quem precisa tirar uma ideia do papel ou evoluir um processo com tecnologia feita sob medida.',
    deliverable: 'Descoberta, arquitetura, implementação, validação e evolução contínua do projeto.',
    badges: ['Sob Medida', 'IA Aplicada', 'Custo-Benefício'],
    features: [
      'Levantamento da necessidade real antes da escolha técnica',
      'Desenvolvimento orientado a resultado, usabilidade e escalabilidade',
      'Tecnologia atual com foco em sustentabilidade financeira do projeto',
    ],
    iconKey: 'developer',
    iconColor: 'text-cyber-emerald',
    iconBg: 'bg-cyber-emerald/15',
    border: 'hover:border-cyber-emerald/30 hover:shadow-cyber-emerald/10',
    cover: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    ctaTitle: 'Tire sua solução do papel com direção técnica',
    ctaDescription: 'Entenda o melhor caminho para desenhar, validar e evoluir um projeto sob medida com foco em resultado.',
    outcomes: [
      'Transforma ideia dispersa em escopo viavel e tecnicamente coerente',
      'Prioriza o que gera valor antes de ampliar investimento',
      'Cria base para evolucao continua sem travar o projeto no inicio',
    ],
    miniCaseTitle: 'Cenario comum',
    miniCaseDescription: 'Muitos projetos nascem com uma ideia boa, mas sem clareza de fluxo, prioridade ou stack adequada. A consultoria organiza o caminho do discovery ate a implementacao com foco no que gera resultado primeiro.',
    miniCaseMetrics: ['Escopo priorizado', 'Arquitetura inicial clara', 'Roadmap de evolucao definido'],
  },
  {
    slug: 'bi-express-pmes',
    title: 'BI Express para PMEs',
    audience: 'Gestão • Comercial • Operação',
    description: 'Uma frente pensada para gerar resultado rápido em empresas locais e regionais por meio de dashboards executivos, automações operacionais e organização dos indicadores essenciais. É uma porta de entrada de alto valor para negócios que precisam enxergar melhor suas operações e decidir com mais segurança.',
    idealFor: 'Comércios, indústrias, distribuidores, clínicas e gestores que querem clareza nos números e ganho operacional.',
    deliverable: 'Mapa de indicadores, painel executivo, rotina de atualização e recomendações práticas de melhoria.',
    badges: ['Dashboard', 'KPIs', 'Quick Wins'],
    features: [
      'Estruturação de indicadores críticos para operação, comercial e financeiro',
      'Painéis objetivos para acompanhamento e tomada de decisão',
      'Automação de etapas repetitivas para reduzir retrabalho e ruído operacional',
    ],
    iconKey: 'bi',
    iconColor: 'text-[#E07390]',
    iconBg: 'bg-[#E07390]/15',
    border: 'hover:border-[#E07390]/30 hover:shadow-[#E07390]/10',
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    ctaTitle: 'Transforme números em gestão prática',
    ctaDescription: 'Ganhe um ponto de partida enxuto para organizar indicadores, decidir melhor e reduzir ruído operacional.',
    outcomes: [
      'Consolida indicadores essenciais para gestao, comercial e operacao',
      'Cria visao executiva para decidir mais rapido e com menos intuicao',
      'Identifica quick wins de automacao para reduzir retrabalho',
    ],
    miniCaseTitle: 'Cenario comum',
    miniCaseDescription: 'Pequenas e medias empresas frequentemente operam com planilhas isoladas e pouca visibilidade executiva. A consultoria organiza indicadores, painis e rotinas para dar clareza rapida ao negocio.',
    miniCaseMetrics: ['KPIs priorizados', 'Painel executivo objetivo', 'Quick wins operacionais mapeados'],
  },
];

export function getSpecializedConsultingService(slug: string) {
  return specializedConsultingServices.find((service) => service.slug === slug);
}
