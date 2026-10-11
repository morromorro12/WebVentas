import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import "./work.css";

const PROJECTS = [
  {
    img: "/portfolio-gopet",
    title: "Go Pet",
    type: "Landing page",
    desc: "Landing page moderna y atractiva para una marca de productos para mascotas.",
    fallback: "https://placehold.co/1200x800/111827/FFFFFF?text=Go+Pet",
    url: "https://gopet-wine.vercel.app/",
  },
  {
    img: "/portfolio-puntolimpio",
    title: "Punto Limpio",
    type: "Catálogo de pedidos",
    desc: "Catálogo online de productos de limpieza con carrito y envío del pedido directo por WhatsApp.",
    fallback: "https://placehold.co/1200x800/002BFF/FFFFFF?text=Punto+Limpio",
    url: "https://puntolimpio-uy.vercel.app/",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

export function Work() {
  const listRef = useRef<HTMLUListElement>(null);

  // Cada proyecto entra la primera vez que aparece en pantalla.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-visible", "");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 },
    );
    list.querySelectorAll(".work-item").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="work" className="work" aria-labelledby="work-title">
      <div className="work-inner">
        <header className="work-head">
          <h2 id="work-title" className="work-title">
            Últimos proyectos.
          </h2>
          <p className="work-count" aria-hidden="true">
            ({pad(PROJECTS.length)})
          </p>
        </header>

        <ul ref={listRef} className="work-list">
          {PROJECTS.map((project, i) => (
            <li key={project.title} className="work-item" data-testid={`portfolio-item-${i}`}>
              {/* Toda la tarjeta lleva al sitio, que se abre en otra pestaña. */}
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="work-link"
                aria-label={`Ver el sitio de ${project.title} (se abre en otra pestaña)`}
              >
                <div className="work-media">
                  {/* loading va antes que src/srcSet: si no, el navegador arranca la descarga antes de ver el lazy */}
                  <img
                    loading="lazy"
                    decoding="async"
                    srcSet={[640, 1024, 1536].map((w) => `${project.img}-${w}.webp ${w}w`).join(", ")}
                    sizes="(min-width: 1328px) 616px, (min-width: 1024px) calc(50vw - 60px), calc(100vw - 40px)"
                    src={`${project.img}-1024.webp`}
                    width={1536}
                    height={1024}
                    alt={`Sitio de ${project.title}`}
                    onError={(e) => {
                      e.currentTarget.srcset = "";
                      e.currentTarget.src = project.fallback;
                    }}
                  />
                </div>

                <div className="work-info">
                  <span className="work-num" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <h3 className="work-name">{project.title}</h3>
                  <span className="work-arrow" aria-hidden="true">
                    <ArrowUpRight />
                  </span>
                  <span className="work-type">{project.type}</span>
                  <p className="work-desc">{project.desc}</p>
                  <span className="work-cta">Ver sitio</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
