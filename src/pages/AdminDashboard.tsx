import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Settings, 
  Plus, 
  Save, 
  Download, 
  Shield, 
  Zap, 
  Code2, 
  Database, 
  Bot,
  Layout,
  ChevronRight,
  Sparkles,
  Users,
  Kanban,
  Key,
  DollarSign,
  ClipboardList,
  Briefcase,
  Search,
  Eye,
  X,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  Network,
  History,
  Target,
  FileSignature,
  Menu,
  Building,
  CreditCard,
  MessageSquareQuote,
  TrendingUp,
  Fingerprint,
  ExternalLink,
  Trash2,
  PieChart,
  Calendar,
  Paperclip,
  FileUp,
  FileCheck,
  FileCode,
  ShieldAlert,
  HelpCircle,
  Activity,
  ArrowUpRight,
  MousePointer2,
  LogOut,
  Server,
  Cpu,
  HardDrive,
  Thermometer
} from 'lucide-react';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';

import { useAuth } from '../hooks/useAuth';

// --- Mapeamento de Ícones ---
const ICON_MAP: Record<string, any> = {
  TrendingUp,
  Kanban,
  DollarSign,
  Layout,
  Users,
  Settings,
  Database,
  Bot,
  Zap,
  Target,
  FileText,
  Briefcase,
  Shield,
  FileSignature,
  PieChart,
  Building,
  Fingerprint,
  Sparkles,
  Search,
  ChevronRight,
  Plus,
  Save,
  Eye,
  CheckCircle2,
  MessageSquareQuote,
  Clock,
  AlertCircle,
  Network,
  History,
  CreditCard,
  ExternalLink,
  Trash2,
  Calendar,
  Paperclip,
  FileUp,
  FileCheck,
  FileCode,
  ShieldAlert,
  HelpCircle,
  Activity,
  ArrowUpRight,
  MousePointer2
};

// --- Tipagens ---

interface BoardColumn {
  id: string;
  title: string;
  type: 'text' | 'status' | 'date' | 'number' | 'person' | 'link' | 'tags' | 'priority' | 'timeline';
  width?: number;
}

interface BoardItem {
  id: string;
  name: string;
  values: Record<string, any>; // id da coluna -> valor
  subitems?: BoardItem[];
}

interface BoardGroup {
  id: string;
  title: string;
  color: string;
  items: BoardItem[];
}

interface Board {
  id: string;
  name: string;
  description?: string;
  columns: BoardColumn[];
  groups: BoardGroup[];
}

interface Workspace {
  id: string;
  name: string;
  icon: string; // Nome do ícone no ICON_MAP
  boards: Board[];
}

interface Module {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'core' | 'ai' | 'automation' | 'support';
}

interface Stakeholder {
  name: string;
  role: string;
  influence: 'high' | 'medium' | 'low';
  preference: string;
}

interface ProjectAccess {
  label: string;
  type: 'VPS' | 'Database' | 'GitHub' | 'Cloud' | 'Other';
  credentials: string;
}

interface ProjectTask {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  startDate?: string;
  endDate?: string;
}

interface ProjectDocument {
  id: string;
  name: string;
  type: 'contract' | 'briefing' | 'technical' | 'other';
  date: string;
  size: string;
}

type MeetingType = 'discovery' | 'kickoff' | 'followup' | 'delivery' | 'postDelivery';

interface ProjectMeetingNote {
  date: string;
  content: string;
  title?: string;
  kind?: MeetingType;
  outcome?: string;
  nextStep?: string;
}

type ProjectPaymentStatus = 'draft' | 'pending' | 'partial' | 'paid' | 'overdue';

interface ProjectInstallment {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}

interface ProjectFinancials {
  proposalValue: number;
  paymentMethod: string;
  invoiceStatus: 'pending' | 'issued' | 'paid';
  installments: ProjectInstallment[];
}

interface ProjectPostDeliveryStep {
  id: string;
  title: string;
  area: 'testimonial' | 'case' | 'portfolio' | 'referral' | 'upsell';
  done: boolean;
}

type PlaybookTemplateId = 'consulting' | 'automation' | 'analytics' | 'retainer';

interface ProjectPlaybookStep {
  id: string;
  title: string;
  description: string;
  done: boolean;
}

interface ProjectPlaybook {
  templateId: PlaybookTemplateId;
  steps: ProjectPlaybookStep[];
}

type ProjectStage = 'lead' | 'diagnosis' | 'proposal' | 'onboarding' | 'delivery' | 'launch' | 'relationship';

interface ProjectWorkflowStep {
  id: string;
  title: string;
  area: 'commercial' | 'onboarding' | 'delivery' | 'launch' | 'relationship';
  done: boolean;
}

interface Project {
  id: string;
  clientName: string;
  projectName: string;
  brief: string;
  status: 'prospect' | 'active' | 'finished';
  value: number;
  deadline: string;
  accesses: ProjectAccess[];
  tasks: ProjectTask[];
  costs: { label: string; value: number }[];
  stakeholders: Stakeholder[];
  meetingNotes: ProjectMeetingNote[];
  documents: ProjectDocument[];
  stage: ProjectStage;
  nextAction: string;
  followUpDate: string;
  workflowSteps: ProjectWorkflowStep[];
  financials: ProjectFinancials;
  postDeliverySteps: ProjectPostDeliveryStep[];
  playbook: ProjectPlaybook;
}

interface CompanyProfile {
  name: string;
  cnpj: string;
  address: string;
  email: string;
  bankInfo: string;
}

interface CollaborationMember {
  id: string;
  email: string;
  role: 'manager' | 'editor' | 'finance' | 'viewer';
  status: 'approved' | 'accepted' | 'revoked';
  note: string;
  permissions: {
    dashboardView: boolean;
    crmView: boolean;
    projectsView: boolean;
    projectsEdit: boolean;
    workspacesView: boolean;
    workspacesEdit: boolean;
    companyView: boolean;
    companyEdit: boolean;
    financeView: boolean;
    postsEdit: boolean;
    serverView: boolean;
    teamManage: boolean;
  };
  createdAt?: string;
  acceptedAt?: string | null;
  inviteLink: string | null;
  user?: {
    id: string;
    username: string;
    email: string;
    avatar: string;
    bio: string;
  } | null;
}

const ROLE_OPTIONS: Array<{ value: CollaborationMember['role']; label: string; description: string }> = [
  { value: 'manager', label: 'Manager', description: 'Opera comercial, projetos, empresa e visão financeira.' },
  { value: 'editor', label: 'Editor', description: 'Trabalha conteúdo, CRM e projetos sem administração completa.' },
  { value: 'finance', label: 'Financeiro', description: 'Acompanha receita, empresa e propostas em modo controlado.' },
  { value: 'viewer', label: 'Viewer', description: 'Acompanha a operação sem editar áreas sensíveis.' }
];

const PERMISSION_CATALOG: Array<{
  key: keyof CollaborationMember['permissions'];
  label: string;
  summary: string;
  impact: string;
}> = [
  { key: 'dashboardView', label: 'Dashboards', summary: 'Entra na visão executiva do negócio.', impact: 'Indicadores, follow-ups e visão consolidada.' },
  { key: 'crmView', label: 'CRM & Clientes', summary: 'Consulta pipeline, clientes e histórico.', impact: 'Relacionamento, agenda e acompanhamento comercial.' },
  { key: 'projectsView', label: 'Projetos', summary: 'Visualiza projetos e entregas.', impact: 'Escopo, tarefas, stakeholders e playbook.' },
  { key: 'projectsEdit', label: 'Editar Projetos', summary: 'Cria, altera e remove pipeline/projetos.', impact: 'Propostas, avanço operacional e dados do projeto.' },
  { key: 'workspacesView', label: 'Workspaces', summary: 'Abre boards e espaços de trabalho.', impact: 'Quadros operacionais e organização interna.' },
  { key: 'workspacesEdit', label: 'Editar Workspaces', summary: 'Altera boards, itens e estrutura.', impact: 'Operação de entrega e colaboração diária.' },
  { key: 'companyView', label: 'Perfil da Empresa', summary: 'Consulta dados institucionais.', impact: 'Informações comerciais e de faturamento.' },
  { key: 'companyEdit', label: 'Editar Empresa', summary: 'Atualiza cadastro e faturamento.', impact: 'White label, dados corporativos e billing.' },
  { key: 'financeView', label: 'Financeiro', summary: 'Acessa visão ERP e métricas financeiras.', impact: 'Receita, contas e previsões.' },
  { key: 'postsEdit', label: 'Blog/Conteúdo', summary: 'Pode moderar posts existentes.', impact: 'Operação editorial e consistência de marca.' },
  { key: 'serverView', label: 'Servidor', summary: 'Consulta status técnico do ambiente.', impact: 'Infraestrutura, disponibilidade e monitoramento.' },
  { key: 'teamManage', label: 'Equipe', summary: 'Gerencia convites e permissões.', impact: 'Modelo multiator e expansão white label.' }
];

// --- Dados Iniciais (Mocks) ---

const AVAILABLE_MODULES: Module[] = [
  { id: '1', name: 'Arquitetura de Dados', price: 2500, category: 'core', description: 'Modelagem e estruturação de banco de dados.' },
  { id: '2', name: 'Agente de IA (GPT-4o)', price: 4000, category: 'ai', description: 'Integração de assistente inteligente personalizado.' },
  { id: '3', name: 'Dashboard Analítico', price: 1800, category: 'core', description: 'Visualização de dados em tempo real.' },
  { id: '4', name: 'Automação n8n', price: 1500, category: 'automation', description: 'Workflows automatizados entre ferramentas.' },
  { id: '5', name: 'Suporte & Manutenção', price: 800, category: 'support', description: 'Acompanhamento mensal e correções.' },
  { id: '6', name: 'Integração de API', price: 1200, category: 'automation', description: 'Conexão entre sistemas externos via REST/GraphQL.' },
  { id: '7', name: 'Infraestrutura Cloud', price: 2000, category: 'core', description: 'Setup de VPS, Docker e CI/CD.' },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    clientName: 'Global RJ Serviços',
    projectName: 'Automação de ETL',
    brief: 'O cliente precisa de um fluxo automatizado para extrair dados de planilhas e inserir em um banco PostgreSQL, com dashboard de acompanhamento.',
    status: 'active',
    value: 8500,
    deadline: '2026-04-15',
    accesses: [
      { label: 'VPS Produção', type: 'VPS', credentials: 'root@145.22.33.11 | pass: ****' },
      { label: 'GitHub Repo', type: 'GitHub', credentials: 'github.com/org/repo-etl' }
    ],
    tasks: [
      { id: 't1', title: 'Configuração do n8n', status: 'done', startDate: '2026-03-05', endDate: '2026-03-10' },
      { id: 't2', title: 'Mapeamento de tabelas SQL', status: 'doing', startDate: '2026-03-12' },
      { id: 't3', title: 'Criação do Dashboard', status: 'todo' }
    ],
    costs: [
      { label: 'Hospedagem DigitalOcean', value: 60 },
      { label: 'API OpenAI (Est.)', value: 150 }
    ],
    stakeholders: [
      { name: 'Ricardo Santos', role: 'CTO', influence: 'high', preference: 'Arquitetura limpa e documentação API' },
      { name: 'Fernanda Lima', role: 'Financeiro', influence: 'medium', preference: 'Redução de custos operacionais e ROI' }
    ],
    meetingNotes: [
      {
        date: '2026-03-10',
        title: 'Validação técnica da integração',
        kind: 'followup',
        content: 'Ricardo demonstrou preocupação com a latência das APIs legadas. Sugeri cache com Redis.',
        outcome: 'Aprovado um teste controlado de desempenho antes da próxima entrega.',
        nextStep: 'Apresentar benchmark da API e fluxo com cache.'
      },
      {
        date: '2026-03-05',
        title: 'Kickoff operacional',
        kind: 'kickoff',
        content: 'Definição de cronograma. Primeira entrega em 15 dias.',
        outcome: 'Cliente aprovou marcos semanais e canal único de alinhamento.',
        nextStep: 'Subir ambiente inicial e compartilhar plano de execução.'
      }
    ],
    documents: [
      { id: 'doc1', name: 'Contrato Assinado - v1.pdf', type: 'contract', date: '2026-03-05', size: '1.2MB' },
      { id: 'doc2', name: 'Briefing Técnico - Global RJ.pdf', type: 'briefing', date: '2026-03-01', size: '450KB' }
    ],
    stage: 'delivery',
    nextAction: 'Fechar o dashboard analítico e validar com o cliente',
    followUpDate: '2026-03-28',
    financials: {
      proposalValue: 8500,
      paymentMethod: 'Pix + transferência',
      invoiceStatus: 'issued',
      installments: [
        { id: 'inst-1', label: 'Sinal', amount: 3500, dueDate: '2026-03-08', status: 'paid' },
        { id: 'inst-2', label: 'Entrega parcial', amount: 2500, dueDate: '2026-03-28', status: 'pending' },
        { id: 'inst-3', label: 'Entrega final', amount: 2500, dueDate: '2026-04-15', status: 'pending' }
      ]
    },
    postDeliverySteps: [
      { id: 'testimonial', title: 'Solicitar depoimento do cliente', area: 'testimonial', done: false },
      { id: 'case', title: 'Transformar o projeto em case', area: 'case', done: false },
      { id: 'portfolio', title: 'Atualizar portfólio e landing pessoal', area: 'portfolio', done: false },
      { id: 'referral', title: 'Pedir indicação ou ponte comercial', area: 'referral', done: false },
      { id: 'upsell', title: 'Abrir próxima oferta ou retenção', area: 'upsell', done: false }
    ],
    playbook: {
      templateId: 'automation',
      steps: [
        { id: 'playbook-briefing', title: 'Consolidar briefing técnico e fontes de dados', description: 'Transformar dores do cliente em fluxo operacional validado.', done: true },
        { id: 'playbook-stack', title: 'Definir stack, ambiente e segurança do fluxo', description: 'Fechar n8n, banco, credenciais, observabilidade e backups.', done: true },
        { id: 'playbook-mvp', title: 'Entregar MVP automatizado com validação', description: 'Subir primeira versão do fluxo e validar com dados reais.', done: false },
        { id: 'playbook-handover', title: 'Preparar handoff, treinamento e SOP final', description: 'Registrar operação, uso e manutenção para o cliente.', done: false }
      ]
    },
    workflowSteps: [
      { id: 'discovery', title: 'Conduzir reunião de descoberta', area: 'commercial', done: true },
      { id: 'proposal', title: 'Enviar proposta e alinhar escopo', area: 'commercial', done: true },
      { id: 'kickoff', title: 'Formalizar contrato e onboarding', area: 'onboarding', done: true },
      { id: 'delivery', title: 'Executar entrega principal', area: 'delivery', done: false },
      { id: 'validation', title: 'Validar resultado com o cliente', area: 'delivery', done: false },
      { id: 'launch', title: 'Publicar entrega, case ou divulgação', area: 'launch', done: false },
      { id: 'upsell', title: 'Abrir follow-up, retenção ou upsell', area: 'relationship', done: false }
    ]
  }
];

const INITIAL_COMPANY: CompanyProfile = {
  name: 'Adriano Lengruber Consultoria',
  cnpj: '00.000.000/0001-00',
  address: 'Rio de Janeiro, RJ',
  email: 'contato@al-profile.com',
  bankInfo: 'Pix: contato@al-profile.com'
};

const getTodayDate = () => new Date().toISOString().split('T')[0];

const PROJECT_STAGE_OPTIONS: { value: ProjectStage; label: string }[] = [
  { value: 'lead', label: 'Lead' },
  { value: 'diagnosis', label: 'Diagnóstico' },
  { value: 'proposal', label: 'Proposta' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'delivery', label: 'Entrega' },
  { value: 'launch', label: 'Divulgação' },
  { value: 'relationship', label: 'Relacionamento' }
];

const MEETING_TYPE_OPTIONS: { value: MeetingType; label: string }[] = [
  { value: 'discovery', label: 'Descoberta' },
  { value: 'kickoff', label: 'Kickoff' },
  { value: 'followup', label: 'Follow-up' },
  { value: 'delivery', label: 'Entrega' },
  { value: 'postDelivery', label: 'Pós-entrega' }
];

const DEFAULT_WORKFLOW_STEPS: Omit<ProjectWorkflowStep, 'done'>[] = [
  { id: 'discovery', title: 'Conduzir reunião de descoberta', area: 'commercial' },
  { id: 'proposal', title: 'Enviar proposta e alinhar escopo', area: 'commercial' },
  { id: 'kickoff', title: 'Formalizar contrato e onboarding', area: 'onboarding' },
  { id: 'delivery', title: 'Executar entrega principal', area: 'delivery' },
  { id: 'validation', title: 'Validar resultado com o cliente', area: 'delivery' },
  { id: 'launch', title: 'Publicar entrega, case ou divulgação', area: 'launch' },
  { id: 'upsell', title: 'Abrir follow-up, retenção ou upsell', area: 'relationship' }
];

const DEFAULT_POST_DELIVERY_STEPS: Omit<ProjectPostDeliveryStep, 'done'>[] = [
  { id: 'testimonial', title: 'Solicitar depoimento do cliente', area: 'testimonial' },
  { id: 'case', title: 'Transformar o projeto em case', area: 'case' },
  { id: 'portfolio', title: 'Atualizar portfólio e landing pessoal', area: 'portfolio' },
  { id: 'referral', title: 'Pedir indicação ou ponte comercial', area: 'referral' },
  { id: 'upsell', title: 'Abrir próxima oferta ou retenção', area: 'upsell' }
];

const PLAYBOOK_TEMPLATES: Record<PlaybookTemplateId, { label: string; description: string; steps: Omit<ProjectPlaybookStep, 'done'>[] }> = {
  consulting: {
    label: 'Consultoria',
    description: 'Ideal para diagnóstico, escopo, plano de ação e entrega consultiva.',
    steps: [
      { id: 'playbook-discovery', title: 'Mapear dores, contexto e decisão', description: 'Consolidar entrevistas, metas e stakeholders-chave.' },
      { id: 'playbook-proposal', title: 'Fechar proposta com escopo e critérios', description: 'Definir entregáveis, cronograma, riscos e premissas.' },
      { id: 'playbook-diagnosis', title: 'Executar diagnóstico e recomendações', description: 'Estruturar análise, plano e prioridades do cliente.' },
      { id: 'playbook-presentation', title: 'Apresentar plano e próximos passos', description: 'Converter a entrega em decisão prática e continuidade.' }
    ]
  },
  automation: {
    label: 'Automação',
    description: 'Fluxo para projetos com integrações, n8n, APIs e operação recorrente.',
    steps: [
      { id: 'playbook-briefing', title: 'Consolidar briefing técnico e fontes de dados', description: 'Transformar dores do cliente em fluxo operacional validado.' },
      { id: 'playbook-stack', title: 'Definir stack, ambiente e segurança do fluxo', description: 'Fechar n8n, banco, credenciais, observabilidade e backups.' },
      { id: 'playbook-mvp', title: 'Entregar MVP automatizado com validação', description: 'Subir primeira versão do fluxo e validar com dados reais.' },
      { id: 'playbook-handover', title: 'Preparar handoff, treinamento e SOP final', description: 'Registrar operação, uso e manutenção para o cliente.' }
    ]
  },
  analytics: {
    label: 'Dashboard',
    description: 'Modelo para BI, indicadores, dashboards e camada analítica.',
    steps: [
      { id: 'playbook-kpi', title: 'Definir KPIs e regras do negócio', description: 'Fechar métricas, fontes e visão executiva com o cliente.' },
      { id: 'playbook-modeling', title: 'Modelar dados e estrutura analítica', description: 'Organizar tabelas, dimensões, filtros e consistência.' },
      { id: 'playbook-visuals', title: 'Construir painéis com narrativa', description: 'Montar dashboards acionáveis e fáceis de usar.' },
      { id: 'playbook-adoption', title: 'Validar adoção e rotina de uso', description: 'Treinar cliente e consolidar cadência de leitura dos dados.' }
    ]
  },
  retainer: {
    label: 'Recorrência',
    description: 'Para suporte contínuo, manutenção e crescimento mensal.',
    steps: [
      { id: 'playbook-scope', title: 'Definir escopo mensal e SLAs', description: 'Alinhar entregas recorrentes, limites e prioridades.' },
      { id: 'playbook-backlog', title: 'Organizar backlog e agenda mensal', description: 'Separar melhorias, correções e oportunidades do período.' },
      { id: 'playbook-review', title: 'Executar review e reportar valor', description: 'Mostrar resultado, horas, impacto e próximos passos.' },
      { id: 'playbook-renewal', title: 'Abrir renovação, upsell e expansão', description: 'Transformar operação recorrente em conta crescente.' }
    ]
  }
};

const getStageFromStatus = (status?: Project['status']): ProjectStage => {
  if (status === 'active') return 'delivery';
  if (status === 'finished') return 'relationship';
  return 'proposal';
};

const getDefaultNextAction = (status?: Project['status']) => {
  if (status === 'active') return 'Fechar a próxima entrega crítica do projeto';
  if (status === 'finished') return 'Publicar resultado, pedir depoimento e abrir upsell';
  return 'Agendar follow-up comercial e avançar proposta';
};

const getDefaultFollowUpDate = (deadline?: string) => {
  if (deadline && deadline !== 'A definir' && !Number.isNaN(new Date(deadline).getTime())) {
    return deadline;
  }

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  return nextWeek.toISOString().split('T')[0];
};

const createWorkflowSteps = (status?: Project['status'], workflowSteps?: Partial<ProjectWorkflowStep>[]) => {
  const doneByStatus = status === 'finished'
    ? ['discovery', 'proposal', 'kickoff', 'delivery', 'validation', 'launch']
    : status === 'active'
      ? ['discovery', 'proposal', 'kickoff']
      : ['discovery'];

  const existing = new Map((Array.isArray(workflowSteps) ? workflowSteps : []).map(step => [step.id, step]));

  return DEFAULT_WORKFLOW_STEPS.map(step => {
    const saved = existing.get(step.id);
    return {
      id: step.id,
      title: typeof saved?.title === 'string' && saved.title.trim() ? saved.title : step.title,
      area: saved?.area && ['commercial', 'onboarding', 'delivery', 'launch', 'relationship'].includes(saved.area)
        ? saved.area
        : step.area,
      done: typeof saved?.done === 'boolean' ? saved.done : doneByStatus.includes(step.id)
    } as ProjectWorkflowStep;
  });
};

const createPostDeliverySteps = (status?: Project['status'], postDeliverySteps?: Partial<ProjectPostDeliveryStep>[]) => {
  const doneByStatus = status === 'finished'
    ? ['testimonial']
    : [];

  const existing = new Map((Array.isArray(postDeliverySteps) ? postDeliverySteps : []).map(step => [step.id, step]));

  return DEFAULT_POST_DELIVERY_STEPS.map(step => {
    const saved = existing.get(step.id);
    return {
      id: step.id,
      title: typeof saved?.title === 'string' && saved.title.trim() ? saved.title : step.title,
      area: saved?.area && ['testimonial', 'case', 'portfolio', 'referral', 'upsell'].includes(saved.area)
        ? saved.area
        : step.area,
      done: typeof saved?.done === 'boolean' ? saved.done : doneByStatus.includes(step.id)
    } as ProjectPostDeliveryStep;
  });
};

const getSuggestedPlaybookTemplate = (project?: Partial<Project>) => {
  const projectName = typeof project?.projectName === 'string' ? project.projectName.toLowerCase() : '';
  const brief = typeof project?.brief === 'string' ? project.brief.toLowerCase() : '';
  const taskTitles = Array.isArray(project?.tasks)
    ? project.tasks.map(task => typeof task?.title === 'string' ? task.title.toLowerCase() : '').join(' ')
    : '';
  const context = `${projectName} ${brief} ${taskTitles}`;

  if (context.includes('dashboard') || context.includes('bi') || context.includes('métrica') || context.includes('analít')) {
    return 'analytics' as PlaybookTemplateId;
  }

  if (context.includes('autom') || context.includes('n8n') || context.includes('api') || context.includes('integra')) {
    return 'automation' as PlaybookTemplateId;
  }

  if (context.includes('suporte') || context.includes('manutenção') || context.includes('recorr')) {
    return 'retainer' as PlaybookTemplateId;
  }

  return 'consulting' as PlaybookTemplateId;
};

