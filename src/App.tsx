import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Mail, Phone, MapPin, ExternalLink, Menu, X,
  ArrowRight, GitFork, Star, BookOpen, MessageCircle, Heart, Share2,
  User, LogIn, Send, Code2, Database, BarChart3, LayoutDashboard,
  Calculator, Eye, Building2, Cloud, Bot, Zap, Palette, GitBranch,
  BrainCircuit, Wrench, Rocket, Users, Terminal, Cpu, CheckCircle2,
  ChevronDown, Calendar,
} from 'lucide-react';

interface Experience {
  id: number; title: string; company: string; period: string;
  location: string; description: string; skills: string[]; current?: boolean;
}
interface Repository {
  id: number; name: string; description: string; language: string;
  languageColor: string; stars: number; forks: number; url: string; topics: string[];
}
interface BlogPost {
  id: number; title: string; excerpt: string; author: string; date: string;
  readTime: string; likes: number; comments: number; tags: string[];
}
interface Skill {
  name: string; level: number; category: 'language' | 'tool' | 'cloud' | 'other';
  icon: React.ReactNode;
}

const experiences: Experience[] = [
  {
    id: 1, title: 'Cientista de Dados & Desenvolvedor', company: 'Freelancer',
    period: '2024 - Atual', location: 'Itaperuna, RJ', current: true,
    description: 'Atuação independente: desenvolvimento de softwares sob medida, manutenção de computadores, marketing digital, automação de processos e inteligência artificial. Prospecção e agendamento de novos clientes.',
    skills: ['Python', 'SQL', 'Power BI', 'RPA', 'AI Agents', 'Automação'],
  },
  {
    id: 2, title: 'Engenheiro de Software Sênior', company: 'Global RJ Serviços',
    period: 'Mar 2025 - Set 2025', location: 'Itaperuna, RJ',
    description: 'Python e SQL para tratamento/limpeza, análise e criação de Views/Querys. Processo ETL completo, Modelagem, Relacionamentos, Colunas Calculadas, Medidas DAX. Criação de Painéis no PowerBi. Scripts para automações e Web Scraping. Desenvolvimento Full-Stack.',
    skills: ['Python', 'SQL', 'Power BI', 'DAX', 'ETL', 'Git', 'Full-Stack'],
  },
  {
    id: 3, title: 'Analista de Dados / Planejamento', company: 'Infotec Brasil',
    period: 'Jul 2023 - Fev 2025', location: 'Macaé, RJ',
    description: 'Contrato MC38 atendendo clientes da região de Imbetiba - Macaé/RJ. Extrações de dados do sistema SAP BW - SAP 4/HANA Petrobrás. Processo ETL completo, testes, validação. Criação de relatórios e dashboards no PowerBi. Microsoft Power Platform: PowerApps e Power Automate.',
    skills: ['SAP BW', 'Power BI', 'DAX', 'PowerApps', 'Power Automate', 'ETL'],
  },
  {
    id: 4, title: 'Analista de Dados', company: 'HCB Consultoria Empresarial',
    period: 'Abr 2021 - Ago 2021', location: 'Macaé, RJ',
    description: 'Manutenção nos dashboards, reestilização, reestruturação das ETLs, Medidas, KPIs. Utilização do sistema SAP Petrobrás para obtenção de Querys. Análises de dados.',
    skills: ['Power BI', 'Spotfire', 'SAP', 'VBA', 'SQL', 'JavaScript', 'C#'],
  },
  {
    id: 5, title: 'Analista de Suporte', company: 'PLANSUL Planejamento e Consultoria',
    period: 'Out 2020 - Dez 2020', location: 'Itaperuna, RJ',
    description: 'Manutenção das urnas eletrônicas de votação. Limpeza, reinstalação de software, formatação, substituição de peças, testes, distribuição.',
    skills: ['Suporte Técnico', 'Hardware', 'Manutenção'],
  },
  {
    id: 6, title: 'Gerente Operacional', company: 'BIF BEEF - BCG IND. E COM.',
    period: 'Abr 2014 - Set 2016', location: 'Itaperuna, RJ',
    description: 'Retorno financeiro e baixa nas duplicatas. Importação de pedidos para sistema ERP. Logística de entrega e faturamento (NFe). Gestão de rede interna e equipamentos.',
    skills: ['Gestão', 'ERP', 'Logística', 'Financeiro', 'Gestão de Equipes'],
  },
];

