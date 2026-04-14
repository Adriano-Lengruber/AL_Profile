import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Mail, Phone, MapPin, ExternalLink, Menu, X,
  ArrowRight, GitFork, Star, BookOpen, Heart, Share2,
  User, LogIn, Send, Code2, Database, BarChart3, LayoutDashboard,
  Calculator, Eye, Building2, Cloud, Bot, Zap, Palette, GitBranch,
  BrainCircuit, Wrench, Rocket, Users, Terminal, Cpu, CheckCircle2, Handshake,
  ChevronDown, ChevronLeft, ChevronRight, Calendar, FileDown, Award, TrendingUp, Blocks,
  CheckCheck, Sparkles, Activity, Instagram, Youtube, Server, Container, Workflow,
  Network, GitGraph, Box, HardDrive, CloudLightning, CloudFog, Table2, FileSpreadsheet,
  Variable, Warehouse, Kanban, Gauge, Hexagon, FileCode, Brackets, Globe,
  CircleDot,
} from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import brandLogo from '../Imgs/Logos_Formacoes/LOGO01.png';
import logoLibano from '../Imgs/Logos_Formacoes/logo_instituo-libano.png';
import logoSoulCode from '../Imgs/Logos_Formacoes/soulcode.png';
import logoUnig from '../Imgs/Logos_Formacoes/logo-da-unig.webp';
import logoWall from '../Imgs/Logos_Formacoes/wall_escola_tcnica_logo.jpg';
import BlogPage from './pages/BlogPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import AdminDashboard from './pages/AdminDashboard';
import ClientPortal from './pages/ClientPortal';
import SpecializedConsultingPage from './pages/SpecializedConsultingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './hooks/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { getSpecializedConsultingService, specializedConsultingServices } from './data/specializedConsulting';

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

function WhatsAppIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2C6.62 2 2.2 6.42 2.2 11.83c0 1.73.45 3.42 1.3 4.9L2 22l5.42-1.42a9.8 9.8 0 0 0 4.61 1.17h.01c5.41 0 9.83-4.42 9.83-9.83 0-2.62-1.02-5.08-2.82-6.99Zm-7.01 15.18h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.22.85.86-3.14-.2-.32a8.08 8.08 0 0 1-1.24-4.34c0-4.48 3.65-8.13 8.14-8.13 2.17 0 4.21.84 5.74 2.38a8.04 8.04 0 0 1 2.38 5.75c0 4.49-3.65 8.14-8.02 8.26Zm4.46-6.08c-.24-.12-1.44-.71-1.67-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.22-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.36.11-.48.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42l-.47-.01c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.33.98 2.49c.12.16 1.69 2.58 4.09 3.62.57.24 1.01.39 1.36.5.57.18 1.09.15 1.5.09.46-.07 1.44-.59 1.64-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

export { };
const HERO_ROLES = ['Consultoria de Soluções Inteligentes', 'AI Agents & Automation Specialist', 'Data Scientist & Full Stack Dev', 'Business Intelligence Expert'];

interface Skill {
  name: string; level: number; category: 'language' | 'tool' | 'cloud' | 'other';
  icon: React.ReactNode;
}