const createProjectPlaybook = (project?: Partial<Project>) => {
  const templateId = project?.playbook?.templateId && PLAYBOOK_TEMPLATES[project.playbook.templateId]
    ? project.playbook.templateId
    : getSuggestedPlaybookTemplate(project);

  const template = PLAYBOOK_TEMPLATES[templateId];
  const existingSteps = Array.isArray(project?.playbook?.steps) ? project.playbook.steps : [];
  const existing = new Map(existingSteps.map(step => [step.id, step]));
  const doneByStatus = project?.status === 'finished' ? template.steps.slice(0, 3).map(step => step.id) : project?.status === 'active' ? [template.steps[0]?.id, template.steps[1]?.id].filter(Boolean) : [];

  return {
    templateId,
    steps: template.steps.map(step => {
      const saved = existing.get(step.id);
      return {
        id: step.id,
        title: typeof saved?.title === 'string' && saved.title.trim() ? saved.title : step.title,
        description: typeof saved?.description === 'string' && saved.description.trim() ? saved.description : step.description,
        done: typeof saved?.done === 'boolean' ? saved.done : doneByStatus.includes(step.id)
      } as ProjectPlaybookStep;
    })
  } as ProjectPlaybook;
};

const formatProjectDate = (value?: string) => {
  if (!value || value === 'A definir') return 'A definir';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('pt-BR');
};

const getDateTimestamp = (value?: string) => {
  if (!value || value === 'A definir') return null;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.getTime();
};

const getShiftedDate = (days: number, baseDate?: string) => {
  const baseTimestamp = getDateTimestamp(baseDate);
  const base = baseTimestamp ? new Date(baseTimestamp) : new Date();
  base.setDate(base.getDate() + days);
  return base.toISOString().split('T')[0];
};

