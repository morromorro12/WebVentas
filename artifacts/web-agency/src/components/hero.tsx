import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { X } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/contact";
import "./hero.css";

// Cada string es una línea fija del titular (se animan de a una).
const HEADLINE = ["Agencia de", "marketing", "digital."];

const MENU_LINKS = [
  { href: "#services", label: "Servicios" },
  { href: "#work", label: "Proyectos" },
  { href: "#contact", label: "Contacto" },
];

// Tiene que coincidir con el preload de index.html para no bajar la imagen dos veces.
const HERO_SIZES = "(min-width: 1024px) 50vw, 100vw";
const srcSet = (ext: string) =>
  [640, 828, 940].map((w) => `/images/hero-p-${w}.${ext} ${w}w`).join(", ");

const PARALLAX_MAX = 40;
const PARALLAX_SPEED = 0.12;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Convierte cualquier color CSS (rgb, oklch, color-mix…) a [r, g, b, alfa] pintándolo en un canvas.
const rgbaCache = new Map<string, [number, number, number, number]>();
let colorCtx: CanvasRenderingContext2D | null = null;
function toRgba(color: string) {
  const cached = rgbaCache.get(color);
  if (cached) return cached;
  colorCtx ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!colorCtx) return [0, 0, 0, 0] as const;
  colorCtx.clearRect(0, 0, 1, 1);
  colorCtx.fillStyle = "rgba(0, 0, 0, 0)";
  colorCtx.fillStyle = color;
  colorCtx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = colorCtx.getImageData(0, 0, 1, 1).data;
  const rgba: [number, number, number, number] = [r, g, b, a / 255];
  rgbaCache.set(color, rgba);
  return rgba;
}

// ¿Es claro lo que pasa por debajo del encabezado en (x, y)? Sube por los padres del
// elemento que está ahí hasta encontrar un fondo opaco.
function isLightBehind(x: number, y: number, header: HTMLElement) {
  const hit = document.elementsFromPoint(x, y).find((el) => !header.contains(el));
  for (let el: Element | null = hit ?? null; el; el = el.parentElement) {
    const [r, g, b, a] = toRgba(getComputedStyle(el).backgroundColor);
    if (a >= 0.5) return 0.2126 * r + 0.7152 * g + 0.0722 * b > 150;
  }
  return true;
}

function Logo() {
  return (
    <span className="hero-logo">
      PÍXEL<span className="hero-logo-dot">.</span>
    </span>
  );
}

export function Hero() {
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [tone, setTone] = useState<"dark" | "light">("dark");

  // Al cerrar con "Cerrar" o Esc el foco vuelve al botón; al tocar un link, no (si no, la página vuelve arriba).
  const closeMenu = useCallback((returnFocus: boolean) => {
    setMenuOpen(false);
    if (returnFocus) menuButtonRef.current?.focus({ preventScroll: true });
  }, []);

  // Arranca la secuencia de entrada cuando carga la imagen (o a los 900ms, lo que pase primero).
  useEffect(() => {
    if (imgRef.current?.complete) setReady(true);
    const fallback = window.setTimeout(() => setReady(true), 900);
    return () => window.clearTimeout(fallback);
  }, []);

  // Parallax: la imagen baja más lento que el texto, hasta 40px.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const offset = Math.min(PARALLAX_MAX, window.scrollY * PARALLAX_SPEED);
      frame.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  // Encabezado fijo: logo y botón en blanco sobre fondos oscuros y en negro sobre claros.
  useEffect(() => {
    const header = headerRef.current;
    const button = menuButtonRef.current;
    if (!header || !button) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const { top, height } = button.getBoundingClientRect();
      setTone(isLightBehind(window.innerWidth / 2, top + height / 2, header) ? "light" : "dark");
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <header ref={headerRef} className="site-header" data-tone={tone}>
        <nav className="hero-nav" aria-label="Principal">
          <Logo />
          <button
            ref={menuButtonRef}
            type="button"
            className="hero-pill"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen(true)}
            data-testid="nav-menu-button"
          >
            Menú
          </button>
        </nav>
      </header>
      {/* Desenfoque progresivo detrás del encabezado: más fuerte arriba, se desvanece hacia abajo. */}
      <div className="site-header-blur" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <section className="hero" data-ready={ready || undefined} aria-labelledby="hero-title">
        <div className="hero-media">
          <div ref={frameRef} className="hero-frame">
            <picture>
              <source type="image/avif" srcSet={srcSet("avif")} sizes={HERO_SIZES} />
              <source type="image/webp" srcSet={srcSet("webp")} sizes={HERO_SIZES} />
              <img
                ref={imgRef}
                className="hero-img"
                src="/images/hero-p-828.webp"
                width={940}
                height={1672}
                alt=""
                fetchPriority="high"
                onLoad={() => setReady(true)}
                data-testid="hero-image"
              />
            </picture>
          </div>
        </div>

        <div className="hero-copy">
          <h1 id="hero-title" className="hero-title">
            {HEADLINE.map((line, i) => (
              <span key={line} className="hero-line hero-reveal" style={{ "--i": i } as CSSProperties}>
                {line}{" "}
              </span>
            ))}
          </h1>
          <p className="hero-sub hero-reveal" style={{ "--i": HEADLINE.length + 0.5 } as CSSProperties}>
            Anuncios, contenido y páginas web que traen clientes a tu negocio.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-cta hero-reveal"
            style={{ "--i": HEADLINE.length + 2 } as CSSProperties}
            data-testid="hero-cta-primary"
          >
            Escribinos por WhatsApp
          </a>
        </div>
      </section>

      <SiteMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}

function SiteMenu({ open, onClose }: { open: boolean; onClose: (returnFocus: boolean) => void }) {
  const menuRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose(true);
        return;
      }
      // Mantiene el foco dentro del menú mientras está abierto.
      if (e.key !== "Tab" || !menuRef.current) return;
      const focusables = menuRef.current.querySelectorAll<HTMLElement>("a[href], button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      root.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <div
      ref={menuRef}
      id="site-menu"
      className="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      data-open={open || undefined}
      inert={!open}
    >
      <div className="hero-nav">
        <Logo />
        <button ref={closeRef} type="button" className="hero-pill" onClick={() => onClose(true)}>
          Cerrar <X aria-hidden="true" className="hero-pill-icon" />
        </button>
      </div>
      <nav className="site-menu-nav" aria-label="Secciones">
        <ul>
          {MENU_LINKS.map((link, i) => (
            <li key={link.href} style={{ "--i": i } as CSSProperties}>
              <a href={link.href} onClick={() => onClose(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="site-menu-foot"
        style={{ "--i": MENU_LINKS.length } as CSSProperties}
      >
        Escribinos por WhatsApp
      </a>
    </div>
  );
}