const skills: Skill[] = [
  { name: 'Python', level: 95, category: 'language', icon: <Code2 size={16} /> },
  { name: 'SQL', level: 90, category: 'language', icon: <Database size={16} /> },
  { name: 'R', level: 75, category: 'language', icon: <BarChart3 size={16} /> },
  { name: 'Power BI', level: 95, category: 'tool', icon: <LayoutDashboard size={16} /> },
  { name: 'DAX', level: 90, category: 'tool', icon: <Calculator size={16} /> },
  { name: 'Looker', level: 80, category: 'tool', icon: <Eye size={16} /> },
  { name: 'SAP BW', level: 85, category: 'tool', icon: <Building2 size={16} /> },
  { name: 'GCP', level: 75, category: 'cloud', icon: <Cloud size={16} /> },
  { name: 'AWS', level: 70, category: 'cloud', icon: <Cloud size={16} /> },
  { name: 'Azure', level: 70, category: 'cloud', icon: <Cloud size={16} /> },
  { name: 'RPA', level: 85, category: 'tool', icon: <Bot size={16} /> },
  { name: 'Power Platform', level: 90, category: 'tool', icon: <Zap size={16} /> },
  { name: 'UX/UI', level: 80, category: 'other', icon: <Palette size={16} /> },
  { name: 'Git/GitHub', level: 85, category: 'tool', icon: <GitBranch size={16} /> },
  { name: 'Machine Learning', level: 75, category: 'other', icon: <BrainCircuit size={16} /> },
  { name: 'AI Agents', level: 80, category: 'other', icon: <Bot size={16} /> },
];

const repositories: Repository[] = [
  { id: 1, name: 'data-science-projects', description: 'Projetos de Ciência de Dados com Python, Machine Learning e Análise de Dados', language: 'Python', languageColor: '#3572A5', stars: 128, forks: 45, url: 'https://github.com/Adriano-Lengruber', topics: ['python', 'machine-learning', 'data-science'] },
  { id: 2, name: 'powerbi-dashboards', description: 'Dashboards e relatórios profissionais em Power BI com DAX avançado', language: 'DAX', languageColor: '#d4a853', stars: 89, forks: 32, url: 'https://github.com/Adriano-Lengruber', topics: ['powerbi', 'dax', 'business-intelligence'] },
  { id: 3, name: 'automations-scripts', description: 'Scripts de automação e Web Scraping para otimização de processos', language: 'Python', languageColor: '#3572A5', stars: 156, forks: 67, url: 'https://github.com/Adriano-Lengruber', topics: ['automation', 'web-scraping', 'rpa'] },
  { id: 4, name: 'ai-agents-framework', description: 'Framework para criação de agentes de IA para automação inteligente', language: 'Python', languageColor: '#3572A5', stars: 234, forks: 89, url: 'https://github.com/Adriano-Lengruber', topics: ['ai', 'agents', 'automation'] },
  { id: 5, name: 'sql-analytics', description: 'Consultas SQL avançadas e views para análise de dados empresariais', language: 'SQL', languageColor: '#e38c00', stars: 67, forks: 23, url: 'https://github.com/Adriano-Lengruber', topics: ['sql', 'analytics', 'etl'] },
  { id: 6, name: 'portfolio-website', description: 'Meu portfólio pessoal desenvolvido com React e Tailwind CSS', language: 'TypeScript', languageColor: '#2b7489', stars: 45, forks: 12, url: 'https://github.com/Adriano-Lengruber', topics: ['react', 'typescript', 'portfolio'] },
];

const blogPosts: BlogPost[] = [
  { id: 1, title: 'Transformando Dados em Decisões: O Poder da Análise Preditiva', excerpt: 'Aprenda como utilizar Machine Learning para prever tendências e tomar decisões baseadas em dados.', author: 'Adriano Lengruber', date: '15 Jan 2025', readTime: '8 min', likes: 142, comments: 23, tags: ['Machine Learning', 'Data Science', 'Business'] },
  { id: 2, title: 'Automação Inteligente: O Futuro do Trabalho', excerpt: 'Descubra como AI Agents estão revolucionando a forma como trabalhamos e produzimos resultados.', author: 'Adriano Lengruber', date: '08 Jan 2025', readTime: '6 min', likes: 98, comments: 15, tags: ['AI', 'Automação', 'Futuro'] },
  { id: 3, title: 'Dashboards que Contam Histórias', excerpt: 'Técnicas avançadas de visualização de dados para comunicar insights de forma eficaz no Power BI.', author: 'Adriano Lengruber', date: '02 Jan 2025', readTime: '10 min', likes: 187, comments: 31, tags: ['Power BI', 'Visualização', 'DAX'] },
  { id: 4, title: 'Introdução ao Power Platform', excerpt: 'Um guia completo para começar a utilizar Power Apps, Power Automate e Power BI na prática.', author: 'Adriano Lengruber', date: '28 Dez 2024', readTime: '12 min', likes: 156, comments: 28, tags: ['Power Platform', 'Low-Code', 'Microsoft'] },
];

