import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Smartphone, Video, Monitor, MessageCircle, Star, CheckCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ParticleCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const COUNT = 55;
    type P = { x: number; y: number; vx: number; vy: number; r: number; o: number };
    let pts: P[] = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      pts = Array.from({ length: COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 1.8 + 0.8,
        o: Math.random() * 0.35 + 0.08,
      }));
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,43,255,${p.o})`;
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,43,255,${0.1 * (1 - d / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className={className} />;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const services = [
  {
    icon: <Monitor className="w-12 h-12" />,
    iconLarge: <Monitor className="w-16 h-16" />,
    title: "Sitios Corporativos",
    tag: "Presencia Digital",
    desc: "Páginas web a medida que transmiten autoridad y convierten visitantes en clientes.",
    subtitle: "Presentá tu empresa de forma profesional y generá confianza desde el primer momento.",
    body: "Desarrollamos sitios web corporativos completamente personalizados, con múltiples secciones para mostrar tus servicios, información institucional, portfolio, contacto y todo lo necesario para fortalecer tu presencia digital.\n\nCada sitio está diseñado para adaptarse a cualquier dispositivo, ofrecer una excelente experiencia de usuario y transmitir una imagen profesional de tu marca.",
    features: ["Diseño 100% personalizado", "Hasta 5 páginas completas", "Adaptado a móvil y escritorio", "Formulario de contacto integrado", "Integración con WhatsApp", "Optimización básica para buscadores"],
    price: "$13.900 UYU",
    monthly: "~$650 UYU / mes",
    monthlyNote: "Incluye hosting, dominio y pequeños cambios. El costo exacto se confirma al contactarnos.",
  },
  {
    icon: <Smartphone className="w-12 h-12" />,
    iconLarge: <Smartphone className="w-16 h-16" />,
    title: "Landing Pages",
    tag: "Alta Conversión",
    desc: "Embudos de alta conversión diseñados específicamente para tus campañas de anuncios.",
    subtitle: "Diseñada para captar la atención de tus potenciales clientes y convertir visitas en consultas o ventas.",
    body: "Creamos landing pages modernas, rápidas y optimizadas para dispositivos móviles y computadoras, enfocadas en generar resultados reales para tu negocio. Cada proyecto incluye diseño personalizado, formulario de contacto, integración con WhatsApp y optimización básica para buscadores.",
    features: ["Una página de alto impacto", "Diseño personalizado", "Optimización para móvil", "Formulario de contacto", "Integración con WhatsApp", "Entrega rápida"],
    price: "$7.900 UYU",
    monthly: "~$500 UYU / mes",
    monthlyNote: "Incluye hosting, dominio y pequeños cambios. El costo exacto se confirma al contactarnos.",
  },
  {
    icon: <Video className="w-12 h-12" />,
    iconLarge: <Video className="w-16 h-16" />,
    title: "Imágenes, Videos y Diseño",
    tag: "Contenido Visual",
    desc: "Contenido visual profesional para tus campañas: videos publicitarios, reels, logos y creatividades que generan impacto.",
    subtitle: "Potenciá la imagen de tu negocio con contenido visual profesional diseñado para captar la atención de tus clientes.",
    body: "Creamos imágenes publicitarias, videos promocionales y logos de alta calidad para redes sociales, campañas digitales y presentaciones de marca. Cada pieza se adapta a la identidad de tu negocio y está pensada para transmitir un mensaje claro, moderno y atractivo.\n\nIdeal para empresas, emprendedores, comercios y profesionales que buscan destacar en internet con contenido visual impactante.",
    features: ["Videos publicitarios profesionales", "Reels para redes sociales", "Imágenes creativas para anuncios", "Creación de logos e identidad visual", "Diseño gráfico a medida", "Entrega en dos días"],
    price: "Consultar",
    monthly: null,
    monthlyNote: "El precio varía según cantidad de piezas y características. Contactanos para una cotización.",
  },
];

function Home() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const active = selectedService !== null ? services[selectedService] : null;

  return (
    <div className="min-h-screen w-full bg-background overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-display font-black text-2xl tracking-tighter uppercase" data-testid="nav-logo">
            Píxel<span className="text-accent">.</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
            <a href="#services" className="hover:text-primary transition-colors" data-testid="nav-link-services">Servicios</a>
            <a href="#work" className="hover:text-primary transition-colors" data-testid="nav-link-work">Proyectos</a>
            <a href="https://wa.me/59892178756" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-primary text-white font-bold uppercase tracking-wide brutalist-border brutalist-shadow inline-flex items-center gap-2" data-testid="nav-cta">
              <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
              Escribinos
            </a>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 min-h-[90vh] flex flex-col justify-center relative overflow-hidden">
        <ParticleCanvas className="absolute inset-0 w-full h-full pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-8 relative z-10"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 bg-accent/10 border-2 border-accent px-4 py-2 w-fit">
              <Zap className="w-5 h-5 text-accent" />
              <span className="text-accent font-bold uppercase tracking-wider text-sm">Agencia de Diseño Web</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-6xl md:text-8xl font-black font-display leading-[0.9] text-balance">
              Diseño que <br/><span className="text-primary">Convierte.</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl text-muted-foreground max-w-xl font-medium">
              No hacemos plantillas aburridas. Creamos experiencias digitales eléctricas para negocios ambiciosos en toda Latinoamérica que exigen resultados.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-wrap gap-4 pt-4">
              <a href="#contact" className="px-8 py-4 bg-primary text-white font-black text-lg uppercase tracking-wide brutalist-border brutalist-shadow flex items-center gap-2" data-testid="hero-cta-primary">
                Iniciar Proyecto <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#work" className="px-8 py-4 bg-white text-foreground font-black text-lg uppercase tracking-wide brutalist-border hover:bg-gray-50 transition-colors" data-testid="hero-cta-secondary">
                Ver Trabajo
              </a>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-gray-100 brutalist-border brutalist-shadow overflow-hidden relative">
              <img 
                src="/hero.png" 
                alt="Abstract digital design" 
                className="w-full h-full object-cover"
                data-testid="hero-image"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/800x800/002BFF/FFFFFF?text=Pixel+Studio";
                }}
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-8 -left-8 bg-accent text-white p-6 brutalist-border brutalist-shadow z-20 hidden md:block">
              <div className="font-black text-4xl">100%</div>
              <div className="font-bold uppercase tracking-wider text-sm">Conversión<br/>Garantizada</div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Ticker Tape */}
      <div className="w-full overflow-hidden bg-foreground text-background py-4 brutalist-border border-l-0 border-r-0 rotate-1 transform-gpu my-20">
        <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-4 font-display font-black text-2xl uppercase">
              <span>Diseño Web</span>
              <Star className="w-6 h-6 text-accent fill-accent" />
              <span>Videos Publicitarios</span>
              <Star className="w-6 h-6 text-accent fill-accent" />
            </div>
          ))}
        </div>
      </div>
      {/* Services Section */}
      <section id="services" className="py-24 px-6 bg-secondary/30 relative overflow-hidden">
        <ParticleCanvas className="absolute inset-0 w-full h-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div>
              <h2 className="md:text-7xl font-black font-display mb-6 text-[79px]">Nuestros<br/>Servicios.</h2>
              <p className="text-xl text-muted-foreground max-w-md font-medium">
                Todo lo que necesitas para dominar tu nicho digital. Sin relleno, solo impacto.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.button
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                onClick={() => setSelectedService(i)}
                className="relative bg-white rounded-3xl p-10 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group text-left w-full cursor-pointer overflow-hidden border-2 border-black/[0.05] hover:border-primary"
                data-testid={`service-card-${i}`}
              >
                {/* big background number */}
                <span className="absolute -bottom-4 -right-2 text-[9rem] font-black text-black/[0.04] leading-none select-none font-display pointer-events-none">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* icon — free floating, no box */}
                <div className="text-primary mb-7 relative z-10 group-hover:scale-110 transition-transform duration-300 origin-left">
                  {service.icon}
                </div>

                <h3 className="text-2xl font-black font-display mb-3 relative z-10">{service.title}</h3>
                <p className="text-muted-foreground font-medium mb-7 relative z-10 leading-relaxed">{service.desc}</p>
                <span className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm group-hover:gap-3 transition-all relative z-10">
                  Ver más <ArrowRight className="w-4 h-4" />
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>
      {/* Service Detail Modal */}
      <Dialog open={selectedService !== null} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent
          className="max-w-3xl w-full p-0 overflow-hidden border-0 shadow-2xl rounded-2xl gap-0"
          aria-describedby={undefined}
          data-testid="service-modal"
        >
          {active && (
            <div className="flex flex-col md:flex-row min-h-[520px]">

              {/* LEFT — dark panel */}
              <div className="relative md:w-2/5 bg-[#0a0a0f] flex flex-col justify-between p-8 overflow-hidden">
                {/* decorative circles */}
                <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-accent/15 blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-400 border border-blue-400/40 rounded-full mb-6">
                    {active.tag}
                  </span>
                  <DialogHeader>
                    <DialogTitle className="text-white font-black font-display text-2xl leading-tight text-left mb-4">
                      {active.title}
                    </DialogTitle>
                  </DialogHeader>
                  <p className="text-white/60 text-sm leading-relaxed">{active.subtitle}</p>
                </div>

                {/* price block */}
                <div className="relative z-10 mt-8">
                  <div className="border-t border-white/10 pt-6">
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Precio del proyecto</p>
                    <p className="text-white font-black font-display text-3xl">{active.price}</p>
                    {active.monthly && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                        <span className="text-white/50 text-xs">{active.monthly} estimado</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* large icon watermark */}
                <div className="absolute bottom-6 right-6 text-white/5 pointer-events-none">
                  {active.iconLarge}
                </div>
              </div>

              {/* RIGHT — content panel */}
              <div className="md:w-3/5 bg-white flex flex-col p-8">
                <div className="flex-1 space-y-6">
                  {active.body.split("\n\n").map((para, j) => (
                    <p key={j} className="text-gray-600 text-sm leading-relaxed">{para}</p>
                  ))}

                  {/* features grid */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Incluye</p>
                    <ul className="grid grid-cols-1 gap-2">
                      {active.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* monthly note */}
                  <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed border border-gray-100">
                    {active.monthlyNote}
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="#contact"
                  onClick={() => setSelectedService(null)}
                  className="mt-6 flex items-center justify-center gap-2 w-full px-6 py-4 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-primary/30"
                  data-testid="service-modal-cta"
                >
                  Consultar ahora <ArrowRight className="w-4 h-4" />
                </a>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Work Section */}
      <section id="work" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="md:text-7xl font-black font-display mb-16 text-center text-[79px]">Últimos<br/>Proyectos.</h2>
          
          <div className="space-y-32">
            {[
              {
                img: "/portfolio-gopet.png",
                title: "Go Pet",
                type: "Landing Page",
                desc: "Landing page moderna y atractiva para una marca de productos para mascotas.",
                fallback: "https://placehold.co/1200x800/111827/FFFFFF?text=Go+Pet",
                url: "https://gopet-wine.vercel.app/"
              },
              {
                img: "/portfolio-sandy.png",
                title: "Sandy Lane",
                type: "Sitio Corporativo",
                desc: "Presencia digital elegante y funcional para una marca de alto nivel.",
                fallback: "https://placehold.co/1200x800/002BFF/FFFFFF?text=Sandy+Lane",
                url: "https://sandy-lane.com"
              }
            ].map((work, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}
                data-testid={`portfolio-item-${i}`}
              >
                <div className="w-full md:w-3/5">
                  <div className="bg-gray-100 brutalist-border brutalist-shadow overflow-hidden group">
                    <img
                      src={work.img}
                      alt={work.title}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.currentTarget.src = work.fallback; }}
                    />
                  </div>
                </div>
                <div className="w-full md:w-2/5 flex flex-col items-start">
                  <div className="px-4 py-2 border-2 border-foreground font-bold uppercase tracking-wider text-sm mb-6">
                    {work.type}
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black font-display mb-6">{work.title}</h3>
                  <p className="text-xl text-muted-foreground font-medium mb-8">{work.desc}</p>
                  <a
                    href={work.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold uppercase tracking-widest text-primary hover:text-accent flex items-center gap-2 group transition-colors"
                  >
                    Ir a sitio web <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-foreground text-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black font-display mb-16 text-center text-white">Impacto<br/>Real.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "Increíble nivel de detalle. El sitio no solo se ve de clase mundial, sino que duplicó nuestros leads semanales.", name: "Carlos Mendoza", role: "Fundador, TechNova" },
              { quote: "Píxel entendió nuestra visión inmediatamente. El sitio es moderno, rápido y nuestros clientes lo notan desde el primer clic.", name: "Sofía Arango", role: "CEO, Aura Fashion" },
              { quote: "La mejor inversión en marketing del año. Trabajar con ellos es rápido, directo y el resultado es impecable.", name: "Diego Torres", role: "Director, Metrics B2B" }
            ].map((testimonial, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="bg-card/10 p-10 border-2 border-white/20 hover:border-accent hover:-translate-y-2 transition-all duration-300"
                data-testid={`testimonial-card-${i}`}
              >
                <Star className="w-10 h-10 text-accent fill-accent mb-6" />
                <p className="text-xl font-medium mb-8 text-white/90">"{testimonial.quote}"</p>
                <div>
                  <div className="font-bold uppercase tracking-wider text-white">{testimonial.name}</div>
                  <div className="text-sm text-white/60 mt-1">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA / Contact Section */}
      <section id="contact" className="py-32 px-6 bg-primary text-white border-y-2 border-foreground">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-6xl md:text-9xl font-black font-display mb-8 tracking-tighter leading-none">
              ¿Listo para<br/>Empezar?
            </h2>
            <p className="text-xl md:text-2xl font-medium mb-12 text-white/80 max-w-2xl">
              Escribinos un mensaje sin compromiso y te armamos un boceto para que veas cómo se vería tu proyecto.
            </p>
            <a 
              href="https://wa.me/59892178756" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-4 px-10 py-6 bg-white text-foreground font-black text-xl uppercase tracking-wide brutalist-border hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.4)] transition-all duration-300"
              data-testid="footer-cta"
            >
              <MessageCircle className="w-7 h-7" /> Escribinos
            </a>
          </motion.div>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-12 px-6 bg-background border-t-2 border-foreground">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-display font-black text-2xl tracking-tighter uppercase">
            Píxel<span className="text-accent">.</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="font-medium text-muted-foreground text-center md:text-right">
              © 2024 Estudio Píxel. Diseño radical para marcas latinas.
            </p>
            <a href="mailto:alfonso12.taro@gmail.com" className="text-sm text-primary font-semibold hover:underline">
              alfonso12.taro@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
