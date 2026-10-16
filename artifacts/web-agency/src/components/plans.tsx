import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ArrowRight, Check, X } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/contact";
import "./plans.css";

type Plan = {
  name: string;
  blurb: string;
  price: string;
  adSpend: string;
  recommended?: boolean;
  // Mismo orden en todos los planes, así las filas quedan alineadas. Lo que va entre ** sale en negrita.
  features: { text: string; included: boolean }[];
};

const PLANS: Plan[] = [
  {
    name: "Arranque",
    blurb: "Para empezar a anunciar con lo justo.",
    price: "$3.000",
    adSpend: "$2.500",
    features: [
      { text: "**2** anuncios diseñados por mes", included: true },
      { text: "Testeo profundo de anuncios para mayor rendimiento", included: false },
      { text: "Página web gratis", included: false },
      { text: "Manejo completo de tu Instagram", included: false },
      { text: "Resumen y optimización de resultados **1 vez por mes**", included: true },
    ],
  },
  {
    name: "Crecimiento",
    blurb: "Más anuncios, probados a fondo, y tu página web.",
    price: "$6.000",
    adSpend: "$7.000",
    recommended: true,
    features: [
      { text: "**4** anuncios diseñados por mes", included: true },
      { text: "Testeo profundo de anuncios para mayor rendimiento", included: true },
      { text: "Página web gratis", included: true },
      { text: "Manejo completo de tu Instagram", included: false },
      { text: "Resumen y optimización de resultados **cada 15 días**", included: true },
    ],
  },
  {
    name: "Todo incluido",
    blurb: "Anuncios, página web y tu Instagram en nuestras manos.",
    price: "$10.000",
    adSpend: "$7.000",
    features: [
      { text: "**8** anuncios diseñados por mes", included: true },
      { text: "Testeo profundo de anuncios para mayor rendimiento", included: true },
      { text: "Página web gratis", included: true },
      { text: "Manejo completo de tu Instagram", included: true },
      { text: "Resumen y optimización de resultados **cada 15 días**", included: true },
    ],
  },
];

// En el celular el carrusel arranca en el plan recomendado, con los otros dos asomando a los costados.
const START = Math.max(0, PLANS.findIndex((plan) => plan.recommended));

const rich = (text: string) => text.split("**").map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));

const whatsappFor = (plan: Plan) =>
  `${WHATSAPP_URL}?text=${encodeURIComponent(`Hola! Quiero el Plan ${plan.name} de anuncios.`)}`;

// Scroll que deja la tarjeta `i` centrada en el carrusel.
const centerOf = (track: HTMLElement, i: number) => {
  const card = track.children[i] as HTMLElement | undefined;
  return card ? card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2 : 0;
};

function AdSpendHelp() {
  return (
    <Popover.Root>
      <Popover.Trigger className="plans-help" aria-label="¿Qué es la inversión en anuncios?">
        ?
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="plans-pop" side="top" sideOffset={10} collisionPadding={16}>
          <p className="plans-pop-title">¿Qué es la inversión en anuncios?</p>
          <p>
            Es la plata que va directo a Instagram y Facebook para que muestren tus anuncios. Se paga aparte del plan y
            el monto lo definimos juntos según a cuánta gente querés llegar.
          </p>
          <Popover.Arrow className="plans-pop-arrow" width={14} height={7} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function Plans() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(START);

  // Antes de pintar, para que no se vea el salto desde el primer plan.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (track) track.scrollLeft = centerOf(track, START);
  }, []);

  // El selector de arriba sigue a la tarjeta que quedó en el centro al deslizar.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      let nearest = 0;
      for (let i = 1; i < PLANS.length; i++) {
        if (Math.abs(centerOf(track, i) - track.scrollLeft) < Math.abs(centerOf(track, nearest) - track.scrollLeft)) {
          nearest = i;
        }
      }
      setActive(nearest);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  // Las tarjetas entran la primera vez que aparecen en pantalla.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        track.setAttribute("data-visible", "");
        observer.disconnect();
      },
      { threshold: 0.15 },
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const show = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: centerOf(track, i), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id="plans" className="plans" aria-labelledby="plans-title">
      <div className="plans-inner">
        <header className="plans-head">
          <h2 id="plans-title" className="plans-title">
            Planes de anuncios.
          </h2>
          <p className="plans-lead">
            Todos los planes arrancan con una reunión donde definimos a quién le querés vender, qué ofrecés y qué
            decimos en los anuncios.
          </p>
        </header>
      </div>

      {/* Solo en el celular y la tablet, donde los planes van en carrusel. */}
      <div className="plans-switch" role="group" aria-label="Elegí un plan" style={{ "--active": active } as CSSProperties}>
        {PLANS.map((plan, i) => (
          <button key={plan.name} type="button" aria-pressed={i === active} onClick={() => show(i)}>
            {plan.name}
          </button>
        ))}
      </div>

      <ul ref={trackRef} className="plans-track">
        {PLANS.map((plan, i) => (
          <li
            key={plan.name}
            className="plans-card"
            data-recommended={plan.recommended || undefined}
            style={{ "--i": i } as CSSProperties}
            data-testid={`plan-card-${i}`}
          >
            <h3 className="plans-name">
              <span className="plans-kicker">Plan</span> {plan.name}
            </h3>
            {plan.recommended && <span className="plans-badge">Recomendado</span>}
            <p className="plans-blurb">{plan.blurb}</p>

            <p className="plans-price">
              <span className="plans-amount">{plan.price}</span>
              <span className="plans-per">UYU / mes</span>
            </p>

            <div className="plans-spend">
              <span className="plans-spend-label">
                Inversión en anuncios <AdSpendHelp />
              </span>
              <span className="plans-spend-value">
                desde <strong>{plan.adSpend}</strong>
              </span>
              <span className="plans-spend-note">Se paga aparte del plan</span>
            </div>

            <ul className="plans-features">
              {plan.features.map((feature) => (
                <li key={feature.text} data-included={feature.included || undefined}>
                  <span className="plans-icon" aria-hidden="true">
                    {feature.included ? <Check /> : <X />}
                  </span>
                  <span>
                    <span className="sr-only">{feature.included ? "Incluido: " : "No incluido: "}</span>
                    {rich(feature.text)}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={whatsappFor(plan)}
              target="_blank"
              rel="noopener noreferrer"
              className="plans-cta"
              data-testid={`plan-cta-${i}`}
            >
              Quiero este plan <ArrowRight aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
