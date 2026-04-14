import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Brackets,
  CheckCircle2,
  Gauge,
  HardDrive,
  Mail,
  Phone,
  Server,
} from 'lucide-react';
import brandLogo from '../../Imgs/Logos_Formacoes/LOGO01.png';
import {
  getSpecializedConsultingService,
  specializedConsultingServices,
  type SpecializedConsultingService,
} from '../data/specializedConsulting';

function serviceIcon(service: SpecializedConsultingService) {
  const common = { size: 28, className: service.iconColor };

  switch (service.iconKey) {
    case 'workstation':
      return <HardDrive {...common} />;
    case 'vps':
      return <Server {...common} />;
    case 'developer':
      return <Brackets {...common} />;
    case 'bi':
      return <Gauge {...common} />;
    default:
      return <CheckCircle2 {...common} />;
  }
}

function serviceMessage(service: SpecializedConsultingService) {
  return encodeURIComponent(`Olá, Adriano. Quero conversar sobre a consultoria "${service.title}".`);
}

export default function SpecializedConsultingPage() {
  const { slug = '' } = useParams();
  const service = getSpecializedConsultingService(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!service) {
    return (
      <div className="min-h-screen bg-cyber-black text-foreground">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar para a home
          </Link>
          <h1 className="font-heading text-4xl font-bold mt-8 mb-4">Consultoria não encontrada</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Esta rota não existe mais ou foi digitada incorretamente. Use a página inicial para acessar as consultorias disponíveis.
          </p>
        </div>
      </div>
    );
  }

  const relatedServices = specializedConsultingServices.filter((item) => item.slug !== service.slug);

  return (
    <div className="min-h-screen bg-cyber-black text-foreground">
      <header className="border-b border-white/10 bg-cyber-black/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={brandLogo} alt="Adriano Lengruber" className="h-10 w-auto" />
            <div>
              <p className="font-semibold tracking-wide">Adriano Lengruber</p>
              <p className="text-xs text-muted-foreground">Consultoria em Solucoes Inteligentes</p>
            </div>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar para a home
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `linear-gradient(135deg, rgba(5,8,12,0.55), rgba(5,8,12,0.9)), url(${service.cover})` }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(30,144,255,0.16),_transparent_45%)]" />
          <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="max-w-4xl">
              <div className={`inline-flex items-center gap-3 rounded-full border border-white/10 px-4 py-2 ${service.iconBg} mb-6`}>
                {serviceIcon(service)}
                <span className="text-sm font-medium text-muted-foreground">{service.audience}</span>
              </div>
              <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-6">{service.title}</h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">{service.description}</p>

              <div className="flex flex-wrap gap-3 mt-8">
                {service.badges.map((badge) => (
                  <span key={badge} className="px-3 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-muted-foreground">
                    {badge}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mt-10">
                <a
                  href={`https://wa.me/5521983300779?text=${serviceMessage(service)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all"
                >
                  Conversar sobre esta consultoria
                  <ArrowRight size={18} />
                </a>
                <Link
                  to={`/?service=${service.slug}#contact`}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 rounded-lg font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                >
                  Ir para formulario guiado
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 space-y-8">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-stretch">
              <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl border border-white/10 p-8 md:p-10 h-full">
                <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Como eu conduzo</p>
                <h2 className="font-heading text-3xl font-bold mb-6 max-w-2xl">Entrega orientada ao contexto real do cliente</h2>
                <div className="space-y-4">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className={`mt-1 flex-shrink-0 ${service.iconColor}`} />
                      <p className="text-base text-muted-foreground leading-relaxed">{feature}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.aside initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6 h-full">
                <div className="glass rounded-3xl border border-white/10 p-7 md:p-8 h-full">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Ideal para</p>
                  <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">{service.idealFor}</p>
                </div>
                <div className="glass rounded-3xl border border-white/10 p-7 md:p-8 h-full">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Entregavel esperado</p>
                  <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">{service.deliverable}</p>
                </div>
              </motion.aside>
            </div>

            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-stretch">
              <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl border border-white/10 p-8 md:p-10 h-full">
                <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">{service.miniCaseTitle}</p>
                <h2 className="font-heading text-3xl font-bold mb-5 max-w-2xl">Onde essa consultoria costuma gerar valor primeiro</h2>
                <p className="text-base text-muted-foreground leading-relaxed">{service.miniCaseDescription}</p>
              </motion.div>

              <motion.aside initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6 h-full">
                <div className="glass rounded-3xl border border-white/10 p-7 md:p-8">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Resultado esperado</p>
                  <div className="space-y-3">
                    {service.outcomes.map((outcome) => (
                      <div key={outcome} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className={`mt-1 flex-shrink-0 ${service.iconColor}`} />
                        <p className="text-sm text-muted-foreground leading-relaxed">{outcome}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass rounded-3xl border border-white/10 p-7 md:p-8">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Indicadores de impacto</p>
                  <div className="space-y-3">
                    {service.miniCaseMetrics.map((metric, index) => (
                      <div key={metric} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-primary/75 mb-2">Sinal {index + 1}</p>
                        <p className="text-sm font-medium leading-relaxed text-foreground/90">{metric}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl border border-white/10 p-8 md:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="max-w-3xl">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Proximo passo</p>
                  <h2 className="font-heading text-3xl font-bold mb-4">{service.ctaTitle}</h2>
                  <p className="text-muted-foreground leading-relaxed">{service.ctaDescription}</p>
                </div>
                <div className="space-y-4">
                  <a
                    href={`https://wa.me/5521983300779?text=${serviceMessage(service)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all"
                  >
                    Falar no WhatsApp
                    <ArrowRight size={18} />
                  </a>
                  <Link
                    to={`/?service=${service.slug}#contact`}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 rounded-lg font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                  >
                    <Mail size={18} />
                    Abrir formulario
                  </Link>
                  <a
                    href="tel:+5521983300779"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 rounded-lg font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                  >
                    <Phone size={18} />
                    Ligar agora
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Outras frentes</p>
                <h2 className="font-heading text-3xl font-bold">Consultorias relacionadas</h2>
              </div>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Ver home completa
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedServices.map((item) => (
                <Link
                  key={item.slug}
                  to={`/consultorias/${item.slug}`}
                  className={`glass rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:-translate-y-1 ${item.border}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.iconBg}`}>
                    {serviceIcon(item)}
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                    Abrir consultoria
                    <ArrowRight size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