const experiences: Experience[] = [
  {
    id: 1, title: 'Consultor em Soluções Inteligentes & IA', company: 'adriano-lengruber.com',
    period: '2026 - Atual', location: 'Remoto / Brasil', current: true,
    description: 'Atuação dedicada à criação de soluções proprietárias para empresas e empreendedores, unindo automação, inteligência artificial, dados e desenvolvimento sob medida. Conduzo o projeto do diagnóstico à entrega final, com foco em eficiência operacional, escalabilidade e melhor relação entre investimento e resultado.',
    skills: ['IA Aplicada', 'Automação', 'Arquitetura de Soluções', 'Full-Stack', 'Consultoria'],
  },
  {
    id: 2, title: 'Fundador & Consultor de Tecnologia', company: 'SuperTech - Soluções em TI',
    period: '2010 - 2026', location: 'Natividade, RJ',
    description: 'Liderei uma operação própria de tecnologia com atendimento personalizado, desenvolvimento de softwares sob medida, manutenção de computadores e eletrônicos, marketing digital e relacionamento comercial. A experiência consolidou uma visão prática de ponta a ponta, da prospecção à entrega de soluções alinhadas às necessidades reais de cada cliente.',
    skills: ['Empreendedorismo', 'Suporte Técnico', 'Software Sob Medida', 'Marketing Digital', 'Relacionamento com Clientes'],
  },
  {
    id: 3, title: 'Engenheiro de Software Sênior', company: 'Global RJ Serviços',
    period: '2025', location: 'Macaé, RJ',
    description: 'Atuei na construção de soluções orientadas a dados com Python, SQL e Power BI, cobrindo extração, tratamento, modelagem e disponibilização de informações para análise executiva. Também desenvolvi automações, rotinas de web scraping, dashboards de alta performance e entregas full stack com versionamento e deploy estruturados.',
    skills: ['Python', 'SQL', 'Power BI', 'DAX', 'ETL', 'Git', 'Full-Stack'],
  },
  {
    id: 4, title: 'Analista de Dados / Planejamento', company: 'Infotec Brasil',
    period: '2023 - 2025', location: 'Macaé, RJ',
    description: 'Atuei no contrato MC38, atendendo demandas da região de Imbetiba com extração de dados em SAP BW / SAP S/4HANA, processos completos de ETL, validação de consistência e construção de relatórios no Power BI. Também desenvolvi aplicações corporativas com Power Apps e automações com Power Automate para digitalizar rotinas e integrar informações em uma única solução de negócio.',
    skills: ['SAP BW', 'Power BI', 'DAX', 'Power Apps', 'Power Automate', 'ETL'],
  },
  {
    id: 5, title: 'Gerente Operacional', company: 'BIF BEEF - BCG IND. E COM.',
    period: '2014 - 2016', location: 'Itaperuna, RJ',
    description: 'Fui responsável pela operação administrativa e logística, incluindo faturamento, controle financeiro, importação de pedidos, emissão de notas fiscais, roteirização de entregas e gestão de cadastros no ERP. Também atuei na negociação com fornecedores, supervisão comercial e administração da infraestrutura interna e dos equipamentos da empresa.',
    skills: ['Gestão Operacional', 'ERP', 'Logística', 'Financeiro', 'Gestão de Equipes'],
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

const education = [
  {
    title: 'Pós-graduação Lato Sensu',
    school: 'Faculdade Líbano',
    degree: 'Business Intelligence, Big Data e Analytics — Ciência de Dados',
    period: '2024 - 2025',
    description: 'Formação avançada em Business Intelligence, big data e analytics com aprofundamento em ciência de dados aplicada ao contexto corporativo.',
    highlight: 'Especialização',
    accent: 'from-[#0056D2]/85 via-[#0A2540]/80 to-cyber-black',
    providerAccent: 'bg-[#0056D2]/15 text-[#6aa3ff]',
    icon: <BrainCircuit size={24} />,
    skills: ['BI', 'Big Data', 'Ciência de Dados'],
    logo: logoLibano,
  },
  {
    title: 'Bootcamp',
    school: 'SoulCode Academy',
    degree: 'Analista de Dados',
    period: '2023',
    description: 'Bootcamp intensivo com foco em análise de dados, SQL, Python, visualização e construção de soluções orientadas por métricas.',
    highlight: 'Formação prática',
    accent: 'from-[#F2C811]/85 via-[#614b03]/70 to-cyber-black',
    providerAccent: 'bg-[#F2C811]/15 text-[#f6db5d]',
    icon: <BarChart3 size={24} />,
    skills: ['SQL', 'Python', 'Dashboards'],
    logo: logoSoulCode,
  },
  {
    title: 'Bacharel',
    school: 'Universidade Iguaçu - UNIG',
    degree: 'Sistemas de Informação',
    period: '2004 - 2007',
    description: 'Graduação voltada à base de desenvolvimento de software, banco de dados, análise de sistemas e fundamentos de tecnologia da informação.',
    highlight: 'Graduação',
    accent: 'from-[#1f6feb]/85 via-[#10203f]/80 to-cyber-black',
    providerAccent: 'bg-[#1f6feb]/15 text-[#73a7ff]',
    icon: <Code2 size={24} />,
    skills: ['Software', 'Banco de Dados', 'Análise'],
    logo: logoUnig,
  },
  {
    title: 'Técnico',
    school: 'Wall Escola Técnica',
    degree: 'Técnico em Mecatrônica',
    period: '2008 - 2010',
    description: 'Curso técnico focado em mecânica, eletrônica e informática industrial. Programação de controladores lógicos programáveis (CLP), manutenção de sistemas automatizados e robótica.',
    highlight: 'Base técnica',
    accent: 'from-[#F97316]/85 via-[#431407]/80 to-cyber-black',
    providerAccent: 'bg-[#F97316]/15 text-[#fdba74]',
    icon: <Cpu size={24} />,
    skills: ['Automação', 'CLP', 'Robótica'],
    logo: logoWall,
  },
];

const certifications = [
  {
    name: 'Google Data Analytics Professional Certificate',
    provider: 'Google + Coursera',
    format: 'Professional Certificate',
    credentialId: 'K39K5TQURMN4',
    credentialUrl: 'https://www.coursera.org/account/accomplishments/professional-cert/K39K5TQURMN4',
    description: 'Formação completa em análise de dados com certificação reconhecida por Google e Coursera, cobrindo limpeza, tratamento, visualização e tomada de decisão orientada por dados.',
    thumbnailUrl: 'https://s3.amazonaws.com/coursera/media/Grid_Coursera_Partners_updated.png',
    accent: 'from-[#4285F4]/85 via-[#0F172A]/80 to-cyber-black',
    providerAccent: 'bg-[#4285F4]/15 text-[#8db8ff]',
    icon: <BarChart3 size={24} />,
    skills: ['Google Data Analytics', 'Análise de Dados', 'Coursera'],
  },
  {
    name: 'Azure AI Fundamentals',
    provider: 'Microsoft',
    format: 'Fundamentals',
    credentialId: '4A1E4A6CC6AA62DF',
    credentialUrl: 'https://learn.microsoft.com/api/credentials/share/en-us/AdrianoLengruber/F648454AE3C1C82?sharingId=B67723CE0F8D690D',
    description: 'Certificação fundamental em IA aplicada com conceitos de machine learning, visão computacional, NLP e workloads de IA na Azure.',
    thumbnailUrl: 'https://learn.microsoft.com/en-us/media/open-graph-image.png',
    accent: 'from-[#0078D4]/85 via-[#0b2740]/80 to-cyber-black',
    providerAccent: 'bg-[#0078D4]/15 text-[#7cc6ff]',
    icon: <Cloud size={24} />,
    skills: ['Azure AI', 'Cloud', 'Microsoft'],
  },
  {
    name: 'Formação Power BI Analyst',
    provider: 'DIO',
    format: 'Bootcamp',
    credentialId: '83CD0F9B',
    credentialUrl: 'https://www.dio.me/certificate/83CD0F9B/share',
    description: 'Trilha com foco em modelagem analítica, visualização de dados, métricas e storytelling com Power BI.',
    thumbnailUrl: 'https://hermes.dio.me/certificates/cover/83CD0F9B.jpg',
    accent: 'from-[#F2C811]/85 via-[#614b03]/70 to-cyber-black',
    providerAccent: 'bg-[#F2C811]/15 text-[#f6db5d]',
    icon: <LayoutDashboard size={24} />,
    skills: ['Power BI', 'DAX', 'Analytics'],
  },
  {
    name: 'Formação Python Developer',
    provider: 'DIO',
    format: 'Bootcamp',
    credentialId: 'B0A2ABED',
    credentialUrl: 'https://www.dio.me/certificate/B0A2ABED/share',
    description: 'Formação orientada a desenvolvimento em Python com prática em lógica, sintaxe e construção de soluções reais.',
    thumbnailUrl: 'https://hermes.dio.me/certificates/cover/B0A2ABED.jpg',
    accent: 'from-[#1f6feb]/85 via-[#10203f]/80 to-cyber-black',
    providerAccent: 'bg-[#1f6feb]/15 text-[#73a7ff]',
    icon: <Code2 size={24} />,
    skills: ['Python', 'APIs', 'Automação'],
  },
  {
    name: 'Formação UX Designer',
    provider: 'DIO',
    format: 'Bootcamp',
    credentialId: 'BBB4A04E',
    credentialUrl: 'https://www.dio.me/certificate/BBB4A04E/share',
    description: 'Percurso focado em experiência do usuário, interface, fluxo de navegação e decisões guiadas por usabilidade.',
    thumbnailUrl: 'https://hermes.dio.me/certificates/cover/BBB4A04E.jpg',
    accent: 'from-[#E07390]/85 via-[#411726]/80 to-cyber-black',
    providerAccent: 'bg-[#E07390]/15 text-[#f2a6ba]',
    icon: <Palette size={24} />,
    skills: ['UX', 'UI', 'Jornada'],
  },
  {
    name: 'Ética na Inteligência Artificial',
    provider: 'SENAI-SP',
    format: 'Curso Livre',
    credentialId: '00042104/8184334',
    credentialUrl: 'https://www.sp.senai.br/consulta-certificado?qrcode=00042104/8184334',
    description: 'Curso com verificação pública voltado a fundamentos éticos, responsabilidade e uso consciente de IA em contexto profissional.',
    completionLabel: 'Concluído em 04/08/2025 • 4h',
    accent: 'from-[#D71920]/85 via-[#42090b]/80 to-cyber-black',
    providerAccent: 'bg-[#D71920]/15 text-[#ff9b9f]',
    icon: <CheckCircle2 size={24} />,
    skills: ['Ética em IA', 'Governança', 'SENAI'],
  },
];

// ──────────────────────────────────────────────────────────────
// Navigation
// ──────────────────────────────────────────────────────────────
function BrandMark({ className = 'h-11 w-auto md:h-12' }: { className?: string }) {
  return (
    <img
      src={brandLogo}
      alt="Adriano Lengruber"
      className={className}
      loading="eager"
      decoding="async"
    />
  );
}

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Início', href: '#home' },
    { name: 'Sobre', href: '#about' },
    { name: 'Serviços', href: '#services' },
    { name: 'Processo', href: '#process' },
    { name: 'Currículo', href: '#resume' },
    { name: 'Projetos', href: '#projects' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contato', href: '#contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cyber-slate/28 py-3 backdrop-blur-2xl supports-[backdrop-filter]:bg-cyber-slate/22' : 'bg-transparent py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3 shrink-0" aria-label="Voltar ao topo">
          <BrandMark />
        </a>
        <div className="hidden md:flex items-center justify-center gap-8 flex-1">
          {navItems.map((item) => (
            <a key={item.name} href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 tracking-wide">
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link to="/blog" className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors duration-200">
            Blog
          </Link>
          <Link
            to="/admin"
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border ${
              user?.adminAccess?.canAccessAdmin
                ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20'
                : 'border-white/10 bg-white/5 text-foreground hover:bg-white/10'
            }`}
          >
            Admin
          </Link>
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
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const currentRole = HERO_ROLES[roleIndex];
    if (typedText.length < currentRole.length) {
      timeout = setTimeout(() => setTypedText(currentRole.slice(0, typedText.length + 1)), 100);
    } else {
      timeout = setTimeout(() => { setRoleIndex((prev) => (prev + 1) % HERO_ROLES.length); setTypedText(''); }, 2500);
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
            className="text-lg text-muted-foreground max-w-4xl mx-auto mb-10 leading-relaxed"
          >
            Transformando dados em soluções inteligentes. Especialista em automação e IA, crio soluções com tecnologias de ponta que impulsionam a evolução de empresas e empreendedores de todos os portes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <a href="#contact" className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-primary/20">
              Vamos conversar <ArrowRight size={18} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-6"
          >
            {[
              { href: 'https://github.com/Adriano-Lengruber', icon: <Github size={22} /> },
              { href: 'https://linkedin.com/in/adriano-lengruber', icon: <Linkedin size={22} /> },
              { href: 'mailto:contato@adriano-lengruber.com', icon: <Mail size={22} /> },
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
    { icon: <Calendar size={22} className="text-primary" />, label: 'Anos de Exp.', value: '16+' },
    { icon: <Handshake size={22} className="text-primary" />, label: 'Consultorias', value: '35' },
    { icon: <Rocket size={22} className="text-primary" />, label: 'Projetos', value: '50+' },
    { icon: <Users size={22} className="text-primary" />, label: 'Clientes', value: '60+' },
  ];

  // Tech stack logos for carousel
  const techStack = [
    { icon: <Code2 size={28} />, name: 'Python' },
    { icon: <Database size={28} />, name: 'SQL' },
    { icon: <BarChart3 size={28} />, name: 'Power BI' },
    { icon: <LayoutDashboard size={28} />, name: 'DAX' },
    { icon: <Bot size={28} />, name: 'AI Agents' },
    { icon: <BrainCircuit size={28} />, name: 'ML' },
    { icon: <Zap size={28} />, name: 'RPA' },
    { icon: <Cloud size={28} />, name: 'Cloud' },
    { icon: <GitBranch size={28} />, name: 'Git' },
    { icon: <Building2 size={28} />, name: 'SAP' },
    { icon: <Cpu size={28} />, name: 'ETL' },
    { icon: <Terminal size={28} />, name: 'Docker' },
  ];

  // Duplicate for seamless infinite scroll
  const techStackDoubled = [...techStack, ...techStack, ...techStack];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">Sobre <span className="text-gradient">Mim</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Uma trajetória multidisciplinar em tecnologia, dados e inovação</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
            <h3 className="font-heading text-2xl font-semibold"><span className="text-white">Arquiteto de</span> <span className="text-cyber-gold">Soluções Inteligentes</span></h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Especialista em <span className="text-white font-medium">Ciência de Dados, Automação e Inteligência Artificial</span>, dedico minha carreira a converter desafios operacionais complexos em sistemas inteligentes de alta performance.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Minha trajetória multidisciplinar percorre desde a engenharia de software e hardware até o marketing estratégico e análise de dados corporativos. Essa visão 360º me permite projetar ecossistemas que não apenas automatizam tarefas, mas potencializam a tomada de decisão em níveis executivos e governamentais.
            </p>
            <p className="text-muted-foreground leading-relaxed border-l-2 border-cyber-gold pl-4 italic">
              "Foco na criação de workflows cognitivos e aplicações de IA que transcendem a produtividade comum, entregando inteligência real e escalável para negócios que buscam a fronteira tecnológica."
            </p>
          </motion.div>

           <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
             {stats.map((stat, index) => (
               <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                 transition={{ delay: index * 0.1 }} className="glass rounded-xl p-6 text-center hover:border-primary/20 transition-all duration-300 h-[160px] flex flex-col justify-center items-center">
                 <div className="flex justify-center mb-3">{stat.icon}</div>
                 <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{stat.value}</div>
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
// Tech Stack - Carrossel com CSS Marquee (Tema Dourado Premium)
// ──────────────────────────────────────────────────────────────
function TechStack() {
  // Tech stack com ícones Lucide (tema dourado)
  const techStack = [
    { name: 'Python', icon: <FileCode size={24} />, color: '#3776AB' },
    { name: 'TensorFlow', icon: <BrainCircuit size={24} />, color: '#FF6F00' },
    { name: 'PyTorch', icon: <Sparkles size={24} />, color: '#EE4C2C' },
    { name: 'Pandas', icon: <BarChart3 size={24} />, color: '#150458' },
    { name: 'NumPy', icon: <TrendingUp size={24} />, color: '#013243' },
    { name: 'MySQL', icon: <Database size={24} />, color: '#4479A1' },
    { name: 'PostgreSQL', icon: <HardDrive size={24} />, color: '#336791' },
    { name: 'MongoDB', icon: <Hexagon size={24} />, color: '#47A248' },
    { name: 'Redis', icon: <Zap size={24} />, color: '#DC382D' },
    { name: 'Power BI', icon: <LayoutDashboard size={24} />, color: '#F2C811' },
    { name: 'Tableau', icon: <CircleDot size={24} />, color: '#E97627' },
    { name: 'AWS', icon: <Cloud size={24} />, color: '#FF9900' },
    { name: 'GCP', icon: <CloudLightning size={24} />, color: '#4285F4' },
    { name: 'Azure', icon: <CloudFog size={24} />, color: '#0078D4' },
    { name: 'Docker', icon: <Box size={24} />, color: '#2496ED' },
    { name: 'Kubernetes', icon: <Container size={24} />, color: '#326CE5' },
    { name: 'React', icon: <Hexagon size={24} />, color: '#61DAFB' },
    { name: 'TypeScript', icon: <Code2 size={24} />, color: '#3178C6' },
    { name: 'Node.js', icon: <Server size={24} />, color: '#339933' },
    { name: 'FastAPI', icon: <Rocket size={24} />, color: '#017794' },
    { name: 'Git', icon: <GitBranch size={24} />, color: '#F05032' },
    { name: 'GitHub', icon: <Github size={24} />, color: '#d4a853' },
    { name: 'SAP', icon: <Terminal size={24} />, color: '#0FAAFF' },
    { name: 'n8n', icon: <Workflow size={24} />, color: '#FA6400' },
  ];

  return (
    <section className="py-12 relative bg-cyber-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="text-center"
        >
          <h2 className="font-heading text-3xl font-bold mb-2">Tech <span className="text-gradient">Stack</span></h2>
          <p className="text-muted-foreground text-sm">Tecnologias que domino</p>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden">
        {/* Gradiente máscara esquerda */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-cyber-black to-transparent" />
        
        {/* Gradiente máscara direita */}
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-cyber-black to-transparent" />
        
        {/* Marquee Track */}
        <div className="flex gap-6 marquee-track">
          {/* Primeiro conjunto */}
          {techStack.map((tech, index) => (
            <motion.div
              key={`first-${tech.name}-${index}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0"
            >
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div 
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyber-gold/20 to-cyber-gold/5 flex items-center justify-center shadow-lg border border-cyber-gold/20 group-hover:border-cyber-gold/50 group-hover:scale-110 transition-all duration-300"
                  style={{ color: '#d4a853' }}
                >
                  {tech.icon}
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-cyber-gold transition-colors whitespace-nowrap">
                  {tech.name}
                </span>
              </div>
            </motion.div>
          ))}
          {/* Segundo conjunto para loop */}
          {techStack.map((tech, index) => (
            <motion.div
              key={`second-${tech.name}-${index}`}
              className="flex-shrink-0"
            >
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div 
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyber-gold/20 to-cyber-gold/5 flex items-center justify-center shadow-lg border border-cyber-gold/20 group-hover:border-cyber-gold/50 group-hover:scale-110 transition-all duration-300"
                  style={{ color: '#d4a853' }}
                >
                  {tech.icon}
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-cyber-gold transition-colors whitespace-nowrap">
                  {tech.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────
// Services
// ──────────────────────────────────────────────────────────────
function Services() {
  const services = [
    {
      icon: <BrainCircuit size={28} />,
      color: 'text-cyber-gold',
      bg: 'bg-cyber-gold/10',
      border: 'hover:border-cyber-gold/30',
      title: 'Consultoria Estratégica',
      description: 'Diagnóstico profundo de processos para identificar gargalos e oportunidades de automação e inteligência.',
      items: [
        { text: 'Mapeamento de processos e fluxos de dados' },
        { text: 'Arquitetura de soluções escaláveis' },
        { text: 'Relatório de impacto e ROI esperado' },
        { text: 'Definição de stack tecnológica ideal' },
      ],
      badges: ['Estratégia', 'Arquitetura', 'ROI'],
    },
    {
      icon: <LayoutDashboard size={28} />,
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      border: 'hover:border-cyan-400/30',
      title: 'Soluções Inteligentes',
      description: 'Desenvolvimento de sistemas personalizados que integram software, dados e IA em uma única plataforma.',
      items: [
        { text: 'Plataformas web com inteligência nativa' },
        { text: 'Dashboards analíticos de alta performance' },
        { text: 'Modelos de Machine Learning integrados' },
        { text: 'Sistemas de suporte à decisão' },
      ],
      badges: ['React', 'Python', 'ML'],
    },
    {
      icon: <Bot size={28} />,
      color: 'text-cyber-emerald',
      bg: 'bg-cyber-emerald/10',
      border: 'hover:border-cyber-emerald/30',
      title: 'Automação & IA',
      description: 'Implementação de agentes de IA e RPA para eliminar tarefas repetitivas e aumentar a eficiência operacional.',
      items: [
        { text: 'Agentes de IA autônomos e cognitivos' },
        { text: 'Automação de processos ponta a ponta (RPA)' },
        { text: 'Integração de APIs e sistemas legados' },
        { text: 'Workflows inteligentes com n8n e LLMs' },
      ],
      badges: ['OpenAI', 'n8n', 'Python'],
    },
    {
      icon: <TrendingUp size={28} />,
      color: 'text-[#E07390]',
      bg: 'bg-[#E07390]/10',
      border: 'hover:border-[#E07390]/30',
      title: 'Recorrência & Evolução',
      description: 'Suporte contínuo, manutenção de infraestrutura e evolução constante da sua solução tecnológica.',
      items: [
        { text: 'Gestão de infraestrutura em nuvem (DevOps)' },
        { text: 'Suporte técnico especializado' },
        { text: 'Melhorias contínuas baseadas em dados' },
        { text: 'Segurança e monitoramento 24/7' },
      ],
      badges: ['DevOps', 'Cloud', 'Suporte'],
    },
  ];

  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">O que eu <span className="text-gradient">Ofereço</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Soluções sob medida para transformar seus dados e processos em vantagem competitiva</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((svc, i) => (
            <motion.div key={svc.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`glass rounded-xl p-6 transition-all duration-300 group ${svc.border} hover:shadow-lg`}
            >
              <div className={`w-14 h-14 rounded-xl ${svc.bg} flex items-center justify-center mb-5 ${svc.color} group-hover:scale-110 transition-transform duration-300`}>
                {svc.icon}
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">{svc.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{svc.description}</p>
              <ul className="space-y-2 mb-4">
                {svc.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCheck size={14} className={svc.color} />
                    {item.text}
                  </li>
                ))}
              </ul>
              {svc.badges && svc.badges.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-cyber-gold/10">
                  {svc.badges.map((badge) => (
                    <span key={badge} className={`px-2 py-1 rounded-full text-xs font-medium ${svc.bg} ${svc.color}`}>
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpecializedConsulting() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const consultingServices = specializedConsultingServices.map((service) => ({
    ...service,
    icon:
      service.iconKey === 'workstation' ? <HardDrive size={24} /> :
        service.iconKey === 'vps' ? <Server size={24} /> :
          service.iconKey === 'developer' ? <Brackets size={24} /> :
            <Gauge size={24} />,
  }));

  return (
    <section className="py-24 relative bg-cyber-black/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium tracking-[0.2em] uppercase mb-5">
            <Sparkles size={14} />
            Nova frente
          </div>
          <h2 className="font-heading text-4xl font-bold mb-4">Consultorias <span className="text-gradient">Especializadas</span></h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">Serviços com alta percepção de valor para atrair projetos rápidos, estratégicos e personalizados, do hardware à infraestrutura e ao software sob medida.</p>
        </motion.div>

        <div className="relative">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full glass items-center justify-center hover:bg-primary/15 hover:border-primary/25 transition-all hidden md:flex"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {consultingServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="min-w-0 flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)]"
                >
                  <div className={`glass rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 ${service.border} hover:-translate-y-1 h-full`}>
                    <div className="relative h-60">
                      <Link to={`/consultorias/${service.slug}`} className="absolute inset-0 block group" aria-label={`Abrir ${service.title}`}>
                        <div
                          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `linear-gradient(135deg, rgba(5,8,12,0.2), rgba(5,8,12,0.75)), url(${service.cover})` }}
                        />
                      </Link>
                      <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-cyber-black/30 to-transparent" />
                      <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex flex-wrap gap-2 max-w-[80%]">
                            {service.badges.map((badge) => (
                              <span key={badge} className="px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-sm border border-white/15 text-[11px] font-medium text-white/90">
                                {badge}
                              </span>
                            ))}
                          </div>
                          <div className={`w-12 h-12 rounded-xl ${service.iconBg} backdrop-blur-sm flex items-center justify-center ${service.iconColor}`}>
                            {service.icon}
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] uppercase tracking-[0.25em] text-white/70 mb-2">{service.audience}</p>
                          <h3 className="font-heading text-2xl font-semibold text-white">{service.title}</h3>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-muted-foreground leading-relaxed mb-5">{service.description}</p>

                      <div className="grid sm:grid-cols-2 gap-4 mb-5">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-primary mb-2">Ideal para</p>
                          <p className="text-sm text-foreground/85 leading-relaxed">{service.idealFor}</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-primary mb-2">Entregavel</p>
                          <p className="text-sm text-foreground/85 leading-relaxed">{service.deliverable}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {service.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 size={16} className={service.iconColor} />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 mt-6">
                        <Link
                          to={`/consultorias/${service.slug}`}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          Ver pagina
                          <ArrowRight size={16} />
                        </Link>
                        <a
                          href={`https://wa.me/5521983300779?text=${encodeURIComponent(`Ola, Adriano. Quero conversar sobre a consultoria "${service.title}".`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                        >
                          <WhatsAppIcon size={16} />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full glass items-center justify-center hover:bg-primary/15 hover:border-primary/25 transition-all hidden md:flex"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────
// Process - Como trabalhamos (Novo)
// ──────────────────────────────────────────────────────────────
function Process() {
  const steps = [
    {
      number: '01',
      title: 'Diagnóstico',
      description: 'Análise profunda do seu negócio para identificar gargalos e oportunidades reais de ganho com tecnologia.',
      icon: <Eye size={24} />,
    },
    {
      number: '02',
      title: 'Estratégia',
      description: 'Desenho da arquitetura ideal, seleção da stack tecnológica e definição do roadmap de implementação.',
      icon: <BrainCircuit size={24} />,
    },
    {
      number: '03',
      title: 'Desenvolvimento',
      description: 'Construção da solução com metodologias ágeis, foco em UX/UI e integração total de dados e IA.',
      icon: <Code2 size={24} />,
    },
    {
      number: '04',
      title: 'Evolução',
      description: 'Acompanhamento contínuo, suporte especializado e melhorias constantes para garantir o ROI.',
      icon: <TrendingUp size={24} />,
    },
  ];

  return (
    <section id="process" className="py-24 relative bg-cyber-black/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">Como <span className="text-gradient">Atuo?</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Um processo consultivo focado em resultados tangíveis e transparência total.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="glass rounded-xl p-8 hover:border-primary/30 transition-all duration-300 h-full">
                <div className="text-5xl font-bold text-cyber-gold/10 absolute top-4 right-6 group-hover:text-cyber-gold/20 transition-colors">
                  {step.number}
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 translate-y-1/2 z-10 text-cyber-gold/20">
                  <ArrowRight size={24} />
                </div>
              )}
            </motion.div>
          ))}
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

  return (
    <section id="resume" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">Experiência <span className="text-gradient">Profissional</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Uma jornada de aprendizado contínuo e conquistas profissionais</p>
        </motion.div>

        {/* Experience - Timeline Simplificada para Mobile First */}
        <div className="relative pl-8 md:pl-0">
          {/* Timeline line - left side on mobile, center on desktop - all gold */}
          <div className="absolute left-[18px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyber-gold via-cyber-gold to-cyber-gold md:-translate-x-1/2" />
          
          {experiences.map((exp, index) => {
            const isLeft = index % 2 === 0;
            const isExpanded = expandedId === exp.id;
            
            return (
              <motion.div 
                key={exp.id} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} 
                transition={{ delay: index * 0.1 }}
                className={`relative mb-8 last:mb-0`}
              >
                {/* Timeline dot - all gold, properly positioned */}
                <div className={`absolute left-[-18px] md:left-1/2 top-6 md:-translate-x-1/2 z-10 w-4 h-4`}>
                  <div className={`w-full h-full rounded-full border-2 border-cyber-black bg-cyber-gold ${exp.current ? 'shadow-lg shadow-cyber-gold/50 animate-pulse' : ''}`} />
                </div>
                
                {/* Card */}
                <div className={`
                  glass rounded-xl p-6 hover:border-primary/25 transition-all duration-300 cursor-pointer
                  ${isLeft ? 'md:w-[45%] md:mr-auto md:pr-8' : 'md:w-[45%] md:ml-auto md:pl-8'}
                `} onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}>
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
                  <p className={`text-muted-foreground text-sm leading-relaxed ${isExpanded ? 'mb-4' : 'line-clamp-2 mb-2'}`}>{exp.description}</p>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                          {exp.skills.map((skill) => (
                            <span key={skill} className="px-2.5 py-1 rounded-md bg-cyber-slate text-xs text-primary/80 border border-primary/15">{skill}</span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button className="text-primary/70 text-xs flex items-center gap-1 mt-3 hover:text-primary transition-colors">
                    {isExpanded ? 'Ver menos' : 'Ver mais'}
                    <ChevronDown size={13} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
        </div>
      </section>
  );
}

// ──────────────────────────────────────────────────────────────
// Education - Seção Independente
// ──────────────────────────────────────────────────────────────
function Education() {
  return (
    <section id="education" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">Formação <span className="text-gradient">Acadêmica</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Minha jornada educacional construindo a base do conhecimento</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {education.map((edu, index) => (
            <motion.div 
              key={edu.school} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} 
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl border border-white/10 hover:border-primary/25 transition-all duration-300 h-full p-5 md:p-6 group"
            >
              <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${edu.accent} p-4 mb-5`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_42%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-cyber-black/20 to-transparent" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ${edu.providerAccent}`}>
                      {edu.highlight}
                    </span>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/75 mt-4 mb-2">{edu.title}</p>
                    <h4 className="font-semibold text-lg text-white leading-snug">{edu.school}</h4>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white flex-shrink-0">
                    {edu.icon}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mb-4">
                <p className="text-foreground/90 font-medium text-sm md:text-base">{edu.degree}</p>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                  <Calendar size={12} className="text-primary" />
                  {edu.period}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <img src={edu.logo} alt={edu.school} className="h-9 max-w-[110px] object-contain rounded-lg bg-white/95 px-2 py-1" />
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="flex flex-col flex-1">
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{edu.description}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-white/10">
                  {edu.skills.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────
// Certifications - Carrossel
// ──────────────────────────────────────────────────────────────
function Certifications() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  return (
    <section id="certifications" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">Certificações <span className="text-gradient">Profissionais</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Credenciais que validam meu conhecimento e competências</p>
        </motion.div>

        <div className="relative">
          <button 
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-primary/15 hover:border-primary/25 transition-all hidden md:flex"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {certifications.map((cert, index) => (
                <motion.a 
                  key={cert.name}
                  initial={{ opacity: 0, scale: 0.95 }} 
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -6 }}
                  viewport={{ once: true }} 
                  transition={{ delay: index * 0.05 }}
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-80"
                >
                  <div className="glass rounded-2xl overflow-hidden border border-white/10 hover:border-primary/25 transition-all duration-300 h-full flex flex-col group">
                    <div className={`relative h-44 bg-gradient-to-br ${cert.accent}`}>
                      {cert.thumbnailUrl ? (
                        <>
                          <img
                            src={cert.thumbnailUrl}
                            alt={cert.name}
                            className="w-full h-full object-cover mix-blend-screen opacity-85 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-cyber-black/25 to-transparent" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_40%)]" />
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-4">
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase ${cert.providerAccent}`}>
                          {cert.provider}
                        </span>
                        <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-cyber-black/45 border border-white/10 text-white/85 backdrop-blur-sm">
                          {cert.icon}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="text-[11px] uppercase tracking-[0.22em] text-primary">{cert.format}</span>
                        <span className="text-xs text-muted-foreground">Credencial verificada</span>
                      </div>
                      <h4 className="font-semibold mb-3 line-clamp-2">{cert.name}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{cert.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {cert.skills.map((skill) => (
                          <span key={skill} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto space-y-4">
                        <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Credencial</p>
                          <p className="text-sm font-medium text-foreground/90">{cert.completionLabel || `ID ${cert.credentialId}`}</p>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-primary font-medium">Ver certificado</span>
                          <ExternalLink size={18} className="text-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          <button 
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-primary/15 hover:border-primary/25 transition-all hidden md:flex"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────
// Projects
// ──────────────────────────────────────────────────────────────
function Projects() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const GITHUB_USERNAME = 'Adriano-Lengruber';

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=9`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            description: repo.description || 'Sem descrição',
            language: repo.language || 'Code',
            languageColor: getLanguageColor(repo.language),
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url,
            topics: repo.topics || [],
          }));
          setRepos(mapped);
        } else {
          setRepos(repositories);
        }
        setLoading(false);
      })
      .catch(() => {
        setRepos(repositories);
        setLoading(false);
      });
  }, []);

  function getLanguageColor(lang: string | null): string {
    const colors: Record<string, string> = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      Python: '#3572A5',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Java: '#b07219',
      Go: '#00ADD8',
      Rust: '#dea584',
      'C++': '#f34b7d',
      C: '#555555',
      Ruby: '#701516',
      PHP: '#4F5D95',
      Swift: '#F05138',
      Kotlin: '#A97BFF',
      Shell: '#89e051',
    };
    return colors[lang || ''] || '#8b949e';
  }

  const displayRepos = repos.length > 0 ? repos : repositories;

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">Projetos no <span className="text-gradient">GitHub</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Repositórios públicos demonstrando minhas habilidades em desenvolvimento e ciência de dados</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Activity className="animate-spin" size={20} />
                Carregando repositórios...
              </div>
            </div>
          ) : (
            displayRepos.slice(0, 3).map((repo, index) => (
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
            ))
          )}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
        <a href="https://github.com/Adriano-Lengruber" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 glass rounded-lg font-medium hover:border-primary/30 hover:text-primary transition-all duration-200">
          Ver todos os repositórios <Github size={18} />
        </a>
      </motion.div>
    </section>
  );
}

