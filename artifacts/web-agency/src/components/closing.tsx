import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { EMAIL, WHATSAPP_NUMBER, WHATSAPP_URL } from "@/lib/contact";
import "./closing.css";

const whatsappWith = (text: string) => `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;

/* ---------- ¿Listo para empezar? ---------- */

export function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact-inner">
        <h2 id="contact-title" className="contact-title">
          <span>¿Listo para</span> <span>empezar?</span>
        </h2>
        <div className="contact-row">
          <p className="contact-text">
            Escribinos un mensaje sin compromiso y te armamos un boceto para que veas cómo se vería tu proyecto.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-btn"
            data-testid="footer-cta"
            data-contact="¿Listo para empezar?"
          >
            Escribinos por WhatsApp <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Cita final sobre Píxel ---------- */

const MANIFESTO = "Píxel — Hacemos marcas que no se olvidan, con diseño, anuncios y tecnología que traen clientes.";
const WORDS = MANIFESTO.split(" ");

// Comillas gruesas en bloque; la de cierre es la misma girada.
function Quote({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 58 44" aria-hidden="true">
      <path d="M0 20 11 0h10l-7 20h10v24H0zM34 20 45 0h10l-7 20h10v24H34z" />
    </svg>
  );
}

export function Manifesto() {
  const textRef = useRef<HTMLParagraphElement>(null);

  // Las palabras pasan de gris a negro a medida que se baja por la sección.
  useEffect(() => {
    const text = textRef.current;
    if (!text) return;
    const words = Array.from(text.querySelectorAll<HTMLElement>(".manifesto-word"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((word) => word.style.setProperty("--fill", "1"));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const { top, height } = text.getBoundingClientRect();
      const vh = window.innerHeight;
      // Empieza cuando el texto asoma por abajo (80% de la pantalla) y termina cuando su final
      // llega a un poco más de la mitad.
      const progress = Math.min(1, Math.max(0, (vh * 0.8 - top) / (vh * 0.25 + height)));
      const filled = progress * words.length;
      words.forEach((word, i) => {
        word.style.setProperty("--fill", String(Math.min(1, Math.max(0, filled - i)).toFixed(2)));
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="manifesto" aria-label="Sobre Píxel">
      <div className="manifesto-inner">
        <Quote className="manifesto-quote" />
        <p ref={textRef} className="manifesto-text">
          {WORDS.map((word, i) => (
            <span key={i} className="manifesto-word" style={{ "--fill": 0 } as CSSProperties}>
              {word}{" "}
            </span>
          ))}
        </p>
        <Quote className="manifesto-quote manifesto-quote-close" />
        <a
          href={whatsappWith("Hola! Tengo un proyecto nuevo y quiero consultarles.")}
          target="_blank"
          rel="noopener noreferrer"
          className="manifesto-btn"
          data-contact="¿Nuevo proyecto?"
        >
          ¿Nuevo proyecto?
        </a>
      </div>
    </section>
  );
}

/* ---------- Pie de página ---------- */

// 59892178756 → +598 92 178 756
const PHONE = `+${WHATSAPP_NUMBER.slice(0, 3)} ${WHATSAPP_NUMBER.slice(3, 5)} ${WHATSAPP_NUMBER.slice(5, 8)} ${WHATSAPP_NUMBER.slice(8)}`;

const FOOTER_LINKS = [
  { href: "#services", label: "Servicios" },
  { href: "#work", label: "Proyectos" },
  { href: "#reviews", label: "Reseñas" },
];

export function Footer() {
  const toTop = () => {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-cols">
          <div>
            <h2 className="footer-label">Contacto</h2>
            <ul>
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-contact="Pie de página">
                  WhatsApp {PHONE}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} data-contact="Pie de página">
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>
          <nav aria-label="Secciones">
            <h2 className="footer-label">Secciones</h2>
            <ul>
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="footer-wordmark" aria-hidden="true">
          PÍXEL<span>.</span>
        </p>

        <div className="footer-bottom">
          <div className="footer-legal">
            <p>© 2025 Estudio Píxel. Agencia de diseño y marketing digital, Uruguay.</p>
            {/* Aviso que piden las condiciones de Meta en cada página con el píxel. */}
            <p>
              Esta web usa cookies de Meta para medir y mostrar anuncios.{" "}
              <a href="/privacidad">Privacidad y cómo desactivarlas</a>
            </p>
          </div>
          <button type="button" className="footer-top" onClick={toTop}>
            Volver arriba <ArrowUp aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
