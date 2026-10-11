import { useEffect, useRef, type CSSProperties } from "react";
import "./gallery.css";

// Originales en Cloudinary (PNG de ~2 MB cada uno). Se piden achicados y en WebP/AVIF con las
// transformaciones de Cloudinary, así cada uno pesa entre 20 y 60 KB.
const PIECES = [
  { path: "v1783528134/899364F2-B5AE-4F9F-8741-4049B8E17A1C_jzbxv9.png", tag: "Diseño publicitario" },
  { path: "v1783528094/ChatGPT_Image_6_mar_2026_17_34_32_t5thxc.png", tag: "Logo" },
  { path: "v1783528053/ad_sin_precio_e1epob.png", tag: "Diseño publicitario" },
  { path: "v1783527987/razas_pequenas_lager_100_kaxukb.png", tag: "Productos" },
  { path: "v1783527986/Lager_senior_100_FINAL_n8srfl.png", tag: "Productos" },
  { path: "v1783527986/Maxine_adulto_final_100_cak23s.png", tag: "Productos" },
];

const cloudinary = (path: string, width: number) =>
  `https://res.cloudinary.com/dhfwi0myn/image/upload/f_auto,q_auto,w_${width},c_limit/${path}`;

export function Gallery() {
  const gridRef = useRef<HTMLUListElement>(null);

  // Cada pieza entra la primera vez que aparece en pantalla.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-visible", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -80px 0px" },
    );
    grid.querySelectorAll(".gallery-item").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="gallery" aria-labelledby="gallery-title">
      <div className="gallery-inner">
        <header className="gallery-head">
          <h2 id="gallery-title" className="gallery-title">
            Diseño y branding.
          </h2>
          <p className="gallery-lead">
            Diseño gráfico, imágenes publicitarias y contenido visual creado para distintas marcas.
          </p>
        </header>

        <ul ref={gridRef} className="gallery-grid">
          {PIECES.map((piece, i) => (
            <li
              key={piece.path}
              className="gallery-item"
              style={{ "--delay": `${(i % 3) * 80}ms` } as CSSProperties}
              data-testid={`gallery-item-${i}`}
            >
              <figure>
                <div className="gallery-media">
                  <img
                    loading="lazy"
                    decoding="async"
                    srcSet={[400, 800].map((w) => `${cloudinary(piece.path, w)} ${w}w`).join(", ")}
                    sizes="(min-width: 1328px) 411px, (min-width: 1024px) calc((100vw - 144px) / 3), calc((100vw - 52px) / 2)"
                    src={cloudinary(piece.path, 800)}
                    alt={piece.tag}
                  />
                </div>
                <figcaption>{piece.tag}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
