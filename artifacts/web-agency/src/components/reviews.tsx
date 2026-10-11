import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode, type RefObject } from "react";
import { Mic, Pause, Play, Star } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import "./reviews.css";

const REVIEWS = [
  { quote: "No tenía página web ni me manejaba online. Ellos se encargaron de todo y ahora digitalmente tengo una empresa profesional.", name: "Jerónimo D'Alessandro", role: "Gopet", rating: 5 },
  { quote: "Ya me diseñaron varias etiquetas de productos que antes me llevaba por lo menos una semana. Me lo hicieron en un día y muchísimo más barato. Super recomendado!!", name: "Ana Moroni", role: "Tankin", rating: 5 },
  { quote: "No me tuve que preocupar ni un momento por mi imagen online y tengo una imagen muy profesional por un costo muy barato. La verdad, les recomiendo antes de que se vuelva una empresa más grande y suba los precios.", name: "Fabricio Goncalvez", role: "Sandy Lane", rating: 4.5 },
];

// Audios de clientes sacados de grabaciones de pantalla de WhatsApp, a la velocidad en que se
// grabaron. "bars" es la onda real de cada audio, 40 barras de 0 a 1.
const VOICES = [
  { src: "/audio/resena-voz-2.m4a", duration: 11.23, bars: [0.88, 0.2, 0.91, 0.94, 0.96, 0.9, 0.85, 0.91, 0.94, 0.96, 0.85, 0.87, 0.89, 0.84, 0.91, 0.9, 0.96, 0.27, 0.98, 0.9, 0.89, 0.89, 0.87, 0.81, 0.91, 0.86, 0.91, 0.91, 1.0, 0.97, 0.86, 0.94, 0.86, 0.68, 0.89, 0.94, 1.0, 0.8, 0.84, 0.41] },
  { src: "/audio/resena-voz-5.m4a", duration: 12.82, bars: [1.0, 1.0, 1.0, 0.78, 0.74, 0.12, 0.85, 0.81, 0.65, 0.94, 0.95, 0.8, 0.7, 0.83, 0.8, 0.23, 0.64, 0.96, 0.78, 0.84, 0.89, 0.83, 0.83, 0.75, 0.87, 0.75, 0.74, 0.81, 0.83, 0.85, 0.82, 0.78, 0.85, 0.99, 0.93, 0.41, 0.21, 0.46, 0.86, 0.74] },
  { src: "/audio/resena-voz-4.m4a", duration: 11.83, bars: [0.75, 0.61, 0.8, 1.0, 0.87, 0.54, 0.83, 0.84, 0.71, 0.75, 0.77, 0.76, 0.55, 0.13, 0.12, 0.16, 0.48, 0.83, 0.82, 0.87, 0.61, 0.4, 0.46, 0.14, 0.98, 0.96, 0.83, 0.12, 1.0, 0.8, 0.21, 0.22, 0.29, 1.0, 1.0, 0.74, 0.89, 0.44, 0.12, 0.2] },
  { src: "/audio/resena-voz-3.m4a", duration: 5.0, bars: [0.12, 0.45, 1.0, 1.0, 0.95, 0.81, 0.87, 0.69, 0.73, 0.7, 0.67, 0.12, 0.75, 0.71, 0.79, 0.75, 0.14, 0.12, 0.79, 0.75, 0.12, 0.76, 0.79, 0.66, 0.69, 0.86, 0.69, 0.82, 0.74, 0.75, 0.65, 0.61, 0.37, 0.31, 0.12, 0.12, 0.12, 0.12, 0.12, 0.61] },
  { src: "/audio/resena-voz-1.m4a", duration: 3.98, bars: [0.12, 0.17, 0.19, 0.3, 0.45, 0.98, 1.0, 0.64, 1.0, 1.0, 0.24, 0.13, 0.35, 0.49, 0.63, 0.57, 0.39, 0.3, 0.32, 0.46, 0.63, 0.43, 0.2, 0.24, 0.18, 0.14, 0.14, 0.14, 0.44, 0.53, 0.29, 0.14, 0.16, 0.14, 0.15, 0.15, 0.17, 0.14, 0.15, 0.12] },
];

const SHOTS = [
  {
    name: "chat-1", width: 1170, height: 1085,
    alt: "Captura de WhatsApp: un cliente cuenta que la campaña le trajo varios clientes invirtiendo poco y que está consiguiendo clientes de vuelta sin hacer nada.",
  },
  {
    name: "chat-2", width: 1170, height: 1273,
    alt: "Captura de WhatsApp: un cliente cuenta que en comparación con cómo venía antes ya cambió, y que es un proceso bastante rápido.",
  },
];

