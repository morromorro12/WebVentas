import { useState, type CSSProperties } from "react";
import { Star } from "lucide-react";
import "./reviews.css";

const REVIEWS = [
  { quote: "No tenía página web ni me manejaba online. Ellos se encargaron de todo y ahora digitalmente tengo una empresa profesional.", name: "Jerónimo D'Alessandro", role: "Gopet", rating: 5 },
  { quote: "Ya me diseñaron varias etiquetas de productos que antes me llevaba por lo menos una semana. Me lo hicieron en un día y muchísimo más barato. Super recomendado!!", name: "Ana Moroni", role: "Tankin", rating: 5 },
  { quote: "No me tuve que preocupar ni un momento por mi imagen online y tengo una imagen muy profesional por un costo muy barato. La verdad, les recomiendo antes de que se vuelva una empresa más grande y suba los precios.", name: "Fabricio Goncalvez", role: "Sandy Lane", rating: 4.5 },
];

// Veces que se repiten las reseñas en cada mitad de la cinta: cada mitad tiene que medir
// más que la pantalla más ancha (3 × 3 tarjetas de 424px = 3816px).
const REPEATS = 3;
const LOOP = Array.from({ length: REPEATS }, () => REVIEWS).flat();

type Review = (typeof REVIEWS)[number];

function Rating({ value }: { value: number }) {
  return (
    <div className="flex gap-1 mb-6" role="img" aria-label={`${value} de 5 estrellas`}>
      {[0, 1, 2, 3, 4].map((starIndex) => {
        const fillAmount = Math.max(0, Math.min(1, value - starIndex));
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
  );
}

function ReviewCard({ review, hidden }: { review: Review; hidden: boolean }) {
  return (
    <li
      className="reviews-card flex flex-col bg-card/10 p-6 md:p-10 border-2 border-white/20 hover:border-accent transition-colors duration-300"
      aria-hidden={hidden || undefined}
    >
      <Rating value={review.rating} />
      <p className="text-lg md:text-xl font-medium mb-8 text-white/90">"{review.quote}"</p>
      <div className="mt-auto">
        <div className="font-bold uppercase tracking-wider text-white">{review.name}</div>
        <div className="text-sm text-white/60 mt-1">{review.role}</div>
      </div>
    </li>
  );
}

export function Reviews() {
  const [paused, setPaused] = useState(false);
  const resume = () => setPaused(false);

  return (
    <section className="py-24 bg-foreground text-background" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="text-5xl md:text-7xl font-black font-display mb-16 px-6 text-center text-white">
        Reseñas.
      </h2>

      {/* Mantener el dedo apretado la frena; al soltar (o al empezar a scrollear) sigue. */}
      <div
        className="reviews-marquee"
        data-paused={paused || undefined}
        onPointerDown={() => setPaused(true)}
        onPointerUp={resume}
        onPointerCancel={resume}
        onPointerLeave={resume}
      >
        <div className="reviews-track" style={{ "--count": LOOP.length } as CSSProperties}>
          {/* Solo la primera tanda de la primera mitad la leen los lectores de pantalla. */}
          {[0, 1].map((half) => (
            <ul key={half} className="reviews-group" aria-hidden={half === 1 || undefined}>
              {LOOP.map((review, i) => (
                <ReviewCard key={i} review={review} hidden={half === 0 && i >= REVIEWS.length} />
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
