import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Mail, Shield, Sparkles } from 'lucide-react';
import brandLogo from '../../Imgs/Logos_Formacoes/LOGO01.png';

const sections = [
  {
    title: '1. Aceitação dos termos',
    paragraphs: [
      'Ao acessar e utilizar este site, você concorda com estes Termos de Uso e com a Política de Privacidade vigente. Se não concordar com qualquer condição, o recomendado é não utilizar os serviços e conteúdos disponibilizados nesta plataforma.'
    ]
  },
  {
    title: '2. Finalidade do site',
    paragraphs: [
      'O site tem caráter institucional, informativo, comercial e educacional. Ele apresenta o portfólio profissional de Adriano Lengruber, serviços prestados, conteúdos técnicos, canais de contato e, quando aplicável, áreas autenticadas e recursos complementares.'
    ]
  },
  {
    title: '3. Uso adequado da plataforma',
    paragraphs: [
      'Você concorda em utilizar o site de forma lícita, ética e compatível com sua finalidade. Não é permitido tentar comprometer a estabilidade, a segurança, a reputação, o desempenho ou a integridade técnica da plataforma.'
    ],
    bullets: [
      'Não praticar coleta automatizada abusiva de dados.',
      'Não tentar acessar áreas restritas sem autorização.',
      'Não enviar conteúdo malicioso, ofensivo, fraudulento ou ilegal.',
      'Não usar o site para violar direitos de terceiros.'
    ]
  },
  {
    title: '4. Conteúdo e propriedade intelectual',
    paragraphs: [
      'Salvo quando indicado de outra forma, textos, estrutura visual, marcas, elementos gráficos, código, materiais autorais e demais conteúdos deste site pertencem a Adriano Lengruber ou são utilizados sob autorização/licença adequada.',
      'A reprodução, redistribuição, modificação ou exploração comercial sem autorização prévia e expressa não é permitida.'
    ]
  },
  {
    title: '5. Conteúdo publicado no blog',
    paragraphs: [
      'Os artigos, análises e materiais do blog têm finalidade educativa e informativa. Embora sejam produzidos com critério técnico, eles não substituem diagnóstico individual, consultoria formal, parecer jurídico, contábil ou decisão empresarial específica.',
      'Toda aplicação prática deve considerar contexto, maturidade operacional, orçamento, riscos, segurança e objetivos do negócio.'
    ]
  },
  {
    title: '6. Áreas autenticadas e contas de usuário',
    paragraphs: [
      'Recursos que exijam autenticação dependem de credenciais válidas. O usuário é responsável por manter seus dados de acesso sob sigilo e por toda atividade realizada em sua conta, salvo prova de uso indevido por terceiros.'
    ],
    bullets: [
      'Forneça informações verídicas no cadastro.',
      'Proteja suas credenciais e dispositivos.',
      'Comunique imediatamente qualquer suspeita de acesso indevido.'
    ]
  },
  {
    title: '7. Disponibilidade e limitações',
    paragraphs: [
      'Busca-se manter o site estável e disponível, mas não existe garantia de operação ininterrupta, livre de falhas, indisponibilidades temporárias, manutenção programada ou eventos externos de infraestrutura.'
    ]
  },
  {
    title: '8. Links e serviços de terceiros',
    paragraphs: [
      'O site pode apontar para serviços, redes sociais, plataformas e ferramentas de terceiros. Esses ambientes possuem regras próprias, e o uso deles é de responsabilidade do usuário.'
    ]
  },
  {
    title: '9. Limitação de responsabilidade',
    paragraphs: [
      'Na máxima extensão permitida pela legislação aplicável, não há responsabilidade por danos indiretos, lucros cessantes, perda de oportunidade, indisponibilidade de terceiros ou decisões tomadas exclusivamente com base no conteúdo publicado no site.'
    ]
  },
  {
    title: '10. Alterações destes termos',
    paragraphs: [
      'Os Termos de Uso podem ser revisados a qualquer momento para refletir mudanças legais, técnicas, comerciais ou operacionais. O uso continuado do site após atualização representa ciência da versão vigente.'
    ]
  },
  {
    title: '11. Foro e legislação aplicável',
    paragraphs: [
      'Estes termos são regidos pela legislação brasileira. Sempre que possível, eventuais questões serão resolvidas de forma amigável. Persistindo controvérsia, aplica-se o foro competente nos termos da lei.'
    ]
  }
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cyber-black">
      <header className="glass border-b border-white/10 sticky top-0 z-40">
        <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 text-primary hover:text-primary/80 transition-colors">
            <img src={brandLogo} alt="Adriano Lengruber" className="h-10 w-auto" />
            <span className="inline-flex items-center gap-2">
              <ArrowLeft size={18} />
              <span>Voltar ao site</span>
            </span>
          </Link>
          <Link to="/privacidade" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Ver Política de Privacidade
          </Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-14">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary mb-6">
            <FileText size={16} />
            Regras de Uso da Plataforma
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-5">
            Termos de <span className="text-gradient">Uso</span>
          </h1>
          <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
            Condições que regulam o acesso ao site, ao conteúdo publicado e aos recursos
            disponibilizados na plataforma.
          </p>
          <p className="text-sm text-muted-foreground/80 mt-4">
            Última atualização: 14 de abril de 2026.
          </p>
        </motion.div>

        <div className="grid gap-6">
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="glass rounded-2xl p-6 md:p-8"
            >
              <h2 className="font-heading text-2xl font-semibold mb-4">{section.title}</h2>
              <div className="space-y-4 text-muted-foreground leading-7">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul className="space-y-2 text-muted-foreground">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.section>
          ))}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 md:p-8 mt-8"
        >
          <h2 className="font-heading text-2xl font-semibold mb-4">Boas práticas e contato</h2>
          <div className="space-y-4 text-muted-foreground leading-7">
            <p className="flex items-start gap-3">
              <Shield size={16} className="text-primary mt-1" />
              <span>Use o site de forma responsável, respeitando segurança, propriedade intelectual e a experiência dos demais usuários.</span>
            </p>
            <p className="flex items-start gap-3">
              <Sparkles size={16} className="text-primary mt-1" />
              <span>Se tiver interesse comercial, quiser licenciar conteúdo ou solicitar autorização de uso, entre em contato.</span>
            </p>
            <p className="flex items-center gap-3">
              <Mail size={16} className="text-primary" />
              <a href="mailto:contato@adriano-lengruber.com" className="hover:text-primary transition-colors">
                contato@adriano-lengruber.com
              </a>
            </p>
          </div>
        </motion.section>

        <footer className="mt-10 pt-8 border-t border-white/8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Adriano Lengruber. Todos os direitos reservados.</p>
          <div className="flex items-center gap-5">
            <Link to="/" className="hover:text-primary transition-colors">Página inicial</Link>
            <Link to="/privacidade" className="hover:text-primary transition-colors">Privacidade</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