type Review = (typeof REVIEWS)[number];

const formatTime = (seconds: number) => {
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/* ---------- Capturas ---------- */

function Shot({ index, onOpen }: { index: number; onOpen: () => void }) {
  const shot = SHOTS[index];
  return (
    <button type="button" className="proof-shot" onClick={onOpen} aria-label={`Ver en grande. ${shot.alt}`}>
      <img
        src={`/images/resenas/${shot.name}-800.webp`}
        srcSet={`/images/resenas/${shot.name}-544.webp 544w, /images/resenas/${shot.name}-800.webp 800w, /images/resenas/${shot.name}-1170.webp 1170w`}
        sizes="(min-width: 1024px) 360px, (min-width: 768px) 45vw, calc(100vw - 48px)"
        width={shot.width}
        height={shot.height}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </button>
  );
}

/* ---------- Audios ---------- */

// Un solo reproductor para todos: suena un audio a la vez. El avance se escribe directo en el
// DOM (--progress y el tiempo) para no re-renderizar a cada cuadro.
function useVoicePlayer(root: RefObject<HTMLElement | null>) {
  const [playing, setPlaying] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentRef = useRef<number | null>(null);

  const paint = (index: number, time: number | null) => {
    const el = root.current?.querySelector<HTMLElement>(`[data-voice="${index}"]`);
    if (!el) return;
    const { duration } = VOICES[index];
    el.style.setProperty("--progress", String(time === null ? 0 : Math.min(1, time / duration)));
    const label = el.querySelector(".voice-time");
    if (label) label.textContent = time === null ? formatTime(duration) : `${formatTime(time)} / ${formatTime(duration)}`;
  };

  useEffect(() => {
    if (playing === null) return;
    const audio = audioRef.current;
    if (!audio) return;
    let raf = 0;
    const tick = () => {
      paint(playing, audio.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useEffect(() => () => audioRef.current?.pause(), []);

  const getAudio = () => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio();
    audio.preload = "auto";
    audio.addEventListener("play", () => setPlaying(currentRef.current));
    audio.addEventListener("pause", () => setPlaying(null));
    audio.addEventListener("ended", () => {
      if (currentRef.current !== null) paint(currentRef.current, null);
    });
    audioRef.current = audio;
    return audio;
  };

  // Arranca (o sigue) el audio `index`; con `from` (0 a 1) salta a ese punto.
  const play = (index: number, from?: number) => {
    const audio = getAudio();
    if (currentRef.current !== index) {
      if (currentRef.current !== null) paint(currentRef.current, null);
      currentRef.current = index;
      audio.src = VOICES[index].src;
    }
    if (from !== undefined) {
      const seek = () => {
        audio.currentTime = from * (audio.duration || VOICES[index].duration);
        paint(index, audio.currentTime);
      };
      if (audio.readyState >= 1) seek();
      else audio.addEventListener("loadedmetadata", seek, { once: true });
    }
    void audio.play().catch(() => setPlaying(null));
  };

  const toggle = (index: number) => {
    if (playing === index) audioRef.current?.pause();
    else play(index);
  };

  return { playing, toggle, play };
}

function VoicePlayer({
  index,
  playing,
  onToggle,
  onSeek,
}: {
  index: number;
  playing: boolean;
  onToggle: () => void;
  onSeek: (fraction: number) => void;
}) {
  const voice = VOICES[index];
  const seek = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
  };
  const bars = (extra = "") => (
    <span className={`voice-bars ${extra}`}>
      {voice.bars.map((h, i) => (
        <span key={i} style={{ height: `${h * 100}%` }} />
      ))}
    </span>
  );

  return (
    <li className="voice" data-voice={index} data-playing={playing || undefined}>
      <button
        type="button"
        className="voice-play"
        onClick={onToggle}
        aria-label={playing ? "Pausar audio" : `Escuchar audio de un cliente (${formatTime(voice.duration)})`}
      >
        {playing ? <Pause fill="currentColor" strokeWidth={0} /> : <Play fill="currentColor" strokeWidth={0} />}
      </button>
      <div className="voice-main">
        {/* Tocar la onda salta a ese punto del audio. */}
        <div className="voice-wave" onPointerDown={seek} aria-hidden="true">
          {bars()}
          {bars("voice-bars-played")}
        </div>
        <div className="voice-meta">
          <span>Mensaje de voz</span>
          <span className="voice-time">{formatTime(voice.duration)}</span>
        </div>
      </div>
    </li>
  );
}

/* ---------- Reseñas escritas: cinta chica que se desliza sin fin ---------- */

/* Cada mitad de la pista repite las reseñas `repeats` veces y tiene que medir más que la
   pantalla más ancha; se corre exactamente una mitad por vuelta, así no se nota el salto.
   Solo la primera tanda la leen los lectores de pantalla. */
function Marquee<T>({
  items,
  repeats,
  render,
}: {
  items: T[];
  repeats: number;
  render: (item: T, hidden: boolean, key: string) => ReactNode;
}) {
  // Mantener el dedo apretado la frena; al soltar (o al empezar a scrollear) sigue.
  const [held, setHeld] = useState(false);
  const release = () => setHeld(false);
  const loop = Array.from({ length: repeats }, () => items).flat();

  return (
    <div
      className="reviews-marquee"
      data-paused={held || undefined}
      onPointerDown={() => setHeld(true)}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
    >
      <div className="reviews-track" style={{ "--count": loop.length } as CSSProperties}>
        {[0, 1].map((half) => (
          <ul key={half} className="reviews-group" aria-hidden={half === 1 || undefined}>
            {loop.map((item, i) => render(item, half === 1 || i >= items.length, `${half}-${i}`))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function Rating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${value} de 5 estrellas`}>
      {[0, 1, 2, 3, 4].map((starIndex) => {
        const fillAmount = Math.max(0, Math.min(1, value - starIndex));
        return (
          <div key={starIndex} className="relative w-3.5 h-3.5">
            <Star className="w-3.5 h-3.5 text-white/20 absolute inset-0" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillAmount * 100}%` }}>
              <Star className="w-3.5 h-3.5 text-accent fill-accent" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReviewCard({ review, hidden }: { review: Review; hidden: boolean }) {
  return (
    <li className="reviews-card" aria-hidden={hidden || undefined}>
      <Rating value={review.rating} />
      <p className="reviews-quote">"{review.quote}"</p>
      <p className="reviews-author">
        <span className="text-white font-semibold">{review.name}</span> · {review.role}
      </p>
    </li>
  );
}

/* ---------- Sección ---------- */

export function Reviews() {
  const voicesRef = useRef<HTMLUListElement>(null);
  const { playing, toggle, play } = useVoicePlayer(voicesRef);
  const [openShot, setOpenShot] = useState<number | null>(null);

  return (
    <section className="py-24 bg-foreground text-white" aria-labelledby="reviews-title">
      <div className="max-w-6xl mx-auto px-6">
        <h2 id="reviews-title" className="text-5xl md:text-7xl font-black font-display text-center">
          Reseñas.
        </h2>
        <p className="mt-4 mb-12 md:mb-16 text-center text-lg text-white/60">
          Mensajes reales que nos mandan nuestros clientes por WhatsApp.
        </p>

        <div className="proof-grid">
          {SHOTS.map((_, i) => (
            <Shot key={i} index={i} onOpen={() => setOpenShot(i)} />
          ))}

          <div className="proof-voices">
            <h3 className="proof-label">
              <Mic aria-hidden="true" />
              Audios de clientes
            </h3>
            <ul ref={voicesRef}>
              {VOICES.map((_, i) => (
                <VoicePlayer
                  key={i}
                  index={i}
                  playing={playing === i}
                  onToggle={() => toggle(i)}
                  onSeek={(fraction) => play(i, fraction)}
                />
              ))}
            </ul>
          </div>
        </div>

        <h3 className="mt-20 md:mt-24 pt-12 mb-8 border-t border-white/10 text-center text-xs font-bold uppercase tracking-[0.2em] text-white/50">
          Otras reseñas
        </h3>
      </div>

      <Marquee
        items={REVIEWS}
        repeats={3}
        render={(review, hidden, key) => <ReviewCard key={key} review={review} hidden={hidden} />}
      />

      <Dialog open={openShot !== null} onOpenChange={(open) => !open && setOpenShot(null)}>
        <DialogContent
          className="w-[min(92vw,560px)] max-w-none p-0 overflow-hidden border-0 rounded-2xl gap-0"
          aria-describedby={undefined}
        >
          {openShot !== null && (
            <>
              <DialogTitle className="sr-only">Captura de WhatsApp de un cliente</DialogTitle>
              <img
                src={`/images/resenas/${SHOTS[openShot].name}-1170.webp`}
                width={SHOTS[openShot].width}
                height={SHOTS[openShot].height}
                alt={SHOTS[openShot].alt}
                className="block w-full h-auto max-h-[85vh] object-contain bg-[#efeae2]"
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
