import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import "./statement.css";

const WORDS = ["personas.", "marcas.", "clientes.", "negocios.", "usuarios."];
const INTERVAL_MS = 1700;

// Lo que nos diferencia, sacado de cómo trabajamos cada servicio.
const POINTS = [
  { title: "Hecho desde cero", text: "Nada de plantillas: cada pieza se arma en base a tu marca y a lo que vendés." },
  { title: "Rápido", text: "La mayoría de las piezas las tenés en dos días, no en semanas." },
  { title: "Directo por WhatsApp", text: "Hablás con nosotros sin formularios ni vueltas, y te respondemos ahí." },
  { title: "Con números", text: "Te mostramos qué se gastó, cuántas consultas entraron y cuánto costó cada una." },
];

// Texto completo para lectores de pantalla (la parte animada queda oculta para ellos). Sin "l@s",
// que se leería "l arroba s".
const SPOKEN = "Creamos cosas importantes para personas, marcas, clientes, negocios y usuarios.";

type Step = { index: number; prev: number };

// Palabras apiladas: la actual se ve; al cambiar, sale hacia arriba y la nueva entra desde abajo.
function Rotator({ values, step }: { values: string[]; step: Step }) {
  const longest = values.reduce((a, b) => (b.length > a.length ? b : a));
  return (
    <span className="rotator">
      <span className="rotator-sizer">{longest}</span>
      {values.map((value, i) => (
        <span
          key={i}
          className="rotator-item"
          data-state={i === step.index ? "current" : i === step.prev ? "prev" : undefined}
        >
          {value}
        </span>
      ))}
    </span>
  );
}

export function Statement() {
  const [step, setStep] = useState<Step>({ index: 0, prev: -1 });
  const sectionRef = useRef<HTMLElement>(null);

  // Rota solo mientras la sección está en pantalla y si el usuario no pidió reducir el movimiento.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (!entry.isIntersecting) return;
      timer = window.setInterval(() => {
        setStep((s) => ({ index: (s.index + 1) % WORDS.length, prev: s.index }));
      }, INTERVAL_MS);
    });
    observer.observe(section);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section ref={sectionRef} className="statement" aria-labelledby="statement-title">
      <div className="statement-inner">
        <p className="statement-eyebrow">
          <span className="statement-dot" aria-hidden="true" />
          Agencia de diseño y marketing digital · Uruguay
        </p>
        <h2 id="statement-title" className="statement-title">
          <span className="sr-only">{SPOKEN}</span>
          <span aria-hidden="true">
            <span className="statement-line">Creamos cosas</span>
            <span className="statement-line">importantes</span>
            <span className="statement-line">para l@s</span>
            <span className="statement-line statement-accent">
              <Rotator values={WORDS} step={step} />
            </span>
          </span>
        </h2>

        <div className="statement-about">
          <p className="statement-label">Quiénes somos</p>
          <div>
            <p className="statement-text">
              Hacemos anuncios, páginas web, automatizaciones y contenido para negocios que quieren vender más.
              Sin vueltas y explicándote cada paso.
            </p>
            <a href="#services" className="statement-link">
              Ver soluciones <ArrowDown aria-hidden="true" />
            </a>
          </div>
        </div>

        <ul className="statement-points">
          {POINTS.map((point, i) => (
            <li key={point.title}>
              <span className="statement-points-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
