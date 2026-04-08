import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  CheckCircle2,
  Clock,
  Calendar,
  History,
  Kanban,
  MessageSquareQuote,
  ArrowLeft,
  Target,
  FileText,
  Wallet,
  BadgeCheck,
  FileSignature,
  AlertCircle,
  RefreshCcw,
  ExternalLink
} from 'lucide-react';

interface ProjectTask {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  startDate?: string;
  endDate?: string;
}

interface ProjectMeetingNote {
  date: string;
  content: string;
  title?: string;
  kind?: string;
  outcome?: string;
  nextStep?: string;
}

interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}

interface ProjectWorkflowStep {
  id: string;
  title: string;
  area: string;
  done: boolean;
}

interface ProjectInstallment {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid';
}

interface ProjectFinancials {
  proposalValue: number;
  paymentMethod: string;
  invoiceStatus: 'pending' | 'issued' | 'paid';
  installments: ProjectInstallment[];
}

interface ProjectApproval {
  contractStatus: 'draft' | 'sent' | 'signed';
  approvalStatus: 'pending' | 'approved';
  signatureProvider: 'manual' | 'govbr' | 'platform';
  contractUrl: string;
  signatureUrl: string;
  scopeSummary: string;
  approvalDeadline: string;
  signedAt: string;
  approvedAt: string;
}

interface ProjectPostDeliveryStep {
  id: string;
  title: string;
  area: string;
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
  tasks: ProjectTask[];
  meetingNotes: ProjectMeetingNote[];
  documents: ProjectDocument[];
  stage: string;
  nextAction: string;
  followUpDate: string;
  workflowSteps: ProjectWorkflowStep[];
  financials: ProjectFinancials;
  approval: ProjectApproval;
  postDeliverySteps: ProjectPostDeliveryStep[];
}

interface ProjectAttentionItem {
  id: string;
  title: string;
  detail: string;
  tone: string;
}