// ──────────────────────────────────────────────────────────────
// Navigation
// ──────────────────────────────────────────────────────────────
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Início', href: '#home' },
    { name: 'Sobre', href: '#about' },
    { name: 'Currículo', href: '#resume' },
    { name: 'Projetos', href: '#projects' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contato', href: '#contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-3 shadow-lg' : 'bg-transparent py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#home" className="font-heading text-xl font-bold text-gradient">AL</a>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a key={item.name} href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 tracking-wide">
              {item.name}
            </a>
          ))}
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10"
          >
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <a key={item.name} href={item.href} onClick={() => setIsOpen(false)} className="block text-muted-foreground hover:text-primary transition-colors">
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ──────────────────────────────────────────────────────────────
// Hero
// ──────────────────────────────────────────────────────────────
function Hero() {
  const [typedText, setTypedText] = useState('');
  const roles = ['Cientista de Dados', 'AI Agents Developer', 'Desenvolvedor Full Stack', 'Especialista Power BI'];
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentRole = roles[roleIndex];
    if (typedText.length < currentRole.length) {
      timeout = setTimeout(() => setTypedText(currentRole.slice(0, typedText.length + 1)), 100);
    } else {
      timeout = setTimeout(() => { setRoleIndex((prev) => (prev + 1) % roles.length); setTypedText(''); }, 2500);
    }
    return () => clearTimeout(timeout);
  }, [typedText, roleIndex]);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-gold/8 rounded-full blur-3xl animate-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyber-steel/6 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyber-emerald/4 rounded-full blur-3xl" />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,168,83,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(212,168,83,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="text-center">
          {/* Available badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-cyber-emerald font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-pulse" />
              Disponível para novos projetos
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            Adriano <span className="text-gradient">Lengruber</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-6 h-10 font-light"
          >
            <span className="text-foreground/90">{typedText}</span>
            <span className="animate-pulse text-primary">|</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Transformando dados em soluções inteligentes. Especialista em automação e IA, criando soluções que impulsionam a evolução das empresas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <a href="#contact" className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-primary/20">
              Vamos conversar <ArrowRight size={18} />
            </a>
            <a href="#projects" className="inline-flex items-center gap-2 px-7 py-3 glass rounded-lg font-semibold hover:border-primary/30 transition-all duration-200">
              Ver projetos
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-6"
          >
            {[
              { href: 'https://github.com/Adriano-Lengruber', icon: <Github size={22} /> },
              { href: 'https://linkedin.com/in/adriano-lengruber', icon: <Linkedin size={22} /> },
              { href: 'mailto:adrianolengruber@hotmail.com', icon: <Mail size={22} /> },
            ].map(({ href, icon }, i) => (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 glass rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200">
                {icon}
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
          <ChevronDown className="text-muted-foreground/50" size={28} />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────
// About
// ──────────────────────────────────────────────────────────────
function About() {
  const stats = [
    { icon: <Code2 size={22} className="text-primary" />, label: 'Linguagens', value: '5+' },
    { icon: <Wrench size={22} className="text-cyber-steel" />, label: 'Ferramentas', value: '15+' },
    { icon: <Rocket size={22} className="text-cyber-emerald" />, label: 'Projetos', value: '50+' },
    { icon: <Users size={22} className="text-primary" />, label: 'Clientes', value: '20+' },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">Sobre <span className="text-gradient">Mim</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Uma trajetória multidisciplinar em tecnologia, dados e inovação</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
            <h3 className="font-heading text-2xl font-semibold">Transformando Complexidade em Simplicidade</h3>
            <p className="text-muted-foreground leading-relaxed">
              Sou cientista de dados em especialização nas áreas de automação e inteligência artificial, com o propósito de transformar processos complexos em soluções inteligentes, eficientes e acessíveis.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Ao longo da minha trajetória, atuei em diversas frentes tecnológicas — desde o desenvolvimento de softwares personalizados e manutenção de equipamentos eletrônicos, até marketing digital, análise de dados e atendimento a clientes corporativos e governamentais.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Atualmente, estou focado em automações inteligentes e aplicações de IA voltadas à otimização de processos, ganho de produtividade e suporte à tomada de decisão.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {['Python', 'Machine Learning', 'Power BI', 'AI Agents', 'Automação'].map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full glass text-sm text-primary/80 border-primary/20">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: index * 0.1 }} className="glass rounded-xl p-6 text-center hover:border-primary/20 transition-all duration-300">
                <div className="flex justify-center mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────
// Resume
// ──────────────────────────────────────────────────────────────
function Resume() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'language': return 'bg-primary/15 text-primary';
      case 'tool': return 'bg-cyber-steel/15 text-cyber-steel';
      case 'cloud': return 'bg-cyber-emerald/15 text-cyber-emerald';
      default: return 'bg-primary/10 text-primary/80';
    }
  };

  const getBarColor = (category: string) => {
    switch (category) {
      case 'language': return 'bg-gradient-to-r from-cyber-gold to-cyber-amber';
      case 'tool': return 'bg-gradient-to-r from-cyber-steel to-cyber-blue';
      case 'cloud': return 'bg-gradient-to-r from-cyber-emerald to-teal-400';
      default: return 'bg-gradient-to-r from-cyber-gold/70 to-cyber-amber/70';
    }
  };

  const education = [
    { title: 'Pós-graduação Lato Sensu', school: 'Faculdade Líbano', degree: 'Business Intelligence, Big Data e Analytics — Ciência de Dados', period: '2024 - 2025' },
    { title: 'Bootcamp', school: 'SoulCode', degree: 'Analista de Dados', period: '2023' },
    { title: 'Bacharel', school: 'Universidade Iguaçu', degree: 'Sistemas de Informação', period: '2004 - 2007' },
    { title: 'Técnico', school: 'Wall Escola Técnica', degree: 'Tecnologia da Informação', period: '2008 - 2010' },
  ];

  const certs = ['Power BI para Análise de Dados', 'Fundamentos de Python', 'Implementando Banco de Dados', 'Classificação e Tratamento da Informação'];

  return (
    <section id="resume" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">Currículo <span className="text-gradient">Profissional</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Uma jornada de aprendizado contínuo e conquistas profissionais</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Experience */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
              <Terminal className="text-primary" size={20} /> Experiência Profissional
            </h3>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px timeline-line" />
              {experiences.map((exp, index) => (
                <motion.div key={exp.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="relative pl-16 pb-8">
                  <div className={`absolute left-[18px] top-1 w-4 h-4 rounded-full border-2 border-cyber-black ${exp.current ? 'bg-cyber-emerald shadow-sm shadow-cyber-emerald/50' : 'bg-cyber-gold'}`} />
                  <div className="glass rounded-xl p-6 cursor-pointer hover:border-primary/25 transition-all duration-300"
                    onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg leading-tight">{exp.title}</h4>
                        <p className="text-primary text-sm font-medium mt-0.5">{exp.company}</p>
                      </div>
                      {exp.current && (
                        <span className="px-2.5 py-1 rounded-full bg-cyber-emerald/15 text-cyber-emerald text-xs font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald animate-pulse" /> Atual
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {exp.period}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {exp.location}</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{exp.description}</p>
                    <AnimatePresence>
                      {expandedId === exp.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10 mt-4">
                            {exp.skills.map((skill) => (
                              <span key={skill} className="px-2.5 py-1 rounded-md bg-cyber-slate text-xs text-primary/80 border border-primary/15">{skill}</span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button className="text-primary/70 text-xs flex items-center gap-1 mt-3 hover:text-primary transition-colors">
                      {expandedId === exp.id ? 'Ver menos' : 'Ver mais'}
                      <ChevronDown size={13} className={`transition-transform ${expandedId === exp.id ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Skills + Education + Certs */}
          <div className="space-y-6">
            <h3 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
              <Cpu className="text-primary" size={20} /> Habilidades Técnicas
            </h3>
            <div className="space-y-3">
              {skills.map((skill, index) => (
                <motion.div key={skill.name} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <span className={`p-1 rounded ${getCategoryColor(skill.category)}`}>{skill.icon}</span>
                      {skill.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 bg-cyber-slate/80 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }} transition={{ duration: 1, delay: index * 0.04 }}
                      className={`h-full rounded-full ${getBarColor(skill.category)}`} />
                  </div>
                </motion.div>
              ))}
            </div>

            <h3 className="font-heading text-xl font-semibold mt-8 mb-4 flex items-center gap-2">
              <BookOpen className="text-primary" size={20} /> Formação Acadêmica
            </h3>
            <div className="space-y-3">
              {education.map((edu, index) => (
                <motion.div key={edu.school} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="glass rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-0.5">{edu.title}</p>
                  <h4 className="font-semibold text-sm">{edu.school}</h4>
                  <p className="text-xs text-primary/80 mt-0.5">{edu.degree}</p>
                  <p className="text-xs text-muted-foreground mt-1">{edu.period}</p>
                </motion.div>
              ))}
            </div>

            <h3 className="font-heading text-xl font-semibold mt-8 mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-primary" size={20} /> Certificações
            </h3>
            <div className="flex flex-wrap gap-2">
              {certs.map((cert, index) => (
                <motion.span key={cert} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: index * 0.05 }}
                  className="px-3 py-2 rounded-lg glass text-xs text-muted-foreground hover:text-primary/80 transition-colors">
                  {cert}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────
// Projects
// ──────────────────────────────────────────────────────────────
function Projects() {
  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">Projetos no <span className="text-gradient">GitHub</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Repositórios públicos demonstrando minhas habilidades em desenvolvimento e ciência de dados</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repositories.map((repo, index) => (
            <motion.a key={repo.id} href={repo.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="glass rounded-xl p-6 hover:border-primary/25 transition-all duration-300 group flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GitBranch size={16} className="text-primary/60" />
                  <h3 className="font-semibold group-hover:text-primary transition-colors text-sm">{repo.name}</h3>
                </div>
                <ExternalLink size={15} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
              <p className="text-muted-foreground text-sm mb-4 flex-1 leading-relaxed">{repo.description}</p>
              <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: repo.languageColor }} />
                  {repo.language}
                </span>
                <span className="flex items-center gap-1"><Star size={12} /> {repo.stars}</span>
                <span className="flex items-center gap-1"><GitFork size={12} /> {repo.forks}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {repo.topics.map((topic) => (
                  <span key={topic} className="px-2 py-0.5 rounded text-xs bg-primary/8 text-primary/70 border border-primary/12">{topic}</span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
          <a href="https://github.com/Adriano-Lengruber" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 glass rounded-lg font-medium hover:border-primary/30 hover:text-primary transition-all duration-200">
            Ver todos os repositórios <Github size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────
// Blog
// ──────────────────────────────────────────────────────────────
const blogPatterns = [
  { from: 'from-cyber-gold/10', to: 'to-cyber-amber/5', accent: 'text-cyber-gold' },
  { from: 'from-cyber-steel/10', to: 'to-cyber-blue/5', accent: 'text-cyber-steel' },
  { from: 'from-cyber-emerald/10', to: 'to-teal-900/20', accent: 'text-cyber-emerald' },
  { from: 'from-primary/8', to: 'to-cyber-steel/5', accent: 'text-primary/70' },
];

function Blog() {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const handleLike = (id: number) => setLikedPosts((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <section id="blog" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">Blog <span className="text-gradient">Comunitário</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Compartilhando conhecimento sobre dados, IA e tecnologia. Junte-se à comunidade!</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {blogPosts.map((post, index) => {
            const pat = blogPatterns[index % blogPatterns.length];
            return (
              <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="glass rounded-xl overflow-hidden hover:border-primary/25 transition-all duration-300 group flex flex-col">
                {/* Elegant thumbnail — no emoji */}
                <div className={`h-44 bg-gradient-to-br ${pat.from} ${pat.to} relative overflow-hidden blog-pattern`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`flex flex-col items-center gap-2 opacity-30 ${pat.accent}`}>
                      <BarChart3 size={48} strokeWidth={1} />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded glass text-xs font-medium backdrop-blur-md">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-heading text-lg font-semibold mb-2 group-hover:text-primary transition-colors leading-snug">{post.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 flex-1 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span className="font-medium">{post.author}</span>
                    <span>{post.date} · {post.readTime} leitura</span>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <button onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${likedPosts.includes(post.id) ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                      <Heart size={15} fill={likedPosts.includes(post.id) ? 'currentColor' : 'none'} />
                      {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                    </button>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MessageCircle size={15} /> {post.comments}
                    </span>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors ml-auto">
                      <Share2 size={15} /> Compartilhar
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Auth CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-12 glass rounded-xl p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="text-primary" size={24} />
          </div>
          <h3 className="font-heading text-xl font-semibold mb-2">Junte-se à Comunidade</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto text-sm">
            Crie uma conta para comentar, curtir artigos e contribuir com a comunidade de dados e IA.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all">
              <LogIn size={17} /> Cadastrar-se
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 glass rounded-lg font-semibold hover:border-primary/30 transition-all">
              Já tenho conta
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────
// Contact
// ──────────────────────────────────────────────────────────────
function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); console.log('Form submitted:', formData); };
  const up = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const contactInfo = [
    { icon: <Mail size={22} className="text-primary" />, bg: 'bg-primary/10', label: 'Email', content: <a href="mailto:adrianolengruber@hotmail.com" className="text-muted-foreground hover:text-primary transition-colors text-sm">adrianolengruber@hotmail.com</a> },
    { icon: <Phone size={22} className="text-cyber-steel" />, bg: 'bg-cyber-steel/10', label: 'Telefone', content: <a href="tel:+5521983300779" className="text-muted-foreground hover:text-primary transition-colors text-sm">(21) 98330-0779</a> },
    { icon: <MapPin size={22} className="text-cyber-emerald" />, bg: 'bg-cyber-emerald/10', label: 'Localização', content: <p className="text-muted-foreground text-sm">Itaperuna, Rio de Janeiro, Brasil</p> },
  ];

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">Vamos <span className="text-gradient">Conversar</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Tem um projeto em mente? Entre em contato para discutirmos como posso ajudar.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
            {contactInfo.map(({ icon, bg, label, content }) => (
              <div key={label} className="glass rounded-xl p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>{icon}</div>
                <div><h3 className="font-semibold text-sm mb-0.5">{label}</h3>{content}</div>
              </div>
            ))}

            <div className="pt-4">
              <h3 className="font-semibold text-sm mb-4">Redes Sociais</h3>
              <div className="flex gap-3">
                {[
                  { href: 'https://github.com/Adriano-Lengruber', icon: <Github size={19} />, label: 'GitHub' },
                  { href: 'https://linkedin.com/in/adriano-lengruber', icon: <Linkedin size={19} />, label: 'LinkedIn' },
                  { href: 'https://instagram.com/supertech_solucoes_tecnologia', icon: <span className="text-xs font-bold">IG</span>, label: 'Instagram' },
                ].map(({ href, icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-11 h-11 glass rounded-xl flex items-center justify-center hover:bg-primary/15 hover:border-primary/25 hover:text-primary transition-all duration-200 text-muted-foreground">
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                {[{ id: 'name', label: 'Nome', type: 'text', placeholder: 'Seu nome' },
                { id: 'email', label: 'Email', type: 'email', placeholder: 'seu@email.com' }].map(({ id, label, type, placeholder }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-sm font-medium mb-2 text-muted-foreground">{label}</label>
                    <input type={type} id={id} value={formData[id as keyof typeof formData]} onChange={up(id)}
                      className="w-full px-4 py-3 rounded-lg bg-cyber-black/50 border border-white/10 focus:border-primary/50 focus:outline-none transition-colors text-sm"
                      placeholder={placeholder} required />
                  </div>
                ))}
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2 text-muted-foreground">Assunto</label>
                <input type="text" id="subject" value={formData.subject} onChange={up('subject')}
                  className="w-full px-4 py-3 rounded-lg bg-cyber-black/50 border border-white/10 focus:border-primary/50 focus:outline-none transition-colors text-sm"
                  placeholder="Sobre o que quer falar?" required />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-muted-foreground">Mensagem</label>
                <textarea id="message" rows={5} value={formData.message} onChange={up('message')}
                  className="w-full px-4 py-3 rounded-lg bg-cyber-black/50 border border-white/10 focus:border-primary/50 focus:outline-none transition-colors resize-none text-sm"
                  placeholder="Sua mensagem..." required />
              </div>
              <button type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20">
                <Send size={17} /> Enviar Mensagem
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────
// Footer
// ──────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-10 border-t border-white/6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-heading text-xl font-bold text-gradient">AL</span>
            <span className="text-muted-foreground text-sm">© 2025 Adriano Lengruber</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Termos</a>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Code2 size={13} className="text-primary/60" />
            <span>Feito com precisão e tecnologia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ──────────────────────────────────────────────────────────────
// App
// ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-cyber-black">
      <Navigation />
      <Hero />
      <About />
      <Resume />
      <Projects />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );
}
