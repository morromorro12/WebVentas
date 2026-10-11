import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import NotFound from "@/pages/not-found";
import { Hero } from "@/components/hero";
import { Statement } from "@/components/statement";
import { Services } from "@/components/services";
import { Reviews } from "@/components/reviews";
import { Contact, Manifesto } from "@/components/closing";

const queryClient = new QueryClient();

function Home() {
  return (
    <div className="min-h-screen w-full bg-background overflow-x-clip selection:bg-primary selection:text-white">
      <Hero />
      <Statement />
      <Services />
      {/* Work Section */}
      <section id="work" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="md:text-7xl font-black font-display mb-16 text-center text-[79px]">Últimos<br/>Proyectos.</h2>
          
          <div className="space-y-32">
            {[
              {
                img: "/portfolio-gopet",
                title: "Go Pet",
                type: "Landing Page",
                desc: "Landing page moderna y atractiva para una marca de productos para mascotas.",
                fallback: "https://placehold.co/1200x800/111827/FFFFFF?text=Go+Pet",
                url: "https://gopet-wine.vercel.app/"
              },
              {
                img: "/portfolio-puntolimpio",
                title: "Punto Limpio",
                type: "Catálogo de Pedidos",
                desc: "Catálogo online de productos de limpieza con carrito y envío del pedido directo por WhatsApp.",
                fallback: "https://placehold.co/1200x800/002BFF/FFFFFF?text=Punto+Limpio",
                url: "https://puntolimpio-uy.vercel.app/"
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
                    {/* loading va antes que src/srcSet: si no, el navegador arranca la descarga antes de ver el lazy */}
                    <img
                      loading="lazy"
                      decoding="async"
                      srcSet={[640, 1024, 1536].map((w) => `${work.img}-${w}.webp ${w}w`).join(", ")}
                      sizes="(min-width: 1328px) 740px, (min-width: 768px) 60vw, 100vw"
                      src={`${work.img}-1024.webp`}
                      width={1536}
                      height={1024}
                      alt={work.title}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.currentTarget.srcset = ""; e.currentTarget.src = work.fallback; }}
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
      {/* Creative Gallery Section */}
      <section className="py-32 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="md:text-7xl font-black font-display mb-6 text-[79px]">Diseño y<br/>Branding.</h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto font-medium">
              Diseño gráfico, imágenes publicitarias y contenido visual creado para distintas marcas.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { img: "https://res.cloudinary.com/dhfwi0myn/image/upload/v1783528134/899364F2-B5AE-4F9F-8741-4049B8E17A1C_jzbxv9.png", tag: "Diseño Publicitario" },
              { img: "https://res.cloudinary.com/dhfwi0myn/image/upload/v1783528094/ChatGPT_Image_6_mar_2026_17_34_32_t5thxc.png", tag: "Logo" },
              { img: "https://res.cloudinary.com/dhfwi0myn/image/upload/v1783528053/ad_sin_precio_e1epob.png", tag: "Diseño Publicitario" },
              { img: "https://res.cloudinary.com/dhfwi0myn/image/upload/v1783527987/razas_pequenas_lager_100_kaxukb.png", tag: "Productos" },
              { img: "https://res.cloudinary.com/dhfwi0myn/image/upload/v1783527986/Lager_senior_100_FINAL_n8srfl.png", tag: "Productos" },
              { img: "https://res.cloudinary.com/dhfwi0myn/image/upload/v1783527986/Maxine_adulto_final_100_cak23s.png", tag: "Productos" },
            ].map((piece, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300"
                data-testid={`gallery-item-${i}`}
              >
                <img
                  src={piece.img}
                  alt={piece.tag}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-4 left-4 text-white font-bold uppercase tracking-wider text-xs opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  {piece.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Reviews />
      <Contact />
      <Manifesto />
      {/* Footer */}
      <footer className="py-12 px-6 bg-background border-t-2 border-foreground">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-display font-black text-2xl tracking-tighter uppercase">
            Píxel<span className="text-accent">.</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="font-medium text-muted-foreground text-center md:text-right">
              © 2025 Estudio Píxel. Agencia de diseño y marketing digital, Uruguay.
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