const getFollowUpMeta = (value?: string) => {
  const timestamp = getDateTimestamp(value);
  if (!timestamp) {
    return {
      label: 'Sem data',
      tone: 'text-muted-foreground',
      badge: 'bg-white/5 border-white/10',
      rank: 4
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((timestamp - today.getTime()) / 86400000);

  if (diffDays < 0) {
    return {
      label: `${Math.abs(diffDays)}d atrasado`,
      tone: 'text-red-400',
      badge: 'bg-red-500/10 border-red-500/20',
      rank: 0
    };
  }

  if (diffDays === 0) {
    return {
      label: 'Hoje',
      tone: 'text-cyber-gold',
      badge: 'bg-cyber-gold/10 border-cyber-gold/20',
      rank: 1
    };
  }

  if (diffDays <= 3) {
    return {
      label: `${diffDays}d`,
      tone: 'text-primary',
      badge: 'bg-primary/10 border-primary/20',
      rank: 2
    };
  }

  return {
    label: `${diffDays}d`,
    tone: 'text-cyber-emerald',
    badge: 'bg-cyber-emerald/10 border-cyber-emerald/20',
    rank: 3
  };
};

const getSuggestedNextAction = (project: Project) => {
  if (project.status === 'prospect') return 'Registrar retorno comercial e mover o lead para próxima etapa';
  if (project.status === 'finished') return 'Pedir depoimento, publicar case e abrir oportunidade recorrente';
  return 'Executar os combinados do follow-up e fechar a próxima entrega';
};

const getMeetingTypeStyle = (kind?: MeetingType) => {
  if (kind === 'discovery') return 'bg-cyber-gold/10 text-cyber-gold border-cyber-gold/20';
  if (kind === 'kickoff') return 'bg-primary/10 text-primary border-primary/20';
  if (kind === 'delivery') return 'bg-cyber-emerald/10 text-cyber-emerald border-cyber-emerald/20';
  if (kind === 'postDelivery') return 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20';
  return 'bg-white/10 text-white/80 border-white/10';
};

const getEffectiveInstallmentStatus = (installment: ProjectInstallment) => {
  if (installment.status === 'paid') return 'paid';
  const dueTimestamp = getDateTimestamp(installment.dueDate);
  if (dueTimestamp && dueTimestamp < new Date().setHours(0, 0, 0, 0)) return 'overdue';
  return installment.status;
};

const getInstallmentStatusStyle = (status: ProjectInstallment['status']) => {
  if (status === 'paid') return 'bg-cyber-emerald/10 text-cyber-emerald border-cyber-emerald/20';
  if (status === 'overdue') return 'bg-red-500/10 text-red-400 border-red-500/20';
  return 'bg-cyber-gold/10 text-cyber-gold border-cyber-gold/20';
};

const getProjectCostsTotal = (project: Project) => project.costs?.reduce((acc, cost) => acc + cost.value, 0) || 0;

const getProjectReceivedTotal = (project: Project) => (
  project.financials.installments.reduce((acc, installment) => (
    getEffectiveInstallmentStatus(installment) === 'paid' ? acc + installment.amount : acc
  ), 0)
);

const getProjectOutstandingTotal = (project: Project) => Math.max(0, project.financials.proposalValue - getProjectReceivedTotal(project));

const getProjectMarginTotal = (project: Project) => project.financials.proposalValue - getProjectCostsTotal(project);

const getProjectMarginPercentage = (project: Project) => {
  if (!project.financials.proposalValue) return 0;
  return Math.round((getProjectMarginTotal(project) / project.financials.proposalValue) * 100);
};

const getProjectPaymentStatus = (project: Project): ProjectPaymentStatus => {
  if (!project.financials.proposalValue) return 'draft';
  const received = getProjectReceivedTotal(project);
  const hasOverdue = project.financials.installments.some(installment => getEffectiveInstallmentStatus(installment) === 'overdue');
  if (received >= project.financials.proposalValue) return 'paid';
  if (hasOverdue) return 'overdue';
  if (received > 0) return 'partial';
  return 'pending';
};

const getPaymentStatusStyle = (status: ProjectPaymentStatus) => {
  if (status === 'paid') return 'bg-cyber-emerald/10 text-cyber-emerald border-cyber-emerald/20';
  if (status === 'partial') return 'bg-primary/10 text-primary border-primary/20';
  if (status === 'overdue') return 'bg-red-500/10 text-red-400 border-red-500/20';
  if (status === 'draft') return 'bg-white/10 text-muted-foreground border-white/10';
  return 'bg-cyber-gold/10 text-cyber-gold border-cyber-gold/20';
};

const getPostDeliveryAreaLabel = (area: ProjectPostDeliveryStep['area']) => {
  if (area === 'testimonial') return 'Depoimento';
  if (area === 'case') return 'Case';
  if (area === 'portfolio') return 'Portfólio';
  if (area === 'referral') return 'Indicação';
  return 'Upsell';
};

const getPlaybookTemplateMeta = (templateId: PlaybookTemplateId) => PLAYBOOK_TEMPLATES[templateId];

const normalizeProject = (project: Partial<Project>): Project => ({
  id: project.id || `p-${Date.now()}`,
  clientName: project.clientName || 'Cliente sem nome',
  projectName: project.projectName || 'Projeto sem nome',
  brief: project.brief || '',
  status: project.status || 'prospect',
  value: typeof project.value === 'number' ? project.value : 0,
  deadline: project.deadline || 'A definir',
  accesses: Array.isArray(project.accesses) ? project.accesses : [],
  tasks: Array.isArray(project.tasks) ? project.tasks : [],
  costs: Array.isArray(project.costs) ? project.costs : [],
  stakeholders: Array.isArray(project.stakeholders) ? project.stakeholders : [],
  meetingNotes: Array.isArray(project.meetingNotes)
    ? project.meetingNotes.map((note) => ({
        date: typeof note?.date === 'string' && note.date.trim() ? note.date : getTodayDate(),
        content: typeof note?.content === 'string' ? note.content : '',
        title: typeof note?.title === 'string' ? note.title : undefined,
        kind: typeof note?.kind === 'string' && MEETING_TYPE_OPTIONS.some(option => option.value === note.kind)
          ? note.kind
          : undefined,
        outcome: typeof note?.outcome === 'string' ? note.outcome : undefined,
        nextStep: typeof note?.nextStep === 'string' ? note.nextStep : undefined
      }))
    : [],
  documents: Array.isArray(project.documents) ? project.documents : [],
  stage: project.stage || getStageFromStatus(project.status),
  nextAction: project.nextAction || getDefaultNextAction(project.status),
  followUpDate: project.followUpDate || getDefaultFollowUpDate(project.deadline),
  workflowSteps: createWorkflowSteps(project.status, project.workflowSteps),
  financials: {
    proposalValue: typeof project.financials?.proposalValue === 'number' ? project.financials.proposalValue : (typeof project.value === 'number' ? project.value : 0),
    paymentMethod: typeof project.financials?.paymentMethod === 'string' ? project.financials.paymentMethod : 'A definir',
    invoiceStatus: project.financials?.invoiceStatus === 'issued' || project.financials?.invoiceStatus === 'paid' ? project.financials.invoiceStatus : 'pending',
    installments: Array.isArray(project.financials?.installments)
      ? project.financials.installments.map((installment) => ({
          id: typeof installment?.id === 'string' && installment.id.trim() ? installment.id : `inst-${Date.now()}`,
          label: typeof installment?.label === 'string' && installment.label.trim() ? installment.label : 'Parcela',
          amount: typeof installment?.amount === 'number' ? installment.amount : 0,
          dueDate: typeof installment?.dueDate === 'string' && installment.dueDate.trim() ? installment.dueDate : getTodayDate(),
          status: installment?.status === 'paid' || installment?.status === 'overdue' ? installment.status : 'pending'
        }))
      : []
  },
  postDeliverySteps: createPostDeliverySteps(project.status, project.postDeliverySteps),
  playbook: createProjectPlaybook(project)
});

const normalizeCompany = (company?: Partial<CompanyProfile> | null): CompanyProfile => ({
  ...INITIAL_COMPANY,
  ...company,
  bankInfo: company?.bankInfo || INITIAL_COMPANY.bankInfo,
});

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const DEFAULT_PERMISSIONS = PERMISSION_CATALOG.reduce((acc, permission) => {
  acc[permission.key] = false;
  return acc;
}, {} as CollaborationMember['permissions']);

type AdminTab = 'proposals' | 'crm' | 'ops' | 'erp' | 'board' | 'dashboard' | 'company' | 'server' | 'team';
type DashboardSubTab = 'insights' | 'finance' | 'server';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const PROJECT_COLUMNS: BoardColumn[] = [
  { id: 'owner', title: 'Responsável', type: 'person', width: 120 },
  { id: 'status', title: 'Status', type: 'status', width: 140 },
  { id: 'timeline', title: 'Cronograma', type: 'timeline', width: 180 },
  { id: 'priority', title: 'Prioridade', type: 'priority', width: 120 },
  { id: 'budget', title: 'Orçamento', type: 'number', width: 130 },
  { id: 'link', title: 'Documentos', type: 'link', width: 100 },
];

const ERP_COLUMNS: BoardColumn[] = [
  { id: 'category', title: 'Categoria', type: 'tags', width: 120 },
  { id: 'value', title: 'Valor Mensal', type: 'number', width: 140 },
  { id: 'status', title: 'Status Pagamento', type: 'status', width: 140 },
  { id: 'dueDate', title: 'Vencimento', type: 'date', width: 120 },
  { id: 'provider', title: 'Fornecedor', type: 'text', width: 150 },
];

const CRM_COLUMNS: BoardColumn[] = [
  { id: 'contact', title: 'Contato Principal', type: 'person', width: 150 },
  { id: 'stage', title: 'Etapa Funil', type: 'status', width: 140 },
  { id: 'dealValue', title: 'Valor Estimado', type: 'number', width: 130 },
  { id: 'lastContact', title: 'Último Contato', type: 'date', width: 120 },
  { id: 'priority', title: 'Prioridade', type: 'priority', width: 120 },
];

const WORKSPACES: Workspace[] = [
  {
    id: 'ws-growth',
    name: 'Crescimento & Vendas',
    icon: 'TrendingUp',
    boards: [
      {
        id: 'board-crm',
        name: 'Funil de Vendas (CRM)',
        description: 'Gestão de leads e oportunidades de negócio.',
        columns: CRM_COLUMNS,
        groups: [
          {
            id: 'g-leads',
            title: 'Novos Leads',
            color: '#579BFC',
            items: [
              { id: 'l1', name: 'Imobiliária HighEnd', values: { stage: 'Qualificação', dealValue: 15000, priority: 'Alta' } },
              { id: 'l3', name: 'Escola de Idiomas', values: { stage: 'Lead', dealValue: 5000, priority: 'Média' } }
            ]
          },
          {
            id: 'g-negotiation',
            title: 'Em Negociação',
            color: '#FFCB00',
            items: [
              { id: 'l2', name: 'Academia FitLife', values: { stage: 'Proposta Enviada', dealValue: 8000, priority: 'Média' } }
            ]
          },
          {
            id: 'g-closed',
            title: 'Ganhos',
            color: '#00C875',
            items: [
              { id: 'l4', name: 'Restaurante Sabor', values: { stage: 'Contrato Assinado', dealValue: 12000, priority: 'Baixa' } }
            ]
          }
        ]
      },
      {
        id: 'board-proposals',
        name: 'Propostas Enviadas',
        description: 'Histórico de propostas comerciais.',
        columns: [
          { id: 'client', title: 'Cliente', type: 'text', width: 150 },
          { id: 'date', title: 'Data Envio', type: 'date', width: 120 },
          { id: 'status', title: 'Status', type: 'status', width: 140 },
          { id: 'value', title: 'Valor', type: 'number', width: 130 }
        ],
        groups: [
          {
            id: 'g-sent',
            title: 'Aguardando Resposta',
            color: '#fdab3d',
            items: [
              { id: 'p-1', name: 'Proposta Automação ETL', values: { client: 'Global RJ', date: '2026-03-05', status: 'Trabalhando nisso', value: 8500 } }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ws-delivery',
    name: 'Operações & Projetos',
    icon: 'Kanban',
    boards: [
      {
        id: 'board-main',
        name: 'Projetos Ativos',
        description: 'Acompanhamento de entregas e sprints.',
        columns: PROJECT_COLUMNS,
        groups: [
          {
            id: 'g-dev',
            title: 'Em Desenvolvimento',
            color: '#00C875',
            items: [
              {
                id: 'i1',
                name: 'Automação de ETL - Global RJ',
                values: {
                  owner: 'Adriano',
                  status: 'Trabalhando nisso',
                  timeline: { from: '2026-03-05', to: '2026-04-15' },
                  priority: 'Alta',
                  budget: 8500,
                  link: 'https://notion.so/global-rj'
                }
              }
            ]
          },
          {
            id: 'g-planning',
            title: 'Planejamento / Onboarding',
            color: '#579BFC',
            items: [
              {
                id: 'i2',
                name: 'Clube do Café',
                values: {
                  owner: 'Adriano',
                  status: 'Não iniciado',
                  priority: 'Média',
                  budget: 4500
                }
              }
            ]
          }
        ]
      },
      {
        id: 'board-backlog',
        name: 'Backlog de Tarefas',
        description: 'Lista de pendências e melhorias.',
        columns: [
          { id: 'project', title: 'Projeto', type: 'text', width: 150 },
          { id: 'priority', title: 'Prioridade', type: 'priority', width: 120 },
          { id: 'status', title: 'Status', type: 'status', width: 140 }
        ],
        groups: [
          {
            id: 'g-backlog',
            title: 'Próximos Sprints',
            color: '#784BD1',
            items: [
              { id: 'b1', name: 'Refatorar API de Pagamento', values: { project: 'E-commerce X', priority: 'Alta', status: 'Não iniciado' } }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ws-finance',
    name: 'Gestão Financeira (ERP)',
    icon: 'DollarSign',
    boards: [
      {
        id: 'board-expenses',
        name: 'Custos Fixos & Variáveis',
        description: 'Controle de ferramentas, VPS e terceiros.',
        columns: ERP_COLUMNS,
        groups: [
          {
            id: 'g-tech',
            title: 'Tecnologias & Infra',
            color: '#A25DDC',
            items: [
              { id: 'e1', name: 'DigitalOcean VPS', values: { category: 'Infra', value: 60, status: 'Pronto', dueDate: '2026-04-01', provider: 'DigitalOcean' } },
              { id: 'e2', name: 'OpenAI API', values: { category: 'IA', value: 150, status: 'Trabalhando nisso', dueDate: '2026-04-10', provider: 'OpenAI' } }
            ]
          },
          {
            id: 'g-contractors',
            title: 'Terceirizados',
            color: '#FF642E',
            items: [
              { id: 'e3', name: 'Dev Frontend (Lucas)', values: { category: 'Dev', value: 2500, status: 'Não iniciado', dueDate: '2026-04-05', provider: 'Lucas Silva' } }
            ]
          }
        ]
      },
      {
        id: 'board-revenue',
        name: 'Fluxo de Receita',
        description: 'Entradas de projetos e recorrência.',
        columns: [
          { id: 'client', title: 'Cliente', type: 'text', width: 150 },
          { id: 'value', title: 'Valor Bruto', type: 'number', width: 140 },
          { id: 'status', title: 'Status Recebimento', type: 'status', width: 140 },
          { id: 'date', title: 'Data Prevista', type: 'date', width: 120 }
        ],
        groups: [
          {
            id: 'g-recurring',
            title: 'Contratos Recorrentes',
            color: '#00C875',
            items: [
              { id: 'r1', name: 'Manutenção Global RJ', values: { client: 'Global RJ', value: 1500, status: 'Pronto', date: '2026-04-01' } }
            ]
          }
        ]
      }
    ]
  }
];

// --- Sub-componente BoardView (Monday.com Style) ---

const BoardView = ({ board, onUpdateCell, onAddItem, onAddGroup, onDeleteItem, onDeleteGroup }: { 
  board: Board, 
  onUpdateCell: (groupId: string, itemId: string, columnId: string, value: any) => void,
  onAddItem: (groupId: string) => void,
  onAddGroup: () => void,
  onDeleteItem: (groupId: string, itemId: string) => void,
  onDeleteGroup: (groupId: string) => void
}) => {
  return (
    <div className="space-y-12">
      {board.groups.map(group => (
        <div key={group.id} className="space-y-0 relative group/g">
          {/* Header do Grupo */}
          <div className="flex items-center gap-2 sm:gap-3 mb-2 group/title overflow-hidden">
            <div className="w-1 h-5 sm:h-6 rounded-full shrink-0" style={{ backgroundColor: group.color }} />
            <h3 className="text-xs sm:text-lg font-bold truncate" style={{ color: group.color }}>{group.title}</h3>
            <span className="text-[8px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-wider shrink-0">{group.items.length} itens</span>
            <button 
              onClick={() => onDeleteGroup(group.id)}
              className="opacity-0 group-hover/g:opacity-100 p-1 hover:text-red-500 transition-all ml-1 sm:ml-2 shrink-0"
              title="Remover Grupo"
            >
              <Trash2 size={10} className="sm:size-[14px]" />
            </button>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.01] custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px] sm:min-w-[1000px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-2 sm:p-3 w-10 sm:w-12 sticky left-0 bg-cyber-black z-10"></th>
                  <th className="p-2 sm:p-3 font-bold text-[10px] sm:text-[11px] uppercase text-muted-foreground sticky left-10 sm:left-12 bg-cyber-black z-10 w-48 sm:w-64 border-r border-white/5">Nome do Item</th>
                  {board.columns.map(col => (
                    <th key={col.id} className="p-2 sm:p-3 font-bold text-[10px] sm:text-[11px] uppercase text-muted-foreground text-center border-r border-white/5" style={{ width: col.width }}>
                      {col.title}
                    </th>
                  ))}
                  <th className="p-2 sm:p-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {group.items.map(item => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group/row">
                    <td className="p-2 sm:p-3 text-center sticky left-0 bg-cyber-black group-hover/row:bg-white/5 transition-colors">
                      <div className="w-1 h-6 sm:h-8 rounded-full mx-auto" style={{ backgroundColor: group.color }} />
                    </td>
                    <td className="p-2 sm:p-3 sticky left-10 sm:left-12 bg-cyber-black group-hover/row:bg-white/5 transition-colors border-r border-white/5">
                      <input 
                        id={`item-name-${item.id}`}
                        name={`item-name-${item.id}`}
                        className="bg-transparent border-none outline-none text-xs sm:text-sm font-medium w-full focus:ring-1 focus:ring-primary/50 rounded px-1"
                        value={item.name}
                        onChange={(e) => onUpdateCell(group.id, item.id, 'name', e.target.value)}
                      />
                    </td>
                    {board.columns.map(col => (
                      <td key={col.id} className="p-0 border-r border-white/5 text-center align-middle h-full">
                        {col.type === 'status' && (
                          <div 
                            className={`h-10 sm:h-12 flex items-center justify-center text-[10px] sm:text-[11px] font-bold cursor-pointer transition-all hover:brightness-110 active:scale-95`}
                            style={{ 
                              backgroundColor: 
                                item.values[col.id] === 'Pronto' ? '#00c875' : 
                                item.values[col.id] === 'Trabalhando nisso' ? '#fdab3d' : 
                                item.values[col.id] === 'Bloqueado' ? '#e2445c' : '#c4c4c4'
                            }}
                            onClick={() => {
                              const options = ['Pronto', 'Trabalhando nisso', 'Bloqueado', 'Não iniciado'];
                              const currentIdx = options.indexOf(item.values[col.id]);
                              const next = options[(currentIdx + 1) % options.length];
                              onUpdateCell(group.id, item.id, col.id, next);
                            }}
                          >
                            <span className="truncate px-1">{item.values[col.id] || 'Não iniciado'}</span>
                          </div>
                        )}
                        {col.type === 'priority' && (
                          <div 
                            className={`h-10 sm:h-12 flex items-center justify-center text-[10px] sm:text-[11px] font-bold cursor-pointer transition-all hover:brightness-110`}
                            style={{ 
                              backgroundColor: 
                                item.values[col.id] === 'Alta' ? '#401694' : 
                                item.values[col.id] === 'Média' ? '#5559df' : 
                                item.values[col.id] === 'Baixa' ? '#579bfc' : '#c4c4c4'
                            }}
                            onClick={() => {
                              const options = ['Alta', 'Média', 'Baixa', '-'];
                              const currentIdx = options.indexOf(item.values[col.id]);
                              const next = options[(currentIdx + 1) % options.length];
                              onUpdateCell(group.id, item.id, col.id, next);
                            }}
                          >
                            {item.values[col.id] || '-'}
                          </div>
                        )}
                        {col.type === 'number' && (
                          <input 
                            id={`item-${item.id}-col-${col.id}`}
                            name={`item-${item.id}-col-${col.id}`}
                            type="number"
                            className="bg-transparent border-none outline-none text-[10px] sm:text-xs text-center w-full h-10 sm:h-12 px-2 focus:bg-white/5"
                            value={item.values[col.id] || ''}
                            onChange={(e) => onUpdateCell(group.id, item.id, col.id, Number(e.target.value))}
                            placeholder="0"
                          />
                        )}
                        {col.type === 'person' && (
                          <div className="flex items-center justify-center h-10 sm:h-12 gap-1.5 sm:gap-2 group/person cursor-pointer hover:bg-white/5 px-2">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-primary">
                              {(item.values[col.id] || 'A').charAt(0)}
                            </div>
                            <span className="text-[10px] sm:text-[11px] text-muted-foreground group-hover/person:text-white transition-colors truncate max-w-[60px]">{item.values[col.id] || 'Atribuir'}</span>
                          </div>
                        )}
                        {col.type === 'timeline' && (
                          <div className="px-2 sm:px-3 h-10 sm:h-12 flex items-center justify-center">
                            <div className="w-full bg-white/10 h-4 sm:h-5 rounded-full relative overflow-hidden flex items-center justify-center group/timeline cursor-pointer hover:bg-white/20 transition-colors">
                              <span className="text-[8px] sm:text-[9px] font-bold relative z-10 text-white/80 truncate px-1">
                                {item.values[col.id]?.from ? `${new Date(item.values[col.id].from).toLocaleDateString('pt-BR', {day: 'numeric', month: 'short'})} - ${new Date(item.values[col.id].to).toLocaleDateString('pt-BR', {day: 'numeric', month: 'short'})}` : 'Definir'}
                              </span>
                              {item.values[col.id]?.from && (
                                <div className="absolute inset-0 bg-primary/30" />
                              )}
                            </div>
                          </div>
                        )}
                        {col.type === 'date' && (
                          <input 
                            id={`item-${item.id}-col-${col.id}`}
                            name={`item-${item.id}-col-${col.id}`}
                            type="date"
                            className="bg-transparent border-none outline-none text-[10px] sm:text-[11px] text-center w-full h-10 sm:h-12 px-2 focus:bg-white/5 text-muted-foreground"
                            value={item.values[col.id] || ''}
                            onChange={(e) => onUpdateCell(group.id, item.id, col.id, e.target.value)}
                          />
                        )}
                        {col.type === 'link' && (
                          <div className="flex items-center justify-center h-10 sm:h-12">
                            {item.values[col.id] ? (
                              <a href={item.values[col.id]} target="_blank" rel="noopener noreferrer" className="text-primary hover:scale-110 transition-transform">
                                <ExternalLink size={12} className="sm:size-[14px]" />
                              </a>
                            ) : (
                              <button className="text-muted-foreground hover:text-white transition-colors">
                                <Plus size={12} className="sm:size-[14px]" />
                              </button>
                            )}
                          </div>
                        )}
                        {col.type === 'tags' && (
                          <div className="flex flex-wrap gap-1 justify-center items-center h-10 sm:h-12 px-2">
                            <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[8px] sm:text-[9px] font-bold uppercase truncate max-w-[50px]">
                              {item.values[col.id] || 'Tag'}
                            </span>
                          </div>
                        )}
                        {col.type === 'text' && (
                          <input 
                            id={`item-${item.id}-col-${col.id}`}
                            name={`item-${item.id}-col-${col.id}`}
                            className="bg-transparent border-none outline-none text-[10px] sm:text-[11px] text-center w-full h-10 sm:h-12 px-2 focus:bg-white/5"
                            value={item.values[col.id] || ''}
                            onChange={(e) => onUpdateCell(group.id, item.id, col.id, e.target.value)}
                            placeholder="..."
                          />
                        )}
                      </td>
                    ))}
                    <td className="p-2 sm:p-3 text-right">
                      <button 
                        onClick={() => onDeleteItem(group.id, item.id)}
                        className="opacity-0 group-hover/row:opacity-100 text-muted-foreground hover:text-red-400 transition-all p-1"
                        title="Excluir Item"
                      >
                        <Trash2 size={12} className="sm:size-[14px]" />
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Rodapé Adicionar Item */}
                <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group/add">
                  <td className="p-2 sm:p-3 sticky left-0 bg-cyber-black group-hover/add:bg-white/[0.02] z-10"></td>
                  <td colSpan={board.columns.length + 2} className="p-0 sticky left-10 sm:left-12 bg-cyber-black group-hover/add:bg-white/[0.02] z-10">
                    <button 
                      onClick={() => onAddItem(group.id)}
                      className="w-full text-left px-3 py-2.5 sm:py-3 text-[11px] sm:text-xs text-muted-foreground hover:text-white flex items-center gap-2 transition-colors"
                    >
                      <Plus size={12} className="sm:size-[14px]" /> Adicionar novo item
                    </button>
                  </td>
                </tr>
              </tbody>
              {/* Footer de Resumo do Grupo */}
              <tfoot className="bg-white/[0.02]">
                <tr>
                  <td className="p-1 sm:p-2 sticky left-0 bg-cyber-black z-10"></td>
                  <td className="p-1 sm:p-2 sticky left-10 sm:left-12 bg-cyber-black border-r border-white/5 z-10"></td>
                  {board.columns.map(col => (
                    <td key={col.id} className="p-1 sm:p-2 border-r border-white/5 text-center">
                      {col.type === 'number' && (
                        <div className="text-[9px] sm:text-[10px] font-mono font-bold text-muted-foreground truncate px-1">
                          Σ R$ {group.items.reduce((acc, item) => acc + (Number(item.values[col.id]) || 0), 0).toLocaleString('pt-BR')}
                        </div>
                      )}
                      {col.type === 'status' && (
                        <div className="flex h-1 sm:h-1.5 w-full bg-white/5 rounded-full overflow-hidden mx-1">
                          <div className="bg-[#00c875]" style={{ width: `${(group.items.filter(i => i.values[col.id] === 'Pronto').length / Math.max(group.items.length, 1)) * 100}%` }} />
                          <div className="bg-[#fdab3d]" style={{ width: `${(group.items.filter(i => i.values[col.id] === 'Trabalhando nisso').length / Math.max(group.items.length, 1)) * 100}%` }} />
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="p-1 sm:p-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ))}

      <button 
        onClick={onAddGroup}
        className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-muted-foreground hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-sm font-bold"
      >
        <Plus size={18} /> Criar Novo Grupo
      </button>
    </div>
  );
};

const ServerStatsView = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/system/stats`, { headers: getHeaders() });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Erro ao buscar stats do servidor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Atualiza a cada 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">Conectando ao Servidor...</p>
      </div>
    );
  }

  if (!stats) return <div className="text-center py-20 text-muted-foreground">Não foi possível carregar dados do servidor.</div>;

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* CPU */}
        <div className="glass p-4 sm:p-6 rounded-2xl border-white/5 space-y-3 sm:space-y-4 relative overflow-hidden group hover:border-white/10 transition-all hover:scale-[1.01]">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <Cpu size={60} className="sm:size-[80px]" />
          </div>
          <div className="flex justify-between items-center">
            <div className="p-2 sm:p-3 rounded-xl bg-blue-500/10 text-blue-500 shadow-inner group-hover:scale-110 transition-transform">
              <Cpu size={18} className="sm:size-[24px]" />
            </div>
            <div className="text-right">
              <p className="text-[8px] sm:text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Processador</p>
              <p className="text-[10px] sm:text-xs font-bold truncate max-w-[80px] sm:max-w-[120px]">{stats.cpu.model.split(' ')[0]}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-muted-foreground">Carga (1/5/15m)</span>
              <span className="font-bold font-mono">{stats.cpu.load[0].toFixed(2)}</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(stats.cpu.load[0] * 10, 100)}%` }}
                className={`h-full transition-all duration-1000 ${stats.cpu.load[0] > 2 ? 'bg-red-500' : 'bg-blue-500'}`}
              />
            </div>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground flex items-center gap-1">
              <Activity size={10} className="text-blue-500" /> {stats.cpu.cores} núcleos ativos
            </p>
          </div>
        </div>

        {/* Memory */}
        <div className="glass p-4 sm:p-6 rounded-2xl border-white/5 space-y-3 sm:space-y-4 relative overflow-hidden group hover:border-white/10 transition-all hover:scale-[1.01]">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <Database size={60} className="sm:size-[80px]" />
          </div>
          <div className="flex justify-between items-center">
            <div className="p-2 sm:p-3 rounded-xl bg-purple-500/10 text-purple-500 shadow-inner group-hover:scale-110 transition-transform">
              <Database size={18} className="sm:size-[24px]" />
            </div>
            <div className="text-right">
              <p className="text-[8px] sm:text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Memória RAM</p>
              <p className="text-[10px] sm:text-xs font-bold">{(stats.memory.total / (1024**3)).toFixed(1)} GB Total</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-muted-foreground">Uso Atual</span>
              <span className="font-bold font-mono">{stats.memory.usage}%</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stats.memory.usage}%` }}
                className={`h-full transition-all duration-1000 ${stats.memory.usage > 80 ? 'bg-red-500' : 'bg-purple-500'}`}
              />
            </div>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground flex items-center gap-1">
              <CheckCircle2 size={10} className="text-purple-500" /> {(stats.memory.free / (1024**3)).toFixed(1)} GB disponíveis
            </p>
          </div>
        </div>

        {/* Uptime */}
        <div className="glass p-4 sm:p-6 rounded-2xl border-white/5 space-y-3 sm:space-y-4 relative overflow-hidden group hover:border-white/10 transition-all hover:scale-[1.01]">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <Clock size={60} className="sm:size-[80px]" />
          </div>
          <div className="flex justify-between items-center">
            <div className="p-2 sm:p-3 rounded-xl bg-cyber-emerald/10 text-cyber-emerald shadow-inner group-hover:scale-110 transition-transform">
              <Clock size={18} className="sm:size-[24px]" />
            </div>
            <div className="text-right">
              <p className="text-[8px] sm:text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Tempo Online</p>
              <p className="text-[10px] sm:text-xs font-bold">SLA: 99.9%</p>
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-xl sm:text-3xl font-bold font-heading text-cyber-emerald">{(stats.uptime / 86400).toFixed(1)}d</h4>
            <p className="text-[8px] sm:text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Dias ininterruptos</p>
          </div>
          <div className="pt-2 flex items-center gap-2 text-[9px] sm:text-[10px] text-cyber-emerald font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-emerald animate-pulse shadow-[0_0_8px_#00C875]" />
            Servidor Estável
          </div>
        </div>

        {/* OS Info */}
        <div className="glass p-4 sm:p-6 rounded-2xl border-white/5 space-y-3 sm:space-y-4 relative overflow-hidden group hover:border-white/10 transition-all hover:scale-[1.01]">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <HardDrive size={60} className="sm:size-[80px]" />
          </div>
          <div className="flex justify-between items-center">
            <div className="p-2 sm:p-3 rounded-xl bg-orange-500/10 text-orange-500 shadow-inner group-hover:scale-110 transition-transform">
              <HardDrive size={18} className="sm:size-[24px]" />
            </div>
            <div className="text-right">
              <p className="text-[8px] sm:text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Sistema Operacional</p>
              <p className="text-[10px] sm:text-xs font-bold capitalize truncate max-w-[80px] sm:max-w-none">{stats.platform} {stats.arch}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] sm:text-xs">
              <span className="text-muted-foreground">Hostname</span>
              <span className="font-mono text-[9px] sm:text-[10px] bg-white/5 px-1.5 py-0.5 rounded truncate max-w-[80px] sm:max-w-none">{stats.hostname}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] sm:text-xs">
              <span className="text-muted-foreground">Kernel</span>
              <span className="font-mono text-[9px] sm:text-[10px] truncate max-w-[80px] sm:max-w-[100px]">{stats.release}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Network & Logs (Placeholder for more data) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-6 rounded-2xl border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Network size={16} className="text-primary" /> Atividade de Rede
            </h3>
            <div className="flex items-center gap-4 text-[10px] font-bold">
              <div className="flex items-center gap-1.5 text-cyber-emerald">
                <div className="w-2 h-2 rounded-full bg-cyber-emerald" /> Upload
              </div>
              <div className="flex items-center gap-1.5 text-blue-500">
                <div className="w-2 h-2 rounded-full bg-blue-500" /> Download
              </div>
            </div>
          </div>
          <div className="h-40 flex items-center justify-center text-muted-foreground text-xs italic bg-white/[0.02] rounded-xl border border-dashed border-white/10">
            Gráfico de tráfego em tempo real (Mock)
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border-white/5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
            <ShieldAlert size={16} className="text-cyber-gold" /> Logs de Segurança
          </h3>
          <div className="space-y-3">
            {[
              { time: '2m ago', msg: 'Sucesso: Login root via SSH', type: 'success' },
              { time: '15m ago', msg: 'Aviso: Tentativa falha SSH (IP: 192.168.1.1)', type: 'warn' },
              { time: '1h ago', msg: 'Info: Firewall atualizado', type: 'info' },
              { time: '2h ago', msg: 'Sucesso: Backup diário concluído', type: 'success' },
            ].map((log, i) => (
              <div key={i} className="flex items-start gap-3 text-[10px]">
                <span className="text-muted-foreground whitespace-nowrap">{log.time}</span>
                <span className={`${log.type === 'warn' ? 'text-cyber-gold' : log.type === 'success' ? 'text-cyber-emerald' : 'text-blue-500'}`}>
                  {log.msg}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardView = ({ projects, workspaces, onNewWorkspace, onNewLead, onOpenProject, onSnoozeFollowUp, onCompleteFollowUp }: { 
  projects: Project[], 
  workspaces: Workspace[],
  onNewWorkspace: () => void,
  onNewLead: () => void,
  onOpenProject: (projectId: string) => void,
  onSnoozeFollowUp: (projectId: string, days: number) => void,
  onCompleteFollowUp: (projectId: string) => void
}) => {
  const activeWorkspacesCount = workspaces.length;
  const totalLeads = projects.filter(p => p.status === 'prospect').length;
  const activeProjectsCount = projects.filter(p => p.status === 'active').length;
  const totalPipelineValue = projects.reduce((acc, p) => acc + (p.value || 0), 0);
  const winRate = projects.length > 0 ? Math.round((projects.filter(p => p.status === 'finished' || p.status === 'active').length / projects.length) * 100) : 0;
  const mrrEstimated = projects
    .filter(p => p.status === 'active' || p.status === 'finished')
    .reduce((acc, p) => acc + (p.value || 0), 0) / 6;

  // Gerar dados do gráfico a partir dos projetos finalizados e ativos
  const getMonthlyRevenue = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentMonth = new Date().getMonth();
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthIdx = (currentMonth - i + 12) % 12;
      last6Months.push({
        name: months[monthIdx],
        value: 0,
        monthIdx
      });
    }

    projects.forEach(p => {
      if (p.status === 'active' || p.status === 'finished') {
        // Usa a data de criação ou fallback para hoje se não houver deadline
        const date = p.deadline && p.deadline !== 'A definir' ? new Date(p.deadline) : new Date();
        const monthIdx = date.getMonth();
        const chartMonth = last6Months.find(m => m.monthIdx === monthIdx);
        if (chartMonth) {
          chartMonth.value += (p.value || 0);
        }
      }
    });

    // Se todos os valores forem zero, adiciona um fallback visual para não quebrar o gráfico
    const hasData = last6Months.some(m => m.value > 0);
    if (!hasData) {
      // Opcional: injetar dados fake apenas se realmente não houver nada para o gráfico não ficar vazio
      // Ou apenas retornar os zeros e deixar o gráfico plano (que é o comportamento correto para "sem dados")
    }

    return last6Months;
  };

  const chartData = getMonthlyRevenue();
  const soloRadarProjects = [...projects]
    .filter(project => project.nextAction || project.followUpDate)
    .sort((a, b) => {
      const aDate = a.followUpDate ? new Date(a.followUpDate).getTime() : Number.MAX_SAFE_INTEGER;
      const bDate = b.followUpDate ? new Date(b.followUpDate).getTime() : Number.MAX_SAFE_INTEGER;
      return aDate - bDate;
    })
    .slice(0, 4);
  const followUpProjects = [...projects]
    .filter(project => getDateTimestamp(project.followUpDate))
    .sort((a, b) => {
      const aMeta = getFollowUpMeta(a.followUpDate);
      const bMeta = getFollowUpMeta(b.followUpDate);
      if (aMeta.rank !== bMeta.rank) return aMeta.rank - bMeta.rank;
      return (getDateTimestamp(a.followUpDate) || Number.MAX_SAFE_INTEGER) - (getDateTimestamp(b.followUpDate) || Number.MAX_SAFE_INTEGER);
    });
  const overdueFollowUps = followUpProjects.filter(project => getFollowUpMeta(project.followUpDate).rank === 0).length;
  const todayFollowUps = followUpProjects.filter(project => getFollowUpMeta(project.followUpDate).rank === 1).length;
  const weekFollowUps = followUpProjects.filter(project => getFollowUpMeta(project.followUpDate).rank <= 2).length;
  const followUpAgendaGroups = [
    {
      id: 'overdue',
      label: 'Atrasados',
      description: 'Prioridade máxima para evitar esfriar lead, entrega ou upsell.',
      empty: 'Nenhum follow-up atrasado.',
      style: 'border-red-500/20 bg-red-500/5 text-red-400',
      projects: followUpProjects.filter(project => getFollowUpMeta(project.followUpDate).rank === 0)
    },
    {
      id: 'today',
      label: 'Hoje',
      description: 'Contatos que precisam sair ainda hoje.',
      empty: 'Nada vencendo hoje.',
      style: 'border-cyber-gold/20 bg-cyber-gold/5 text-cyber-gold',
      projects: followUpProjects.filter(project => getFollowUpMeta(project.followUpDate).rank === 1)
    },
    {
      id: 'week',
      label: 'Próximos dias',
      description: 'Fila curta para fechar a semana com o pipeline em dia.',
      empty: 'Sem contatos urgentes para os próximos dias.',
      style: 'border-primary/20 bg-primary/5 text-primary',
      projects: followUpProjects.filter(project => {
        const rank = getFollowUpMeta(project.followUpDate).rank;
        return rank === 2 || rank === 3;
      }).slice(0, 6)
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold font-heading">Business <span className="text-gradient">Insights</span></h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">Visão consolidada da sua operação de consultoria.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full border-cyber-emerald/20 text-cyber-emerald text-[10px] font-bold uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-cyber-emerald animate-pulse" />
          Sistema Online
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-4">
        {[
          { label: 'Workspaces', value: activeWorkspacesCount, sub: 'Clientes ativos', icon: Layout, color: 'text-primary' },
          { label: 'Projetos', value: activeProjectsCount, sub: 'Em execução', icon: Kanban, color: 'text-cyber-emerald' },
          { label: 'Total Leads', value: totalLeads, sub: 'Novas ops', icon: Users, color: 'text-cyber-gold' },
          { label: 'Pipeline', value: `R$ ${(totalPipelineValue / 1000).toFixed(1)}k`, sub: 'Valor total', icon: DollarSign, color: 'text-blue-500' },
          { label: 'MRR Est.', value: `R$ ${(mrrEstimated / 1000).toFixed(1)}k`, sub: 'Recorrência', icon: TrendingUp, color: 'text-purple-500' },
          { label: 'Win Rate', value: `${winRate}%`, sub: 'Conversão', icon: Activity, color: 'text-cyber-emerald' },
        ].map((kpi, i) => (
          <div key={i} className="glass p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border-white/5 relative overflow-hidden group hover:border-white/10 transition-all hover:scale-[1.02] duration-300 shadow-lg hover:shadow-primary/5">
            <div className="absolute -right-2 -top-2 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <kpi.icon size={28} className="sm:size-[50px]" />
            </div>
            <div className="flex flex-col gap-0 relative z-10">
              <p className="text-[7px] sm:text-[9px] font-bold uppercase text-muted-foreground tracking-widest truncate">{kpi.label}</p>
              <h3 className="text-sm sm:text-xl font-bold">{kpi.value}</h3>
              <p className="text-[7px] sm:text-[9px] text-muted-foreground mt-0.5 flex items-center gap-1">
                <ArrowUpRight size={8} className="text-cyber-emerald shrink-0" /> <span className="truncate">{kpi.sub}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Chart Area */}
        <div className="xl:col-span-2 glass p-4 sm:p-8 rounded-3xl border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <div className="min-w-0 w-full">
              <h3 className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2 truncate">
                <TrendingUp size={16} className="text-primary shrink-0" /> <span className="truncate">Velocidade de Receita</span>
              </h3>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground truncate">Volume de projetos ativos e finalizados por mês</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="px-2 py-1 bg-cyber-emerald/10 text-cyber-emerald text-[9px] font-bold rounded uppercase border border-cyber-emerald/20">Real-time</div>
              <div className="px-2 py-1 bg-primary/10 text-primary text-[9px] font-bold rounded uppercase border border-primary/20">2026</div>
            </div>
          </div>
          
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                {/* @ts-expect-error - Recharts types incompatibility with React 18 */}
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#888' }}
                  dy={10}
                  minTickGap={10}
                />
                {/* @ts-expect-error - Recharts types incompatibility with React 18 */}
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#888' }}
                  width={35}
                  tickFormatter={(val) => `R$ ${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
                />
                {/* @ts-expect-error - Recharts types incompatibility with React 18 */}
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(5, 5, 5, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    borderRadius: '12px', 
                    fontSize: '10px',
                    backdropFilter: 'blur(4px)',
                    padding: '8px'
                  }}
                  itemStyle={{ color: '#0066FF', padding: 0 }}
                  formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Receita']}
                />
                {/* @ts-expect-error - Recharts types incompatibility with React 18 */}
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0066FF" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Command Center */}
        <div className="space-y-4 sm:space-y-6 h-full">
          <div className="glass p-4 sm:p-8 rounded-[2rem] border-white/5 h-full relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] -z-10 group-hover:bg-primary/20 transition-all duration-700" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyber-gold/5 blur-[40px] -z-10" />
            
            <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-white/50 mb-4 sm:mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-gold animate-pulse" />
              Command Center
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3 sm:gap-4">
              <motion.button 
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNewWorkspace()}
                className="w-full p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 flex items-center gap-3 sm:gap-4 group/btn hover:border-primary/40 transition-all text-left shadow-lg shadow-primary/5"
              >
                <div className="p-2 sm:p-2.5 rounded-xl bg-primary/20 text-primary group-hover/btn:bg-primary group-hover/btn:text-white transition-all shrink-0 shadow-inner">
                  <Plus size={18} className="sm:size-[20px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs font-black text-white group-hover/btn:text-primary transition-colors truncate uppercase tracking-wider">Novo Workspace</p>
                  <p className="text-[8px] sm:text-[10px] text-muted-foreground truncate font-medium">Setup rápido de cliente</p>
                </div>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNewLead()}
                className="w-full p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-cyber-gold/10 to-transparent border border-cyber-gold/20 flex items-center gap-3 sm:gap-4 group/btn hover:border-cyber-gold/40 transition-all text-left shadow-lg shadow-cyber-gold/5"
              >
                <div className="p-2 sm:p-2.5 rounded-xl bg-cyber-gold/20 text-cyber-gold group-hover/btn:bg-cyber-gold group-hover/btn:text-cyber-black transition-all shrink-0 shadow-inner">
                  <MousePointer2 size={18} className="sm:size-[20px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs font-black text-white group-hover/btn:text-cyber-gold transition-colors truncate uppercase tracking-wider">Injetar Lead</p>
                  <p className="text-[8px] sm:text-[10px] text-muted-foreground truncate font-medium">Captura de oportunidade</p>
                </div>
              </motion.button>

              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3 sm:p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-[8px] sm:text-[10px] font-black uppercase text-white/60 tracking-[0.2em]">Radar Solo</h4>
                    <p className="text-[8px] sm:text-[10px] text-muted-foreground">Próximas ações críticas da operação</p>
                  </div>
                  <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[8px] font-bold uppercase border border-primary/20">
                    {soloRadarProjects.length} prioridades
                  </div>
                </div>

                <div className="space-y-2.5">
                  {soloRadarProjects.length > 0 ? soloRadarProjects.map(project => {
                    const completedSteps = project.workflowSteps.filter(step => step.done).length;
                    return (
                      <button
                        key={project.id}
                        onClick={() => onOpenProject(project.id)}
                        className="w-full text-left rounded-xl border border-white/5 bg-black/20 px-3 py-3 hover:border-primary/30 hover:bg-primary/5 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[10px] sm:text-[11px] font-bold truncate">{project.projectName}</p>
                            <p className="text-[9px] sm:text-[10px] text-muted-foreground truncate">{project.clientName}</p>
                          </div>
                          <span className="text-[8px] font-bold uppercase text-cyber-gold shrink-0">{PROJECT_STAGE_OPTIONS.find(option => option.value === project.stage)?.label || 'Pipeline'}</span>
                        </div>
                        <p className="mt-2 text-[9px] sm:text-[10px] text-white/80 line-clamp-2">{project.nextAction || 'Definir próxima ação do projeto'}</p>
                        <div className="mt-2 flex items-center justify-between text-[8px] sm:text-[9px] text-muted-foreground">
                          <span>Follow-up: {formatProjectDate(project.followUpDate)}</span>
                          <span>{completedSteps}/{project.workflowSteps.length} etapas</span>
                        </div>
                      </button>
                    );
                  }) : (
                    <div className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-[9px] sm:text-[10px] text-muted-foreground text-center">
                      Defina próximas ações nos projetos para alimentar o radar da semana.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-5 sm:pt-6 mt-2 sm:mt-4 border-t border-white/5 relative">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <h4 className="text-[8px] sm:text-[10px] font-black uppercase text-white/50 tracking-[0.2em]">Sistemas Ativos</h4>
                    <p className="text-[6px] sm:text-[8px] text-muted-foreground font-medium uppercase mt-0.5">Auto-scaling enabled</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyber-emerald/10 border border-cyber-emerald/20">
                    <div className="w-1 h-1 rounded-full bg-cyber-emerald animate-pulse" />
                    <span className="text-cyber-emerald text-[7px] sm:text-[8px] font-black uppercase tracking-tighter">Live Ops</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {[
                    { name: 'Sales Engine', icon: Target, active: true },
                    { name: 'CRM Core', icon: Users, active: true },
                    { name: 'BI Layer', icon: Activity, active: true },
                    { name: 'Automation', icon: Zap, active: true }
                  ].map((mod, i) => (
                    <div key={i} className="px-2 sm:px-3 py-2 sm:py-3 rounded-xl bg-white/[0.03] border border-white/5 text-[8px] sm:text-[10px] font-bold flex flex-col gap-2 hover:bg-white/[0.08] hover:border-white/10 transition-all cursor-default group/mod">
                      <div className="flex justify-between items-center w-full">
                        <mod.icon size={12} className="text-muted-foreground group-hover/mod:text-primary transition-colors" />
                        <div className="w-1 h-1 rounded-full bg-cyber-emerald shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      </div>
                      <span className="text-muted-foreground group-hover/mod:text-white transition-colors truncate uppercase tracking-tighter">{mod.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-4 sm:gap-6">
        <div className="glass rounded-3xl border-white/5 p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                <Calendar size={16} className="text-primary" /> Agenda de Follow-ups
              </h3>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">Contatos prioritários para manter pipeline, entrega e pós-venda sob controle.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-[8px] sm:text-[9px] font-bold uppercase">
              <span className="px-2.5 py-1 rounded-full border border-red-500/20 bg-red-500/10 text-red-400">{overdueFollowUps} atrasados</span>
              <span className="px-2.5 py-1 rounded-full border border-cyber-gold/20 bg-cyber-gold/10 text-cyber-gold">{todayFollowUps} hoje</span>
              <span className="px-2.5 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary">{weekFollowUps} foco da semana</span>
            </div>
          </div>

          <div className="space-y-4">
            {followUpProjects.length > 0 ? followUpAgendaGroups.map(group => (
              <div key={group.id} className="rounded-2xl border border-white/5 bg-black/20 p-3 sm:p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/80">{group.label}</h4>
                    <p className="text-[8px] sm:text-[9px] text-muted-foreground mt-1">{group.description}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full border text-[8px] font-bold uppercase ${group.style}`}>
                    {group.projects.length}
                  </div>
                </div>

                <div className="space-y-3">
                  {group.projects.length > 0 ? group.projects.map(project => {
                    const meta = getFollowUpMeta(project.followUpDate);
                    const lastContact = project.meetingNotes[0]?.date;

                    return (
                      <div key={project.id} className="rounded-2xl border border-white/5 bg-white/[0.03] p-3 sm:p-4 space-y-3 hover:border-white/10 transition-all">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-[11px] sm:text-sm font-bold truncate">{project.projectName}</p>
                              <span className={`px-2 py-1 rounded-full border text-[8px] font-bold uppercase ${meta.badge} ${meta.tone}`}>{meta.label}</span>
                            </div>
                            <p className="text-[9px] sm:text-[10px] text-muted-foreground truncate">{project.clientName}</p>
                            <p className="mt-2 text-[10px] sm:text-[11px] text-white/80">{project.nextAction || 'Definir próximo contato com o cliente'}</p>
                          </div>

                          <div className="text-[8px] sm:text-[9px] text-muted-foreground space-y-1 shrink-0">
                            <p>Follow-up: {formatProjectDate(project.followUpDate)}</p>
                            <p>Último contato: {lastContact ? formatProjectDate(lastContact) : 'Sem registro'}</p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="text-[8px] sm:text-[9px] text-muted-foreground">
                            Fase atual: {PROJECT_STAGE_OPTIONS.find(option => option.value === project.stage)?.label || 'Pipeline'}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => onOpenProject(project.id)}
                              className="px-3 py-1.5 rounded-xl border border-white/10 text-[9px] sm:text-[10px] font-bold hover:bg-white/5 transition-all"
                            >
                              Abrir projeto
                            </button>
                            <button
                              onClick={() => onSnoozeFollowUp(project.id, 2)}
                              className="px-3 py-1.5 rounded-xl border border-primary/20 bg-primary/10 text-primary text-[9px] sm:text-[10px] font-bold hover:bg-primary/15 transition-all"
                            >
                              +2 dias
                            </button>
                            <button
                              onClick={() => onCompleteFollowUp(project.id)}
                              className="px-3 py-1.5 rounded-xl border border-cyber-emerald/20 bg-cyber-emerald/10 text-cyber-emerald text-[9px] sm:text-[10px] font-bold hover:bg-cyber-emerald/15 transition-all"
                            >
                              Follow-up feito
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="rounded-2xl border border-dashed border-white/10 p-4 text-center text-[10px] sm:text-xs text-muted-foreground">
                      {group.empty}
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-white/10 p-5 text-center text-[10px] sm:text-xs text-muted-foreground">
                Cadastre datas de follow-up nos projetos para montar sua fila de contatos.
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-3xl border-white/5 p-4 sm:p-6 space-y-4">
          <div>
            <h3 className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <AlertCircle size={16} className="text-cyber-gold" /> Brechas Detectadas
            </h3>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">Pontos que mais costumam gerar perda de contexto quando você toca tudo sozinho.</p>
          </div>

          <div className="space-y-3">
            {[
              overdueFollowUps > 0 ? `${overdueFollowUps} follow-up(s) atrasado(s) podem esfriar lead, projeto ou upsell.` : 'Nenhum follow-up atrasado no momento.',
              projects.filter(project => project.tasks.length === 0).length > 0
                ? `${projects.filter(project => project.tasks.length === 0).length} projeto(s) sem tarefas detalhadas ainda.`
                : 'Todos os projetos têm ao menos uma tarefa registrada.',
              projects.filter(project => !project.nextAction.trim()).length > 0
                ? `${projects.filter(project => !project.nextAction.trim()).length} projeto(s) sem próxima ação definida.`
                : 'Todos os projetos têm próxima ação definida.'
            ].map((insight, index) => (
              <div key={index} className="rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-3 text-[10px] sm:text-xs text-white/85">
                {insight}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Componentes ---

export default function AdminDashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [dashboardSubTab, setDashboardSubTab] = useState<DashboardSubTab>('insights');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAcceptingInvite, setIsAcceptingInvite] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [collaborators, setCollaborators] = useState<CollaborationMember[]>([]);
  const [isLoadingCollaborators, setIsLoadingCollaborators] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'viewer' as CollaborationMember['role'],
    note: ''
  });
  
  const [workspaces, setWorkspaces] = useState<Workspace[]>(WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(WORKSPACES[1].id); // Default to Operations
  const [activeBoardId, setActiveBoardId] = useState(WORKSPACES[1].boards[0].id);

  // Estados para Contratos/Propostas
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [clientData, setClientData] = useState({ name: '', cnpj: '', email: '', projectTitle: '', brief: '', profile: 'technical' });
  
  // Estados para CRM/Ops
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [meetingForm, setMeetingForm] = useState({
    date: getTodayDate(),
    kind: 'followup' as MeetingType,
    title: '',
    content: '',
    outcome: '',
    nextStep: '',
    followUpDate: ''
  });
  const [financeForm, setFinanceForm] = useState({
    paymentMethod: 'Pix',
    invoiceStatus: 'pending' as ProjectFinancials['invoiceStatus'],
    installmentLabel: 'Sinal',
    installmentAmount: '',
    installmentDueDate: getTodayDate()
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Project['status'] | 'all'>('all');
  
  // Estados para Empresa
  const [company, setCompany] = useState<CompanyProfile>(INITIAL_COMPANY);
  const [showPreview, setShowPreview] = useState(false);
  const inviteToken = new URLSearchParams(location.search).get('invite');
  const access = user?.adminAccess;
  const permissions = access?.permissions || DEFAULT_PERMISSIONS;
  const isOwner = !!access?.isOwner;
  const canAccessAdmin = !!access?.canAccessAdmin;
  const canViewDashboard = permissions.dashboardView;
  const canViewCRM = permissions.crmView;
  const canViewProjects = permissions.projectsView;
  const canEditProjects = permissions.projectsEdit;
  const canViewWorkspaces = permissions.workspacesView;
  const canEditWorkspaces = permissions.workspacesEdit;
  const canViewCompany = permissions.companyView;
  const canEditCompany = permissions.companyEdit;
  const canViewFinance = permissions.financeView;
  const canViewServer = permissions.serverView;
  const canManageTeam = isOwner && permissions.teamManage;
  const availableTabs = useMemo<Record<AdminTab, boolean>>(() => ({
    dashboard: canViewDashboard,
    proposals: canEditProjects,
    crm: canViewCRM,
    ops: canViewProjects,
    erp: canViewFinance,
    board: canViewWorkspaces,
    company: canViewCompany,
    server: canViewServer,
    team: canManageTeam
  }), [canEditProjects, canManageTeam, canViewCRM, canViewCompany, canViewDashboard, canViewFinance, canViewProjects, canViewServer, canViewWorkspaces]);
  const availableDashboardSubTabs = useMemo<Record<DashboardSubTab, boolean>>(() => ({
    insights: canViewDashboard,
    finance: canViewFinance,
    server: canViewServer
  }), [canViewDashboard, canViewFinance, canViewServer]);

  const openFirstAvailableTab = useCallback(() => {
    const orderedTabs: AdminTab[] = ['dashboard', 'crm', 'ops', 'board', 'company', 'erp', 'team', 'proposals', 'server'];
    const nextTab = orderedTabs.find((tab) => availableTabs[tab]);
    if (nextTab) {
      setActiveTab(nextTab);
    }
  }, [availableTabs]);

  const loadCollaborators = useCallback(async () => {
    if (!canManageTeam) {
      setCollaborators([]);
      return;
    }

    setIsLoadingCollaborators(true);
    try {
      const res = await fetch(`${API_BASE}/collaborations`, { headers: getHeaders() });
      if (!res.ok) {
        throw new Error('Erro ao buscar colaboradores');
      }
      const data = await res.json();
      setCollaborators(Array.isArray(data.collaborators) ? data.collaborators : []);
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
      toast.error('Erro ao carregar equipe colaborativa');
    } finally {
      setIsLoadingCollaborators(false);
    }
  }, [canManageTeam]);

  useEffect(() => {
    if (!canAccessAdmin || !inviteToken) return;
    navigate('/admin', { replace: true });
  }, [canAccessAdmin, inviteToken, navigate]);

  useEffect(() => {
    if (!inviteToken || canAccessAdmin) return;

    const acceptInvite = async () => {
      setIsAcceptingInvite(true);
      setInviteStatus(null);
      try {
        const res = await fetch(`${API_BASE}/collaborations/accept`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ token: inviteToken })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Não foi possível validar o convite');
        }

        updateUser(data.user);
        setInviteStatus({ type: 'success', message: data.message || 'Convite aceito com sucesso' });
        toast.success(data.message || 'Convite aceito com sucesso');
        navigate('/admin', { replace: true });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Não foi possível validar o convite';
        setInviteStatus({ type: 'error', message });
        toast.error(message);
      } finally {
        setIsAcceptingInvite(false);
      }
    };

    acceptInvite();
  }, [canAccessAdmin, inviteToken, navigate, updateUser]);

  useEffect(() => {
    if (!canAccessAdmin) return;
    if (!availableTabs[activeTab]) {
      openFirstAvailableTab();
    }
  }, [activeTab, availableTabs, canAccessAdmin, openFirstAvailableTab]);

  useEffect(() => {
    if (!availableDashboardSubTabs[dashboardSubTab]) {
      if (canViewDashboard) {
        setDashboardSubTab('insights');
      } else if (canViewFinance) {
        setDashboardSubTab('finance');
      } else if (canViewServer) {
        setDashboardSubTab('server');
      }
    }
  }, [availableDashboardSubTabs, dashboardSubTab, canViewDashboard, canViewFinance, canViewServer]);

  // Load Data from MongoDB
  useEffect(() => {
    if (!canAccessAdmin) {
      setIsLoading(false);
      return;
    }

    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const [wsRes, projRes, compRes] = await Promise.all([
          canViewWorkspaces ? fetch(`${API_BASE}/workspaces`, { headers: getHeaders() }) : Promise.resolve(null),
          (canViewProjects || canViewCRM || canViewFinance || canEditProjects) ? fetch(`${API_BASE}/projects`, { headers: getHeaders() }) : Promise.resolve(null),
          canViewCompany ? fetch(`${API_BASE}/company`, { headers: getHeaders() }) : Promise.resolve(null)
        ]);

        if (wsRes?.ok) {
          const wsData = await wsRes.json();
          if (wsData.length > 0) setWorkspaces(wsData);
        }

        if (projRes?.ok) {
          const projData = await projRes.json();
          if (projData.length > 0) {
            setProjects(projData.map(normalizeProject));
          }
        }

        if (compRes?.ok) {
          const compData = await compRes.json();
          if (compData) setCompany(normalizeCompany(compData));
        }
      } catch (error) {
        console.error('Erro ao carregar dados do MongoDB:', error);
        toast.error('Erro ao carregar dados. Usando dados locais.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [canAccessAdmin, canEditProjects, canViewCRM, canViewCompany, canViewFinance, canViewProjects, canViewWorkspaces]);

  // Sync Workspaces
  useEffect(() => {
    if (isLoading || !canEditWorkspaces) return;
    const syncWorkspaces = async () => {
      setIsSyncing(true);
      try {
        // Para simplificar, vamos salvar apenas o workspace ativo ou todos
        // Em um app real, faríamos updates pontuais
        await Promise.all(workspaces.map(ws => 
          fetch(`${API_BASE}/workspaces/${ws.id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(ws)
          })
        ));
      } catch (error) {
        console.error('Erro ao sincronizar workspaces:', error);
      } finally {
        setIsSyncing(false);
      }
    };

    const timeout = setTimeout(syncWorkspaces, 2000);
    return () => clearTimeout(timeout);
  }, [canEditWorkspaces, isLoading, workspaces]);

  // Sync Projects
  useEffect(() => {
    if (isLoading || !canEditProjects) return;
    const syncProjects = async () => {
      try {
        await Promise.all(projects.map(p => 
          fetch(`${API_BASE}/projects/${p.id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(p)
          })
        ));
      } catch (error) {
        console.error('Erro ao sincronizar projetos:', error);
      }
    };

    const timeout = setTimeout(syncProjects, 2000);
    return () => clearTimeout(timeout);
  }, [canEditProjects, isLoading, projects]);

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem('al_projects', JSON.stringify(projects.map(normalizeProject)));
  }, [isLoading, projects]);

  // Sync Company
  useEffect(() => {
    if (isLoading || !canEditCompany) return;
    const syncCompany = async () => {
      try {
        await fetch(`${API_BASE}/company`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(company)
        });
      } catch (error) {
        console.error('Erro ao sincronizar empresa:', error);
      }
    };

    const timeout = setTimeout(syncCompany, 2000);
    return () => clearTimeout(timeout);
  }, [canEditCompany, company, isLoading]);

  useEffect(() => {
    if (!canManageTeam) return;
    loadCollaborators();
  }, [canManageTeam, loadCollaborators]);

  useEffect(() => {
    if (!selectedProject) return;
    const updatedProject = projects.find(project => project.id === selectedProject.id);
    if (!updatedProject) {
      setSelectedProject(null);
      return;
    }
    if (updatedProject !== selectedProject) {
      setSelectedProject(updatedProject);
    }
  }, [projects, selectedProject]);

  useEffect(() => {
    setMeetingForm({
      date: getTodayDate(),
      kind: 'followup',
      title: '',
      content: '',
      outcome: '',
      nextStep: '',
      followUpDate: selectedProject?.followUpDate || ''
    });
  }, [selectedProject?.id, selectedProject?.followUpDate]);

  useEffect(() => {
    setFinanceForm({
      paymentMethod: selectedProject?.financials.paymentMethod || 'Pix',
      invoiceStatus: selectedProject?.financials.invoiceStatus || 'pending',
      installmentLabel: 'Sinal',
      installmentAmount: '',
      installmentDueDate: selectedProject?.followUpDate || getTodayDate()
    });
  }, [selectedProject?.id, selectedProject?.financials.paymentMethod, selectedProject?.financials.invoiceStatus, selectedProject?.followUpDate]);

  const ensureWorkspaceEdit = () => {
    if (canEditWorkspaces) return true;
    toast.error('Seu acesso permite visualizar workspaces, mas não editar.');
    return false;
  };

  const ensureProjectEdit = () => {
    if (canEditProjects) return true;
    toast.error('Seu perfil pode acompanhar projetos, mas não alterar dados.');
    return false;
  };

  const ensureCompanyEdit = () => {
    if (canEditCompany) return true;
    toast.error('Seu acesso à empresa está em modo leitura.');
    return false;
  };

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0] || { id: '', name: '', icon: 'Layout', boards: [] };
  const activeBoard = activeWorkspace.boards?.find(b => b.id === activeBoardId) || activeWorkspace.boards?.[0] || { id: '', name: '', description: '', columns: [], groups: [] };

  // Edição Inline do Board
  const updateCellValue = (boardId: string, groupId: string, itemId: string, columnId: string, value: any) => {
    if (!ensureWorkspaceEdit()) return;
    setWorkspaces(prev => prev.map(ws => ({
      ...ws,
      boards: ws.boards.map(b => b.id === boardId ? {
        ...b,
        groups: b.groups.map(g => g.id === groupId ? {
          ...g,
          items: g.items.map(i => i.id === itemId ? {
            ...i,
            values: { ...i.values, [columnId]: value }
          } : i)
        } : g)
      } : b)
    })));
  };

  const addNewItem = (boardId: string, groupId: string) => {
    if (!ensureWorkspaceEdit()) return;
    const newItem: BoardItem = {
      id: `i-${Date.now()}`,
      name: 'Novo Item',
      values: {}
    };
    setWorkspaces(prev => prev.map(ws => ({
      ...ws,
      boards: ws.boards.map(b => b.id === boardId ? {
        ...b,
        groups: b.groups.map(g => g.id === groupId ? {
          ...g,
          items: [...g.items, newItem]
        } : g)
      } : b)
    })));
  };

  const addNewGroup = (boardId: string) => {
    if (!ensureWorkspaceEdit()) return;
    const newGroup: BoardGroup = {
      id: `g-${Date.now()}`,
      title: 'Novo Grupo',
      color: '#c4c4c4',
      items: []
    };
    setWorkspaces(prev => prev.map(ws => ({
      ...ws,
      boards: ws.boards.map(b => b.id === boardId ? {
        ...b,
        groups: [...b.groups, newGroup]
      } : b)
    })));
  };

  const deleteWorkspace = async (id: string) => {
    if (!ensureWorkspaceEdit()) return;
    if (!window.confirm('Tem certeza que deseja remover este workspace?')) return;
    try {
      const res = await fetch(`${API_BASE}/workspaces/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        setWorkspaces(prev => prev.filter(ws => ws.id !== id));
        if (activeWorkspaceId === id) {
          const nextWs = workspaces.find(ws => ws.id !== id);
          setActiveWorkspaceId(nextWs?.id || '');
          setActiveBoardId(nextWs?.boards[0]?.id || '');
        }
        toast.success('Workspace removido com sucesso');
      }
    } catch (error) {
      console.error('Erro ao remover workspace:', error);
      toast.error('Erro ao remover workspace');
    }
  };

  const deleteBoard = async (workspaceId: string, boardId: string) => {
    if (!ensureWorkspaceEdit()) return;
    if (!window.confirm('Tem certeza que deseja remover este quadro?')) return;
    
    const oldWorkspaces = [...workspaces];
    const updatedWorkspaces = workspaces.map(ws => {
      if (ws.id === workspaceId) {
        return {
          ...ws,
          boards: ws.boards.filter(b => b.id !== boardId)
        };
      }
      return ws;
    });

    setWorkspaces(updatedWorkspaces);

    try {
      const workspace = updatedWorkspaces.find(ws => ws.id === workspaceId);
      if (!workspace) return;

      const res = await fetch(`${API_BASE}/workspaces/${workspaceId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(workspace)
      });

      if (!res.ok) throw new Error('Erro ao sincronizar exclusão do quadro');
      
      if (activeBoardId === boardId) {
        setActiveBoardId(workspace.boards[0]?.id || '');
      }
      toast.success('Quadro removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover quadro:', error);
      setWorkspaces(oldWorkspaces);
      toast.error('Erro ao remover quadro do servidor');
    }
  };

  const deleteProject = async (id: string) => {
    if (!ensureProjectEdit()) return;
    if (!window.confirm('Tem certeza que deseja remover este projeto?')) return;
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
        toast.success('Projeto removido com sucesso');
      }
    } catch (error) {
      console.error('Erro ao remover projeto:', error);
      toast.error('Erro ao remover projeto');
    }
  };

  const deleteBoardItem = async (boardId: string, groupId: string, itemId: string) => {
    if (!ensureWorkspaceEdit()) return;
    if (!window.confirm('Tem certeza que deseja remover este item?')) return;
    
    const oldWorkspaces = [...workspaces];
    const targetWs = workspaces.find(ws => ws.boards.some(b => b.id === boardId));
    if (!targetWs) return;

    const updatedWorkspace = {
      ...targetWs,
      boards: targetWs.boards.map(b => b.id === boardId ? {
        ...b,
        groups: b.groups.map(g => g.id === groupId ? {
          ...g,
          items: g.items.filter(i => i.id !== itemId)
        } : g)
      } : b)
    };

    setWorkspaces(prev => prev.map(ws => ws.id === targetWs.id ? updatedWorkspace : ws));

    try {
      const res = await fetch(`${API_BASE}/workspaces/${targetWs.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedWorkspace)
      });
      if (!res.ok) throw new Error('Erro ao sincronizar exclusão de item');
      toast.success('Item removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover item:', error);
      setWorkspaces(oldWorkspaces);
      toast.error('Erro ao remover item do servidor');
    }
  };

  const deleteBoardGroup = async (boardId: string, groupId: string) => {
    if (!ensureWorkspaceEdit()) return;
    if (!window.confirm('Remover este grupo e todos os seus itens?')) return;
    
    const oldWorkspaces = [...workspaces];
    const targetWs = workspaces.find(ws => ws.boards.some(b => b.id === boardId));
    if (!targetWs) return;

    const updatedWorkspace = {
      ...targetWs,
      boards: targetWs.boards.map(b => b.id === boardId ? {
        ...b,
        groups: b.groups.filter(g => g.id !== groupId)
      } : b)
    };

    setWorkspaces(prev => prev.map(ws => ws.id === targetWs.id ? updatedWorkspace : ws));

    try {
      const res = await fetch(`${API_BASE}/workspaces/${targetWs.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedWorkspace)
      });
      if (!res.ok) throw new Error('Erro ao sincronizar exclusão de grupo');
      toast.success('Grupo removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover grupo:', error);
      setWorkspaces(oldWorkspaces);
      toast.error('Erro ao remover grupo do servidor');
    }
  };

  const handleInviteCollaborator = async () => {
    if (!canManageTeam) {
      toast.error('Somente o owner pode gerenciar convites.');
      return;
    }

    if (!inviteForm.email.trim()) {
      toast.error('Informe o e-mail do colaborador.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/collaborations/invite`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          email: inviteForm.email.trim(),
          role: inviteForm.role,
          note: inviteForm.note.trim() || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao criar convite');
      }

      toast.success(data.message || 'Convite aprovado e pronto para compartilhamento');
      setInviteForm({ email: '', role: 'viewer', note: '' });
      loadCollaborators();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar convite');
    }
  };

  const updateCollaborator = async (
    collaboratorId: string,
    payload: Partial<Pick<CollaborationMember, 'role' | 'note' | 'permissions' | 'status'>>
  ) => {
    if (!canManageTeam) {
      toast.error('Somente o owner pode alterar permissões.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/collaborations/${collaboratorId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao atualizar colaborador');
      }

      setCollaborators(prev => prev.map(item => item.id === data.collaboration.id ? data.collaboration : item));
      toast.success('Permissões atualizadas.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar colaborador');
    }
  };

  const revokeCollaborator = async (collaboratorId: string) => {
    if (!canManageTeam) {
      toast.error('Somente o owner pode revogar acessos.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/collaborations/${collaboratorId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao revogar colaborador');
      }

      toast.success(data.message || 'Acesso revogado.');
      loadCollaborators();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao revogar colaborador');
    }
  };

  // Funções de Utilidade
  const maskCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  // Motor de IA (Simulado com Lógica de Palavras-Chave)
  const analyzeBriefing = () => {
    if (!ensureProjectEdit()) return;
    if (!clientData.brief.trim()) {
      toast.error("Insira um briefing para analisar.");
      return;
    }

    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          const keywords: Record<string, string[]> = {
            '1': ['banco', 'dados', 'sql', 'postgres', 'estrutura', 'arquitetura'],
            '2': ['ia', 'gpt', 'openai', 'inteligente', 'chat', 'bot'],
            '3': ['dashboard', 'visão', 'gráficos', 'métricas', 'indicadores'],
            '4': ['automação', 'n8n', 'fluxo', 'integrar', 'workflow'],
            '5': ['suporte', 'manutenção', 'acompanhar', 'mensal'],
            '6': ['api', 'rest', 'webhook', 'conectar', 'sistema'],
            '7': ['cloud', 'vps', 'docker', 'nuvem', 'hospedagem', 'infra'],
          };

          const detected: string[] = [];
          const text = clientData.brief.toLowerCase();

          Object.entries(keywords).forEach(([id, words]) => {
            if (words.some(w => text.includes(w))) {
              detected.push(id);
            }
          });

          if (detected.length > 0) {
            setSelectedModules(prev => [...new Set([...prev, ...detected])]);
            resolve(`Detectamos ${detected.length} módulos relevantes!`);
          } else {
            resolve("Não detectamos módulos específicos, mas você pode selecionar manualmente.");
          }
        }, 1500);
      }),
      {
        loading: 'O Cérebro AL está analisando seu briefing...',
        success: (msg) => msg as string,
        error: 'Erro na análise.',
      }
    );
  };

  // Salvar Proposta como Projeto
  const saveAsProject = (type: 'full' | 'fast' = 'full') => {
    if (!ensureProjectEdit()) return;
    if (!clientData.name) {
      toast.error("Preencha ao menos o nome do cliente.");
      return;
    }

    const newProject: Project = {
      id: `p-${Date.now()}`,
      clientName: clientData.name,
      projectName: clientData.projectTitle || (type === 'fast' ? 'Preparação de Reunião' : 'Novo Projeto (A definir)'),
      brief: clientData.brief || (type === 'fast' ? "Preparação rápida para primeira reunião." : "Cliente criado manualmente."),
      status: 'prospect',
      value: totalValue,
      deadline: 'A definir',
      accesses: [],
      tasks: selectedModules.length > 0 ? selectedModules.map((id, i) => ({
        id: `t-${Date.now()}-${i}`,
        title: AVAILABLE_MODULES.find(m => m.id === id)?.name || 'Nova Tarefa',
        status: 'todo'
      })) : [{ id: `t-${Date.now()}-0`, title: 'Reunião de Alinhamento Inicial', status: 'todo' }],
      costs: [],
      stakeholders: [],
      meetingNotes: [
        { 
          date: new Date().toISOString().split('T')[0], 
          content: clientData.brief 
            ? `Briefing inicial: ${clientData.brief}` 
            : type === 'fast' ? "Preparação rápida para primeira reunião." : "Cliente criado manualmente."
        }
      ],
      documents: [
        { 
          id: `doc-prep-${Date.now()}-1`, 
          name: `Proposta Comercial - ${clientData.name}.pdf`, 
          type: 'briefing', 
          date: new Date().toISOString().split('T')[0], 
          size: 'Gerando...' 
        },
        { 
          id: `doc-prep-${Date.now()}-2`, 
          name: `Minuta de Contrato - ${clientData.name}.pdf`, 
          type: 'contract', 
          date: new Date().toISOString().split('T')[0], 
          size: 'Gerando...' 
        }
      ],
      stage: 'lead',
      nextAction: type === 'fast' ? 'Conduzir a primeira reunião e registrar dores do cliente' : 'Enviar proposta comercial e alinhar escopo',
      followUpDate: getTodayDate(),
      workflowSteps: createWorkflowSteps('prospect'),
      financials: {
        proposalValue: totalValue,
        paymentMethod: 'Pix',
        invoiceStatus: 'pending',
        installments: totalValue > 0 ? [{
          id: `inst-${Date.now()}`,
          label: type === 'fast' ? 'Sinal da descoberta' : 'Sinal de entrada',
          amount: totalValue,
          dueDate: getTodayDate(),
          status: 'pending'
        }] : []
      },
      postDeliverySteps: createPostDeliverySteps('prospect'),
      playbook: createProjectPlaybook({
        status: 'prospect',
        projectName: clientData.projectTitle,
        brief: clientData.brief,
        tasks: selectedModules.length > 0 ? selectedModules.map((id, i) => ({
          id: `playbook-task-${i}`,
          title: AVAILABLE_MODULES.find(m => m.id === id)?.name || 'Nova Tarefa',
          status: 'todo'
        })) : []
      })
    };

    setProjects(prev => {
      const updated = [newProject, ...prev];
      return updated;
    });
    toast.success(type === 'fast' ? "Cliente criado e documentos preparados!" : "Proposta salva no seu pipeline!");
    setShowPreview(false);
    setActiveTab('crm');
  };

  const updateProjectStatus = (id: string, newStatus: Project['status']) => {
    if (!ensureProjectEdit()) return;
    setProjects(prev => prev.map(p => p.id === id ? {
      ...p,
      status: newStatus,
      stage: p.stage === getStageFromStatus(p.status) ? getStageFromStatus(newStatus) : p.stage,
      workflowSteps: createWorkflowSteps(newStatus, p.workflowSteps),
      postDeliverySteps: createPostDeliverySteps(newStatus, p.postDeliverySteps),
      playbook: createProjectPlaybook({ ...p, status: newStatus })
    } : p));
    toast.success(`Status do projeto atualizado para ${newStatus}`);
  };

  const updateProjectPlanning = (projectId: string, fields: Partial<Pick<Project, 'stage' | 'nextAction' | 'followUpDate'>>) => {
    if (!ensureProjectEdit()) return;
    setProjects(prev => prev.map(project => project.id === projectId ? { ...project, ...fields } : project));
  };

  const toggleWorkflowStep = (projectId: string, stepId: string) => {
    if (!ensureProjectEdit()) return;
    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;

      return {
        ...project,
        workflowSteps: project.workflowSteps.map(step => step.id === stepId ? { ...step, done: !step.done } : step)
      };
    }));
  };

  const updateProjectPlaybookTemplate = (projectId: string, templateId: PlaybookTemplateId) => {
    if (!ensureProjectEdit()) return;
    setProjects(prev => prev.map(project => (
      project.id === projectId
        ? {
            ...project,
            playbook: createProjectPlaybook({
              ...project,
              playbook: {
                templateId,
                steps: []
              }
            })
          }
        : project
    )));

    toast.success('Playbook aplicado ao projeto.');
  };

  const toggleProjectPlaybookStep = (projectId: string, stepId: string) => {
    if (!ensureProjectEdit()) return;
    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;

      const steps = project.playbook.steps.map(step => step.id === stepId ? { ...step, done: !step.done } : step);
      const nextPendingStep = steps.find(step => !step.done);

      return {
        ...project,
        playbook: {
          ...project.playbook,
          steps
        },
        nextAction: nextPendingStep?.title || project.nextAction
      };
    }));
  };

  const snoozeFollowUp = (projectId: string, days: number) => {
    if (!ensureProjectEdit()) return;
    const nextDate = getShiftedDate(days);

    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;

      return {
        ...project,
        followUpDate: nextDate,
        meetingNotes: [
          {
            date: getTodayDate(),
            content: `Follow-up reagendado para ${formatProjectDate(nextDate)}.`
          },
          ...project.meetingNotes
        ]
      };
    }));

    toast.success(`Follow-up reagendado para ${formatProjectDate(nextDate)}.`);
  };

  const completeFollowUp = (projectId: string) => {
    if (!ensureProjectEdit()) return;
    const nextDate = getShiftedDate(7);

    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;

      return {
        ...project,
        followUpDate: nextDate,
        nextAction: getSuggestedNextAction(project),
        meetingNotes: [
          {
            date: getTodayDate(),
            content: `Follow-up concluído. Próximo ciclo agendado para ${formatProjectDate(nextDate)}.`
          },
          ...project.meetingNotes
        ]
      };
    }));

    toast.success('Follow-up registrado e próximo ciclo planejado.');
  };

  const registerMeetingNote = (projectId: string) => {
    if (!ensureProjectEdit()) return;
    if (!meetingForm.title.trim() || !meetingForm.content.trim()) {
      toast.error('Preencha pelo menos o título e o resumo da reunião.');
      return;
    }

    const nextFollowUpDate = meetingForm.followUpDate.trim();
    const note: ProjectMeetingNote = {
      date: meetingForm.date || getTodayDate(),
      title: meetingForm.title.trim(),
      kind: meetingForm.kind,
      content: meetingForm.content.trim(),
      outcome: meetingForm.outcome.trim() || undefined,
      nextStep: meetingForm.nextStep.trim() || undefined
    };

    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;

      return {
        ...project,
        meetingNotes: [note, ...project.meetingNotes],
        nextAction: meetingForm.nextStep.trim() || project.nextAction,
        followUpDate: nextFollowUpDate || project.followUpDate
      };
    }));

    setMeetingForm({
      date: getTodayDate(),
      kind: 'followup',
      title: '',
      content: '',
      outcome: '',
      nextStep: '',
      followUpDate: nextFollowUpDate
    });

    toast.success('Reunião registrada no histórico do projeto.');
  };

  const updateProjectFinancials = (projectId: string, fields: Partial<ProjectFinancials>) => {
    if (!ensureProjectEdit()) return;
    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;

      const nextFinancials = {
        ...project.financials,
        ...fields
      };

      return {
        ...project,
        value: typeof fields.proposalValue === 'number' ? fields.proposalValue : project.value,
        financials: nextFinancials
      };
    }));
  };

  const addProjectInstallment = (projectId: string) => {
    if (!ensureProjectEdit()) return;
    const amount = Number(financeForm.installmentAmount);

    if (!financeForm.installmentLabel.trim() || !financeForm.installmentDueDate || Number.isNaN(amount) || amount <= 0) {
      toast.error('Preencha descrição, valor e vencimento da parcela.');
      return;
    }

    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;

      return {
        ...project,
        financials: {
          ...project.financials,
          paymentMethod: financeForm.paymentMethod,
          invoiceStatus: financeForm.invoiceStatus,
          installments: [
            ...project.financials.installments,
            {
              id: `inst-${Date.now()}`,
              label: financeForm.installmentLabel.trim(),
              amount,
              dueDate: financeForm.installmentDueDate,
              status: 'pending'
            }
          ]
        }
      };
    }));

    setFinanceForm(prev => ({
      ...prev,
      installmentLabel: 'Parcela complementar',
      installmentAmount: '',
      installmentDueDate: getShiftedDate(15, prev.installmentDueDate)
    }));

    toast.success('Parcela adicionada ao projeto.');
  };

  const updateInstallmentStatus = (projectId: string, installmentId: string, status: ProjectInstallment['status']) => {
    if (!ensureProjectEdit()) return;
    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;

      return {
        ...project,
        financials: {
          ...project.financials,
          paymentMethod: financeForm.paymentMethod,
          invoiceStatus: financeForm.invoiceStatus,
          installments: project.financials.installments.map(installment => installment.id === installmentId ? { ...installment, status } : installment)
        }
      };
    }));

    toast.success(status === 'paid' ? 'Parcela marcada como recebida.' : 'Status da parcela atualizado.');
  };

  const togglePostDeliveryStep = (projectId: string, stepId: string) => {
    if (!ensureProjectEdit()) return;
    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;

      const updatedSteps = project.postDeliverySteps.map(step => step.id === stepId ? { ...step, done: !step.done } : step);
      const completedSteps = updatedSteps.filter(step => step.done).length;

      return {
        ...project,
        postDeliverySteps: updatedSteps,
        nextAction: completedSteps === updatedSteps.length
          ? 'Revisar oportunidades recorrentes e manter relacionamento ativo'
          : project.nextAction
      };
    }));
  };

  const updateTaskStatus = (projectId: string, taskId: string, newStatus: ProjectTask['status']) => {
    if (!ensureProjectEdit()) return;
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: (p.tasks || []).map(t => t.id === taskId ? { ...t, status: newStatus } : t)
        };
      }
      return p;
    }));
    toast.success(`Status da tarefa atualizado!`);
  };

  const updateTaskDates = (projectId: string, taskId: string, field: 'startDate' | 'endDate', value: string) => {
    if (!ensureProjectEdit()) return;
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: (p.tasks || []).map(t => t.id === taskId ? { ...t, [field]: value } : t)
        };
      }
      return p;
    }));
  };

  const totalValue = selectedModules.reduce((acc, id) => {
    const mod = AVAILABLE_MODULES.find(m => m.id === id);
    return acc + (mod?.price || 0);
  }, 0);

  const toggleModule = (id: string) => {
    if (!ensureProjectEdit()) return;
    setSelectedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const calculateProgress = (project: Project) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const doneTasks = project.tasks.filter(t => t.status === 'done').length;
    return Math.round((doneTasks / project.tasks.length) * 100);
  };

  return (
    <div className="min-h-screen bg-cyber-black text-white flex h-screen overflow-hidden relative">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation - Work OS Style */}
      <aside className={`fixed inset-y-0 left-0 w-72 glass border-r border-white/5 flex flex-col h-full z-50 transition-transform duration-300 transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyber-gold flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold font-heading leading-tight">AL <span className="text-gradient">Work OS</span></h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Consultancy v3.0</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-muted-foreground hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
          {/* Quick Access */}
          <div>
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">Acesso Rápido</p>
            
            <div className="space-y-1">
              {availableTabs.dashboard && (
                <>
                  <button 
                    onClick={() => {
                      setActiveTab('dashboard');
                      setIsSidebarOpen(false);
                    }} 
                    className={`w-full flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all text-[11px] sm:text-sm ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Activity size={16} className="sm:size-[18px]" /> 
                      <span>Dashboards</span>
                    </div>
                    <ChevronRight size={14} className={`transition-transform duration-300 ${activeTab === 'dashboard' ? 'rotate-90' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {activeTab === 'dashboard' && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-9 space-y-1"
                      >
                        {[
                          { id: 'insights', label: 'Insights de Negócio', icon: Activity, allowed: availableDashboardSubTabs.insights },
                          { id: 'finance', label: 'Financeiro (ERP)', icon: PieChart, allowed: availableDashboardSubTabs.finance },
                          { id: 'server', label: 'Status do Servidor', icon: Server, allowed: availableDashboardSubTabs.server },
                        ].filter((sub) => sub.allowed).map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setDashboardSubTab(sub.id as DashboardSubTab);
                              setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${dashboardSubTab === sub.id ? 'text-white bg-white/5' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
                          >
                            <sub.icon size={12} />
                            {sub.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {availableTabs.proposals && (
                <button 
                  onClick={() => {
                    setActiveTab('proposals');
                    setIsSidebarOpen(false);
                  }} 
                  className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all text-[11px] sm:text-sm mt-1 ${activeTab === 'proposals' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5'}`}
                >
                  <FileSignature size={16} className="sm:size-[18px]" /> Propostas & Vendas
                </button>
              )}
              {availableTabs.crm && (
                <button 
                  onClick={() => {
                    setActiveTab('crm');
                    setIsSidebarOpen(false);
                  }} 
                  className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all text-[11px] sm:text-sm ${activeTab === 'crm' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5'}`}
                >
                  <Users size={16} className="sm:size-[18px]" /> CRM & Clientes
                </button>
              )}
              {availableTabs.company && (
                <button 
                  onClick={() => {
                    setActiveTab('company');
                    setIsSidebarOpen(false);
                  }} 
                  className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all text-[11px] sm:text-sm ${activeTab === 'company' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5'}`}
                >
                  <Building size={16} className="sm:size-[18px]" /> Perfil da Empresa
                </button>
              )}
              {availableTabs.team && (
                <button
                  onClick={() => {
                    setActiveTab('team');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all text-[11px] sm:text-sm ${activeTab === 'team' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5'}`}
                >
                  <Shield size={16} className="sm:size-[18px]" /> Equipe & Permissões
                </button>
              )}
            </div>
          </div>

          {/* Workspaces */}
          {canViewWorkspaces && (
            <div className="space-y-6">
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">Workspaces</p>
            {workspaces.map(ws => (
              <div key={ws.id} className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-1 mb-1 group/ws">
                  {(() => {
                    const Icon = ICON_MAP[ws.icon] || Layout;
                    return <Icon size={14} className="text-muted-foreground" />;
                  })()}
                  <span className="text-xs font-bold text-muted-foreground flex-1">{ws.name}</span>
                  {canEditWorkspaces && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteWorkspace(ws.id); }}
                      className="opacity-0 group-hover/ws:opacity-100 p-1 hover:text-red-500 transition-all"
                      title="Remover Workspace"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
                {ws.boards.map(board => (
                  <div key={board.id} className="group/board relative">
                    <button 
                      onClick={() => {
                        setActiveWorkspaceId(ws.id);
                        setActiveBoardId(board.id);
                        setActiveTab('board');
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm pl-8 ${activeBoardId === board.id && activeTab === 'board' ? 'bg-white/10 text-white border border-white/10' : 'text-muted-foreground hover:bg-white/5'}`}
                    >
                      <Layout size={16} className={activeBoardId === board.id && activeTab === 'board' ? 'text-primary' : ''} />
                      <span className="truncate flex-1 text-left">{board.name}</span>
                    </button>
                    {canEditWorkspaces && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteBoard(ws.id, board.id); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/board:opacity-100 p-1 hover:text-red-500 transition-all z-10"
                        title="Remover Quadro"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyber-gold/20 flex items-center justify-center border border-cyber-gold/30">
                <Fingerprint size={16} className="text-cyber-gold" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{user?.username || company.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{isOwner ? 'Owner do ambiente' : 'Colaborador aprovado'}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-all text-muted-foreground"
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
        {/* Top Header - Contextual */}
        <header className="h-16 border-b border-white/5 glass flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-white transition-colors"
            >
              <Menu size={20} />
            </button>
            {activeTab === 'board' ? (
              <>
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                  {(() => {
                    const Icon = ICON_MAP[activeWorkspace.icon] || Layout;
                    return <Icon size={16} className="sm:size-[20px]" />;
                  })()}
                </div>
                <div className="min-w-0">
                  <h2 className="text-[11px] sm:text-sm font-bold flex items-center gap-1 sm:gap-2 truncate">
                    <span className="truncate">{activeWorkspace.name}</span> <ChevronRight size={12} className="text-muted-foreground shrink-0" /> <span className="truncate">{activeBoard.name}</span>
                  </h2>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground truncate">{activeBoard.description}</p>
                </div>
              </>
            ) : (
              <h2 className="text-[11px] sm:text-sm font-bold uppercase tracking-widest truncate max-w-[150px] xs:max-w-[200px] sm:max-w-none">
                {activeTab === 'dashboard' ? 'Business Intelligence & Insights' : 
                 activeTab === 'proposals' ? 'Gerador de Propostas' : 
                 activeTab === 'crm' ? 'Gestão de Relacionamento (CRM)' :
                 activeTab === 'erp' ? 'Dashboard Financeiro (ERP)' :
                 activeTab === 'company' ? 'Perfil da Empresa' :
                 activeTab === 'team' ? 'Equipe & Permissões' :
                 'Configurações da Empresa'}
              </h2>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Shield size={12} className="text-primary" />
              {isOwner ? 'Owner' : access?.role || 'Colaborador'}
            </div>
            {isSyncing && (
              <div className="hidden sm:flex items-center gap-2 text-[10px] text-muted-foreground animate-pulse">
                <Database size={12} />
                Sincronizando...
              </div>
            )}
            <div className="relative group">
              <button className="md:hidden p-2 rounded-full hover:bg-white/5 text-muted-foreground transition-colors">
                <Search size={18} />
              </button>
              <div className="hidden md:block relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  id="search-input"
                  name="search-input"
                  type="text" 
                  placeholder="Pesquisar em tudo..."
                  className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs w-64 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>
            <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all">
              <Sparkles size={18} />
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar relative">
          {isLoading && (
            <div className="absolute inset-0 bg-cyber-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-sm font-bold text-primary animate-pulse">Carregando dados do MongoDB...</p>
            </div>
          )}
          {!isLoading && !canAccessAdmin && (
            <div className="max-w-3xl mx-auto">
              <div className="glass rounded-3xl border border-primary/20 p-6 sm:p-10 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Shield size={28} className="text-primary" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-4xl font-bold font-heading">Acesso colaborativo pendente</h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Sua conta já está autenticada, mas ainda não possui acesso administrativo liberado para este ambiente.
                  </p>
                </div>
                {(isAcceptingInvite || inviteStatus) && (
                  <div className={`rounded-2xl border px-4 py-3 text-sm ${
                    isAcceptingInvite
                      ? 'border-primary/20 bg-primary/10 text-primary'
                      : inviteStatus?.type === 'success'
                        ? 'border-cyber-emerald/20 bg-cyber-emerald/10 text-cyber-emerald'
                        : 'border-red-500/20 bg-red-500/10 text-red-400'
                  }`}>
                    {isAcceptingInvite ? 'Validando convite aprovado...' : inviteStatus?.message}
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    'Login e cadastro já aceitam links de convite aprovados.',
                    'O owner controla módulos visíveis e permissões de edição por colaborador.',
                    'Quando o acesso for liberado, o botão Admin abre o ambiente adequado ao perfil.'
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/80">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {canAccessAdmin && (
          <AnimatePresence mode="wait">
            
            {/* NOVO MODELO: DASHBOARD UNIFICADO COM SUB-ABAS */}
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Dashboard Tabs */}
                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10 w-full sm:w-fit overflow-x-auto scrollbar-hide no-scrollbar">
                  {availableDashboardSubTabs.insights && (
                    <button 
                      onClick={() => setDashboardSubTab('insights')}
                      className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[9px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 ${dashboardSubTab === 'insights' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-white/5'}`}
                    >
                      <Activity size={12} className="sm:size-[14px]" /> <span className="hidden xs:inline">Insights de Negócio</span><span className="xs:hidden">Insights</span>
                    </button>
                  )}
                  {availableDashboardSubTabs.finance && (
                    <button 
                      onClick={() => setDashboardSubTab('finance')}
                      className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[9px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 ${dashboardSubTab === 'finance' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-white/5'}`}
                    >
                      <PieChart size={12} className="sm:size-[14px]" /> Financeiro
                    </button>
                  )}
                  {availableDashboardSubTabs.server && (
                    <button 
                      onClick={() => setDashboardSubTab('server')}
                      className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[9px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 ${dashboardSubTab === 'server' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-white/5'}`}
                    >
                      <Server size={12} className="sm:size-[14px]" /> <span className="hidden xs:inline">Status do Servidor</span><span className="xs:hidden">Servidor</span>
                    </button>
                  )}
                </div>

                {dashboardSubTab === 'insights' && (
                  <DashboardView 
                    projects={projects} 
                    workspaces={workspaces} 
                    onNewWorkspace={() => {
                      if (!ensureWorkspaceEdit()) return;
                      const name = prompt('Nome do novo cliente/workspace:');
                      if (name) {
                        const newWs: Workspace = {
                          id: `ws-${Date.now()}`,
                          name,
                          icon: 'Layout',
                          boards: [{
                            id: `board-${Date.now()}`,
                            name: 'Geral',
                            columns: PROJECT_COLUMNS,
                            groups: [{ id: 'g1', title: 'Início', color: '#579BFC', items: [] }]
                          }]
                        };
                        setWorkspaces(prev => [...prev, newWs]);
                        setActiveWorkspaceId(newWs.id);
                        setActiveBoardId(newWs.boards[0].id);
                        setActiveTab('board');
                        toast.success('Workspace criado!');
                      }
                    }}
                    onNewLead={() => {
                      if (!ensureProjectEdit()) return;
                      setActiveTab('proposals');
                      toast.info('Preencha o briefing para gerar o lead.');
                    }}
                    onOpenProject={(projectId) => {
                      if (!canViewProjects) {
                        toast.error('Seu perfil não possui acesso detalhado aos projetos.');
                        return;
                      }
                      const project = projects.find(item => item.id === projectId);
                      if (!project) return;
                      setSelectedProject(project);
                      setActiveTab('ops');
                    }}
                    onSnoozeFollowUp={snoozeFollowUp}
                    onCompleteFollowUp={completeFollowUp}
                  />
                )}

                {dashboardSubTab === 'finance' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="glass rounded-2xl p-4 sm:p-6 border-white/5 space-y-3 sm:space-y-4 relative overflow-hidden group hover:border-white/10 transition-all">
                      <div className="absolute -right-2 -top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp size={40} className="sm:size-[60px]" />
                      </div>
                      <div className="flex justify-between items-start">
                        <div className="p-2 sm:p-3 rounded-xl bg-green-500/10 text-green-500 shadow-inner group-hover:scale-110 transition-transform">
                          <TrendingUp size={18} className="sm:size-[24px]" />
                        </div>
                        <span className="text-[7px] sm:text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">+12.5%</span>
                      </div>
                      <div>
                        <p className="text-[8px] sm:text-xs text-muted-foreground font-bold uppercase tracking-widest truncate">Receita Projetada</p>
                        <h4 className="text-xl sm:text-3xl font-bold mt-1">R$ 28.400</h4>
                      </div>
                      <div className="pt-3 sm:pt-4 border-t border-white/5 flex items-center justify-between text-[8px] sm:text-[10px] font-bold">
                        <span className="text-muted-foreground uppercase truncate">4 projetos ativos</span>
                        <button className="text-primary hover:underline shrink-0">DETALHES</button>
                      </div>
                    </div>

                    <div className="glass rounded-2xl p-4 sm:p-6 border-white/5 space-y-3 sm:space-y-4 relative overflow-hidden group hover:border-white/10 transition-all">
                      <div className="absolute -right-2 -top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                        <CreditCard size={40} className="sm:size-[60px]" />
                      </div>
                      <div className="flex justify-between items-start">
                        <div className="p-2 sm:p-3 rounded-xl bg-blue-500/10 text-blue-500 shadow-inner group-hover:scale-110 transition-transform">
                          <CreditCard size={18} className="sm:size-[24px]" />
                        </div>
                        <span className="text-[7px] sm:text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">Em dia</span>
                      </div>
                      <div>
                        <p className="text-[8px] sm:text-xs text-muted-foreground font-bold uppercase tracking-widest truncate">Contas a Receber</p>
                        <h4 className="text-xl sm:text-3xl font-bold mt-1">R$ 12.150</h4>
                      </div>
                      <div className="pt-3 sm:pt-4 border-t border-white/5 flex items-center justify-between text-[8px] sm:text-[10px] font-bold">
                        <span className="text-muted-foreground uppercase truncate">Próximo: 25/03</span>
                        <button className="text-primary hover:underline shrink-0">GERENCIAR</button>
                      </div>
                    </div>

                    <div className="glass rounded-2xl p-4 sm:p-6 border-white/5 space-y-3 sm:space-y-4 relative overflow-hidden group hover:border-white/10 transition-all sm:col-span-2 lg:col-span-1">
                      <div className="absolute -right-2 -top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Zap size={40} className="sm:size-[60px]" />
                      </div>
                      <div className="flex justify-between items-start">
                        <div className="p-2 sm:p-3 rounded-xl bg-orange-500/10 text-orange-500 shadow-inner group-hover:scale-110 transition-transform">
                          <Zap size={18} className="sm:size-[24px]" />
                        </div>
                        <span className="text-[7px] sm:text-[10px] font-bold text-orange-500 bg-orange-500/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">-5.2%</span>
                      </div>
                      <div>
                        <p className="text-[8px] sm:text-xs text-muted-foreground font-bold uppercase tracking-widest truncate">Custos Operacionais</p>
                        <h4 className="text-xl sm:text-3xl font-bold mt-1">R$ 3.820</h4>
                      </div>
                      <div className="pt-3 sm:pt-4 border-t border-white/5 flex items-center justify-between text-[8px] sm:text-[10px] font-bold">
                        <span className="text-muted-foreground uppercase truncate">Infra & APIs</span>
                        <button className="text-primary hover:underline shrink-0">OTIMIZAR</button>
                      </div>
                    </div>
                  </div>
                )}

                {dashboardSubTab === 'server' && (
                  <ServerStatsView />
                )}
              </motion.div>
            )}

            {/* NOVO MODELO: BOARD VIEW DINÂMICO */}
            {activeTab === 'board' && (
              <motion.div 
                key={activeBoard.id} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => addNewItem(activeBoard.id, activeBoard.groups[0]?.id)}
                      className="px-2.5 sm:px-4 py-2 bg-primary text-white text-[9px] sm:text-xs font-bold rounded-lg flex items-center gap-1.5 sm:gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 shrink-0"
                    >
                      <Plus size={12} className="sm:size-[16px]" /> Novo Item
                    </button>
                    <button className="px-2.5 sm:px-4 py-2 glass border border-white/10 text-[9px] sm:text-xs font-bold rounded-lg flex items-center gap-1.5 sm:gap-2 hover:bg-white/5 transition-all shrink-0">
                      <Search size={12} className="sm:size-[16px]" /> Filtrar
                    </button>
                    <button className="px-2.5 sm:px-4 py-2 glass border border-white/10 text-[9px] sm:text-xs font-bold rounded-lg flex items-center gap-1.5 sm:gap-2 hover:bg-white/5 transition-all shrink-0">
                      <Users size={12} className="sm:size-[16px]" /> Personas
                    </button>
                  </div>
                  <div className="flex gap-1 p-1 bg-white/5 rounded-lg border border-white/10 self-start sm:self-auto overflow-x-auto">
                    <button className="p-1.5 rounded bg-white/10 text-white shrink-0"><Layout size={12} className="sm:size-[14px]" /></button>
                    <button className="p-1.5 rounded text-muted-foreground hover:bg-white/5 shrink-0"><Kanban size={12} className="sm:size-[14px]" /></button>
                    <button className="p-1.5 rounded text-muted-foreground hover:bg-white/5 shrink-0"><Calendar size={12} className="sm:size-[14px]" /></button>
                  </div>
                </div>

                <BoardView 
                  board={activeBoard} 
                  onUpdateCell={(groupId, itemId, colId, value) => updateCellValue(activeBoard.id, groupId, itemId, colId, value)}
                  onAddItem={(groupId) => addNewItem(activeBoard.id, groupId)}
                  onAddGroup={() => addNewGroup(activeBoard.id)}
                  onDeleteItem={(groupId, itemId) => deleteBoardItem(activeBoard.id, groupId, itemId)}
                  onDeleteGroup={(groupId) => deleteBoardGroup(activeBoard.id, groupId)}
                />
              </motion.div>
            )}

            {/* ABA 1: PROPOSTAS & VENDAS (MANTIDA MAS REFATORADA) */}
            {activeTab === 'proposals' && (
              <motion.div key="proposals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
                {/* O conteúdo das propostas será renderizado aqui */}
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl sm:text-4xl font-bold font-heading">Sales <span className="text-gradient">Engine</span></h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2">Converta briefing em contratos profissionais em segundos.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Dados do Cliente */}
                  <div className="glass rounded-2xl p-4 sm:p-8 border-white/5">
                    <h3 className="text-base sm:text-lg font-semibold mb-6 flex items-center gap-2 text-primary">
                      <Target size={20} /> Perfil do Cliente & Projeto
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Nome/Empresa</label>
                        <input 
                          id="client-name"
                          name="client-name"
                          value={clientData.name} 
                          onChange={e => setClientData({...clientData, name: e.target.value})} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm" 
                          placeholder="Ex: Tech Corp" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Perfil de Decisão</label>
                        <select 
                          id="client-profile"
                          name="client-profile"
                          value={clientData.profile} 
                          onChange={e => setClientData({...clientData, profile: e.target.value})} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm"
                        >
                          <option value="technical" className="bg-cyber-black">Técnico (CTO/Dev)</option>
                          <option value="executive" className="bg-cyber-black">Executivo (CEO/CFO)</option>
                          <option value="operations" className="bg-cyber-black">Operacional (Gerente)</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">CNPJ</label>
                        <input 
                          id="client-cnpj"
                          name="client-cnpj"
                          value={clientData.cnpj} 
                          onChange={e => setClientData({...clientData, cnpj: maskCNPJ(e.target.value)})} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm" 
                          placeholder="00.000.000/0000-00" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">E-mail para Portal</label>
                        <input 
                          id="client-email"
                          name="client-email"
                          value={clientData.email} 
                          onChange={e => setClientData({...clientData, email: e.target.value})} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm" 
                          placeholder="cliente@email.com" 
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground">Briefing do Projeto (Ideia do Cliente)</label>
                          <button onClick={analyzeBriefing} className="text-[10px] font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                            <Sparkles size={12} /> Analisar por IA
                          </button>
                        </div>
                        <textarea 
                          id="client-brief"
                          name="client-brief"
                          value={clientData.brief} 
                          onChange={e => setClientData({...clientData, brief: e.target.value})} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm h-32 resize-none" 
                          placeholder="Cole aqui o texto enviado pelo cliente com a ideia do projeto..." 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Argumentação Estratégica Baseada em Perfil */}
                  <div className="glass rounded-2xl p-4 sm:p-6 border-cyber-gold/20 bg-cyber-gold/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <MessageSquareQuote size={60} className="sm:size-[80px]" />
                    </div>
                    <h3 className="text-[11px] sm:text-sm font-bold uppercase text-cyber-gold mb-3 sm:mb-4 flex items-center gap-2">
                      <Bot size={16} className="sm:size-[18px]" /> Argumentação Sugerida (IA)
                    </h3>
                    <p className="text-[11px] sm:text-sm leading-relaxed text-muted-foreground italic">
                      {clientData.profile === 'technical' ? 
                        "Foque na arquitetura escalável e na redução da dívida técnica. Mencione o uso de n8n para orquestração e Python para processamento pesado, garantindo performance e facilidade de manutenção." :
                        clientData.profile === 'executive' ?
                        "O foco deve ser ROI e redução de Headcount. Mostre como a automação de 20h semanais se traduz em economia de R$ 45k/ano e aceleração do Time-to-Market." :
                        "Foque na experiência do usuário e eliminação de tarefas repetitivas. Mostre como o Dashboard vai dar clareza total sobre o que está acontecendo no dia a dia sem esforço manual."
                      }
                    </p>
                  </div>

                  {/* Seleção de Módulos (Grid Moderno) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {AVAILABLE_MODULES.map(mod => (
                      <div key={mod.id} onClick={() => toggleModule(mod.id)} className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${selectedModules.includes(mod.id) ? 'bg-primary/10 border-primary/50 ring-1 ring-primary/20' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                        <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                          <h4 className="font-bold text-[13px] sm:text-sm group-hover:text-primary transition-colors">{mod.name}</h4>
                          <span className="text-primary text-[10px] sm:text-xs font-mono font-bold">R$ {mod.price}</span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed pr-4">{mod.description}</p>
                        {selectedModules.includes(mod.id) && <CheckCircle2 size={14} className="sm:size-[16px] absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-primary" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resumo & Call to Action */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="glass rounded-2xl p-6 sm:p-8 border-primary/20 lg:sticky lg:top-8 bg-gradient-to-b from-white/[0.03] to-transparent">
                    <h3 className="font-bold mb-4 sm:mb-6 flex items-center justify-between text-base sm:text-lg">
                      Budget Builder
                      <TrendingUp className="text-cyber-gold size-[18px] sm:size-[20px]" />
                    </h3>
                    <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                      {selectedModules.length === 0 && <p className="text-[10px] sm:text-xs text-muted-foreground italic text-center py-3 sm:py-4">Selecione módulos para compor o valor...</p>}
                      {selectedModules.map(id => {
                        const m = AVAILABLE_MODULES.find(x => x.id === id);
                        return (
                          <div key={id} className="flex justify-between text-[11px] sm:text-xs items-center group">
                            <span className="text-muted-foreground group-hover:text-white transition-colors truncate pr-2">{m?.name}</span>
                            <span className="font-mono shrink-0">R$ {m?.price}</span>
                          </div>
                        );
                      })}
                      <div className="pt-4 sm:pt-6 border-t border-white/10 flex justify-between font-black text-xl sm:text-2xl text-cyber-gold">
                        <span className="font-heading uppercase text-[10px] sm:text-xs self-center">Total</span>
                        <span>R$ {totalValue.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2.5 sm:space-y-3">
                      <button onClick={() => setShowPreview(true)} className="w-full bg-primary text-white py-3 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-2 sm:gap-3 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-base">
                        <Eye size={18} className="sm:size-[20px]" /> Visualizar Proposta
                      </button>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <button onClick={() => saveAsProject('full')} className="glass py-3 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-white/10 transition-all border border-white/10 text-[10px] sm:text-xs">
                          <Save size={14} className="sm:size-[16px]" /> Salvar Pipeline
                        </button>
                        <button onClick={() => saveAsProject('fast')} className="bg-cyber-gold/20 text-cyber-gold py-3 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-cyber-gold/30 transition-all border border-cyber-gold/30 text-[10px] sm:text-xs">
                          <Sparkles size={14} className="sm:size-[16px]" /> Preparar Reunião
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ABA 2: CRM & RELACIONAMENTOS */}
          {activeTab === 'crm' && (
            <motion.div key="crm" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 overflow-hidden">
                    <div className="min-w-0 w-full">
                      <h2 className="text-2xl sm:text-4xl font-bold font-heading truncate">Relationship <span className="text-gradient">Intelligence</span></h2>
                      <p className="text-[10px] sm:text-sm text-muted-foreground mt-2 truncate">Mapeie stakeholders e mantenha o contexto de cada conversa.</p>
                    </div>
                    <button 
                      onClick={() => {
                        setClientData({ name: '', cnpj: '', email: '', projectTitle: '', brief: '', profile: 'technical' });
                        setSelectedModules([]);
                        setActiveTab('proposals');
                      }}
                      className="w-full sm:w-auto bg-primary px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all text-xs sm:text-sm shrink-0 shadow-lg shadow-primary/20"
                    >
                      <Plus size={18} className="sm:size-[20px]" /> Adicionar Cliente
                    </button>
                  </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {projects.map(project => (
                  <div key={project.id} onClick={() => { setSelectedProject(project); setActiveTab('ops'); }} className="glass rounded-2xl p-4 sm:p-6 border-white/5 hover:border-primary/20 transition-all group cursor-pointer relative overflow-hidden">
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                        <Building size={20} className="sm:size-[24px] text-primary" />
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setClientData({
                              name: project.clientName,
                              cnpj: '',
                              email: '',
                              projectTitle: project.projectName,
                              brief: project.meetingNotes?.[0]?.content || '',
                              profile: 'technical'
                            });
                            setActiveTab('proposals');
                            toast.info("Dados carregados para edição na aba Propostas.");
                          }}
                          className="p-1.5 sm:p-2 glass rounded-lg hover:bg-primary/20 transition-all text-primary"
                          title="Editar Projeto"
                        >
                          <Settings size={14} className="sm:size-[18px]" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProject(project.id);
                          }}
                          className="p-1.5 sm:p-2 glass rounded-lg hover:bg-red-500/20 transition-all text-red-500"
                          title="Excluir Projeto"
                        >
                          <Trash2 size={14} className="sm:size-[18px]" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/portal/${project.id}`, '_blank');
                          }}
                          className="p-1.5 sm:p-2 glass rounded-lg hover:bg-primary/20 transition-all text-primary"
                          title="Ver Portal do Cliente"
                        >
                          <ExternalLink size={14} className="sm:size-[18px]" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-start gap-4 mb-4 sm:mb-6">
                      <div className="min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold mb-0.5 sm:mb-1 truncate">{project.clientName}</h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">{project.projectName}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 sm:gap-2 shrink-0">
                        <select 
                          id={`project-status-${project.id}`}
                          name={`project-status-${project.id}`}
                          value={project.status} 
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateProjectStatus(project.id, e.target.value as Project['status'])}
                          className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border-none outline-none cursor-pointer transition-colors ${
                            project.status === 'active' ? 'bg-cyber-emerald/10 text-cyber-emerald' : 
                            project.status === 'prospect' ? 'bg-cyber-gold/10 text-cyber-gold' : 
                            'bg-white/10 text-muted-foreground'
                          }`}
                        >
                          <option value="prospect" className="bg-cyber-black">Prospect</option>
                          <option value="active" className="bg-cyber-black">Ativo</option>
                          <option value="finished" className="bg-cyber-black">Finalizado</option>
                        </select>
                        <div className="flex items-center gap-1 text-[8px] sm:text-[9px] text-muted-foreground font-bold">
                          <Clock size={10} /> {formatProjectDate(project.deadline)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      <div className="space-y-2 sm:space-y-3">
                        <h4 className="text-[9px] sm:text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                          <Network size={12} className="sm:size-[14px]" /> Stakeholders Principais
                        </h4>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {(project.stakeholders || []).slice(0, 3).map((sh, i) => (
                            <div key={i} className="glass px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border-white/5 flex items-center gap-1.5 sm:gap-2 group/sh">
                              <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${sh.influence === 'high' ? 'bg-red-500' : 'bg-cyber-gold'}`} />
                              <span className="text-[9px] sm:text-[10px] font-medium truncate max-w-[60px] sm:max-w-none">{sh.name}</span>
                            </div>
                          ))}
                          {(project.stakeholders || []).length > 3 && (
                            <div className="glass px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border-white/5 text-[9px] sm:text-[10px] font-bold text-muted-foreground">
                              +{(project.stakeholders || []).length - 3}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[9px] sm:text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                            <History size={12} className="sm:size-[14px]" /> Memória & Docs
                          </h4>
                          {project.documents && project.documents.length > 0 && (
                            <span className="text-[8px] sm:text-[9px] bg-primary/20 text-primary px-1 sm:px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Paperclip size={8} className="sm:size-[10px]" /> {project.documents.length}
                            </span>
                          )}
                        </div>
                        <div className="bg-white/[0.02] rounded-xl p-2.5 sm:p-3 border border-white/5">
                          <p className="text-[10px] sm:text-[11px] text-muted-foreground italic line-clamp-2">
                            "{project.brief}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ABA 3: OPERAÇÕES & PROJETOS */}
          {activeTab === 'ops' && (
            <motion.div key="ops" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
              {!selectedProject ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
                    <div>
                      <h2 className="text-2xl sm:text-4xl font-bold font-heading">Operations <span className="text-gradient">Center</span></h2>
                      <p className="text-[10px] sm:text-sm text-muted-foreground mt-2">Gerencie a entrega e execução técnica dos seus projetos.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1 max-w-2xl">
                      <div className="relative flex-1 group">
                        <Search size={14} className="sm:size-[16px] absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                          id="ops-search"
                          name="ops-search"
                          type="text" 
                          placeholder="Buscar cliente ou projeto..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 outline-none focus:border-primary/50 transition-all text-[11px] sm:text-sm"
                        />
                      </div>
                      <select 
                        id="ops-status-filter"
                        name="ops-status-filter"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-primary/50 transition-all text-[11px] sm:text-sm min-w-[120px] sm:min-w-[140px]"
                      >
                        <option value="all" className="bg-cyber-black">Todos Status</option>
                        <option value="active" className="bg-cyber-black">Ativos</option>
                        <option value="prospect" className="bg-cyber-black">Propostas</option>
                        <option value="finished" className="bg-cyber-black">Finalizados</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {projects
                      .filter(p => {
                        const matchesSearch = p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                            p.projectName.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
                        return matchesSearch && matchesStatus;
                      })
                      .map(project => (
                      <div key={project.id} onClick={() => setSelectedProject(project)} className="glass rounded-2xl p-4 sm:p-6 border-white/5 hover:border-primary/20 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="sm:size-[18px] text-primary" />
                        </div>
                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Kanban size={16} className="sm:size-[20px] text-primary" />
                          </div>
                          <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${
                            project.status === 'active' ? 'text-cyber-emerald bg-cyber-emerald/10' :
                            project.status === 'prospect' ? 'text-cyber-gold bg-cyber-gold/10' :
                            'text-muted-foreground bg-white/10'
                          }`}>
                            {project.status.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-bold text-base sm:text-lg truncate">{project.projectName}</h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-3 sm:mb-4 truncate">{project.clientName}</p>
                        <div className="space-y-1.5 sm:space-y-2">
                          <div className="flex justify-between text-[9px] sm:text-[10px] font-bold">
                            <span className="text-muted-foreground uppercase">Progresso</span>
                            <span className="text-primary">{calculateProgress(project)}%</span>
                          </div>
                          <div className="w-full bg-white/5 h-1 sm:h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full transition-all duration-500" style={{ width: `${calculateProgress(project)}%` }} />
                          </div>
                          <div className="flex justify-between text-[8px] sm:text-[9px] text-muted-foreground font-mono">
                            <span>{project.tasks.filter(t => t.status === 'done').length}/{project.tasks.length} tarefas</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <div className="col-span-full py-12 sm:py-20 text-center glass rounded-3xl border-dashed border-white/10">
                        <Zap size={32} className="sm:size-[40px] mx-auto text-muted-foreground mb-3 sm:mb-4 opacity-20" />
                        <p className="text-[11px] sm:text-sm text-muted-foreground">Nenhum projeto encontrado.</p>
                        <button onClick={() => setActiveTab('proposals')} className="text-primary font-bold text-[11px] sm:text-sm mt-3 sm:mt-4 hover:underline">Criar nova proposta</button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <button onClick={() => setSelectedProject(null)} className="p-1.5 sm:p-2 glass rounded-lg text-muted-foreground hover:text-white transition-colors">
                      <ChevronRight size={18} className="sm:size-[20px] rotate-180" />
                    </button>
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-4xl font-bold font-heading truncate">{selectedProject.projectName}</h2>
                      <p className="text-[9px] sm:text-sm text-muted-foreground mt-1 truncate">Gestão operacional para <span className="text-primary font-bold">{selectedProject.clientName}</span></p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                    {/* Coluna 1 & 2: Tasks & Accesses */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-8">
                      {/* Briefing do Projeto */}
                      <div className="glass rounded-2xl p-4 sm:p-8 border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                          <MessageSquareQuote size={80} className="sm:size-[120px]" />
                        </div>
                        <h3 className="text-sm sm:text-base font-bold flex items-center gap-2 mb-3 sm:mb-4"><FileText size={18} className="sm:size-[20px] text-primary" /> Briefing do Projeto</h3>
                        <p className="text-[11px] sm:text-sm text-muted-foreground leading-relaxed italic">
                          "{selectedProject.brief}"
                        </p>
                      </div>

                      <div className="glass rounded-2xl p-4 sm:p-8 border-white/5 space-y-5 sm:space-y-6">
                        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                          <div>
                            <h3 className="text-sm sm:text-base font-bold flex items-center gap-2"><MessageSquareQuote size={18} className="sm:size-[20px] text-cyber-gold" /> Centro de Reuniões</h3>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">Registre contexto, decisões e próximos passos para nunca perder o fio da conversa.</p>
                          </div>
                          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full xl:w-auto xl:min-w-[360px]">
                            <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-3">
                              <p className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Registros</p>
                              <p className="text-base sm:text-lg font-bold mt-1">{selectedProject.meetingNotes.length}</p>
                            </div>
                            <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-3">
                              <p className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Último contato</p>
                              <p className="text-[10px] sm:text-xs font-bold mt-1">{selectedProject.meetingNotes[0]?.date ? formatProjectDate(selectedProject.meetingNotes[0].date) : 'Sem registro'}</p>
                            </div>
                            <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-3">
                              <p className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Próximo follow-up</p>
                              <p className="text-[10px] sm:text-xs font-bold mt-1">{formatProjectDate(meetingForm.followUpDate || selectedProject.followUpDate)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-4 sm:gap-6">
                          <div className="rounded-2xl border border-white/5 bg-black/20 p-4 sm:p-5 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Data</label>
                                <input
                                  type="date"
                                  value={meetingForm.date}
                                  onChange={(e) => setMeetingForm(prev => ({ ...prev, date: e.target.value }))}
                                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[11px] sm:text-sm outline-none focus:border-primary/40 transition-all"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Tipo</label>
                                <select
                                  value={meetingForm.kind}
                                  onChange={(e) => setMeetingForm(prev => ({ ...prev, kind: e.target.value as MeetingType }))}
                                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[11px] sm:text-sm outline-none focus:border-primary/40 transition-all"
                                >
                                  {MEETING_TYPE_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value} className="bg-cyber-black">{option.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Título</label>
                              <input
                                type="text"
                                value={meetingForm.title}
                                onChange={(e) => setMeetingForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Ex.: Alinhamento da entrega parcial"
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[11px] sm:text-sm outline-none focus:border-primary/40 transition-all"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Resumo</label>
                              <textarea
                                value={meetingForm.content}
                                onChange={(e) => setMeetingForm(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="Principais dores, objeções, aprovações e contexto relevante."
                                rows={4}
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[11px] sm:text-sm outline-none focus:border-primary/40 transition-all resize-none"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Decisão / resultado</label>
                              <textarea
                                value={meetingForm.outcome}
                                onChange={(e) => setMeetingForm(prev => ({ ...prev, outcome: e.target.value }))}
                                placeholder="O que foi aprovado, travado ou redefinido."
                                rows={2}
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[11px] sm:text-sm outline-none focus:border-primary/40 transition-all resize-none"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Próximo passo</label>
                                <input
                                  type="text"
                                  value={meetingForm.nextStep}
                                  onChange={(e) => setMeetingForm(prev => ({ ...prev, nextStep: e.target.value }))}
                                  placeholder="Ex.: enviar benchmark, proposta revisada, checklist..."
                                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[11px] sm:text-sm outline-none focus:border-primary/40 transition-all"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Novo follow-up</label>
                                <input
                                  type="date"
                                  value={meetingForm.followUpDate}
                                  onChange={(e) => setMeetingForm(prev => ({ ...prev, followUpDate: e.target.value }))}
                                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[11px] sm:text-sm outline-none focus:border-primary/40 transition-all"
                                />
                              </div>
                            </div>

                            <button
                              onClick={() => registerMeetingNote(selectedProject.id)}
                              className="w-full rounded-xl bg-cyber-gold/20 text-cyber-gold border border-cyber-gold/30 px-4 py-3 text-[10px] sm:text-xs font-bold hover:bg-cyber-gold/30 transition-all"
                            >
                              Salvar reunião e atualizar contexto
                            </button>
                          </div>

                          <div className="space-y-3">
                            {selectedProject.meetingNotes.length > 0 ? selectedProject.meetingNotes.slice(0, 5).map((note, index) => (
                              <div key={`${note.date}-${index}`} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 sm:p-5 space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                  <div>
                                    <p className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">{formatProjectDate(note.date)}</p>
                                    <p className="text-[11px] sm:text-sm font-bold mt-1">{note.title || 'Registro de reunião'}</p>
                                  </div>
                                  <span className={`px-2.5 py-1 rounded-full border text-[8px] sm:text-[9px] font-bold uppercase w-fit ${getMeetingTypeStyle(note.kind)}`}>
                                    {MEETING_TYPE_OPTIONS.find(option => option.value === note.kind)?.label || 'Contato'}
                                  </span>
                                </div>
                                <p className="text-[10px] sm:text-xs text-white/80 leading-relaxed">{note.content}</p>
                                {note.outcome && (
                                  <div className="rounded-xl border border-cyber-emerald/10 bg-cyber-emerald/5 px-3 py-2.5">
                                    <p className="text-[8px] sm:text-[9px] uppercase font-bold text-cyber-emerald mb-1">Resultado</p>
                                    <p className="text-[10px] sm:text-xs text-white/85">{note.outcome}</p>
                                  </div>
                                )}
                                {note.nextStep && (
                                  <div className="rounded-xl border border-primary/10 bg-primary/5 px-3 py-2.5">
                                    <p className="text-[8px] sm:text-[9px] uppercase font-bold text-primary mb-1">Próximo passo</p>
                                    <p className="text-[10px] sm:text-xs text-white/85">{note.nextStep}</p>
                                  </div>
                                )}
                              </div>
                            )) : (
                              <div className="rounded-2xl border-2 border-dashed border-white/10 px-4 py-8 text-center">
                                <MessageSquareQuote size={20} className="mx-auto text-muted-foreground opacity-30 mb-2" />
                                <p className="text-[10px] sm:text-xs text-muted-foreground">Sem histórico estruturado ainda. Registre a primeira reunião para construir o contexto do projeto.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stakeholders */}
                      <div className="glass rounded-2xl p-4 sm:p-8 border-white/5">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                          <h3 className="text-sm sm:text-base font-bold flex items-center gap-2"><Users size={18} className="sm:size-[20px] text-primary" /> Stakeholders</h3>
                          <button 
                            onClick={() => {
                              const name = prompt("Nome do Stakeholder:");
                              const role = prompt("Cargo:");
                              if (name && role) {
                                setProjects(prev => prev.map(p => p.id === selectedProject.id ? {
                                  ...p,
                                  stakeholders: [...(p.stakeholders || []), { name, role, influence: 'medium', preference: '' }]
                                } : p));
                              }
                            }}
                            className="text-[9px] sm:text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
                          >
                            <Plus size={10} className="sm:size-[12px]" /> Adicionar
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          {selectedProject.stakeholders?.map((s, i) => (
                            <div key={i} className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] sm:text-base shrink-0">
                                  {s.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[11px] sm:text-sm font-bold truncate">{s.name}</p>
                                  <p className="text-[9px] sm:text-[10px] text-muted-foreground truncate">{s.role}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => {
                                  setProjects(prev => prev.map(p => p.id === selectedProject.id ? {
                                    ...p,
                                    stakeholders: p.stakeholders.filter((_, idx) => idx !== i)
                                  } : p));
                                }}
                                className="opacity-100 sm:opacity-0 group-hover:opacity-100 p-1.5 sm:p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all shrink-0"
                              >
                                <Trash2 size={12} className="sm:size-[14px]" />
                              </button>
                            </div>
                          ))}
                          {(!selectedProject.stakeholders || selectedProject.stakeholders.length === 0) && (
                            <p className="col-span-full text-[10px] sm:text-xs text-muted-foreground italic py-2 sm:py-4 text-center sm:text-left">Nenhum stakeholder cadastrado.</p>
                          )}
                        </div>
                      </div>

                      {/* Kanban Simplificado */}
                      <div className="glass rounded-2xl p-4 sm:p-8 border-white/5">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                          <h3 className="text-sm sm:text-base font-bold flex items-center gap-2"><Kanban size={18} className="sm:size-[20px] text-primary" /> Próximos Passos</h3>
                          <button className="text-[10px] sm:text-xs font-bold text-primary hover:underline">+ Nova Tarefa</button>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                          {selectedProject.tasks.length > 0 ? selectedProject.tasks.map(task => (
                            <div key={task.id} className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all space-y-2 sm:space-y-3">
                              <div className="flex items-center gap-3 sm:gap-4">
                                <button 
                                  onClick={() => updateTaskStatus(selectedProject.id, task.id, task.status === 'done' ? 'todo' : 'done')}
                                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${task.status === 'done' ? 'bg-cyber-emerald border-cyber-emerald shadow-lg shadow-cyber-emerald/20' : 'border-white/20 hover:border-primary'}`}
                                >
                                  {task.status === 'done' && <CheckCircle2 size={12} className="text-white" />}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <span className={`text-[11px] sm:text-sm font-bold block truncate ${task.status === 'done' ? 'text-muted-foreground line-through opacity-50' : 'text-white'}`}>{task.title}</span>
                                </div>
                                <select 
                                  id={`task-status-${task.id}`}
                                  name={`task-status-${task.id}`}
                                  value={task.status} 
                                  onChange={(e) => updateTaskStatus(selectedProject.id, task.id, e.target.value as any)}
                                  className={`text-[9px] sm:text-[10px] font-bold uppercase px-1.5 sm:px-2 py-0.5 sm:py-1 rounded outline-none border-none cursor-pointer shrink-0 ${
                                    task.status === 'done' ? 'bg-cyber-emerald/10 text-cyber-emerald' : 
                                    task.status === 'doing' ? 'bg-primary/20 text-primary' : 
                                    'bg-white/10 text-muted-foreground'
                                  }`}
                                >
                                  <option value="todo" className="bg-cyber-black">Todo</option>
                                  <option value="doing" className="bg-cyber-black">Doing</option>
                                  <option value="done" className="bg-cyber-black">Done</option>
                                </select>
                              </div>
                              
                                <div className="flex flex-wrap gap-2 sm:gap-4 pl-8 sm:pl-10">
                                  <div className="space-y-1 min-w-[100px] flex-1">
                                    <label className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                      <Calendar size={10} /> Início
                                    </label>
                                    <input 
                                      id={`task-start-${task.id}`}
                                      name={`task-start-${task.id}`}
                                      type="date" 
                                      value={task.startDate || ''} 
                                      onChange={(e) => updateTaskDates(selectedProject.id, task.id, 'startDate', e.target.value)}
                                      className="bg-transparent border-none text-[10px] sm:text-[11px] text-muted-foreground outline-none focus:text-white transition-colors w-full"
                                    />
                                  </div>
                                  <div className="space-y-1 min-w-[100px] flex-1">
                                    <label className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                      <Target size={10} /> Fim Previsto
                                    </label>
                                    <input 
                                      id={`task-end-${task.id}`}
                                      name={`task-end-${task.id}`}
                                      type="date" 
                                      value={task.endDate || ''} 
                                      onChange={(e) => updateTaskDates(selectedProject.id, task.id, 'endDate', e.target.value)}
                                      className="bg-transparent border-none text-[10px] sm:text-[11px] text-muted-foreground outline-none focus:text-white transition-colors w-full"
                                    />
                                  </div>
                                </div>
                            </div>
                          )) : (
                            <div className="py-6 sm:py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
                              <Kanban size={20} className="sm:size-[24px] mx-auto text-muted-foreground mb-2 opacity-20" />
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Nenhuma tarefa cadastrada ainda.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Acessos Técnicos */}
                      <div className="glass rounded-2xl p-4 sm:p-8 border-white/5">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                          <h3 className="text-sm sm:text-base font-bold flex items-center gap-2"><Key size={18} className="sm:size-[20px] text-cyber-gold" /> Chaves & Acessos</h3>
                          <button className="text-[10px] sm:text-xs font-bold text-cyber-gold hover:underline">+ Novo Acesso</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {selectedProject.accesses.length > 0 ? selectedProject.accesses.map((access, i) => (
                            <div key={i} className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5 space-y-1.5 sm:space-y-2 group relative">
                              <div className="flex justify-between text-[9px] sm:text-[10px] font-bold uppercase text-muted-foreground">
                                <span>{access.type}</span>
                                <button className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity text-primary">Copiar</button>
                              </div>
                              <p className="text-[11px] sm:text-xs font-bold truncate">{access.label}</p>
                              <code className="text-[9px] sm:text-[10px] bg-black/40 p-1.5 sm:p-2 rounded block font-mono text-cyber-gold/80 truncate">
                                {access.credentials}
                              </code>
                            </div>
                          )) : (
                            <div className="sm:col-span-2 py-6 sm:py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
                              <Key size={20} className="sm:size-[24px] mx-auto text-muted-foreground mb-2 opacity-20" />
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Nenhum acesso técnico cadastrado.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Documentos & Anexos */}
                      <div className="glass rounded-2xl p-4 sm:p-8 border-white/5">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                          <h3 className="text-sm sm:text-base font-bold flex items-center gap-2"><Paperclip size={18} className="sm:size-[20px] text-primary" /> Documentos & Contratos</h3>
                          <button className="text-[10px] sm:text-xs font-bold text-primary hover:underline flex items-center gap-1">
                            <FileUp size={12} className="sm:size-[14px]" /> Upload
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {selectedProject.documents && selectedProject.documents.length > 0 ? (
                            selectedProject.documents.map((doc) => (
                              <div key={doc.id} className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 sm:space-y-3 group hover:bg-white/10 transition-all cursor-pointer">
                                <div className="flex items-start gap-2 sm:gap-3">
                                  <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${
                                    doc.type === 'contract' ? 'bg-primary/20 text-primary' : 
                                    doc.type === 'briefing' ? 'bg-cyber-gold/20 text-cyber-gold' : 
                                    'bg-white/10 text-white'
                                  }`}>
                                    {doc.type === 'contract' ? <FileCheck size={16} className="sm:size-[18px]" /> : 
                                     doc.type === 'briefing' ? <FileText size={16} className="sm:size-[18px]" /> : 
                                     <FileCode size={16} className="sm:size-[18px]" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[11px] sm:text-xs font-bold truncate">{doc.name}</p>
                                    <p className="text-[8px] sm:text-[10px] text-muted-foreground uppercase mt-0.5 truncate">{doc.type} • {doc.size}</p>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                  <span className="text-[8px] sm:text-[10px] text-muted-foreground">{new Date(doc.date).toLocaleDateString('pt-BR')}</span>
                                  <button className="text-[9px] sm:text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">BAIXAR</button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="sm:col-span-2 py-6 sm:py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
                              <FileUp size={20} className="sm:size-[24px] mx-auto text-muted-foreground mb-2 opacity-20" />
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Nenhum documento anexado ainda.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Coluna 3: Métricas & Prazos */}
                    <div className="space-y-4 sm:space-y-6">
                      <div className="glass rounded-2xl p-4 sm:p-8 border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent space-y-4 sm:space-y-6">
                        <div>
                          <h4 className="text-[9px] sm:text-[10px] font-bold uppercase text-muted-foreground mb-3 sm:mb-4">Status da Entrega</h4>
                          <div className="w-full bg-white/5 h-1.5 sm:h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-primary h-full transition-all duration-700 ease-out" 
                              style={{ width: `${calculateProgress(selectedProject)}%` }} 
                            />
                          </div>
                          <div className="flex justify-between mt-2 text-[9px] sm:text-[10px] font-bold">
                            <span>{calculateProgress(selectedProject)}% CONCLUÍDO</span>
                            <span className="text-primary truncate ml-2">FASE {selectedProject.tasks.filter(t => t.status === 'done').length}/{selectedProject.tasks.length}</span>
                          </div>
                        </div>

                        <div className="pt-4 sm:pt-6 border-t border-white/5 space-y-3 sm:space-y-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Calendar size={16} className="sm:size-[18px] text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase">Deadline</p>
                              <p className="text-[11px] sm:text-sm font-bold truncate">{formatProjectDate(selectedProject.deadline)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <DollarSign size={16} className="sm:size-[18px] text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase">Valor do Contrato</p>
                              <p className="text-[11px] sm:text-sm font-bold text-cyber-emerald truncate">R$ {selectedProject.financials.proposalValue.toLocaleString('pt-BR')}</p>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => window.open(`/portal/${selectedProject.id}`, '_blank')}
                          className="w-full py-3 sm:py-4 rounded-xl bg-white/5 border border-white/10 font-bold text-[11px] sm:text-xs hover:bg-white/10 transition-all"
                        >
                          Abrir Portal do Cliente
                        </button>
                      </div>

                      <div className="glass rounded-2xl p-4 sm:p-6 border-white/5 bg-primary/5 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-[9px] sm:text-[10px] font-bold uppercase text-primary flex items-center gap-2">
                              <Target size={12} className="sm:size-[14px]" /> Operação Solo 360
                            </h4>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Controle da jornada do cliente da reunião até a divulgação.</p>
                          </div>
                          <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[8px] font-bold uppercase border border-primary/20">
                            {selectedProject.workflowSteps.filter(step => step.done).length}/{selectedProject.workflowSteps.length}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <label htmlFor="project-stage" className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Fase atual</label>
                            <select
                              id="project-stage"
                              value={selectedProject.stage}
                              onChange={(e) => updateProjectPlanning(selectedProject.id, { stage: e.target.value as ProjectStage })}
                              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 text-[11px] sm:text-xs font-bold outline-none focus:border-primary"
                            >
                              {PROJECT_STAGE_OPTIONS.map(option => (
                                <option key={option.value} value={option.value} className="bg-cyber-black">
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label htmlFor="project-next-action" className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Próxima ação</label>
                            <input
                              id="project-next-action"
                              type="text"
                              value={selectedProject.nextAction}
                              onChange={(e) => updateProjectPlanning(selectedProject.id, { nextAction: e.target.value })}
                              placeholder="Ex: confirmar kickoff com o cliente"
                              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 text-[11px] sm:text-xs outline-none focus:border-primary"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label htmlFor="project-follow-up" className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Data de follow-up</label>
                            <input
                              id="project-follow-up"
                              type="date"
                              value={selectedProject.followUpDate}
                              onChange={(e) => updateProjectPlanning(selectedProject.id, { followUpDate: e.target.value })}
                              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 text-[11px] sm:text-xs outline-none focus:border-primary"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          {selectedProject.workflowSteps.map(step => (
                            <button
                              key={step.id}
                              onClick={() => toggleWorkflowStep(selectedProject.id, step.id)}
                              className={`w-full flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                                step.done
                                  ? 'border-cyber-emerald/20 bg-cyber-emerald/10'
                                  : 'border-white/10 bg-black/20 hover:border-primary/30'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${step.done ? 'border-cyber-emerald bg-cyber-emerald text-white' : 'border-white/20 text-transparent'}`}>
                                  <CheckCircle2 size={12} />
                                </div>
                                <div className="min-w-0">
                                  <p className={`text-[10px] sm:text-[11px] font-bold truncate ${step.done ? 'text-white' : 'text-white/90'}`}>{step.title}</p>
                                  <p className="text-[8px] sm:text-[9px] uppercase text-muted-foreground">{step.area}</p>
                                </div>
                              </div>
                              <span className={`text-[8px] sm:text-[9px] font-bold uppercase shrink-0 ${step.done ? 'text-cyber-emerald' : 'text-muted-foreground'}`}>
                                {step.done ? 'feito' : 'pendente'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="glass rounded-2xl p-4 sm:p-6 border-white/5 bg-sky-500/5 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-[9px] sm:text-[10px] font-bold uppercase text-sky-300 flex items-center gap-2">
                              <ClipboardList size={12} className="sm:size-[14px]" /> SOP / Playbook
                            </h4>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Template operacional reaproveitável para conduzir este tipo de projeto com consistência.</p>
                          </div>
                          <div className="px-2 py-1 rounded-full bg-sky-500/10 text-sky-300 text-[8px] font-bold uppercase border border-sky-500/20">
                            {selectedProject.playbook.steps.filter(step => step.done).length}/{selectedProject.playbook.steps.length}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Template ativo</label>
                          <select
                            value={selectedProject.playbook.templateId}
                            onChange={(e) => updateProjectPlaybookTemplate(selectedProject.id, e.target.value as PlaybookTemplateId)}
                            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 text-[11px] sm:text-xs font-bold outline-none focus:border-sky-400"
                          >
                            {(Object.keys(PLAYBOOK_TEMPLATES) as PlaybookTemplateId[]).map(templateId => (
                              <option key={templateId} value={templateId} className="bg-cyber-black">
                                {getPlaybookTemplateMeta(templateId).label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-3">
                          <p className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Diretriz do template</p>
                          <p className="text-[10px] sm:text-xs text-white mt-1">
                            {getPlaybookTemplateMeta(selectedProject.playbook.templateId).description}
                          </p>
                        </div>

                        <div className="space-y-2">
                          {selectedProject.playbook.steps.map(step => (
                            <button
                              key={step.id}
                              onClick={() => toggleProjectPlaybookStep(selectedProject.id, step.id)}
                              className={`w-full flex items-start justify-between gap-3 rounded-xl border px-3 py-3 text-left transition-all ${
                                step.done
                                  ? 'border-sky-400/20 bg-sky-500/10'
                                  : 'border-white/10 bg-black/20 hover:border-sky-400/30'
                              }`}
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${step.done ? 'border-sky-300 bg-sky-300 text-cyber-black' : 'border-white/20 text-transparent'}`}>
                                  <CheckCircle2 size={12} />
                                </div>
                                <div className="min-w-0">
                                  <p className={`text-[10px] sm:text-[11px] font-bold ${step.done ? 'text-white' : 'text-white/90'}`}>{step.title}</p>
                                  <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">{step.description}</p>
                                </div>
                              </div>
                              <span className={`text-[8px] sm:text-[9px] font-bold uppercase shrink-0 ${step.done ? 'text-sky-300' : 'text-muted-foreground'}`}>
                                {step.done ? 'feito' : 'pendente'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="glass rounded-2xl p-4 sm:p-6 border-white/5 bg-cyber-emerald/5 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-[9px] sm:text-[10px] font-bold uppercase text-cyber-emerald flex items-center gap-2">
                              <CreditCard size={12} className="sm:size-[14px]" /> Financeiro do Projeto
                            </h4>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Controle proposta, recebimentos, parcelas e margem real.</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full border text-[8px] font-bold uppercase ${getPaymentStatusStyle(getProjectPaymentStatus(selectedProject))}`}>
                            {getProjectPaymentStatus(selectedProject)}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-3">
                            <p className="text-[8px] uppercase font-bold text-muted-foreground">Recebido</p>
                            <p className="text-[10px] sm:text-xs font-bold text-cyber-emerald mt-1">R$ {getProjectReceivedTotal(selectedProject).toLocaleString('pt-BR')}</p>
                          </div>
                          <div className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-3">
                            <p className="text-[8px] uppercase font-bold text-muted-foreground">Em aberto</p>
                            <p className="text-[10px] sm:text-xs font-bold text-cyber-gold mt-1">R$ {getProjectOutstandingTotal(selectedProject).toLocaleString('pt-BR')}</p>
                          </div>
                          <div className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-3">
                            <p className="text-[8px] uppercase font-bold text-muted-foreground">Margem</p>
                            <p className={`text-[10px] sm:text-xs font-bold mt-1 ${getProjectMarginPercentage(selectedProject) >= 50 ? 'text-cyber-emerald' : 'text-cyber-gold'}`}>
                              {getProjectMarginPercentage(selectedProject)}%
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <label className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Valor proposto</label>
                            <input
                              type="number"
                              min="0"
                              value={selectedProject.financials.proposalValue}
                              onChange={(e) => updateProjectFinancials(selectedProject.id, { proposalValue: Number(e.target.value) || 0 })}
                              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 text-[11px] sm:text-xs outline-none focus:border-cyber-emerald"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Forma de pagamento</label>
                              <input
                                type="text"
                                value={financeForm.paymentMethod}
                                onChange={(e) => {
                                  const paymentMethod = e.target.value;
                                  setFinanceForm(prev => ({ ...prev, paymentMethod }));
                                  updateProjectFinancials(selectedProject.id, { paymentMethod });
                                }}
                                className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 text-[11px] sm:text-xs outline-none focus:border-cyber-emerald"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Nota / cobrança</label>
                              <select
                                value={financeForm.invoiceStatus}
                                onChange={(e) => {
                                  const invoiceStatus = e.target.value as ProjectFinancials['invoiceStatus'];
                                  setFinanceForm(prev => ({ ...prev, invoiceStatus }));
                                  updateProjectFinancials(selectedProject.id, { invoiceStatus });
                                }}
                                className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 text-[11px] sm:text-xs outline-none focus:border-cyber-emerald"
                              >
                                <option value="pending" className="bg-cyber-black">Pendente</option>
                                <option value="issued" className="bg-cyber-black">Emitida</option>
                                <option value="paid" className="bg-cyber-black">Quitada</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-black/20 p-3 sm:p-4 space-y-3">
                          <p className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Nova parcela</p>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={financeForm.installmentLabel}
                              onChange={(e) => setFinanceForm(prev => ({ ...prev, installmentLabel: e.target.value }))}
                              placeholder="Ex.: sinal, 2ª parcela, entrega final"
                              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 text-[11px] sm:text-xs outline-none focus:border-cyber-emerald"
                            />
                            <div className="grid grid-cols-[1fr_120px] gap-2">
                              <input
                                type="number"
                                min="0"
                                value={financeForm.installmentAmount}
                                onChange={(e) => setFinanceForm(prev => ({ ...prev, installmentAmount: e.target.value }))}
                                placeholder="Valor"
                                className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 text-[11px] sm:text-xs outline-none focus:border-cyber-emerald"
                              />
                              <input
                                type="date"
                                value={financeForm.installmentDueDate}
                                onChange={(e) => setFinanceForm(prev => ({ ...prev, installmentDueDate: e.target.value }))}
                                className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 text-[11px] sm:text-xs outline-none focus:border-cyber-emerald"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => addProjectInstallment(selectedProject.id)}
                            className="w-full rounded-xl border border-cyber-emerald/20 bg-cyber-emerald/10 px-3 py-2.5 text-[10px] sm:text-xs font-bold text-cyber-emerald hover:bg-cyber-emerald/15 transition-all"
                          >
                            Adicionar parcela
                          </button>
                        </div>

                        <div className="space-y-2">
                          {selectedProject.financials.installments.length > 0 ? selectedProject.financials.installments.map(installment => {
                            const effectiveStatus = getEffectiveInstallmentStatus(installment);

                            return (
                              <div key={installment.id} className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-3 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="text-[10px] sm:text-xs font-bold truncate">{installment.label}</p>
                                    <p className="text-[8px] sm:text-[9px] text-muted-foreground">Vence em {formatProjectDate(installment.dueDate)}</p>
                                  </div>
                                  <span className={`px-2 py-1 rounded-full border text-[8px] font-bold uppercase shrink-0 ${getInstallmentStatusStyle(effectiveStatus)}`}>
                                    {effectiveStatus}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-[10px] sm:text-xs font-mono text-white">R$ {installment.amount.toLocaleString('pt-BR')}</p>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => updateInstallmentStatus(selectedProject.id, installment.id, 'pending')}
                                      className="px-2.5 py-1 rounded-lg border border-white/10 text-[8px] sm:text-[9px] font-bold text-muted-foreground hover:bg-white/5 transition-all"
                                    >
                                      Pendente
                                    </button>
                                    <button
                                      onClick={() => updateInstallmentStatus(selectedProject.id, installment.id, 'paid')}
                                      className="px-2.5 py-1 rounded-lg border border-cyber-emerald/20 text-[8px] sm:text-[9px] font-bold text-cyber-emerald hover:bg-cyber-emerald/10 transition-all"
                                    >
                                      Recebida
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          }) : (
                            <div className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-center text-[10px] sm:text-xs text-muted-foreground">
                              Nenhuma parcela cadastrada ainda.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="glass rounded-2xl p-4 sm:p-6 border-white/5 bg-fuchsia-500/5 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-[9px] sm:text-[10px] font-bold uppercase text-fuchsia-300 flex items-center gap-2">
                              <ArrowUpRight size={12} className="sm:size-[14px]" /> Pós-entrega & Divulgação
                            </h4>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Garanta prova social, portfólio e novas oportunidades após a entrega.</p>
                          </div>
                          <div className="px-2 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-300 text-[8px] font-bold uppercase border border-fuchsia-500/20">
                            {selectedProject.postDeliverySteps.filter(step => step.done).length}/{selectedProject.postDeliverySteps.length}
                          </div>
                        </div>

                        <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-3">
                          <p className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Próxima alavanca</p>
                          <p className="text-[10px] sm:text-xs text-white mt-1">
                            {selectedProject.postDeliverySteps.find(step => !step.done)?.title || 'Checklist completo. Hora de nutrir relacionamento e abrir nova oferta.'}
                          </p>
                        </div>

                        <div className="space-y-2">
                          {selectedProject.postDeliverySteps.map(step => (
                            <button
                              key={step.id}
                              onClick={() => togglePostDeliveryStep(selectedProject.id, step.id)}
                              className={`w-full flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                                step.done
                                  ? 'border-fuchsia-500/20 bg-fuchsia-500/10'
                                  : 'border-white/10 bg-black/20 hover:border-fuchsia-500/30'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${step.done ? 'border-fuchsia-300 bg-fuchsia-300 text-cyber-black' : 'border-white/20 text-transparent'}`}>
                                  <CheckCircle2 size={12} />
                                </div>
                                <div className="min-w-0">
                                  <p className={`text-[10px] sm:text-[11px] font-bold truncate ${step.done ? 'text-white' : 'text-white/90'}`}>{step.title}</p>
                                  <p className="text-[8px] sm:text-[9px] uppercase text-muted-foreground">{getPostDeliveryAreaLabel(step.area)}</p>
                                </div>
                              </div>
                              <span className={`text-[8px] sm:text-[9px] font-bold uppercase shrink-0 ${step.done ? 'text-fuchsia-300' : 'text-muted-foreground'}`}>
                                {step.done ? 'feito' : 'pendente'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custos Operacionais */}
                      <div className="glass rounded-2xl p-4 sm:p-6 border-white/5 bg-red-500/5 space-y-3 sm:space-y-4">
                        <h4 className="text-[9px] sm:text-[10px] font-bold uppercase text-red-400 flex items-center gap-2">
                          <PieChart size={12} className="sm:size-[14px]" /> Custos do Projeto
                        </h4>
                        <div className="space-y-1.5 sm:space-y-2">
                          {selectedProject.costs.length > 0 ? selectedProject.costs.map((cost, i) => (
                            <div key={i} className="flex justify-between text-[10px] sm:text-[11px]">
                              <span className="text-muted-foreground truncate mr-2">{cost.label}</span>
                              <span className="font-mono text-red-400 shrink-0">R$ {cost.value}</span>
                            </div>
                          )) : (
                            <p className="text-[10px] sm:text-xs text-muted-foreground italic">Nenhum custo operacional registrado.</p>
                          )}
                        </div>
                        <div className="pt-2 border-t border-white/5 flex justify-between text-[10px] sm:text-[11px] font-bold">
                          <span className="text-muted-foreground">Margem estimada</span>
                          <span className={getProjectMarginPercentage(selectedProject) >= 50 ? 'text-cyber-emerald' : 'text-cyber-gold'}>
                            R$ {getProjectMarginTotal(selectedProject).toLocaleString('pt-BR')} ({getProjectMarginPercentage(selectedProject)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ABA 5: ERP & GESTÃO GLOBAL */}
          {activeTab === 'erp' && (
            <motion.div key="erp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-4 sm:space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <h2 className="text-2xl sm:text-4xl font-bold font-heading">Global <span className="text-gradient">ERP</span></h2>
                  <p className="text-[10px] sm:text-sm text-muted-foreground mt-1 sm:mt-2">Gestão 360º: Financeiro, Terceirizados e Infraestrutura.</p>
                </div>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                  <div className="glass px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border-white/5 flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
                    <div>
                      <p className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase">Receita Total</p>
                      <p className="text-sm sm:text-xl font-bold text-cyber-emerald">R$ {projects.reduce((acc, p) => acc + p.financials.proposalValue, 0).toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="w-px h-6 sm:h-8 bg-white/10" />
                    <div>
                      <p className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase">Recebido</p>
                      <p className="text-sm sm:text-xl font-bold text-primary">R$ {projects.reduce((acc, p) => acc + getProjectReceivedTotal(p), 0).toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="w-px h-6 sm:h-8 bg-white/10" />
                    <div>
                      <p className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase">Custos Atuais</p>
                      <p className="text-sm sm:text-xl font-bold text-red-400">R$ {projects.reduce((acc, p) => acc + getProjectCostsTotal(p), 0).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                {/* Módulo Financeiro Consolidado */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 border-white/5 space-y-4 sm:space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold flex items-center gap-2 text-sm sm:text-lg"><TrendingUp size={18} className="text-primary sm:size-[22px]" /> Fluxo de Caixa por Projeto</h3>
                      <button 
                        onClick={() => {
                          const wsFinance = workspaces.find(w => w.id === 'ws-finance');
                          const boardRevenue = wsFinance?.boards.find(b => b.id === 'board-revenue');
                          if (wsFinance && boardRevenue) {
                            setActiveWorkspaceId(wsFinance.id);
                            setActiveBoardId(boardRevenue.id);
                            setActiveTab('board');
                          }
                        }}
                        className="text-[10px] sm:text-xs font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <span className="hidden xs:inline">Ver Detalhes no Quadro</span><span className="xs:hidden">Detalhes</span> <ChevronRight size={12} className="sm:size-[14px]" />
                      </button>
                    </div>
                    <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                      <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-full">
                        <thead>
                          <tr className="border-b border-white/5">
                            <th className="py-3 sm:py-4 text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase">Projeto</th>
                            <th className="py-3 sm:py-4 text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase">Proposta</th>
                            <th className="py-3 sm:py-4 text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase">Recebido</th>
                            <th className="py-3 sm:py-4 text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase">Em aberto</th>
                            <th className="py-3 sm:py-4 text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase">Custos</th>
                            <th className="py-3 sm:py-4 text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase">Margem</th>
                            <th className="py-3 sm:py-4 text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase text-right">Pagamento</th>
                          </tr>
                        </thead>
                        <tbody className="text-[11px] sm:text-sm">
                          {projects.map(p => {
                            const costs = getProjectCostsTotal(p);
                            const received = getProjectReceivedTotal(p);
                            const outstanding = getProjectOutstandingTotal(p);
                            const margin = getProjectMarginTotal(p);
                            const marginPerc = getProjectMarginPercentage(p);
                            const paymentStatus = getProjectPaymentStatus(p);
                            return (
                              <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="py-3 sm:py-4 font-bold truncate max-w-[100px] sm:max-w-none">{p.projectName}</td>
                                <td className="py-3 sm:py-4 font-mono">R$ {p.financials.proposalValue.toLocaleString('pt-BR')}</td>
                                <td className="py-3 sm:py-4 font-mono text-primary">R$ {received.toLocaleString('pt-BR')}</td>
                                <td className="py-3 sm:py-4 font-mono text-cyber-gold">R$ {outstanding.toLocaleString('pt-BR')}</td>
                                <td className="py-3 sm:py-4 font-mono text-red-400">R$ {costs.toLocaleString('pt-BR')}</td>
                                <td className="py-3 sm:py-4">
                                  <span className={`font-mono ${marginPerc > 50 ? 'text-cyber-emerald' : 'text-cyber-gold'}`}>
                                    R$ {margin.toLocaleString('pt-BR')} <span className="hidden xs:inline">({marginPerc}%)</span>
                                  </span>
                                </td>
                                <td className="py-3 sm:py-4 text-right">
                                  <span className={`text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded uppercase font-bold border ${getPaymentStatusStyle(paymentStatus)}`}>
                                    {paymentStatus}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Gestão de Terceirizados & Parceiros */}
                  <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 border-white/5 space-y-4 sm:space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold flex items-center gap-2 text-sm sm:text-lg"><Briefcase size={18} className="text-cyber-gold sm:size-[22px]" /> Terceirizados & Squads</h3>
                      <button 
                        onClick={() => {
                          const wsFinance = workspaces.find(w => w.id === 'ws-finance');
                          const boardExpenses = wsFinance?.boards.find(b => b.id === 'board-expenses');
                          if (wsFinance && boardExpenses) {
                            setActiveWorkspaceId(wsFinance.id);
                            setActiveBoardId(boardExpenses.id);
                            setActiveTab('board');
                          }
                        }}
                        className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
                      >
                        <span className="hidden xs:inline">Ver no Quadro</span><span className="xs:hidden">Quadro</span> <ChevronRight size={12} className="sm:size-[14px]" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyber-gold/10 flex items-center justify-center text-cyber-gold border border-cyber-gold/20 shrink-0">
                            <Code2 size={20} className="sm:size-[24px]" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm sm:text-base truncate">Marcos Silva</p>
                            <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase truncate">Dev Fullstack • Freelancer</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="text-[10px] sm:text-xs font-mono text-cyber-gold">R$ 120/hora</p>
                          <p className="text-[8px] sm:text-[9px] text-muted-foreground">Alocado: Projeto ETL</p>
                        </div>
                      </div>
                      <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center border-dashed opacity-50">
                        <p className="text-[10px] sm:text-xs text-muted-foreground italic">Nenhum outro parceiro ativo.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna 3: Custos Fixos & Tecnologia */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 border-white/5 space-y-4 sm:space-y-6">
                    <h3 className="font-bold flex items-center gap-2 text-xs sm:text-sm"><Bot size={16} className="text-primary sm:size-[18px]" /> Stack de Tecnologia</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-center p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                            <Database size={12} className="sm:size-[14px]" />
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold truncate">PostgreSQL Cloud</span>
                        </div>
                        <span className="text-[10px] sm:text-xs font-mono text-red-400 shrink-0 ml-2">R$ 80/mês</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                            <Bot size={12} className="sm:size-[14px]" />
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold truncate">OpenAI API (Base)</span>
                        </div>
                        <span className="text-[10px] sm:text-xs font-mono text-red-400 shrink-0 ml-2">R$ 150/mês</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                            <Zap size={12} className="sm:size-[14px]" />
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold truncate">VPS DigitalOcean</span>
                        </div>
                        <span className="text-[10px] sm:text-xs font-mono text-red-400 shrink-0 ml-2">R$ 60/mês</span>
                      </div>
                    </div>
                    <div className="pt-3 sm:pt-4 border-t border-white/5 flex justify-between items-center">
                      <span className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase">Total Operacional Fixo</span>
                      <span className="text-xs sm:text-sm font-bold text-red-400">R$ 290/mês</span>
                    </div>
                  </div>

                  <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 border-primary/20 bg-primary/5 space-y-3 sm:space-y-4">
                    <h4 className="text-[10px] sm:text-xs font-bold flex items-center gap-2"><Sparkles size={14} className="text-primary sm:size-[16px]" /> Insight do ERP</h4>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed">
                      Sua margem média atual é de <span className="text-cyber-emerald font-bold">78%</span>. 
                      O projeto "Automação de ETL" é o mais lucrativo. 
                      Considere migrar a VPS para um plano anual para economizar 15% nos custos fixos.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ABA 4: FINANCEIRO & PERFIL */}
          {activeTab === 'company' && (
            <motion.div key="company" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-4 sm:space-y-8">
              <h2 className="text-2xl sm:text-4xl font-bold font-heading">Business <span className="text-gradient">Settings</span></h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                <div className="glass rounded-2xl p-4 sm:p-8 border-white/5 space-y-4 sm:space-y-6">
                  <h3 className="font-bold flex items-center gap-2 text-sm sm:text-base"><Building size={18} className="text-primary sm:size-[20px]" /> Perfil da Consultoria</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1 sm:space-y-1.5">
                      <label className="text-[8px] sm:text-[10px] uppercase font-bold text-muted-foreground">Nome Fantasia</label>
                      <input 
                        id="company-name"
                        name="company-name"
                        value={company.name} 
                        onChange={e => {
                          if (!ensureCompanyEdit()) return;
                          setCompany({...company, name: e.target.value});
                        }} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-primary/50 transition-all text-[11px] sm:text-sm" 
                        readOnly={!canEditCompany}
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-1.5">
                      <label className="text-[8px] sm:text-[10px] uppercase font-bold text-muted-foreground">CNPJ</label>
                      <input 
                        id="company-cnpj"
                        name="company-cnpj"
                        value={company.cnpj} 
                        onChange={e => {
                          if (!ensureCompanyEdit()) return;
                          setCompany({...company, cnpj: maskCNPJ(e.target.value)});
                        }} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-primary/50 transition-all text-[11px] sm:text-sm" 
                        placeholder="00.000.000/0000-00"
                        readOnly={!canEditCompany}
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-1.5">
                      <label className="text-[8px] sm:text-[10px] uppercase font-bold text-muted-foreground">E-mail Profissional</label>
                      <input 
                        id="company-email"
                        name="company-email"
                        value={company.email} 
                        onChange={e => {
                          if (!ensureCompanyEdit()) return;
                          setCompany({...company, email: e.target.value});
                        }} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-primary/50 transition-all text-[11px] sm:text-sm" 
                        readOnly={!canEditCompany}
                      />
                    </div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-4 sm:p-8 border-white/5 space-y-4 sm:space-y-6">
                  <h3 className="font-bold flex items-center gap-2 text-sm sm:text-base"><CreditCard size={18} className="text-cyber-gold sm:size-[20px]" /> Dados de Pagamento</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1 sm:space-y-1.5">
                      <label className="text-[8px] sm:text-[10px] uppercase font-bold text-muted-foreground">Instruções de Faturamento (Pix/Banco)</label>
                      <textarea 
                        id="company-bank-info"
                        name="company-bank-info"
                        value={company.bankInfo} 
                        onChange={e => {
                          if (!ensureCompanyEdit()) return;
                          setCompany({...company, bankInfo: e.target.value});
                        }} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-primary/50 transition-all text-[11px] sm:text-sm h-24 sm:h-32 resize-none" 
                        readOnly={!canEditCompany}
                      />
                    </div>
                    <button
                      onClick={ensureCompanyEdit}
                      className={`w-full py-3 sm:py-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                        canEditCompany
                          ? 'bg-primary hover:bg-primary/90 shadow-primary/20'
                          : 'bg-white/5 text-muted-foreground shadow-transparent'
                      }`}
                    >
                      <Save size={16} className="sm:size-[18px]" /> Salvar Configurações
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-4xl font-bold font-heading">Equipe <span className="text-gradient">Colaborativa</span></h2>
                  <p className="text-sm text-muted-foreground max-w-3xl">
                    Aqui ficam os atores adicionais já mapeados no produto: operação comercial, CRM, projetos, workspaces, empresa, financeiro, conteúdo e servidor.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                    {collaborators.length} colaborador(es)
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Owner: {user?.email}
                  </span>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
                <div className="space-y-6">
                  <div className="glass rounded-3xl border-white/5 p-5 sm:p-6 space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold">Convite aprovado</h3>
                        <p className="text-[11px] sm:text-xs text-muted-foreground">O link já nasce pronto para cadastro/login e só aceita o e-mail aprovado.</p>
                      </div>
                      <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
                        <Shield size={20} />
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">E-mail</label>
                        <input
                          value={inviteForm.email}
                          onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm"
                          placeholder="colaborador@empresa.com"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Papel inicial</label>
                        <select
                          value={inviteForm.role}
                          onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value as CollaborationMember['role'] }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm"
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role.value} value={role.value} className="bg-cyber-black">
                              {role.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Contexto do acesso</label>
                      <textarea
                        value={inviteForm.note}
                        onChange={(e) => setInviteForm(prev => ({ ...prev, note: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm h-28 resize-none"
                        placeholder="Ex.: vai assumir CRM, follow-up comercial e leitura financeira."
                      />
                    </div>

                    <button
                      onClick={handleInviteCollaborator}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                      <Plus size={16} /> Aprovar e gerar link
                    </button>
                  </div>

                  <div className="glass rounded-3xl border-white/5 p-5 sm:p-6 space-y-5">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold">Colaboradores ativos</h3>
                      <p className="text-[11px] sm:text-xs text-muted-foreground">Cada perfil combina visibilidade de módulo com capacidade de edição.</p>
                    </div>

                    <div className="space-y-4">
                      {isLoadingCollaborators && (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-muted-foreground">
                          Carregando equipe colaborativa...
                        </div>
                      )}

                      {!isLoadingCollaborators && collaborators.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-muted-foreground">
                          Nenhum colaborador aprovado ainda.
                        </div>
                      )}

                      {collaborators.map((collaborator) => (
                        <div key={collaborator.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 space-y-4">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-base font-bold">{collaborator.user?.username || collaborator.email}</h4>
                                <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                                  {collaborator.status}
                                </span>
                                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                  {collaborator.role}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{collaborator.email}</p>
                              {collaborator.note && <p className="text-sm text-white/80">{collaborator.note}</p>}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                              <select
                                value={collaborator.role}
                                onChange={(e) => updateCollaborator(collaborator.id, { role: e.target.value as CollaborationMember['role'] })}
                                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/50"
                              >
                                {ROLE_OPTIONS.map((role) => (
                                  <option key={role.value} value={role.value} className="bg-cyber-black">
                                    {role.label}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => revokeCollaborator(collaborator.id)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-500/20 transition-all"
                              >
                                <Trash2 size={14} /> Revogar
                              </button>
                            </div>
                          </div>

                          {collaborator.inviteLink && (
                            <div className="rounded-2xl border border-white/10 bg-cyber-black/40 p-3 text-xs text-muted-foreground break-all">
                              {collaborator.inviteLink}
                            </div>
                          )}

                          <div className="grid gap-3 md:grid-cols-2">
                            {PERMISSION_CATALOG.map((permission) => (
                              <button
                                key={`${collaborator.id}-${permission.key}`}
                                onClick={() => updateCollaborator(collaborator.id, {
                                  permissions: {
                                    ...collaborator.permissions,
                                    [permission.key]: !collaborator.permissions[permission.key]
                                  }
                                })}
                                className={`rounded-2xl border p-4 text-left transition-all ${
                                  collaborator.permissions[permission.key]
                                    ? 'border-primary/20 bg-primary/10'
                                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05]'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-sm font-bold">{permission.label}</span>
                                  <span className={`text-[10px] font-bold uppercase tracking-widest ${collaborator.permissions[permission.key] ? 'text-primary' : 'text-muted-foreground'}`}>
                                    {collaborator.permissions[permission.key] ? 'Ativo' : 'Bloqueado'}
                                  </span>
                                </div>
                                <p className="mt-2 text-xs text-white/80">{permission.summary}</p>
                                <p className="mt-1 text-[11px] text-muted-foreground">{permission.impact}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass rounded-3xl border-white/5 p-5 sm:p-6 space-y-4">
                    <h3 className="text-sm sm:text-base font-bold">Papéis sugeridos</h3>
                    <div className="space-y-3">
                      {ROLE_OPTIONS.map((role) => (
                        <div key={role.value} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-bold">{role.label}</span>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{role.value}</span>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">{role.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-3xl border-white/5 p-5 sm:p-6 space-y-4">
                    <h3 className="text-sm sm:text-base font-bold">Oportunidades multiator já preparadas</h3>
                    <div className="space-y-3">
                      {[
                        { title: 'Comercial/Closer', detail: 'Propostas, CRM, follow-up e acesso parcial ao financeiro.' },
                        { title: 'Delivery/PM', detail: 'Projetos, workspaces, playbooks, stakeholders e pós-entrega.' },
                        { title: 'Financeiro', detail: 'ERP, company billing e leitura de propostas para conferência.' },
                        { title: 'Conteúdo/Marketing', detail: 'Blog e ativos da marca sem acesso aos dados sensíveis.' }
                      ].map((item) => (
                        <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                          <p className="text-sm font-bold">{item.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          </AnimatePresence>
          )}
        </div>
      </main>

      {/* Modal de Preview da Proposta */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowPreview(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] glass rounded-3xl overflow-hidden border border-white/10 flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <FileText className="text-primary" />
                  <h3 className="font-bold">Preview da Proposta Profissional</h3>
                </div>
                <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-white text-black">
                {/* Cabeçalho da Proposta Real */}
                <div className="flex justify-between items-start mb-12 border-b-2 border-black/5 pb-8">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-black uppercase tracking-tighter">{company.name}</h1>
                    <p className="text-xs text-gray-500">{company.cnpj} | {company.email}</p>
                    <p className="text-xs text-gray-500">{company.address}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] font-bold text-primary uppercase">Proposta Comercial</p>
                    <p className="text-xl font-bold">#PRO-{Date.now().toString().slice(-5)}</p>
                    <p className="text-xs text-gray-500">{new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                {/* Cliente */}
                <div className="mb-10">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Preparado para:</p>
                  <h2 className="text-2xl font-bold">{clientData.name}</h2>
                  <p className="text-lg text-gray-600 font-medium">{clientData.projectTitle}</p>
                </div>

                {/* Escopo */}
                <div className="space-y-6 mb-12">
                  <h3 className="text-sm font-bold uppercase border-b border-black/10 pb-2">Escopo da Solução</h3>
                  <div className="grid gap-4">
                    {selectedModules.map(id => {
                      const m = AVAILABLE_MODULES.find(x => x.id === id);
                      return (
                        <div key={id} className="flex justify-between items-start">
                          <div className="max-w-[70%]">
                            <p className="font-bold text-sm">{m?.name}</p>
                            <p className="text-[11px] text-gray-500">{m?.description}</p>
                          </div>
                          <p className="font-mono text-sm font-bold">R$ {m?.price.toLocaleString('pt-BR')}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Investimento */}
                <div className="bg-gray-50 p-8 rounded-2xl border border-black/5 space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span>Investimento Total</span>
                    <span className="text-2xl font-black text-primary">R$ {totalValue.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="pt-4 border-t border-black/5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Condições de Pagamento</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{company.bankInfo}</p>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-black/5 text-center">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Documento gerado digitalmente pela AL OS Consultancy</p>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end gap-4">
                <button onClick={() => window.print()} className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
                  <Download size={16} /> Imprimir / PDF
                </button>
                <button onClick={() => saveAsProject()} className="px-6 py-2 rounded-xl bg-primary text-white text-sm font-bold flex items-center gap-2 hover:brightness-110 transition-all">
                  <Save size={16} /> Salvar e Finalizar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
