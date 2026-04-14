import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Mail, MapPin, ShieldCheck } from 'lucide-react';
import brandLogo from '../../Imgs/Logos_Formacoes/LOGO01.png';

const sections = [
  {
    title: '1. Visão geral',
    paragraphs: [
      'Esta Política de Privacidade explica como os dados pessoais são tratados ao navegar pelo site adriano-lengruber.com, enviar mensagens pelo formulário de contato e interagir com conteúdos publicados na plataforma.',
      'O compromisso central é simples: coletar apenas o que é necessário para operação, relacionamento profissional, resposta a contatos recebidos e melhoria contínua da experiência digital.'
    ]
  },
  {
    title: '2. Dados que podem ser coletados',
    paragraphs: [
      'Dependendo da forma de uso do site, podem ser tratados dados como nome, e-mail, WhatsApp, assunto e mensagem enviados pelo formulário de contato.',
      'Também podem existir dados técnicos mínimos para funcionamento e segurança, como endereço IP, tipo de navegador, páginas acessadas, horários de acesso e registros de erro ou integridade da aplicação.'
    ],
    bullets: [
      'Dados fornecidos diretamente por você no formulário.',
      'Dados de navegação necessários para desempenho, segurança e diagnóstico.',
      'Informações técnicas relacionadas a autenticação e uso do blog comunitário, quando aplicável.'
    ]
  },
  {
    title: '3. Finalidades do tratamento',
    paragraphs: [
      'Os dados são utilizados para responder solicitações comerciais, apresentar propostas, realizar contato profissional, manter histórico básico de atendimento e melhorar os serviços e conteúdos publicados.',
      'Quando você envia uma mensagem, as informações podem ser armazenadas no sistema e encaminhadas por e-mail para garantir que o contato seja recebido e acompanhado corretamente.'
    ],
    bullets: [
      'Responder contatos e pedidos de orçamento.',
      'Organizar atendimento comercial e técnico.',
      'Manter segurança, estabilidade e rastreabilidade operacional.',
      'Aprimorar conteúdo, navegação e comunicação do site.'
    ]
  },
  {
    title: '4. Base legal',
    paragraphs: [
      'O tratamento pode ocorrer com base em execução de procedimentos preliminares relacionados a contrato, legítimo interesse para atendimento e segurança, cumprimento de obrigações legais e, quando cabível, consentimento do titular.'
    ]
  },
  {
    title: '5. Compartilhamento de dados',
    paragraphs: [
      'Os dados não são comercializados. O compartilhamento, quando necessário, ocorre apenas com provedores de infraestrutura, hospedagem, e-mail, banco de dados, autenticação, segurança ou ferramentas indispensáveis para a operação do site e do atendimento.',
      'Esses operadores atuam dentro dos limites técnicos necessários para prestação do serviço.'
    ]
  },
  {
    title: '6. Cookies e tecnologias semelhantes',
    paragraphs: [
      'O site pode utilizar recursos técnicos equivalentes a cookies para manter sessões, melhorar desempenho, facilitar autenticação e compreender o uso geral da plataforma.',
      'Você pode administrar parte dessas preferências diretamente no navegador, embora algumas funcionalidades possam ser impactadas.'
    ]
  },
  {
    title: '7. Retenção e segurança',
    paragraphs: [
      'Os dados são mantidos pelo tempo necessário para cumprir as finalidades descritas, respeitando necessidades operacionais, segurança da informação, histórico de atendimento e eventuais obrigações legais.',
      'São adotadas medidas técnicas e organizacionais razoáveis para proteger informações contra acesso não autorizado, perda, alteração indevida ou uso abusivo.'
    ]
  },
  {
    title: '8. Direitos do titular',
    paragraphs: [
      'Nos termos da legislação aplicável, especialmente a LGPD, você pode solicitar confirmação do tratamento, acesso, correção, anonimização, eliminação quando cabível, portabilidade e informações sobre compartilhamento, observadas as limitações legais e técnicas.'
    ],
    bullets: [
      'Confirmar se existe tratamento de dados.',
      'Acessar e corrigir informações.',
      'Solicitar revisão, bloqueio ou exclusão quando aplicável.',
      'Revogar consentimento, quando esta for a base legal utilizada.'
    ]
  },
  {
    title: '9. Links externos',
    paragraphs: [
      'O site pode conter links para redes sociais, plataformas terceiras e outros ambientes externos. Cada serviço possui suas próprias práticas de privacidade, pelas quais este site não se responsabiliza.'
    ]
  },
  {
    title: '10. Atualizações desta política',
    paragraphs: [
      'Esta política pode ser atualizada a qualquer momento para refletir mudanças legais, técnicas ou operacionais. A versão vigente será sempre a disponível nesta página.'
    ]
  }
];

export default function PrivacyPage() {
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
          <Link to="/termos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Ver Termos de Uso
          </Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-14">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary mb-6">
            <ShieldCheck size={16} />
            Privacidade e Proteção de Dados
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-5">
            Política de <span className="text-gradient">Privacidade</span>
          </h1>
          <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
            Transparência no tratamento de dados, foco em uso responsável das informações e respeito
            aos direitos do titular em toda interação realizada pelo site.
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
          <h2 className="font-heading text-2xl font-semibold mb-4">Contato sobre privacidade</h2>
          <div className="space-y-3 text-muted-foreground leading-7">
            <p>
              Para exercer direitos, esclarecer dúvidas ou tratar qualquer assunto relacionado a esta
              política, utilize os canais abaixo:
            </p>
            <p className="flex items-center gap-3">
              <Mail size={16} className="text-primary" />
              <a href="mailto:contato@adriano-lengruber.com" className="hover:text-primary transition-colors">
                contato@adriano-lengruber.com
              </a>
            </p>
            <p className="flex items-center gap-3">
              <MapPin size={16} className="text-primary" />
              <span>Natividade, Rio de Janeiro, Brasil</span>
            </p>
          </div>
        </motion.section>

        <footer className="mt-10 pt-8 border-t border-white/8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Adriano Lengruber. Todos os direitos reservados.</p>
          <div className="flex items-center gap-5">
            <Link to="/" className="hover:text-primary transition-colors">Página inicial</Link>
            <Link to="/termos" className="hover:text-primary transition-colors">Termos de uso</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