function Blog() {
  const blogPatterns = [
    { from: 'from-cyber-gold/10', to: 'to-cyber-amber/5', accent: 'text-cyber-gold' },
    { from: 'from-cyber-steel/10', to: 'to-cyber-blue/5', accent: 'text-cyber-steel' },
    { from: 'from-cyber-emerald/10', to: 'to-teal-900/20', accent: 'text-cyber-emerald' },
    { from: 'from-primary/8', to: 'to-cyber-steel/5', accent: 'text-primary/70' },
  ];

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '/api';
        const res = await fetch(`${API_URL}/posts?limit=2`);
        const data = await res.json();
        if (res.ok && data.posts) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section id="blog" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold mb-4">Blog <span className="text-gradient">Comunitário</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Compartilhando conhecimento sobre dados, IA e tecnologia. Junte-se à comunidade!</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {loading ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              Carregando posts...
            </div>
          ) : posts.length > 0 ? (
            <>
            {posts.slice(0, 2).map((post, index) => {
              const pat = blogPatterns[index % blogPatterns.length];
              return (
                <motion.article key={post._id || post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                  className="glass rounded-xl overflow-hidden hover:border-primary/25 transition-all duration-300 group flex flex-col cursor-pointer"
                  onClick={() => window.location.href = `/blog?id=${post._id}`}>
                  <div className={`h-44 bg-gradient-to-br ${pat.from} ${pat.to} relative overflow-hidden blog-pattern group-hover:brightness-75 transition-all duration-300`}>
                    {post.imageUrl ? (
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`flex flex-col items-center gap-2 opacity-30 ${pat.accent}`}>
                          <BarChart3 size={48} strokeWidth={1} />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {post.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="px-2.5 py-1 rounded glass text-xs font-medium backdrop-blur-md text-primary">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-heading text-lg font-semibold mb-2 group-hover:text-primary transition-colors leading-snug">{post.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-1 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      <span>{post.readTime} leitura</span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
            </>
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              Nenhum post encontrado. <Link to="/blog" className="text-primary hover:underline">Seja o primeiro a publicar!</Link>
            </div>
          )}
        </div>

        {/* CTA to Blog Page */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <p className="text-muted-foreground max-w-lg">
              Junte-se à nossa comunidade de profissionais de dados. Compartilhe conhecimento, aprenda e cresça junto.
            </p>
            <Link to="/blog" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-semibold hover:from-primary/90 hover:to-primary/70 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:scale-105">
              <BookOpen size={20} />
              Explorar Blog Comunitário
              <ArrowRight size={18} />
            </Link>
            <p className="text-xs text-muted-foreground/60">
              ✓ Posts técnicos ✓ Tutoriais ✓ Discussões
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
// ──────────────────────────────────────────────────────────────
function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceSlug = params.get('service');
    if (!serviceSlug) return;

    const service = getSpecializedConsultingService(serviceSlug);
    if (!service) return;

    setFormData((prev) => {
      if (prev.subject || prev.message) return prev;
      return {
        ...prev,
        subject: `Interesse em ${service.title}`,
        message: `Ola, Adriano. Quero conversar sobre a consultoria "${service.title}". Meu contexto inicial e: `,
      };
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSending(true);

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Nao foi possivel enviar sua mensagem agora.');
      }

      setSent(true);
      setFormData({ name: '', email: '', whatsapp: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 5500);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Nao foi possivel enviar sua mensagem agora.');
    } finally {
      setSending(false);
    }
  };
  const up = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const contactInfo = [
    { icon: <Mail size={22} className="text-primary" />, bg: 'bg-primary/10', label: 'Email', content: <a href="mailto:contato@adriano-lengruber.com" className="text-muted-foreground hover:text-primary transition-colors text-sm">contato@adriano-lengruber.com</a> },
    { icon: <Phone size={22} className="text-cyber-steel" />, bg: 'bg-cyber-steel/10', label: 'Telefone', content: <a href="tel:+5521983300779" className="text-muted-foreground hover:text-primary transition-colors text-sm">(21) 98330-0779</a> },
    { icon: <MapPin size={22} className="text-cyber-emerald" />, bg: 'bg-cyber-emerald/10', label: 'Localização', content: <p className="text-muted-foreground text-sm">Natividade, Rio de Janeiro, Brasil</p> },
  ];
  const selectedService = typeof window !== 'undefined'
    ? getSpecializedConsultingService(new URLSearchParams(window.location.search).get('service') || '')
    : undefined;

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">Vamos <span className="text-gradient">Conversar</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Tem um projeto em mente? Entre em contato para discutirmos como posso ajudar.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Left side - Contact Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4 flex flex-col justify-between">
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
                  { href: 'https://www.instagram.com/adriano_lengruber/', icon: <Instagram size={19} />, label: 'Instagram' },
                  { href: 'https://wa.me/5521983300779', icon: <WhatsAppIcon size={19} />, label: 'WhatsApp' },
                ].map(({ href, icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-11 h-11 glass rounded-xl flex items-center justify-center hover:bg-primary/15 hover:border-primary/25 hover:text-primary transition-all duration-200 text-muted-foreground">
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass rounded-xl p-8 space-y-6 flex flex-col">
            <form onSubmit={handleSubmit} className="space-y-5">
              {selectedService && (
                <div className="rounded-lg border border-primary/20 bg-primary/8 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-primary mb-1">Consultoria selecionada</p>
                  <p className="text-sm text-foreground/90">Formulario preparado para <span className="font-semibold">{selectedService.title}</span>.</p>
                </div>
              )}
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
                <label htmlFor="whatsapp" className="block text-sm font-medium mb-2 text-muted-foreground">WhatsApp</label>
                <input type="tel" id="whatsapp" value={formData.whatsapp} onChange={up('whatsapp')}
                  className="w-full px-4 py-3 rounded-lg bg-cyber-black/50 border border-white/10 focus:border-primary/50 focus:outline-none transition-colors text-sm"
                  placeholder="(21) 98330-0779" required />
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
              {submitError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {submitError}
                </div>
              )}
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex flex-col items-center gap-3 py-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-cyber-emerald/15 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-cyber-emerald" />
                  </div>
                  <p className="font-semibold text-lg">Mensagem enviada!</p>
                  <p className="text-muted-foreground text-sm">Responderei em breve. Obrigado pelo contato 🙌</p>
                </motion.div>
              ) : (
                <button type="submit" disabled={sending}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-60">
                  {sending ? <Activity size={17} className="animate-spin" /> : <Send size={17} />}
                  {sending ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              )}
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
    <footer className="py-8 md:py-10 border-t border-white/6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3 self-center md:self-auto">
            <BrandMark className="h-10 w-auto" />
            <span className="text-muted-foreground text-sm">© {new Date().getFullYear()} Adriano Lengruber</span>
          </div>
          <div className="flex items-center gap-4 md:gap-6 text-sm text-muted-foreground self-center md:self-auto">
            <Link to="/privacidade" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">Privacidade</Link>
            <Link to="/termos" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">Termos</Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground self-center md:self-auto">
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
    <AuthProvider>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-cyber-black">
            <Navigation />
            <Hero />
            <About />
            <TechStack />
            <Services />
            <SpecializedConsulting />
            <Process />
            <Resume />
            <Education />
            <Certifications />
            <Projects />
            <Blog />
            <Contact />
            <Footer />
          </div>
        } />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/privacidade" element={<PrivacyPage />} />
        <Route path="/termos" element={<TermsPage />} />
        <Route path="/consultorias/:slug" element={<SpecializedConsultingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/portal/:id" element={<ClientPortal />} />
      </Routes>
    </AuthProvider>
  );
}