interface ProjectTimelineItem {
  id: string;
  date: string;
  title: string;
  detail: string;
  category: string;
  tone: string;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const whatsappBase = 'https://wa.me/5521983300779';
const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const formatPortalDate = (value?: string) => {
  if (!value || value === 'A definir') return value || 'A definir';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('pt-BR');
};

const getInstallmentMeta = (installment: ProjectInstallment) => {
  if (installment.status === 'paid') {
    return {
      label: 'Pago',
      tone: 'text-cyber-emerald border-cyber-emerald/20 bg-cyber-emerald/10'
    };
  }

  const dueDate = new Date(installment.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  if (!Number.isNaN(dueDate.getTime()) && dueDate.getTime() < today.getTime()) {
    return {
      label: 'Em atraso',
      tone: 'text-red-400 border-red-500/20 bg-red-500/10'
    };
  }

  return {
    label: 'Pendente',
    tone: 'text-cyber-gold border-cyber-gold/20 bg-cyber-gold/10'
  };
};

const getContractMeta = (status: ProjectApproval['contractStatus']) => {
  if (status === 'signed') {
    return {
      label: 'Contrato assinado',
      tone: 'text-cyber-emerald border-cyber-emerald/20 bg-cyber-emerald/10'
    };
  }

  if (status === 'sent') {
    return {
      label: 'Contrato enviado',
      tone: 'text-primary border-primary/20 bg-primary/10'
    };
  }

  return {
    label: 'Contrato em preparação',
    tone: 'text-cyber-gold border-cyber-gold/20 bg-cyber-gold/10'
  };
};

const getApprovalMeta = (status: ProjectApproval['approvalStatus']) => {
  if (status === 'approved') {
    return {
      label: 'Aceite aprovado',
      tone: 'text-cyber-emerald border-cyber-emerald/20 bg-cyber-emerald/10'
    };
  }

  return {
    label: 'Aceite pendente',
    tone: 'text-cyber-gold border-cyber-gold/20 bg-cyber-gold/10'
  };
};

const getSignatureProviderLabel = (provider: ProjectApproval['signatureProvider']) => {
  if (provider === 'govbr') return 'gov.br';
  if (provider === 'platform') return 'Plataforma externa';
  return 'Manual / envio direto';
};

const getPortalDateTimestamp = (value?: string) => {
  if (!value || value === 'A definir') return null;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.getTime();
};

const getPortalIncompleteTasksLabel = (tasks: ProjectTask[]) => {
  const openTasks = tasks.filter(task => task.status !== 'done').length;
  if (openTasks === 0) return 'Todos os marcos operacionais foram concluídos.';
  return `${openTasks} etapa(s) seguem abertas neste projeto.`;
};

const getPortalAttentionItems = (project: Project): ProjectAttentionItem[] => {
  const items: ProjectAttentionItem[] = [];
  const todayTimestamp = new Date().setHours(0, 0, 0, 0);
  const followUpTimestamp = getPortalDateTimestamp(project.followUpDate);
  const approvalDeadlineTimestamp = getPortalDateTimestamp(project.approval.approvalDeadline);
  const overdueInstallments = project.financials.installments.filter((installment) => {
    if (installment.status === 'paid') return false;
    const dueTimestamp = getPortalDateTimestamp(installment.dueDate);
    return Boolean(dueTimestamp && dueTimestamp < todayTimestamp);
  });
  const openTasks = project.tasks.filter(task => task.status !== 'done').length;
  const deadlineTimestamp = getPortalDateTimestamp(project.deadline);
  const deadlineDiffDays = deadlineTimestamp ? Math.round((deadlineTimestamp - todayTimestamp) / 86400000) : null;

  if (followUpTimestamp && followUpTimestamp < todayTimestamp) {
    items.push({
      id: 'followup-overdue',
      title: 'Follow-up atrasado',
      detail: `O próximo alinhamento estava previsto para ${formatPortalDate(project.followUpDate)}.`,
      tone: 'border-red-500/20 bg-red-500/10 text-red-400'
    });
  } else if (followUpTimestamp === todayTimestamp) {
    items.push({
      id: 'followup-today',
      title: 'Follow-up vence hoje',
      detail: 'Há uma checagem prevista para hoje para manter decisão, entrega ou retenção em dia.',
      tone: 'border-cyber-gold/20 bg-cyber-gold/10 text-cyber-gold'
    });
  }

  if (overdueInstallments.length > 0) {
    items.push({
      id: 'financial-overdue',
      title: 'Parcela em atraso',
      detail: `${overdueInstallments.length} parcela(s) venceram e ainda não constam como pagas.`,
      tone: 'border-red-500/20 bg-red-500/10 text-red-400'
    });
  }

  if (project.approval.approvalStatus !== 'approved' && approvalDeadlineTimestamp && approvalDeadlineTimestamp < todayTimestamp) {
    items.push({
      id: 'approval-overdue',
      title: 'Aceite pendente fora do prazo',
      detail: `O aceite formal estava previsto para ${formatPortalDate(project.approval.approvalDeadline)}.`,
      tone: 'border-red-500/20 bg-red-500/10 text-red-400'
    });
  } else if (project.approval.contractStatus !== 'signed') {
    items.push({
      id: 'contract-open',
      title: 'Contrato em aberto',
      detail: 'Contrato e assinatura ainda não foram totalmente concluídos.',
      tone: 'border-primary/20 bg-primary/10 text-primary'
    });
  }

  if (deadlineDiffDays !== null && deadlineDiffDays <= 5 && openTasks > 0) {
    items.push({
      id: 'deadline-pressure',
      title: 'Prazo próximo',
      detail: `Ainda existem ${openTasks} etapa(s) abertas com deadline em ${formatPortalDate(project.deadline)}.`,
      tone: 'border-primary/20 bg-primary/10 text-primary'
    });
  }

  if (items.length === 0) {
    items.push({
      id: 'healthy',
      title: 'Fluxo publicado sem bloqueios críticos',
      detail: 'Agenda, aceite, financeiro e execução seguem visíveis neste portal.',
      tone: 'border-cyber-emerald/20 bg-cyber-emerald/10 text-cyber-emerald'
    });
  }

  return items.slice(0, 4);
};

const getPortalTimeline = (project: Project): ProjectTimelineItem[] => {
  const items: ProjectTimelineItem[] = [
    ...project.meetingNotes.map((note, index) => ({
      id: `meeting-${index}-${note.date}`,
      date: note.date,
      title: note.title || 'Registro de reunião',
      detail: note.outcome || note.nextStep || note.content,
      category: 'Reunião',
      tone: 'border-cyber-gold/20 bg-cyber-gold/10 text-cyber-gold'
    })),
    ...project.documents.map((document) => ({
      id: `document-${document.id}`,
      date: document.date,
      title: document.name,
      detail: `${document.type.toUpperCase()}${document.size ? ` • ${document.size}` : ''}`,
      category: 'Documento',
      tone: 'border-primary/20 bg-primary/10 text-primary'
    })),
    ...project.financials.installments.map((installment) => ({
      id: `installment-${installment.id}`,
      date: installment.dueDate,
      title: installment.label,
      detail: `${installment.status === 'paid' ? 'Parcela paga' : 'Parcela prevista'} • ${currencyFormatter.format(installment.amount)}`,
      category: 'Financeiro',
      tone: installment.status === 'paid'
        ? 'border-cyber-emerald/20 bg-cyber-emerald/10 text-cyber-emerald'
        : 'border-white/10 bg-white/[0.04] text-white/80'
    })),
    ...(project.approval.signedAt ? [{
      id: 'contract-signed',
      date: project.approval.signedAt,
      title: 'Contrato assinado',
      detail: `Canal utilizado: ${getSignatureProviderLabel(project.approval.signatureProvider)}.`,
      category: 'Assinatura',
      tone: 'border-cyber-emerald/20 bg-cyber-emerald/10 text-cyber-emerald'
    }] : []),
    ...(project.approval.approvedAt ? [{
      id: 'approval-approved',
      date: project.approval.approvedAt,
      title: 'Aceite aprovado',
      detail: 'Validação formal registrada no portal.',
      category: 'Aceite',
      tone: 'border-cyber-emerald/20 bg-cyber-emerald/10 text-cyber-emerald'
    }] : []),
    ...(project.followUpDate ? [{
      id: 'followup-next',
      date: project.followUpDate,
      title: 'Próximo follow-up',
      detail: project.nextAction || 'Checkpoint planejado para o próximo contato.',
      category: 'Agenda',
      tone: 'border-cyber-gold/20 bg-cyber-gold/10 text-cyber-gold'
    }] : []),
    ...(project.deadline && project.deadline !== 'A definir' ? [{
      id: 'deadline',
      date: project.deadline,
      title: 'Deadline do projeto',
      detail: getPortalIncompleteTasksLabel(project.tasks),
      category: 'Prazo',
      tone: 'border-white/10 bg-white/[0.04] text-white/80'
    }] : [])
  ];

  return items
    .filter((item) => Boolean(item.date))
    .sort((a, b) => (getPortalDateTimestamp(b.date) || 0) - (getPortalDateTimestamp(a.date) || 0))
    .slice(0, 10);
};

const normalizeProject = (project: Partial<Project>): Project => ({
  id: project.id || '',
  clientName: project.clientName || 'Cliente',
  projectName: project.projectName || 'Projeto',
  brief: project.brief || '',
  status: project.status || 'prospect',
  value: typeof project.value === 'number' ? project.value : 0,
  deadline: project.deadline || 'A definir',
  tasks: Array.isArray(project.tasks) ? project.tasks : [],
  meetingNotes: Array.isArray(project.meetingNotes)
    ? project.meetingNotes.map((note) => ({
        date: note?.date || '',
        content: note?.content || '',
        title: note?.title || '',
        kind: note?.kind || '',
        outcome: note?.outcome || '',
        nextStep: note?.nextStep || ''
      }))
    : [],
  documents: Array.isArray(project.documents)
    ? project.documents.map((document) => ({
        id: document?.id || `doc-${Math.random().toString(36).slice(2, 8)}`,
        name: document?.name || 'Documento',
        type: document?.type || 'arquivo',
        date: document?.date || '',
        size: document?.size || ''
      }))
    : [],
  stage: project.stage || 'proposal',
  nextAction: project.nextAction || '',
  followUpDate: project.followUpDate || '',
  workflowSteps: Array.isArray(project.workflowSteps)
    ? project.workflowSteps.map((step) => ({
        id: step?.id || `step-${Math.random().toString(36).slice(2, 8)}`,
        title: step?.title || 'Etapa',
        area: step?.area || 'delivery',
        done: Boolean(step?.done)
      }))
    : [],
  financials: {
    proposalValue: typeof project.financials?.proposalValue === 'number'
      ? project.financials.proposalValue
      : (typeof project.value === 'number' ? project.value : 0),
    paymentMethod: project.financials?.paymentMethod || 'A definir',
    invoiceStatus: project.financials?.invoiceStatus === 'issued' || project.financials?.invoiceStatus === 'paid'
      ? project.financials.invoiceStatus
      : 'pending',
    installments: Array.isArray(project.financials?.installments)
      ? project.financials.installments.map((installment) => ({
          id: installment?.id || `inst-${Math.random().toString(36).slice(2, 8)}`,
          label: installment?.label || 'Parcela',
          amount: typeof installment?.amount === 'number' ? installment.amount : 0,
          dueDate: installment?.dueDate || '',
          status: installment?.status === 'paid' ? 'paid' : 'pending'
        }))
      : []
  },
  approval: {
    contractStatus: project.approval?.contractStatus === 'sent' || project.approval?.contractStatus === 'signed'
      ? project.approval.contractStatus
      : 'draft',
    approvalStatus: project.approval?.approvalStatus === 'approved' ? 'approved' : 'pending',
    signatureProvider: project.approval?.signatureProvider === 'govbr' || project.approval?.signatureProvider === 'platform'
      ? project.approval.signatureProvider
      : 'manual',
    contractUrl: project.approval?.contractUrl || '',
    signatureUrl: project.approval?.signatureUrl || '',
    scopeSummary: project.approval?.scopeSummary || project.brief || '',
    approvalDeadline: project.approval?.approvalDeadline || project.followUpDate || '',
    signedAt: project.approval?.signedAt || '',
    approvedAt: project.approval?.approvedAt || ''
  },
  postDeliverySteps: Array.isArray(project.postDeliverySteps)
    ? project.postDeliverySteps.map((step) => ({
        id: step?.id || `post-${Math.random().toString(36).slice(2, 8)}`,
        title: step?.title || 'Próxima ação',
        area: step?.area || 'relationship',
        done: Boolean(step?.done)
      }))
    : []
});

export default function ClientPortal() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await fetch(`${API_BASE}/public/projects/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(normalizeProject(data));
          return;
        }
      } catch (error) {
        console.error('Erro ao carregar portal via API:', error);
      }

      const saved = localStorage.getItem('al_projects');
      if (saved) {
        try {
          const projects: Project[] = JSON.parse(saved);
          const found = projects.find((item) => item.id === id);
          if (found) {
            setProject(normalizeProject(found));
          }
        } catch (error) {
          console.error('Erro ao carregar portal local:', error);
        }
      }
    };

    loadProject().finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen bg-cyber-black text-white flex items-center justify-center">Carregando portal...</div>;
  if (!project) return (
    <div className="min-h-screen bg-cyber-black text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Projeto não encontrado</h1>
      <Link to="/" className="text-primary hover:underline flex items-center gap-2">
        <ArrowLeft size={18} /> Voltar ao início
      </Link>
    </div>
  );

  const doneTasks = project.tasks.filter((task) => task.status === 'done').length;
  const progress = Math.round((doneTasks / project.tasks.length) * 100) || 0;
  const receivedTotal = project.financials.installments.reduce((acc, installment) => installment.status === 'paid' ? acc + installment.amount : acc, 0);
  const outstandingTotal = Math.max(0, project.financials.proposalValue - receivedTotal);
  const approvalPending = project.workflowSteps.some((step) => ['validation', 'launch'].includes(step.id) && !step.done);
  const followUpLabel = project.followUpDate ? formatPortalDate(project.followUpDate) : 'Sem follow-up publicado';
  const whatsappMessage = `Olá, Adriano. Estou no portal do projeto "${project.projectName}" e quero alinhar os próximos passos.`;
  const invoiceStatusMeta = project.financials.invoiceStatus === 'paid'
    ? { label: 'Faturamento quitado', tone: 'text-cyber-emerald border-cyber-emerald/20 bg-cyber-emerald/10' }
    : project.financials.invoiceStatus === 'issued'
      ? { label: 'Fatura emitida', tone: 'text-primary border-primary/20 bg-primary/10' }
      : { label: 'Fatura em preparação', tone: 'text-cyber-gold border-cyber-gold/20 bg-cyber-gold/10' };
  const contractMeta = getContractMeta(project.approval.contractStatus);
  const approvalMeta = getApprovalMeta(project.approval.approvalStatus);
  const attentionItems = getPortalAttentionItems(project);
  const timelineItems = getPortalTimeline(project);

  return (
    <div className="min-h-screen bg-cyber-black text-white selection:bg-primary/30">
      <header className="glass border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyber-gold flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold font-heading leading-tight">AL <span className="text-gradient">Portal</span></h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Acompanhamento de Projeto</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground hidden md:block">Bem-vindo, <span className="text-white font-bold">{project.clientName}</span></span>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Target size={16} className="text-primary" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                  {project.status === 'active' ? 'Projeto em Andamento' : project.status === 'finished' ? 'Projeto Entregue' : 'Proposta em Evolução'}
                </span>
                <span className="text-muted-foreground text-xs flex items-center gap-1">
                  <Calendar size={14} /> Deadline: {formatPortalDate(project.deadline)}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-heading">{project.projectName}</h2>
              <p className="mt-3 max-w-3xl text-sm text-muted-foreground leading-relaxed">
                Portal consolidado com progresso, follow-up, financeiro e próximos passos para facilitar validações e continuidade do projeto.
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Progresso Geral</p>
              <div className="flex items-center gap-4">
                <div className="w-48 h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-primary to-cyber-gold"
                  />
                </div>
                <span className="text-2xl font-black font-mono">{progress}%</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="glass rounded-2xl p-5 border-white/5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Próxima ação</p>
              <p className="text-sm font-semibold leading-relaxed">{project.nextAction || 'Aguardando definição da próxima ação'}</p>
            </div>
            <div className="glass rounded-2xl p-5 border-white/5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Follow-up</p>
              <p className="text-sm font-semibold">{followUpLabel}</p>
              <p className="mt-2 text-xs text-muted-foreground">Contato planejado para não perder timing de decisão, entrega ou retenção.</p>
            </div>
            <div className="glass rounded-2xl p-5 border-white/5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Financeiro em aberto</p>
              <p className="text-sm font-semibold">{currencyFormatter.format(outstandingTotal)}</p>
              <p className="mt-2 text-xs text-muted-foreground">Recebido: {currencyFormatter.format(receivedTotal)}</p>
            </div>
            <div className="glass rounded-2xl p-5 border-white/5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Aceite</p>
              <p className="text-sm font-semibold">{approvalPending ? 'Validação pendente' : 'Fluxo alinhado'}</p>
              <p className="mt-2 text-xs text-muted-foreground">{approvalPending ? 'Há etapas finais aguardando aprovação ou fechamento.' : 'As etapas críticas de validação estão encaminhadas.'}</p>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-3xl p-8 border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
              <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
                <FileText className="text-primary" size={24} />
                Escopo & Briefing
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/30 pl-6 py-2">
                "{project.brief}"
              </p>
            </div>

            <div className="glass rounded-3xl p-8 border-white/5 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <History className="text-primary" size={24} />
                  Timeline & Radar
                </h3>
                <span className="text-xs text-muted-foreground">{timelineItems.length} eventos publicados</span>
              </div>

              <div className="grid xl:grid-cols-[0.9fr_1.1fr] gap-4">
                <div className="space-y-3">
                  {attentionItems.map((item) => (
                    <div key={item.id} className={`rounded-2xl border p-4 ${item.tone}`}>
                      <div className="flex items-start gap-3">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Radar</p>
                          <p className="mt-1 text-sm font-semibold text-white">{item.title}</p>
                          <p className="mt-2 text-xs leading-relaxed text-white/80">{item.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {timelineItems.length > 0 ? timelineItems.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${item.tone}`}>
                              {item.category}
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{formatPortalDate(item.date)}</span>
                          </div>
                          <p className="mt-3 text-sm font-semibold">{item.title}</p>
                          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
                        </div>
                        <div className="mt-1 w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                      </div>
                    </div>
                  )) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-sm text-muted-foreground">
                      A timeline consolidada aparece aqui quando houver reuniões, documentos, parcelas e checkpoints publicados.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-8 border-white/5 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <Kanban className="text-primary" size={24} />
                  Roadmap de Entrega
                </h3>
                <span className="text-xs text-muted-foreground">{doneTasks} de {project.tasks.length} etapas concluídas</span>
              </div>

              <div className="space-y-4">
                {project.tasks.length > 0 ? project.tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${task.status === 'done' ? 'bg-cyber-emerald/5 border-cyber-emerald/20' : task.status === 'doing' ? 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5' : 'bg-white/[0.02] border-white/5'}`}
                  >
                    <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${task.status === 'done' ? 'bg-cyber-emerald border-cyber-emerald text-white' : task.status === 'doing' ? 'border-primary text-primary animate-pulse' : 'border-white/20 text-muted-foreground'}`}>
                      {task.status === 'done' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-sm ${task.status === 'done' ? 'text-muted-foreground line-through' : 'text-white'}`}>{task.title}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {task.status === 'done' ? 'Concluído' : task.status === 'doing' ? 'Em execução' : 'Aguardando'}
                        </p>
                        {task.startDate && (
                          <span className="text-[9px] text-primary/60 flex items-center gap-1">
                            <Calendar size={10} /> {formatPortalDate(task.startDate)}
                          </span>
                        )}
                        {task.endDate && (
                          <span className="text-[9px] text-cyber-gold/60 flex items-center gap-1">
                            <Target size={10} /> {formatPortalDate(task.endDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-sm text-muted-foreground">
                    Nenhuma etapa foi publicada para este projeto ainda.
                  </div>
                )}
              </div>
            </div>

            <div className="glass rounded-3xl p-8 border-white/5 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <BadgeCheck className="text-cyber-gold" size={24} />
                  Validação, Aceite & Documentos
                </h3>
                <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${approvalPending ? 'text-cyber-gold border-cyber-gold/20 bg-cyber-gold/10' : 'text-cyber-emerald border-cyber-emerald/20 bg-cyber-emerald/10'}`}>
                  {approvalPending ? 'Aguardando retorno' : 'Sem bloqueios críticos'}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {project.workflowSteps.length > 0 ? project.workflowSteps.map((step) => (
                  <div key={step.id} className={`rounded-2xl border p-4 ${step.done ? 'border-cyber-emerald/20 bg-cyber-emerald/5' : 'border-white/10 bg-white/[0.02]'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${step.done ? 'bg-cyber-emerald text-white' : 'border border-white/20 text-muted-foreground'}`}>
                        {step.done ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{step.title}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{step.area}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="md:col-span-2 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-sm text-muted-foreground">
                    O plano de workflow ainda não foi publicado para este projeto.
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Documentos publicados</p>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{project.documents.length} itens</span>
                </div>
                {project.documents.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {project.documents.map((document) => (
                      <div key={document.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold leading-relaxed">{document.name}</p>
                            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{document.type}</p>
                          </div>
                          <ExternalLink size={16} className="text-primary shrink-0" />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                          <span>{formatPortalDate(document.date)}</span>
                          {document.size ? <span>{document.size}</span> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-sm text-muted-foreground">
                    Ainda não há documentos publicados neste portal.
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <FileSignature className="text-cyber-gold" size={18} />
                    Contrato, aceite e assinatura
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${contractMeta.tone}`}>
                      {contractMeta.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${approvalMeta.tone}`}>
                      {approvalMeta.label}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Canal</p>
                    <p className="text-sm font-semibold">{getSignatureProviderLabel(project.approval.signatureProvider)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Prazo de aceite</p>
                    <p className="text-sm font-semibold">{formatPortalDate(project.approval.approvalDeadline)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Última validação</p>
                    <p className="text-sm font-semibold">{formatPortalDate(project.approval.approvedAt || project.approval.signedAt)}</p>
                  </div>
                </div>

                {project.approval.scopeSummary ? (
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Resumo formal do escopo</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{project.approval.scopeSummary}</p>
                  </div>
                ) : null}

                <div className="flex flex-col sm:flex-row gap-3">
                  {project.approval.contractUrl ? (
                    <a
                      href={project.approval.contractUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold hover:bg-white/10 transition-all"
                    >
                      Abrir contrato
                      <ExternalLink size={16} />
                    </a>
                  ) : null}
                  {project.approval.signatureUrl ? (
                    <a
                      href={project.approval.signatureUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-cyber-gold/20 bg-cyber-gold/10 px-4 py-3 text-sm font-semibold text-cyber-gold hover:bg-cyber-gold/15 transition-all"
                    >
                      {project.approval.signatureProvider === 'govbr' ? 'Assinar via gov.br' : 'Abrir assinatura / aceite'}
                      <ExternalLink size={16} />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-3xl p-8 border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-3">
                <Wallet className="text-primary" size={20} />
                Financeiro & Faturas
              </h3>

              <div className={`inline-flex px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${invoiceStatusMeta.tone}`}>
                {invoiceStatusMeta.label}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Valor total</p>
                  <p className="text-sm font-semibold">{currencyFormatter.format(project.financials.proposalValue)}</p>
                </div>
                <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Forma de pagamento</p>
                  <p className="text-sm font-semibold">{project.financials.paymentMethod}</p>
                </div>
              </div>

              <div className="space-y-3">
                {project.financials.installments.length > 0 ? project.financials.installments.map((installment) => {
                  const installmentMeta = getInstallmentMeta(installment);
                  return (
                    <div key={installment.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{installment.label}</p>
                          <p className="mt-1 text-xs text-muted-foreground">Vencimento: {formatPortalDate(installment.dueDate)}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full border text-[10px] font-bold ${installmentMeta.tone}`}>{installmentMeta.label}</span>
                      </div>
                      <p className="mt-3 text-sm font-semibold">{currencyFormatter.format(installment.amount)}</p>
                    </div>
                  );
                }) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-sm text-muted-foreground">
                    O cronograma financeiro ainda não foi detalhado neste portal.
                  </div>
                )}
              </div>
            </div>

            <div className="glass rounded-3xl p-8 border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-3">
                <History className="text-cyber-gold" size={20} />
                Histórico de Alinhamento
              </h3>
              <div className="space-y-5 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                {project.meetingNotes.length > 0 ? project.meetingNotes.map((note, index) => (
                  <div key={`${note.date}-${index}`} className="relative pl-8">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-cyber-black border-2 border-cyber-gold" />
                    <p className="text-[10px] font-bold text-cyber-gold uppercase mb-1">{formatPortalDate(note.date)}</p>
                    {note.title ? <p className="text-sm font-semibold mb-1">{note.title}</p> : null}
                    <p className="text-xs text-muted-foreground leading-relaxed">{note.content}</p>
                    {note.outcome ? <p className="mt-2 text-[11px] text-white/80">Resultado: {note.outcome}</p> : null}
                    {note.nextStep ? <p className="mt-1 text-[11px] text-primary">Próximo passo: {note.nextStep}</p> : null}
                  </div>
                )) : (
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-cyber-black border-2 border-white/20" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Ainda não há registros de alinhamento publicados neste portal.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="glass rounded-3xl p-8 border-white/5 bg-gradient-to-br from-primary/10 to-transparent space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-3">
                <RefreshCcw className="text-primary" size={20} />
                Continuidade & Retenção
              </h3>
              <div className="space-y-3">
                {project.postDeliverySteps.length > 0 ? project.postDeliverySteps.map((step) => (
                  <div key={step.id} className={`rounded-2xl border p-4 ${step.done ? 'border-cyber-emerald/20 bg-cyber-emerald/5' : 'border-white/10 bg-white/[0.02]'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${step.done ? 'bg-cyber-emerald text-white' : 'border border-white/20 text-muted-foreground'}`}>
                        {step.done ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{step.title}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{step.area}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-sm text-muted-foreground">
                    As próximas ações de retenção e evolução ainda não foram publicadas.
                  </div>
                )}
              </div>
            </div>

            <div className="glass rounded-3xl p-8 border-primary/20 bg-primary/5 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                <MessageSquareQuote className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Dúvidas, aprovações ou ajustes?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use este canal para confirmar aceite, alinhar pendências, responder follow-ups e acelerar os próximos passos.
                </p>
              </div>
              <a
                href={`${whatsappBase}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-primary py-4 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all"
              >
                Falar com Adriano
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto p-10 text-center border-t border-white/5">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
          Powered by <span className="text-white font-bold">AL Consultancy System</span>
        </p>
      </footer>
    </div>
  );
}
