import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
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
  HelpCircle
} from 'lucide-react';

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
  HelpCircle
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
  meetingNotes: { date: string; content: string }[];
  documents: ProjectDocument[];
}

interface CompanyProfile {
  name: string;
  cnpj: string;
  address: string;
  email: string;
  bankInfo: string;
}

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
      { date: '2026-03-10', content: 'Ricardo demonstrou preocupação com a latência das APIs legadas. Sugeri cache com Redis.' },
      { date: '2026-03-05', content: 'Definição de cronograma. Primeira entrega em 15 dias.' }
    ],
    documents: [
      { id: 'doc1', name: 'Contrato Assinado - v1.pdf', type: 'contract', date: '2026-03-05', size: '1.2MB' },
      { id: 'doc2', name: 'Briefing Técnico - Global RJ.pdf', type: 'briefing', date: '2026-03-01', size: '450KB' }
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
          <div className="flex items-center gap-3 mb-2 group/title">
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: group.color }} />
            <h3 className="text-lg font-bold" style={{ color: group.color }}>{group.title}</h3>
            <span className="text-[10px] text-muted-foreground font-bold uppercase">{group.items.length} itens</span>
            <button 
              onClick={() => onDeleteGroup(group.id)}
              className="opacity-0 group-hover/g:opacity-100 p-1 hover:text-red-500 transition-all ml-2"
              title="Remover Grupo"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.01]">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-3 w-12 sticky left-0 bg-cyber-black z-10"></th>
                  <th className="p-3 font-bold text-[11px] uppercase text-muted-foreground sticky left-12 bg-cyber-black z-10 w-64 border-r border-white/5">Nome do Item</th>
                  {board.columns.map(col => (
                    <th key={col.id} className="p-3 font-bold text-[11px] uppercase text-muted-foreground text-center border-r border-white/5" style={{ width: col.width }}>
                      {col.title}
                    </th>
                  ))}
                  <th className="p-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {group.items.map(item => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group/row">
                    <td className="p-3 text-center sticky left-0 bg-cyber-black group-hover/row:bg-white/5 transition-colors">
                      <div className="w-1 h-8 rounded-full mx-auto" style={{ backgroundColor: group.color }} />
                    </td>
                    <td className="p-3 sticky left-12 bg-cyber-black group-hover/row:bg-white/5 transition-colors border-r border-white/5">
                      <input 
                        className="bg-transparent border-none outline-none text-sm font-medium w-full focus:ring-1 focus:ring-primary/50 rounded px-1"
                        value={item.name}
                        onChange={(e) => onUpdateCell(group.id, item.id, 'name', e.target.value)}
                      />
                    </td>
                    {board.columns.map(col => (
                      <td key={col.id} className="p-0 border-r border-white/5 text-center align-middle h-full">
                        {col.type === 'status' && (
                          <div 
                            className={`h-12 flex items-center justify-center text-[11px] font-bold cursor-pointer transition-all hover:brightness-110 active:scale-95`}
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
                            {item.values[col.id] || 'Não iniciado'}
                          </div>
                        )}
                        {col.type === 'priority' && (
                          <div 
                            className={`h-12 flex items-center justify-center text-[11px] font-bold cursor-pointer transition-all hover:brightness-110`}
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
                            type="number"
                            className="bg-transparent border-none outline-none text-xs text-center w-full h-12 px-2 focus:bg-white/5"
                            value={item.values[col.id] || ''}
                            onChange={(e) => onUpdateCell(group.id, item.id, col.id, Number(e.target.value))}
                            placeholder="0"
                          />
                        )}
                        {col.type === 'person' && (
                          <div className="flex items-center justify-center h-12 gap-2 group/person cursor-pointer hover:bg-white/5 px-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                              {(item.values[col.id] || 'A').charAt(0)}
                            </div>
                            <span className="text-[11px] text-muted-foreground group-hover/person:text-white transition-colors">{item.values[col.id] || 'Atribuir'}</span>
                          </div>
                        )}
                        {col.type === 'timeline' && (
                          <div className="px-3 h-12 flex items-center justify-center">
                            <div className="w-full bg-white/10 h-5 rounded-full relative overflow-hidden flex items-center justify-center group/timeline cursor-pointer hover:bg-white/20 transition-colors">
                              <span className="text-[9px] font-bold relative z-10 text-white/80">
                                {item.values[col.id]?.from ? `${new Date(item.values[col.id].from).toLocaleDateString('pt-BR', {day: 'numeric', month: 'short'})} - ${new Date(item.values[col.id].to).toLocaleDateString('pt-BR', {day: 'numeric', month: 'short'})}` : 'Definir datas'}
                              </span>
                              {item.values[col.id]?.from && (
                                <div className="absolute inset-0 bg-primary/30" />
                              )}
                            </div>
                          </div>
                        )}
                        {col.type === 'date' && (
                          <input 
                            type="date"
                            className="bg-transparent border-none outline-none text-[11px] text-center w-full h-12 px-2 focus:bg-white/5 text-muted-foreground"
                            value={item.values[col.id] || ''}
                            onChange={(e) => onUpdateCell(group.id, item.id, col.id, e.target.value)}
                          />
                        )}
                        {col.type === 'link' && (
                          <div className="flex items-center justify-center h-12">
                            {item.values[col.id] ? (
                              <a href={item.values[col.id]} target="_blank" rel="noopener noreferrer" className="text-primary hover:scale-110 transition-transform">
                                <ExternalLink size={14} />
                              </a>
                            ) : (
                              <button className="text-muted-foreground hover:text-white transition-colors">
                                <Plus size={14} />
                              </button>
                            )}
                          </div>
                        )}
                        {col.type === 'tags' && (
                          <div className="flex flex-wrap gap-1 justify-center items-center h-12 px-2">
                            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] font-bold uppercase">
                              {item.values[col.id] || 'Tag'}
                            </span>
                          </div>
                        )}
                        {col.type === 'text' && (
                          <input 
                            className="bg-transparent border-none outline-none text-[11px] text-center w-full h-12 px-2 focus:bg-white/5"
                            value={item.values[col.id] || ''}
                            onChange={(e) => onUpdateCell(group.id, item.id, col.id, e.target.value)}
                            placeholder="..."
                          />
                        )}
                      </td>
                    ))}
                    <td className="p-3 text-right">
                      <button 
                        onClick={() => onDeleteItem(group.id, item.id)}
                        className="opacity-0 group-hover/row:opacity-100 text-muted-foreground hover:text-red-400 transition-all p-1"
                        title="Excluir Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Rodapé Adicionar Item */}
                <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group/add">
                  <td className="p-3 sticky left-0 bg-cyber-black group-hover/add:bg-white/[0.02] z-10"></td>
                  <td colSpan={board.columns.length + 2} className="p-0 sticky left-12 bg-cyber-black group-hover/add:bg-white/[0.02] z-10">
                    <button 
                      onClick={() => onAddItem(group.id)}
                      className="w-full text-left px-3 py-3 text-xs text-muted-foreground hover:text-white flex items-center gap-2 transition-colors"
                    >
                      <Plus size={14} /> Adicionar novo item
                    </button>
                  </td>
                </tr>
              </tbody>
              {/* Footer de Resumo do Grupo */}
              <tfoot className="bg-white/[0.02]">
                <tr>
                  <td className="p-2 sticky left-0 bg-cyber-black z-10"></td>
                  <td className="p-2 sticky left-12 bg-cyber-black border-r border-white/5 z-10"></td>
                  {board.columns.map(col => (
                    <td key={col.id} className="p-2 border-r border-white/5 text-center">
                      {col.type === 'number' && (
                        <div className="text-[10px] font-mono font-bold text-muted-foreground">
                          Σ R$ {group.items.reduce((acc, item) => acc + (Number(item.values[col.id]) || 0), 0).toLocaleString('pt-BR')}
                        </div>
                      )}
                      {col.type === 'status' && (
                        <div className="flex h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="bg-[#00c875]" style={{ width: `${(group.items.filter(i => i.values[col.id] === 'Pronto').length / Math.max(group.items.length, 1)) * 100}%` }} />
                          <div className="bg-[#fdab3d]" style={{ width: `${(group.items.filter(i => i.values[col.id] === 'Trabalhando nisso').length / Math.max(group.items.length, 1)) * 100}%` }} />
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="p-2"></td>
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

// --- Componentes ---

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'proposals' | 'crm' | 'ops' | 'erp' | 'board'>('board');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [workspaces, setWorkspaces] = useState<Workspace[]>(WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(WORKSPACES[1].id); // Default to Operations
  const [activeBoardId, setActiveBoardId] = useState(WORKSPACES[1].boards[0].id);

  // Estados para Contratos/Propostas
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [clientData, setClientData] = useState({ name: '', cnpj: '', email: '', projectTitle: '', brief: '', profile: 'technical' });
  
  // Estados para CRM/Ops
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Project['status'] | 'all'>('all');
  
  // Estados para Empresa
  const [company, setCompany] = useState<CompanyProfile>(INITIAL_COMPANY);
  const [showPreview, setShowPreview] = useState(false);

  // --- API Integration ---
  const API_BASE = 'http://localhost:3001/api';
  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Load Data from MongoDB
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const [wsRes, projRes, compRes] = await Promise.all([
          fetch(`${API_BASE}/workspaces`, { headers: getHeaders() }),
          fetch(`${API_BASE}/projects`, { headers: getHeaders() }),
          fetch(`${API_BASE}/company`, { headers: getHeaders() })
        ]);

        if (wsRes.ok) {
          const wsData = await wsRes.json();
          if (wsData.length > 0) setWorkspaces(wsData);
        }

        if (projRes.ok) {
          const projData = await projRes.json();
          if (projData.length > 0) setProjects(projData);
        }

        if (compRes.ok) {
          const compData = await compRes.json();
          if (compData) setCompany(compData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do MongoDB:', error);
        toast.error('Erro ao carregar dados. Usando dados locais.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Sync Workspaces
  useEffect(() => {
    if (isLoading) return;
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
  }, [workspaces]);

  // Sync Projects
  useEffect(() => {
    if (isLoading) return;
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
  }, [projects]);

  // Sync Company
  useEffect(() => {
    if (isLoading) return;
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
  }, [company]);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0] || { id: '', name: '', icon: 'Layout', boards: [] };
  const activeBoard = activeWorkspace.boards?.find(b => b.id === activeBoardId) || activeWorkspace.boards?.[0] || { id: '', name: '', description: '', columns: [], groups: [] };

  // Edição Inline do Board
  const updateCellValue = (boardId: string, groupId: string, itemId: string, columnId: string, value: any) => {
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
      ]
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
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    toast.success(`Status do projeto atualizado para ${newStatus}`);
  };

  const updateTaskStatus = (projectId: string, taskId: string, newStatus: ProjectTask['status']) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: p.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
        };
      }
      return p;
    }));
    toast.success(`Status da tarefa atualizado!`);
  };

  const updateTaskDates = (projectId: string, taskId: string, field: 'startDate' | 'endDate', value: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: p.tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t)
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
    <div className="min-h-screen bg-cyber-black text-white flex h-screen overflow-hidden">
      {/* Sidebar Navigation - Work OS Style */}
      <aside className="w-72 glass border-r border-white/5 flex flex-col h-full z-20">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyber-gold flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold font-heading leading-tight">AL <span className="text-gradient">Work OS</span></h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Consultancy v3.0</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
          {/* Quick Access */}
          <div>
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">Acesso Rápido</p>
            <button 
              onClick={() => setActiveTab('proposals')} 
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${activeTab === 'proposals' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5'}`}
            >
              <FileSignature size={18} /> Propostas & Vendas
            </button>
            <button 
              onClick={() => setActiveTab('crm')} 
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${activeTab === 'crm' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5'}`}
            >
              <Users size={18} /> CRM & Clientes
            </button>
            <button 
              onClick={() => setActiveTab('erp')} 
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${activeTab === 'erp' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5'}`}
            >
              <PieChart size={18} /> Dashboard Financeiro
            </button>
            <button 
              onClick={() => setActiveTab('finance')} 
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${activeTab === 'finance' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5'}`}
            >
              <Building size={18} /> Perfil da Empresa
            </button>
          </div>

          {/* Workspaces */}
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
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteWorkspace(ws.id); }}
                    className="opacity-0 group-hover/ws:opacity-100 p-1 hover:text-red-500 transition-all"
                    title="Remover Workspace"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                {ws.boards.map(board => (
                  <div key={board.id} className="group/board relative">
                    <button 
                      onClick={() => {
                        setActiveWorkspaceId(ws.id);
                        setActiveBoardId(board.id);
                        setActiveTab('board');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm pl-8 ${activeBoardId === board.id && activeTab === 'board' ? 'bg-white/10 text-white border border-white/10' : 'text-muted-foreground hover:bg-white/5'}`}
                    >
                      <Layout size={16} className={activeBoardId === board.id && activeTab === 'board' ? 'text-primary' : ''} />
                      <span className="truncate flex-1 text-left">{board.name}</span>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteBoard(ws.id, board.id); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/board:opacity-100 p-1 hover:text-red-500 transition-all z-10"
                      title="Remover Quadro"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyber-gold/20 flex items-center justify-center border border-cyber-gold/30">
              <Fingerprint size={16} className="text-cyber-gold" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{company.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
        {/* Top Header - Contextual */}
        <header className="h-16 border-b border-white/5 glass flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            {activeTab === 'board' ? (
              <>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {(() => {
                    const Icon = ICON_MAP[activeWorkspace.icon] || Layout;
                    return <Icon size={20} />;
                  })()}
                </div>
                <div>
                  <h2 className="text-sm font-bold flex items-center gap-2">
                    {activeWorkspace.name} <ChevronRight size={14} className="text-muted-foreground" /> {activeBoard.name}
                  </h2>
                  <p className="text-[10px] text-muted-foreground">{activeBoard.description}</p>
                </div>
              </>
            ) : (
              <h2 className="text-sm font-bold uppercase tracking-widest">
                {activeTab === 'proposals' ? 'Gerador de Propostas' : 'Configurações da Empresa'}
              </h2>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isSyncing && (
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground animate-pulse">
                <Database size={12} />
                Sincronizando...
              </div>
            )}
            <div className="relative group">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Pesquisar em tudo..."
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs w-64 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all">
              <Sparkles size={18} />
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          {isLoading && (
            <div className="absolute inset-0 bg-cyber-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-sm font-bold text-primary animate-pulse">Carregando dados do MongoDB...</p>
            </div>
          )}
          <AnimatePresence mode="wait">
            
            {/* NOVO MODELO: BOARD VIEW DINÂMICO */}
            {activeTab === 'board' && (
              <motion.div 
                key={activeBoard.id} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => addNewItem(activeBoard.id, activeBoard.groups[0]?.id)}
                      className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-all"
                    >
                      <Plus size={16} /> Novo Item
                    </button>
                    <button className="px-4 py-2 glass border border-white/10 text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-white/5 transition-all">
                      <Search size={16} /> Filtrar
                    </button>
                    <button className="px-4 py-2 glass border border-white/10 text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-white/5 transition-all">
                      <Users size={16} /> Personas
                    </button>
                  </div>
                  <div className="flex gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
                    <button className="p-1.5 rounded bg-white/10 text-white"><Layout size={14} /></button>
                    <button className="p-1.5 rounded text-muted-foreground hover:bg-white/5"><Kanban size={14} /></button>
                    <button className="p-1.5 rounded text-muted-foreground hover:bg-white/5"><Calendar size={14} /></button>
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
              <motion.div key="proposals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-6xl mx-auto space-y-8">
                {/* O conteúdo das propostas será renderizado aqui */}
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-bold font-heading">Sales <span className="text-gradient">Engine</span></h2>
                  <p className="text-muted-foreground mt-2">Converta briefing em contratos profissionais em segundos.</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Dados do Cliente */}
                  <div className="glass rounded-2xl p-8 border-white/5">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-primary">
                      <Target size={20} /> Perfil do Cliente & Projeto
                    </h3>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Nome/Empresa</label>
                        <input value={clientData.name} onChange={e => setClientData({...clientData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm" placeholder="Ex: Tech Corp" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Perfil de Decisão</label>
                        <select value={clientData.profile} onChange={e => setClientData({...clientData, profile: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm">
                          <option value="technical" className="bg-cyber-black">Técnico (CTO/Dev)</option>
                          <option value="executive" className="bg-cyber-black">Executivo (CEO/CFO)</option>
                          <option value="operations" className="bg-cyber-black">Operacional (Gerente)</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">CNPJ</label>
                        <input 
                          value={clientData.cnpj} 
                          onChange={e => setClientData({...clientData, cnpj: maskCNPJ(e.target.value)})} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm" 
                          placeholder="00.000.000/0000-00" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">E-mail para Portal</label>
                        <input 
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
                          value={clientData.brief} 
                          onChange={e => setClientData({...clientData, brief: e.target.value})} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm h-32 resize-none" 
                          placeholder="Cole aqui o texto enviado pelo cliente com a ideia do projeto..." 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Argumentação Estratégica Baseada em Perfil */}
                  <div className="glass rounded-2xl p-6 border-cyber-gold/20 bg-cyber-gold/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <MessageSquareQuote size={80} />
                    </div>
                    <h3 className="text-sm font-bold uppercase text-cyber-gold mb-4 flex items-center gap-2">
                      <Bot size={18} /> Argumentação Sugerida (IA)
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground italic">
                      {clientData.profile === 'technical' ? 
                        "Foqué na arquitetura escalável e na redução da dívida técnica. Mencione o uso de n8n para orquestração e Python para processamento pesado, garantindo performance e facilidade de manutenção." :
                        clientData.profile === 'executive' ?
                        "O foco deve ser ROI e redução de Headcount. Mostre como a automação de 20h semanais se traduz em economia de R$ 45k/ano e aceleração do Time-to-Market." :
                        "Foque na experiência do usuário e eliminação de tarefas repetitivas. Mostre como o Dashboard vai dar clareza total sobre o que está acontecendo no dia a dia sem esforço manual."
                      }
                    </p>
                  </div>

                  {/* Seleção de Módulos (Grid Moderno) */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {AVAILABLE_MODULES.map(mod => (
                      <div key={mod.id} onClick={() => toggleModule(mod.id)} className={`p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${selectedModules.includes(mod.id) ? 'bg-primary/10 border-primary/50 ring-1 ring-primary/20' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{mod.name}</h4>
                          <span className="text-primary text-xs font-mono font-bold">R$ {mod.price}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed pr-4">{mod.description}</p>
                        {selectedModules.includes(mod.id) && <CheckCircle2 size={16} className="absolute bottom-4 right-4 text-primary" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resumo & Call to Action */}
                <div className="space-y-6">
                  <div className="glass rounded-2xl p-8 border-primary/20 sticky top-8 bg-gradient-to-b from-white/[0.03] to-transparent">
                    <h3 className="font-bold mb-6 flex items-center justify-between text-lg">
                      Budget Builder
                      <TrendingUp className="text-cyber-gold" size={20} />
                    </h3>
                    <div className="space-y-4 mb-10">
                      {selectedModules.length === 0 && <p className="text-xs text-muted-foreground italic text-center py-4">Selecione módulos para compor o valor...</p>}
                      {selectedModules.map(id => {
                        const m = AVAILABLE_MODULES.find(x => x.id === id);
                        return (
                          <div key={id} className="flex justify-between text-xs items-center group">
                            <span className="text-muted-foreground group-hover:text-white transition-colors">{m?.name}</span>
                            <span className="font-mono">R$ {m?.price}</span>
                          </div>
                        );
                      })}
                      <div className="pt-6 border-t border-white/10 flex justify-between font-black text-2xl text-cyber-gold">
                        <span className="font-heading uppercase text-xs self-center">Total</span>
                        <span>R$ {totalValue.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <button onClick={() => setShowPreview(true)} className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                        <Eye size={20} /> Visualizar Proposta
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => saveAsProject('full')} className="glass py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/10 text-xs">
                          <Save size={16} /> Salvar Pipeline
                        </button>
                        <button onClick={() => saveAsProject('fast')} className="bg-cyber-gold/20 text-cyber-gold py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-cyber-gold/30 transition-all border border-cyber-gold/30 text-xs">
                          <Sparkles size={16} /> Preparar Reunião
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
            <motion.div key="crm" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="max-w-6xl mx-auto space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-4xl font-bold font-heading">Relationship <span className="text-gradient">Intelligence</span></h2>
                  <p className="text-muted-foreground mt-2">Mapeie stakeholders e mantenha o contexto de cada conversa.</p>
                </div>
                <button 
                  onClick={() => {
                    setClientData({ name: '', cnpj: '', email: '', projectTitle: '', brief: '', profile: 'technical' });
                    setSelectedModules([]);
                    setActiveTab('proposals');
                  }}
                  className="bg-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 transition-all"
                >
                  <Plus size={20} /> Adicionar Cliente
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                  <div key={project.id} onClick={() => { setSelectedProject(project); setActiveTab('ops'); }} className="glass rounded-2xl p-6 border-white/5 hover:border-primary/20 transition-all group cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Abrir modal de edição (a implementar) ou carregar dados na aba de propostas para editar
                          setClientData({
                            name: project.clientName,
                            cnpj: '', // Precisaríamos adicionar CNPJ ao modelo Project se quisermos persistir
                            email: '',
                            projectTitle: project.projectName,
                            brief: project.meetingNotes[0]?.content || '',
                            profile: 'technical'
                          });
                          setActiveTab('proposals');
                          toast.info("Dados carregados para edição na aba Propostas.");
                        }}
                        className="p-2 glass rounded-lg hover:bg-primary/20 transition-all text-primary"
                        title="Editar Projeto"
                      >
                        <Settings size={18} />
                      </button>
                      <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProject(project.id);
                          }}
                          className="p-2 glass rounded-lg hover:bg-red-500/20 transition-all text-red-500"
                          title="Excluir Projeto"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/portal/${project.id}`, '_blank');
                          }}
                          className="p-2 glass rounded-lg hover:bg-primary/20 transition-all text-primary"
                          title="Ver Portal do Cliente"
                        >
                          <ExternalLink size={18} />
                        </button>
                    </div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                        <Building size={24} className="text-primary" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <select 
                          value={project.status} 
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateProjectStatus(project.id, e.target.value as Project['status'])}
                          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border-none outline-none cursor-pointer transition-colors ${
                            project.status === 'active' ? 'bg-cyber-emerald/10 text-cyber-emerald' : 
                            project.status === 'prospect' ? 'bg-cyber-gold/10 text-cyber-gold' : 
                            'bg-white/10 text-muted-foreground'
                          }`}
                        >
                          <option value="prospect" className="bg-cyber-black">Prospect</option>
                          <option value="active" className="bg-cyber-black">Ativo</option>
                          <option value="finished" className="bg-cyber-black">Finalizado</option>
                        </select>
                        <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-bold">
                          <Clock size={10} /> {new Date(project.deadline).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-1">{project.clientName}</h3>
                    <p className="text-xs text-muted-foreground mb-6 line-clamp-1">{project.projectName}</p>

                    <div className="space-y-6">
                      {/* Stakeholders Mapping */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                          <Network size={14} /> Stakeholders Principais
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.stakeholders.map((sh, i) => (
                            <div key={i} className="glass px-3 py-1.5 rounded-lg border-white/5 flex items-center gap-2 group/sh">
                              <div className={`w-1.5 h-1.5 rounded-full ${sh.influence === 'high' ? 'bg-red-500' : 'bg-cyber-gold'}`} />
                              <span className="text-[10px] font-medium">{sh.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Últimas Notas & Documentos */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                            <History size={14} /> Memória & Docs
                          </h4>
                          {project.documents && project.documents.length > 0 && (
                            <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Paperclip size={10} /> {project.documents.length}
                            </span>
                          )}
                        </div>
                        <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                          <p className="text-[11px] text-muted-foreground italic line-clamp-2">
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
            <motion.div key="ops" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="max-w-6xl mx-auto space-y-8">
              {!selectedProject ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <h2 className="text-4xl font-bold font-heading">Operations <span className="text-gradient">Center</span></h2>
                      <p className="text-muted-foreground mt-2">Gerencie a entrega e execução técnica dos seus projetos.</p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 flex-1 max-w-2xl">
                      <div className="relative flex-1 group">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                          type="text" 
                          placeholder="Buscar por empresa ou projeto..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary/50 transition-all text-sm"
                        />
                      </div>
                      <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm min-w-[140px]"
                      >
                        <option value="all" className="bg-cyber-black">Todos Status</option>
                        <option value="active" className="bg-cyber-black">Ativos</option>
                        <option value="prospect" className="bg-cyber-black">Propostas</option>
                        <option value="finished" className="bg-cyber-black">Finalizados</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects
                      .filter(p => {
                        const matchesSearch = p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                            p.projectName.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
                        return matchesSearch && matchesStatus;
                      })
                      .map(project => (
                      <div key={project.id} onClick={() => setSelectedProject(project)} className="glass rounded-2xl p-6 border-white/5 hover:border-primary/20 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={18} className="text-primary" />
                        </div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Kanban size={20} className="text-primary" />
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                            project.status === 'active' ? 'text-cyber-emerald bg-cyber-emerald/10' :
                            project.status === 'prospect' ? 'text-cyber-gold bg-cyber-gold/10' :
                            'text-muted-foreground bg-white/10'
                          }`}>
                            {project.status.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg">{project.projectName}</h3>
                        <p className="text-xs text-muted-foreground mb-4">{project.clientName}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-muted-foreground uppercase">Progresso</span>
                            <span className="text-primary">{calculateProgress(project)}%</span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full transition-all duration-500" style={{ width: `${calculateProgress(project)}%` }} />
                          </div>
                          <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                            <span>{project.tasks.filter(t => t.status === 'done').length}/{project.tasks.length} tarefas</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <div className="col-span-full py-20 text-center glass rounded-3xl border-dashed border-white/10">
                        <Zap size={40} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                        <p className="text-muted-foreground">Nenhum projeto encontrado.</p>
                        <button onClick={() => setActiveTab('proposals')} className="text-primary font-bold text-sm mt-4 hover:underline">Criar nova proposta</button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-2">
                    <button onClick={() => setSelectedProject(null)} className="text-muted-foreground hover:text-white transition-colors">
                      <ChevronRight size={20} className="rotate-180" />
                    </button>
                    <div>
                      <h2 className="text-4xl font-bold font-heading">{selectedProject.projectName}</h2>
                      <p className="text-muted-foreground mt-1">Gestão operacional para <span className="text-primary font-bold">{selectedProject.clientName}</span></p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Coluna 1 & 2: Tasks & Accesses */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* Briefing do Projeto */}
                      <div className="glass rounded-2xl p-8 border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                          <MessageSquareQuote size={120} />
                        </div>
                        <h3 className="font-bold flex items-center gap-2 mb-4"><FileText size={20} className="text-primary" /> Briefing do Projeto</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                          "{selectedProject.brief}"
                        </p>
                      </div>

                      {/* Stakeholders */}
                      <div className="glass rounded-2xl p-8 border-white/5">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="font-bold flex items-center gap-2"><Users size={20} className="text-primary" /> Stakeholders (Decisores)</h3>
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
                            className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
                          >
                            <Plus size={12} /> Adicionar
                          </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          {selectedProject.stakeholders?.map((s, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                  {s.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-bold">{s.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{s.role}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => {
                                  setProjects(prev => prev.map(p => p.id === selectedProject.id ? {
                                    ...p,
                                    stakeholders: p.stakeholders.filter((_, idx) => idx !== i)
                                  } : p));
                                }}
                                className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                          {(!selectedProject.stakeholders || selectedProject.stakeholders.length === 0) && (
                            <p className="col-span-full text-xs text-muted-foreground italic py-4">Nenhum stakeholder cadastrado.</p>
                          )}
                        </div>
                      </div>

                      {/* Kanban Simplificado */}
                      <div className="glass rounded-2xl p-8 border-white/5">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="font-bold flex items-center gap-2"><Kanban size={20} className="text-primary" /> Próximos Passos</h3>
                          <button className="text-xs font-bold text-primary hover:underline">+ Nova Tarefa</button>
                        </div>
                        <div className="space-y-4">
                          {selectedProject.tasks.map(task => (
                            <div key={task.id} className="p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all space-y-3">
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => updateTaskStatus(selectedProject.id, task.id, task.status === 'done' ? 'todo' : 'done')}
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.status === 'done' ? 'bg-cyber-emerald border-cyber-emerald shadow-lg shadow-cyber-emerald/20' : 'border-white/20 hover:border-primary'}`}
                                >
                                  {task.status === 'done' && <CheckCircle2 size={14} className="text-white" />}
                                </button>
                                <div className="flex-1">
                                  <span className={`text-sm font-bold ${task.status === 'done' ? 'text-muted-foreground line-through opacity-50' : 'text-white'}`}>{task.title}</span>
                                </div>
                                <select 
                                  value={task.status} 
                                  onChange={(e) => updateTaskStatus(selectedProject.id, task.id, e.target.value as any)}
                                  className={`text-[10px] font-bold uppercase px-2 py-1 rounded outline-none border-none cursor-pointer ${
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
                              
                              <div className="flex flex-wrap gap-4 pl-10">
                                <div className="space-y-1">
                                  <label className="text-[9px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                    <Calendar size={10} /> Início
                                  </label>
                                  <input 
                                    type="date" 
                                    value={task.startDate || ''} 
                                    onChange={(e) => updateTaskDates(selectedProject.id, task.id, 'startDate', e.target.value)}
                                    className="bg-transparent border-none text-[11px] text-muted-foreground outline-none focus:text-white transition-colors"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                    <Target size={10} /> Fim Previsto
                                  </label>
                                  <input 
                                    type="date" 
                                    value={task.endDate || ''} 
                                    onChange={(e) => updateTaskDates(selectedProject.id, task.id, 'endDate', e.target.value)}
                                    className="bg-transparent border-none text-[11px] text-muted-foreground outline-none focus:text-white transition-colors"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Acessos Técnicos */}
                      <div className="glass rounded-2xl p-8 border-white/5">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="font-bold flex items-center gap-2"><Key size={20} className="text-cyber-gold" /> Chaves & Acessos</h3>
                          <button className="text-xs font-bold text-cyber-gold hover:underline">+ Novo Acesso</button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          {selectedProject.accesses.map((access, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 group relative">
                              <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                                <span>{access.type}</span>
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">Copiar</button>
                              </div>
                              <p className="text-xs font-bold">{access.label}</p>
                              <code className="text-[10px] bg-black/40 p-2 rounded block font-mono text-cyber-gold/80 truncate">
                                {access.credentials}
                              </code>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Documentos & Anexos */}
                      <div className="glass rounded-2xl p-8 border-white/5">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="font-bold flex items-center gap-2"><Paperclip size={20} className="text-primary" /> Documentos & Contratos</h3>
                          <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                            <FileUp size={14} /> Upload
                          </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          {selectedProject.documents && selectedProject.documents.length > 0 ? (
                            selectedProject.documents.map((doc) => (
                              <div key={doc.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 group hover:bg-white/10 transition-all cursor-pointer">
                                <div className="flex items-start gap-3">
                                  <div className={`p-2 rounded-lg ${
                                    doc.type === 'contract' ? 'bg-primary/20 text-primary' : 
                                    doc.type === 'briefing' ? 'bg-cyber-gold/20 text-cyber-gold' : 
                                    'bg-white/10 text-white'
                                  }`}>
                                    {doc.type === 'contract' ? <FileCheck size={18} /> : 
                                     doc.type === 'briefing' ? <FileText size={18} /> : 
                                     <FileCode size={18} />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold truncate">{doc.name}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase mt-0.5">{doc.type} • {doc.size}</p>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                  <span className="text-[10px] text-muted-foreground">{new Date(doc.date).toLocaleDateString('pt-BR')}</span>
                                  <button className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">BAIXAR</button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="md:col-span-2 py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
                              <FileUp size={24} className="mx-auto text-muted-foreground mb-2 opacity-20" />
                              <p className="text-xs text-muted-foreground">Nenhum documento anexado ainda.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Coluna 3: Métricas & Prazos */}
                    <div className="space-y-6">
                      <div className="glass rounded-2xl p-8 border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent space-y-6">
                        <div>
                          <h4 className="text-[10px] font-bold uppercase text-muted-foreground mb-4">Status da Entrega</h4>
                          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-primary h-full transition-all duration-700 ease-out" 
                              style={{ width: `${calculateProgress(selectedProject)}%` }} 
                            />
                          </div>
                          <div className="flex justify-between mt-2 text-[10px] font-bold">
                            <span>{calculateProgress(selectedProject)}% CONCLUÍDO</span>
                            <span className="text-primary">FASE {selectedProject.tasks.filter(t => t.status === 'done').length}/{selectedProject.tasks.length}</span>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 space-y-4">
                          <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-muted-foreground" />
                            <div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase">Deadline</p>
                              <p className="text-sm font-bold">{new Date(selectedProject.deadline).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <DollarSign size={18} className="text-muted-foreground" />
                            <div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase">Valor do Contrato</p>
                              <p className="text-sm font-bold text-cyber-emerald">R$ {selectedProject.value.toLocaleString('pt-BR')}</p>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => window.open(`/portal/${selectedProject.id}`, '_blank')}
                          className="w-full py-4 rounded-xl bg-white/5 border border-white/10 font-bold text-xs hover:bg-white/10 transition-all"
                        >
                          Abrir Portal do Cliente
                        </button>
                      </div>

                      {/* Custos Operacionais */}
                      <div className="glass rounded-2xl p-6 border-white/5 bg-red-500/5 space-y-4">
                        <h4 className="text-[10px] font-bold uppercase text-red-400 flex items-center gap-2">
                          <PieChart size={14} /> Custos do Projeto
                        </h4>
                        <div className="space-y-2">
                          {selectedProject.costs.map((cost, i) => (
                            <div key={i} className="flex justify-between text-[11px]">
                              <span className="text-muted-foreground">{cost.label}</span>
                              <span className="font-mono text-red-400">R$ {cost.value}</span>
                            </div>
                          ))}
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
            <motion.div key="erp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-bold font-heading">Global <span className="text-gradient">ERP</span></h2>
                  <p className="text-muted-foreground mt-2">Gestão 360º: Financeiro, Terceirizados e Infraestrutura.</p>
                </div>
                <div className="flex gap-3">
                  <div className="glass px-6 py-4 rounded-2xl border-white/5 flex items-center gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Receita Total</p>
                      <p className="text-xl font-bold text-cyber-emerald">R$ {projects.reduce((acc, p) => acc + p.value, 0).toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Custos Atuais</p>
                      <p className="text-xl font-bold text-red-400">R$ {projects.reduce((acc, p) => acc + (p.costs?.reduce((cAcc, c) => cAcc + c.value, 0) || 0), 0).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Módulo Financeiro Consolidado */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="glass rounded-3xl p-8 border-white/5 space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold flex items-center gap-2 text-lg"><TrendingUp size={22} className="text-primary" /> Fluxo de Caixa por Projeto</h3>
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
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        Ver Detalhes no Quadro <ChevronRight size={14} />
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5">
                            <th className="py-4 text-[10px] font-bold text-muted-foreground uppercase">Projeto</th>
                            <th className="py-4 text-[10px] font-bold text-muted-foreground uppercase">Valor</th>
                            <th className="py-4 text-[10px] font-bold text-muted-foreground uppercase">Custos (Tec/Terceiros)</th>
                            <th className="py-4 text-[10px] font-bold text-muted-foreground uppercase">Margem</th>
                            <th className="py-4 text-[10px] font-bold text-muted-foreground uppercase text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {projects.map(p => {
                            const costs = p.costs?.reduce((acc, c) => acc + c.value, 0) || 0;
                            const margin = p.value - costs;
                            const marginPerc = Math.round((margin / p.value) * 100);
                            return (
                              <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="py-4 font-bold">{p.projectName}</td>
                                <td className="py-4 font-mono">R$ {p.value.toLocaleString('pt-BR')}</td>
                                <td className="py-4 font-mono text-red-400">R$ {costs.toLocaleString('pt-BR')}</td>
                                <td className="py-4">
                                  <span className={`font-mono ${marginPerc > 50 ? 'text-cyber-emerald' : 'text-cyber-gold'}`}>
                                    R$ {margin.toLocaleString('pt-BR')} ({marginPerc}%)
                                  </span>
                                </td>
                                <td className="py-4 text-right">
                                  <span className={`text-[10px] px-2 py-1 rounded uppercase font-bold ${
                                    p.status === 'active' ? 'bg-primary/20 text-primary' : 
                                    p.status === 'finished' ? 'bg-cyber-emerald/20 text-cyber-emerald' : 
                                    'bg-white/10 text-muted-foreground'
                                  }`}>
                                    {p.status}
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
                  <div className="glass rounded-3xl p-8 border-white/5 space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold flex items-center gap-2 text-lg"><Briefcase size={22} className="text-cyber-gold" /> Terceirizados & Squads</h3>
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
                        Ver no Quadro <ChevronRight size={14} />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-cyber-gold/10 flex items-center justify-center text-cyber-gold border border-cyber-gold/20">
                            <Code2 size={24} />
                          </div>
                          <div>
                            <p className="font-bold">Marcos Silva</p>
                            <p className="text-[10px] text-muted-foreground uppercase">Dev Fullstack • Freelancer</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-mono text-cyber-gold">R$ 120/hora</p>
                          <p className="text-[9px] text-muted-foreground">Alocado: Projeto ETL</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center border-dashed opacity-50">
                        <p className="text-xs text-muted-foreground italic">Nenhum outro parceiro ativo no momento.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna 3: Custos Fixos & Tecnologia */}
                <div className="space-y-6">
                  <div className="glass rounded-3xl p-8 border-white/5 space-y-6">
                    <h3 className="font-bold flex items-center gap-2 text-sm"><Bot size={18} className="text-primary" /> Stack de Tecnologia (Custos Fixos)</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/20 text-primary">
                            <Database size={14} />
                          </div>
                          <span className="text-xs font-bold">PostgreSQL Cloud</span>
                        </div>
                        <span className="text-xs font-mono text-red-400">R$ 80/mês</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/20 text-primary">
                            <Bot size={14} />
                          </div>
                          <span className="text-xs font-bold">OpenAI API (Base)</span>
                        </div>
                        <span className="text-xs font-mono text-red-400">R$ 150/mês</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/20 text-primary">
                            <Zap size={14} />
                          </div>
                          <span className="text-xs font-bold">VPS DigitalOcean</span>
                        </div>
                        <span className="text-xs font-mono text-red-400">R$ 60/mês</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Total Operacional Fixo</span>
                      <span className="text-sm font-bold text-red-400">R$ 290/mês</span>
                    </div>
                  </div>

                  <div className="glass rounded-3xl p-8 border-primary/20 bg-primary/5 space-y-4">
                    <h4 className="text-xs font-bold flex items-center gap-2"><Sparkles size={16} className="text-primary" /> Insight do ERP</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
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
          {activeTab === 'finance' && (
            <motion.div key="finance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl font-bold font-heading">Business <span className="text-gradient">Settings</span></h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="glass rounded-2xl p-8 border-white/5 space-y-6">
                  <h3 className="font-bold flex items-center gap-2"><Building size={20} className="text-primary" /> Perfil da Consultoria</h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Nome Fantasia</label>
                      <input value={company.name} onChange={e => setCompany({...company, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">CNPJ</label>
                      <input 
                        value={company.cnpj} 
                        onChange={e => setCompany({...company, cnpj: maskCNPJ(e.target.value)})} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm" 
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">E-mail Profissional</label>
                      <input value={company.email} onChange={e => setCompany({...company, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm" />
                    </div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-8 border-white/5 space-y-6">
                  <h3 className="font-bold flex items-center gap-2"><CreditCard size={20} className="text-cyber-gold" /> Dados de Pagamento</h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Instruções de Faturamento (Pix/Banco)</label>
                      <textarea value={company.bankInfo} onChange={e => setCompany({...company, bankInfo: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm h-32 resize-none" />
                    </div>
                    <button className="w-full bg-primary py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                      <Save size={18} /> Salvar Configurações
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          </AnimatePresence>
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
                <button onClick={saveAsProject} className="px-6 py-2 rounded-xl bg-primary text-white text-sm font-bold flex items-center gap-2 hover:brightness-110 transition-all">
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
