import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ChevronsLeft } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { whatsappWith } from "@/lib/contact";
import { trackMeta } from "@/lib/meta";
import { PlansTable } from "@/components/plans";
import "./services.css";

type Service = {
  title: string;
  // Frase corta en negrita de la tarjeta.
  tagline: string;
  desc?: string;
  // La tarjeta se desliza y del otro lado aparece la tabla de planes.
  plans?: boolean;
};

const SERVICES: Service[] = [
  {
    title: "Anuncios en redes",
    tagline: "Campañas que te traen clientes.",
    plans: true,
  },
  {
    title: "Páginas web",
    tagline: "Tu negocio, serio en internet.",
    desc: "El sitio de tu empresa: tus servicios, tus trabajos y tus datos de contacto en un solo lugar.",
  },
  {
    title: "Automatizaciones",
    tagline: "Lo repetitivo, que se haga solo.",
    desc: "Lo que hacés a mano todos los días, como cargar ventas o pasar pedidos a una planilla, hecho solo.",
  },
  {
    title: "Imágenes, videos y diseño",
    tagline: "Tu marca, igual en todos lados.",
    desc: "Videos, imágenes de producto, etiquetas y logos para tus redes y para tus anuncios.",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// contact: qué botón fue, para el evento Contact de Meta (src/lib/meta.ts).
function ConsultButton({ href, label, contact }: { href: string; label: string; contact: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="sv-card-btn"
      aria-label={label}
      data-contact={contact}
    >
      <FaWhatsapp aria-hidden="true" /> Consultar
    </a>
  );
}

function ServiceText({ service, index, children }: { service: Service; index: number; children: ReactNode }) {
  return (
    <>
      <span className="sv-card-num" aria-hidden="true">
        {pad(index + 1)}
      </span>
      <h3 lang="es" className="sv-card-title">
        {service.title}.
      </h3>
      <div className="sv-card-body">
        <p className="sv-card-tagline">{service.tagline}</p>
        {service.desc && <p className="sv-card-desc">{service.desc}</p>}
        {children}
      </div>
    </>
  );
}

/* Anuncios en redes: dos caras en un carrusel horizontal. Se pasa deslizando con el dedo o con
   los botones "Ver planes" / "Volver"; la cara que no se ve queda inerte (fuera del tab). */
function AdsCard({ service, index }: { service: Service; index: number }) {
  const cardRef = useRef<HTMLLIElement>(null);
  const swipeRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const plansRef = useRef<HTMLDivElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const [page, setPage] = useState(0);

  const go = (next: number, smooth = true) => {
    const swipe = swipeRef.current;
    if (!swipe) return;
    setPage(next);
    swipe.scrollTo({ left: next * swipe.clientWidth, behavior: smooth && !reducedMotion() ? "smooth" : "auto" });
  };

  // La tarjeta mide lo que su frente y crece hasta el alto de la tabla a medida que se desliza.
  useLayoutEffect(() => {
    const swipe = swipeRef.current;
    const front = frontRef.current;
    const plans = plansRef.current;
    if (!swipe || !front || !plans) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const progress = Math.min(1, Math.max(0, swipe.scrollLeft / swipe.clientWidth));
      const height = front.offsetHeight + (plans.offsetHeight - front.offsetHeight) * progress;
      swipe.style.height = `${height}px`;
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    swipe.addEventListener("scroll", schedule, { passive: true });
    const resize = new ResizeObserver(schedule);
    [swipe, front, plans].forEach((el) => resize.observe(el));
    return () => {
      swipe.removeEventListener("scroll", schedule);
      resize.disconnect();
      window.cancelAnimationFrame(raf);
    };
  }, []);

  // La cara visible se fija cuando el deslizamiento termina, no a mitad de camino.
  useEffect(() => {
    const swipe = swipeRef.current;
    if (!swipe) return;
    let timer = 0;
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setPage(Math.round(swipe.scrollLeft / swipe.clientWidth)), 120);
    };
    swipe.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      swipe.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, []);

  // Ver los planes (con el botón, deslizando o por #plans) es un ViewContent para Meta, una vez por visita.
  const plansSeenRef = useRef(false);
  useEffect(() => {
    if (page !== 1 || plansSeenRef.current) return;
    plansSeenRef.current = true;
    trackMeta("ViewContent", { content_name: "Planes de anuncios" });
  }, [page]);

  // Un link a #plans abre la tarjeta directamente del lado de los planes.
  useEffect(() => {
    const onHash = () => window.location.hash === "#plans" && go(1, false);
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // La primera vez que la tarjeta aparece entera, se corre un poco para mostrar que se desliza.
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        card.setAttribute("data-hint", "");
        observer.disconnect();
      },
      { threshold: 0.7 },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <li
      ref={cardRef}
      id="plans"
      className="sv-card sv-card-ads"
      data-page={page}
      style={{ "--i": index } as CSSProperties}
      data-testid={`service-card-${index}`}
    >
      <div ref={swipeRef} className="sv-swipe">
        <div ref={frontRef} className="sv-face" inert={page !== 0}>
          <ServiceText service={service} index={index}>
            <div className="sv-actions">
              <button
                ref={openRef}
                type="button"
                className="sv-card-btn"
                onClick={() => {
                  go(1);
                  window.requestAnimationFrame(() => backRef.current?.focus({ preventScroll: true }));
                }}
                data-testid="ads-show-plans"
              >
                Ver planes <ArrowRight aria-hidden="true" />
              </button>
              <span className="sv-hint" aria-hidden="true">
                <ChevronsLeft /> Deslizá
              </span>
            </div>
          </ServiceText>
        </div>

        <div ref={plansRef} className="sv-plans" inert={page !== 1} role="group" aria-label="Planes de anuncios">
          <div className="sv-plans-top">
            <button
              ref={backRef}
              type="button"
              className="sv-back"
              onClick={() => {
                go(0);
                window.requestAnimationFrame(() => openRef.current?.focus({ preventScroll: true }));
              }}
            >
              <ArrowLeft aria-hidden="true" /> Volver
            </button>
            <span className="sv-plans-label">Planes de anuncios</span>
          </div>
          <p className="sv-plans-intro">
            Todos los planes arrancan con una reunión donde definimos a quién le querés vender, qué ofrecés, qué decimos
            en los anuncios y el futuro de la campaña.
          </p>
          <div className="sv-plans-table">
            <PlansTable />
          </div>
          <div className="sv-plans-cta">
            <ConsultButton
              href={whatsappWith("Hola! Quiero consultar por los planes de anuncios.")}
              label="Consultar por los planes de anuncios por WhatsApp"
              contact="Planes de anuncios"
            />
          </div>
        </div>
      </div>
    </li>
  );
}

export function Services() {
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
          {SERVICES.map((service, i) =>
            service.plans ? (
              <AdsCard key={service.title} service={service} index={i} />
            ) : (
              <li
                key={service.title}
                className="sv-card"
                style={{ "--i": i } as CSSProperties}
                data-testid={`service-card-${i}`}
              >
                <div className="sv-face">
                  <ServiceText service={service} index={i}>
                    <ConsultButton
                      href={whatsappWith(`Hola! Quiero consultar por ${service.title}.`)}
                      label={`Consultar por ${service.title} por WhatsApp`}
                      contact={service.title}
                    />
                  </ServiceText>
                </div>
              </li>
            ),
          )}
        </ol>
      </div>
    </section>
  );
}
