import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { ArrowRight, Smartphone, Video, Monitor, MessageCircle, Star, CheckCircle, Workflow, Megaphone } from "lucide-react";
import NotFound from "@/pages/not-found";
import { Hero } from "@/components/hero";

const queryClient = new QueryClient();

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const services = [
  {
    icon: <Monitor className="w-10 h-10 md:w-12 md:h-12" />,
    iconLarge: <Monitor className="w-16 h-16" />,
    title: "Páginas Web",
    tag: "Sitio completo",
    desc: "El sitio de tu empresa: tus servicios, tus trabajos y tus datos de contacto en un solo lugar.",
    subtitle: "Para cuando alguien te busca en internet y querés que encuentre algo serio.",
    body: "Armamos el sitio con las secciones que tu negocio necesite: inicio, servicios, quiénes somos, trabajos hechos y contacto. El diseño se hace en base a tu marca y a lo que vendés, no sobre una plantilla.\n\nSe ve bien en celular y en computadora, y lo dejamos andando con hosting y dominio. Después, si querés cambiar un texto, una foto o un precio, nos escribís y lo hacemos nosotros.",
    features: ["Diseño hecho desde cero", "Hasta 5 páginas", "Se ve bien en celular", "Formulario de contacto", "Botón de WhatsApp", "Configurado para aparecer en Google"],
    price: "$13.900 UYU",
    monthly: "~$650 UYU / mes",
    monthlyNote: "El mensual cubre hosting, dominio y los cambios chicos que vayas pidiendo. El número exacto lo cerramos cuando hablemos.",
    hidePrice: true,
  },
  {
    icon: <Megaphone className="w-10 h-10 md:w-12 md:h-12" />,
    iconLarge: <Megaphone className="w-16 h-16" />,
    title: "Anuncios en Redes",
    tag: "Instagram y Facebook",
    desc: "Manejamos tus campañas: probamos varios anuncios, miramos cuál trae consultas y dejamos ese corriendo.",
    subtitle: "Nos hacemos cargo de la pauta entera: a quién le hablamos, qué le mostramos y dónde va el presupuesto.",
    body: "Antes de poner un peso miramos el terreno: quién te compra, qué está haciendo la competencia de tu rubro y qué anuncios les están funcionando hoy. Con eso definimos el mensaje y los públicos a los que vale la pena mostrárselo.\n\nDespués producimos las piezas (imagen, video y texto) y salimos con varias versiones al mismo tiempo. A los pocos días los números muestran cuál rinde: cortamos las que no y movemos el presupuesto a la que sí. Una vez por mes te pasamos qué se gastó, cuántas consultas entraron y cuánto costó cada una.",
    features: ["Estudio del rubro y de la competencia", "Armado de los públicos", "Creación de las piezas: imagen, video y texto", "Varias versiones compitiendo entre sí", "El presupuesto va a la que mejor rinde", "Reporte mensual con los números"],
    price: "Consultar",
    monthly: null,
    monthlyNote: "Se cobra un fijo mensual por el manejo, aparte de la plata que pongas en la pauta. Depende de cuántas campañas y cuántas piezas lleve por mes.",
  },
  {
    icon: <Smartphone className="w-10 h-10 md:w-12 md:h-12" />,
    iconLarge: <Smartphone className="w-16 h-16" />,
    title: "Landing Pages",
    tag: "Una sola página",
    desc: "Una página sola y directa, para que el que llega desde un anuncio te termine escribiendo.",
    subtitle: "Una página, un objetivo: que te dejen la consulta o te escriban por WhatsApp.",
    body: "Es una página única y cortita: qué ofrecés, por qué conviene y cómo contactarte. Sin menú ni secciones de más, para que la persona no se distraiga con otra cosa.\n\nCarga rápido en el celular, que es desde donde entra casi todo el mundo, y el botón de WhatsApp queda siempre a mano. Si estás haciendo anuncios, es acá donde conviene mandar la gente.",
    features: ["Una página enfocada en el contacto", "Diseño hecho desde cero", "Pensada primero para el celular", "Formulario de contacto", "Botón de WhatsApp", "Entrega en pocos días"],
    price: "$7.900 UYU",
    monthly: "~$500 UYU / mes",
    monthlyNote: "El mensual cubre hosting, dominio y los cambios chicos que vayas pidiendo. El número exacto lo cerramos cuando hablemos.",
    hidePrice: true,
  },
  {
    icon: <Workflow className="w-10 h-10 md:w-12 md:h-12" />,
    iconLarge: <Workflow className="w-16 h-16" />,
    title: "Automatizaciones",
    tag: "Tareas repetitivas",
    desc: "Lo que hacés a mano todos los días, como cargar ventas o pasar pedidos a una planilla, hecho solo.",
    subtitle: "Si hay algo que repetís todos los días a mano, lo más probable es que se pueda automatizar.",
    body: "Primero miramos cómo trabajás hoy y en qué se te va el tiempo. Después armamos la automatización para ese caso puntual: mandás un audio y la venta queda registrada, los pedidos entran y se ordenan solos, los avisos y los reportes salen sin que nadie los cargue.\n\nSe conecta con lo que ya usás: WhatsApp, planillas de Google, tu sistema de gestión. No tenés que cambiar de herramienta ni aprender un programa nuevo.",
    features: ["Registrar ventas mandando un audio", "Pedidos que se ordenan solos", "Reportes y avisos automáticos", "Se conecta con WhatsApp y planillas", "Armado para cómo trabaja tu negocio", "Lo dejamos andando y te lo explicamos"],
    price: "Consultar",
    monthly: null,
    monthlyNote: "Depende de cuántos procesos haya que automatizar y qué tan enredados estén. Escribinos, lo vemos juntos y te pasamos un número.",
  },
  {
    icon: <Video className="w-10 h-10 md:w-12 md:h-12" />,
    iconLarge: <Video className="w-16 h-16" />,
    title: "Imágenes, Videos y Diseño",
    tag: "Contenido",
    desc: "Videos, imágenes de producto, etiquetas y logos para tus redes y para tus anuncios.",
    subtitle: "Las piezas que necesitás para publicar y para pautar, sin tener que contratar a tres personas distintas.",
    body: "Hacemos videos cortos para redes, imágenes de producto, piezas para anuncios, etiquetas y logos. Todo sigue la misma línea, así tu marca se ve igual en cualquier lado donde aparezca.\n\nSi ya tenés fotos o material nuestro, los usamos. Si no, lo armamos desde cero. Nos mandás lo que necesitás y en general lo tenés en dos días.",
    features: ["Videos cortos para redes", "Imágenes para anuncios", "Fotos y etiquetas de producto", "Logos e identidad de marca", "Piezas sueltas o por paquete", "En general, entrega en dos días"],
    price: "Consultar",
    monthly: null,
    monthlyNote: "El precio depende de cuántas piezas sean y de qué tipo. Pasanos lo que necesitás y te cotizamos.",
  },
];

