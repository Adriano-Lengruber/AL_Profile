import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  History, 
  Kanban, 
  MessageSquareQuote,
  ArrowLeft,
  Layout,
  ExternalLink,
  Target
} from 'lucide-react';

interface ProjectTask {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  startDate?: string;
  endDate?: string;
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
  meetingNotes: { date: string; content: string }[];
}

export default function ClientPortal() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento do localStorage
    const saved = localStorage.getItem('al_projects');
    if (saved) {
      const projects: Project[] = JSON.parse(saved);
      const found = projects.find(p => p.id === id);
      if (found) setProject(found);
    }
    setLoading(false);
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

  const doneTasks = project.tasks.filter(t => t.status === 'done').length;
  const progress = Math.round((doneTasks / project.tasks.length) * 100) || 0;

  return (
    <div className="min-h-screen bg-cyber-black text-white selection:bg-primary/30">
      {/* Header */}
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

      <main className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
        {/* Hero Section */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                  {project.status === 'active' ? 'Projeto em Andamento' : 'Prospecto'}
                </span>
                <span className="text-muted-foreground text-xs flex items-center gap-1">
                  <Calendar size={14} /> Deadline: {project.deadline}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-heading">{project.projectName}</h2>
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
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timeline / Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Briefing do Projeto */}
            <div className="glass rounded-3xl p-8 border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
              <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
                <FileText className="text-primary" size={24} /> 
                Escopo & Briefing
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/30 pl-6 py-2">
                "{project.brief}"
              </p>
            </div>

            <div className="glass rounded-3xl p-8 border-white/5 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <Kanban className="text-primary" size={24} /> 
                  Roadmap de Entrega
                </h3>
                <span className="text-xs text-muted-foreground">{doneTasks} de {project.tasks.length} etapas concluídas</span>
              </div>

              <div className="space-y-4">
                {project.tasks.map((task, i) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${task.status === 'done' ? 'bg-cyber-emerald/5 border-cyber-emerald/20' : task.status === 'doing' ? 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5' : 'bg-white/[0.02] border-white/5'}`}
                  >
                    <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${task.status === 'done' ? 'bg-cyber-emerald border-cyber-emerald text-white' : task.status === 'doing' ? 'border-primary text-primary animate-pulse' : 'border-white/20 text-muted-foreground'}`}>
                      {task.status === 'done' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-sm ${task.status === 'done' ? 'text-muted-foreground line-through' : 'text-white'}`}>{task.title}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {task.status === 'done' ? 'Concluído' : task.status === 'doing' ? 'Em execução' : 'Aguardando'}
                        </p>
                        {task.startDate && (
                          <span className="text-[9px] text-primary/60 flex items-center gap-1">
                            <Calendar size={10} /> {new Date(task.startDate).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                        {task.endDate && (
                          <span className="text-[9px] text-cyber-gold/60 flex items-center gap-1">
                            <Target size={10} /> {new Date(task.endDate).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Notas e Contexto */}
            <div className="glass rounded-3xl p-8 border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-3">
                <History className="text-cyber-gold" size={20} />
                Histórico de Alinhamento
              </h3>
              <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                {project.meetingNotes.map((note, i) => (
                  <div key={i} className="relative pl-8">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-cyber-black border-2 border-cyber-gold" />
                    <p className="text-[10px] font-bold text-cyber-gold uppercase mb-1">{note.date}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suporte Direct */}
            <div className="glass rounded-3xl p-8 border-primary/20 bg-primary/5 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                <MessageSquareQuote className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Dúvidas ou Sugestões?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Estou à disposição para alinhar qualquer detalhe do projeto em tempo real.
                </p>
              </div>
              <button className="w-full bg-primary py-4 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all">
                Falar com Adriano
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto p-10 text-center border-t border-white/5">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
          Powered by <span className="text-white font-bold">AL Consultancy System</span>
        </p>
      </footer>
    </div>
  );
}
