import { useEffect, useRef, useState, type CSSProperties } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/contact";
import "./services.css";

type Service = {
  title: string;
  // Frase corta en negrita de la tarjeta.
  tagline: string;
  tag: string;
  desc: string;
  subtitle: string;
  body: string;
  features: string[];
  price: string;
  monthly: string | null;
  monthlyNote: string;
  hidePrice?: boolean;
};

const SERVICES: Service[] = [
  {
    title: "Anuncios en redes",
    tagline: "Campañas que traen consultas.",
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
    title: "Páginas web",
    tagline: "Tu negocio, serio en internet.",
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
    title: "Automatizaciones",
    tagline: "Lo repetitivo, que se haga solo.",
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
    title: "Imágenes, videos y diseño",
    tagline: "Tu marca, igual en todos lados.",
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

const pad = (n: number) => String(n).padStart(2, "0");

// El mensaje de WhatsApp ya llega con el servicio elegido.
const whatsappFor = (service: Service) =>
  `${WHATSAPP_URL}?text=${encodeURIComponent(`Hola! Quiero consultar por ${service.title}.`)}`;

// Detalle de un servicio: pantalla completa en el celular y panel lateral en escritorio.
function ServiceDetail({
  index,
  onChange,
  onClosed,
}: {
  index: number | null;
  onChange: (index: number | null) => void;
  onClosed: (index: number) => void;
}) {
  // Mantiene el último servicio mientras corre la animación de cierre.
  const [shown, setShown] = useState(index ?? 0);
  useEffect(() => {
    if (index !== null) setShown(index);
  }, [index]);

  const service = SERVICES[shown];
  const prev = (shown - 1 + SERVICES.length) % SERVICES.length;
  const next = (shown + 1) % SERVICES.length;
  const showPrice = !service.hidePrice && service.price !== "Consultar";

  return (
    <Dialog.Root open={index !== null} onOpenChange={(open) => !open && onChange(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="sv-overlay" />
        <Dialog.Content
          className="sv-panel"
          aria-describedby={undefined}
          data-testid="service-modal"
          onCloseAutoFocus={(e) => {
            // Vuelve a la tarjeta del último servicio visto (puede no ser la que se abrió).
            e.preventDefault();
            onClosed(shown);
          }}
        >
          <div className="sv-panel-top">
            <span className="sv-panel-count">
              {pad(shown + 1)} <span>/ {pad(SERVICES.length)}</span>
            </span>
            <Dialog.Close className="sv-pill">
              Cerrar <X aria-hidden="true" />
            </Dialog.Close>
          </div>

          {/* key: al pasar a otro servicio el contenido entra de nuevo y arranca desde arriba. */}
          <div key={shown} className="sv-panel-body">
            <p className="sv-tag">{service.tag}</p>
            <Dialog.Title className="sv-panel-title">{service.title}.</Dialog.Title>
            <p className="sv-panel-sub">{service.subtitle}</p>

            <div className="sv-panel-text">
              {service.body.split("\n\n").map((para, j) => (
                <p key={j}>{para}</p>
              ))}
            </div>

            <h3 className="sv-label">Qué incluye</h3>
            <ul className="sv-features">
              {service.features.map((feature) => (
                <li key={feature}>
                  <Check aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="sv-note">
              <h3 className="sv-label">Cómo se cobra</h3>
              {showPrice && (
                <p className="sv-price">
                  {service.price}
                  {service.monthly && <span> + {service.monthly}</span>}
                </p>
              )}
              <p>{service.monthlyNote}</p>
            </div>

            <nav className="sv-pager" aria-label="Otros servicios">
              <button type="button" onClick={() => onChange(prev)}>
                <span className="sv-pager-dir">
                  <ArrowLeft aria-hidden="true" /> Anterior
                </span>
                <span className="sv-pager-name">{SERVICES[prev].title}</span>
              </button>
              <button type="button" onClick={() => onChange(next)}>
                <span className="sv-pager-dir">
                  Siguiente <ArrowRight aria-hidden="true" />
                </span>
                <span className="sv-pager-name">{SERVICES[next].title}</span>
              </button>
            </nav>
          </div>

          <div className="sv-panel-cta">
            <a
              href={whatsappFor(service)}
              target="_blank"
              rel="noopener noreferrer"
              className="sv-cta"
              data-testid="service-modal-cta"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function Services() {
  const [selected, setSelected] = useState<number | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <section id="services" className="services" aria-labelledby="services-title">
      <div className="services-inner">
        <header className="services-head">
          <h2 id="services-title" className="services-title">
            Nuestros servicios.
          </h2>
        </header>

        {/* Las tarjetas se apilan al bajar: cada una se queda arriba y la siguiente la tapa. */}
        <ol className="sv-cards">
          {SERVICES.map((service, i) => (
            <li key={service.title} className="sv-card" style={{ "--i": i } as CSSProperties}>
              <span className="sv-card-num" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <h3 lang="es" className="sv-card-title">
                {service.title}.
              </h3>
              <div className="sv-card-body">
                <p className="sv-card-tagline">{service.tagline}</p>
                <p className="sv-card-desc">{service.desc}</p>
                {/* Toda la tarjeta es clickeable (el ::after del botón la cubre). */}
                <button
                  ref={(el) => {
                    buttonRefs.current[i] = el;
                  }}
                  type="button"
                  className="sv-card-btn"
                  onClick={() => setSelected(i)}
                  aria-haspopup="dialog"
                  aria-label={`Ver qué incluye ${service.title}`}
                  data-testid={`service-card-${i}`}
                >
                  Ver qué incluye <ArrowRight aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <ServiceDetail
        index={selected}
        onChange={setSelected}
        onClosed={(i) => buttonRefs.current[i]?.focus({ preventScroll: true })}
      />
    </section>
  );
}