function Home() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const active = selectedService !== null ? services[selectedService] : null;

  return (
    <div className="min-h-screen w-full bg-background overflow-x-hidden selection:bg-primary selection:text-white">
      <Hero />
      {/* Ticker Tape */}
      <div className="w-full overflow-hidden bg-foreground text-background py-4 brutalist-border border-l-0 border-r-0 rotate-1 transform-gpu my-20">
        <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-4 font-display font-black text-2xl uppercase">
              <span>Diseño Web</span>
              <Star className="w-6 h-6 text-accent fill-accent" />
              <span>Videos Publicitarios</span>
              <Star className="w-6 h-6 text-accent fill-accent" />
              <span>Anuncios en Redes</span>
              <Star className="w-6 h-6 text-accent fill-accent" />
              <span>Diseño Digital</span>
              <Star className="w-6 h-6 text-accent fill-accent" />
            </div>
          ))}
        </div>
      </div>
      {/* Services Section */}
      <section id="services" className="py-24 px-4 md:px-6 bg-secondary/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div>
              <h2 className="md:text-7xl font-black font-display mb-6 text-[79px]">Nuestros<br/>Servicios.</h2>
              <p className="text-xl text-muted-foreground max-w-md font-medium">
                Tocá cualquiera para ver en detalle qué incluye y cómo lo trabajamos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {services.map((service, i) => (
              <motion.button
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                onClick={() => setSelectedService(i)}
                className={`relative bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group text-left w-full cursor-pointer overflow-hidden border-2 border-black/[0.05] hover:border-primary ${i === services.length - 1 && services.length % 2 !== 0 ? "col-span-2 lg:col-span-1" : ""}`}
                data-testid={`service-card-${i}`}
              >
                {/* big background number */}
                <span className="absolute -bottom-4 -right-2 text-[6rem] md:text-[9rem] font-black text-black/[0.04] leading-none select-none font-display pointer-events-none">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* icon — free floating, no box */}
                <div className="text-primary mb-4 md:mb-7 relative z-10 group-hover:scale-110 transition-transform duration-300 origin-left">
                  {service.icon}
                </div>

                <h3 lang="es" className="text-base md:text-2xl font-black font-display mb-2 md:mb-3 relative z-10 hyphens-auto break-words [hyphenate-limit-chars:10_6_4]">{service.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground font-medium mb-4 md:mb-7 relative z-10 leading-relaxed line-clamp-4 md:line-clamp-none">{service.desc}</p>
                <span className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs md:text-sm group-hover:gap-3 transition-all relative z-10">
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
                {!active.hidePrice && (
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
                )}

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
                  href="https://wa.me/59892178756"
                  target="_blank"
                  rel="noopener noreferrer"
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
                img: "/portfolio-puntolimpio.png",
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
      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-foreground text-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black font-display mb-16 text-center text-white">Lo que<br/>Dicen.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "No tenía página web ni me manejaba online. Ellos se encargaron de todo y ahora digitalmente tengo una empresa profesional.", name: "Jerónimo D'Alessandro", role: "Gopet", rating: 5 },
              { quote: "Ya me diseñaron varias etiquetas de productos que antes me llevaba por lo menos una semana. Me lo hicieron en un día y muchísimo más barato. Super recomendado!!", name: "Ana Moroni", role: "Tankin", rating: 5 },
              { quote: "No me tuve que preocupar ni un momento por mi imagen online y tengo una imagen muy profesional por un costo muy barato. La verdad, les recomiendo antes de que se vuelva una empresa más grande y suba los precios.", name: "Fabricio Goncalvez", role: "Sandy Lane", rating: 4.5 }
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
                <div className="flex gap-1 mb-6" data-testid={`testimonial-rating-${i}`}>
                  {[0, 1, 2, 3, 4].map((starIndex) => {
                    const fillAmount = Math.max(0, Math.min(1, testimonial.rating - starIndex));
                    return (
                      <div key={starIndex} className="relative w-6 h-6">
                        <Star className="w-6 h-6 text-white/20 absolute inset-0" />
                        <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillAmount * 100}%` }}>
                          <Star className="w-6 h-6 text-accent fill-accent" />
                        </div>
                      </div>
                    );
                  })}
                </div>
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
              © 2026 Estudio Píxel. Páginas web y diseño, Uruguay.
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
