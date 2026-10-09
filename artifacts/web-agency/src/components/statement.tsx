import { useEffect, useRef, useState } from "react";
import "./statement.css";

// Cada destinatario con su artículo: el artículo también cambia cuando no concuerda con el anterior.
const TARGETS = [
  { article: "las", word: "personas" },
  { article: "las", word: "marcas" },
  { article: "los", word: "clientes" },
  { article: "los", word: "negocios" },
  { article: "los", word: "usuarios" },
];
const ARTICLES = TARGETS.map((t) => t.article);
const WORDS = TARGETS.map((t) => `${t.word}.`);
const INTERVAL_MS = 2200;

// Texto completo para lectores de pantalla (la parte animada queda oculta para ellos).
const SPOKEN = "Creamos cosas importantes para las personas, las marcas, los clientes, los negocios y los usuarios.";

type Step = { index: number; prev: number };

// Palabras apiladas: la actual se ve; al cambiar, sale hacia arriba y la nueva entra desde abajo.
// Si el valor no cambia (las → las), el cambio es instantáneo y no se nota.
function Rotator({ values, step }: { values: string[]; step: Step }) {
  const longest = values.reduce((a, b) => (b.length > a.length ? b : a));
  const instant = step.prev >= 0 && values[step.prev] === values[step.index];
  return (
    <span className="rotator">
      <span className="rotator-sizer">{longest}</span>
      {values.map((value, i) => (
        <span
          key={i}
          className="rotator-item"
          data-state={i === step.index ? "current" : i === step.prev ? "prev" : undefined}
          data-instant={instant || undefined}
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
        setStep((s) => ({ index: (s.index + 1) % TARGETS.length, prev: s.index }));
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
      <h2 id="statement-title" className="statement-title">
        <span className="sr-only">{SPOKEN}</span>
        <span aria-hidden="true">
          <span className="statement-line">Creamos cosas</span>
          <span className="statement-line">importantes</span>
          <span className="statement-line">
            para <Rotator values={ARTICLES} step={step} />
          </span>
          <span className="statement-line statement-accent">
            <Rotator values={WORDS} step={step} />
          </span>
        </span>
      </h2>
    </section>
  );
}
