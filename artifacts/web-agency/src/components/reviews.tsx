import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { Mic, Pause, Play, Star, User } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import "./reviews.css";

const REVIEWS = [
  { quote: "No tenía página web ni me manejaba online. Ellos se encargaron de todo y ahora digitalmente tengo una empresa profesional.", name: "Jerónimo D'Alessandro", role: "Gopet", rating: 5 },
  { quote: "Ya me diseñaron varias etiquetas de productos que antes me llevaba por lo menos una semana. Me lo hicieron en un día y muchísimo más barato. Super recomendado!!", name: "Ana Moroni", role: "Tankin", rating: 5 },
  { quote: "No me tuve que preocupar ni un momento por mi imagen online y tengo una imagen muy profesional por un costo muy barato. La verdad, les recomiendo antes de que se vuelva una empresa más grande y suba los precios.", name: "Fabricio Goncalvez", role: "Sandy Lane", rating: 4.5 },
];

// Audios de clientes sacados de grabaciones de pantalla de WhatsApp (los que estaban a 1.5x o 2x
// ya están a velocidad normal). "bars" es la onda real de cada audio, 40 barras de 0 a 1.
const VOICES = [
  { src: "/audio/resena-voz-1.m4a", duration: 3.98, bars: [0.12, 0.17, 0.19, 0.3, 0.45, 0.98, 1.0, 0.64, 1.0, 1.0, 0.24, 0.13, 0.35, 0.49, 0.63, 0.57, 0.39, 0.3, 0.32, 0.46, 0.63, 0.43, 0.2, 0.24, 0.18, 0.14, 0.14, 0.14, 0.44, 0.53, 0.29, 0.14, 0.16, 0.14, 0.15, 0.15, 0.17, 0.14, 0.15, 0.12] },
  { src: "/audio/resena-voz-2.m4a", duration: 16.85, bars: [0.76, 0.21, 0.83, 0.92, 0.94, 0.89, 0.69, 0.87, 0.86, 0.93, 0.85, 0.88, 0.79, 0.91, 0.79, 0.83, 0.85, 0.4, 0.97, 0.87, 0.9, 0.83, 0.86, 0.75, 0.81, 0.82, 0.85, 0.89, 0.48, 0.97, 0.88, 0.93, 0.83, 0.77, 0.55, 0.88, 1.0, 0.9, 0.84, 0.35] },
  { src: "/audio/resena-voz-3.m4a", duration: 9.85, bars: [0.14, 1.0, 1.0, 0.71, 0.7, 0.68, 0.67, 0.65, 0.5, 0.59, 0.52, 0.17, 0.6, 0.64, 0.61, 0.46, 0.12, 0.5, 0.72, 0.22, 0.12, 0.62, 0.68, 0.52, 0.72, 0.72, 0.61, 0.75, 0.65, 0.65, 0.6, 0.48, 0.29, 0.23, 0.12, 0.12, 0.12, 0.12, 0.12, 0.47] },
  { src: "/audio/resena-voz-4.m4a", duration: 11.83, bars: [0.75, 0.61, 0.8, 1.0, 0.87, 0.54, 0.83, 0.84, 0.71, 0.75, 0.77, 0.76, 0.55, 0.13, 0.12, 0.16, 0.48, 0.83, 0.82, 0.87, 0.61, 0.4, 0.46, 0.14, 0.98, 0.96, 0.83, 0.12, 1.0, 0.8, 0.21, 0.22, 0.29, 1.0, 1.0, 0.74, 0.89, 0.44, 0.12, 0.2] },
  { src: "/audio/resena-voz-5.m4a", duration: 19.23, bars: [1.0, 1.0, 0.86, 0.75, 0.69, 0.12, 0.74, 0.7, 0.64, 0.99, 0.84, 0.74, 0.62, 0.78, 0.8, 0.23, 0.68, 0.88, 0.72, 0.68, 0.76, 0.73, 0.75, 0.69, 0.95, 0.59, 0.64, 0.7, 0.68, 0.75, 0.78, 0.65, 0.74, 0.86, 0.74, 0.43, 0.21, 0.39, 0.77, 0.74] },
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

// Segunda cinta: capturas y audios intercalados.
type Chat = { kind: "voice"; index: number } | { kind: "shot"; index: number };
const CHATS: Chat[] = [
  { kind: "voice", index: 1 },
  { kind: "shot", index: 0 },
  { kind: "voice", index: 3 },
  { kind: "voice", index: 0 },
  { kind: "shot", index: 1 },
  { kind: "voice", index: 4 },
  { kind: "voice", index: 2 },
];

type Review = (typeof REVIEWS)[number];

const formatTime = (seconds: number) => {
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/* Cinta que se desliza sin fin. Cada mitad repite los elementos `repeats` veces y tiene que
   medir más que la pantalla más ancha; solo la primera tanda la leen los lectores de pantalla
   y se puede recorrer con el teclado. */
function Marquee<T>({
  items,
  repeats,
  reverse = false,
  paused = false,
  className = "",
  render,
}: {
  items: T[];
  repeats: number;
  reverse?: boolean;
  paused?: boolean;
  className?: string;
  render: (item: T, hidden: boolean, key: string) => ReactNode;
}) {
  // Mantener el dedo apretado la frena; al soltar (o al empezar a scrollear) sigue.
  const [held, setHeld] = useState(false);
  const release = () => setHeld(false);
  const loop = Array.from({ length: repeats }, () => items).flat();

  return (
    <div
      className={`reviews-marquee ${className}`}
      data-paused={held || paused || undefined}
      data-reverse={reverse || undefined}
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

// La onda se dibuja dos veces: gris debajo y oscura encima, recortada hasta donde va el audio.
function Waveform({ bars }: { bars: number[] }) {
  const row = (extra: string) => (
    <span className={`voice-bars ${extra}`}>
      {bars.map((h, i) => (
        <span key={i} style={{ height: `${h * 100}%` }} />
      ))}
    </span>
  );
  return (
    <span className="voice-wave" aria-hidden="true">
      {row("")}
      {row("voice-bars-played")}
      <span className="voice-dot" />
    </span>
  );
}

function VoiceCard({
  index,
  hidden,
  playing,
  onToggle,
}: {
  index: number;
  hidden: boolean;
  playing: boolean;
  onToggle: () => void;
}) {
  const voice = VOICES[index];
  const time = formatTime(voice.duration);
  return (
    <li className="chat-card chat-voice" data-voice={index} aria-hidden={hidden || undefined}>
      <span className="chat-chip">Audio de un cliente</span>
      <div className="voice-bubble">
        <button
          type="button"
          className="voice-play"
          onClick={onToggle}
          tabIndex={hidden ? -1 : undefined}
          aria-label={playing ? "Pausar audio" : `Escuchar audio de un cliente (${time})`}
        >
          {playing ? <Pause fill="currentColor" strokeWidth={0} /> : <Play fill="currentColor" strokeWidth={0} />}
        </button>
        <span className="voice-body">
          <Waveform bars={voice.bars} />
          <span className="voice-time">{time}</span>
        </span>
        <span className="voice-avatar" aria-hidden="true">
          <User />
          <Mic className="voice-avatar-mic" />
        </span>
      </div>
    </li>
  );
}

function ShotCard({ index, hidden, onOpen }: { index: number; hidden: boolean; onOpen: () => void }) {
  const shot = SHOTS[index];
  return (
    <li className="chat-card chat-shot" aria-hidden={hidden || undefined}>
      <button type="button" onClick={onOpen} tabIndex={hidden ? -1 : undefined} aria-label="Ver captura en grande">
        <img
          src={`/images/resenas/${shot.name}-544.webp`}
          srcSet={`/images/resenas/${shot.name}-544.webp 544w, /images/resenas/${shot.name}-800.webp 800w`}
          sizes="(min-width: 768px) 345px, 255px"
          width={shot.width}
          height={shot.height}
          alt={hidden ? "" : shot.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </button>
    </li>
  );
}

// Un solo reproductor para todos los audios: suena uno a la vez y todas las copias de la
// misma tarjeta muestran el mismo avance (--progress, sin re-renderizar a cada cuadro).
function useVoicePlayer(root: RefObject<HTMLElement | null>) {
  const [playing, setPlaying] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentRef = useRef<number | null>(null);

  const setProgress = (index: number, value: number) => {
    root.current?.querySelectorAll<HTMLElement>(`[data-voice="${index}"]`).forEach((el) => {
      el.style.setProperty("--progress", String(value));
    });
  };

  useEffect(() => {
    if (playing === null) return;
    const audio = audioRef.current;
    if (!audio) return;
    let raf = 0;
    const tick = () => {
      if (audio.duration) setProgress(playing, audio.currentTime / audio.duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useEffect(() => () => audioRef.current?.pause(), []);

  const toggle = (index: number) => {
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio();
      audio.preload = "auto";
      audio.addEventListener("ended", () => {
        if (currentRef.current !== null) setProgress(currentRef.current, 0);
        setPlaying(null);
      });
      audio.addEventListener("pause", () => setPlaying(null));
      audio.addEventListener("play", () => setPlaying(currentRef.current));
      audioRef.current = audio;
    }
    if (currentRef.current === index && !audio.paused) {
      audio.pause();
      return;
    }
    if (currentRef.current !== index) {
      if (currentRef.current !== null) setProgress(currentRef.current, 0);
      currentRef.current = index;
      audio.src = VOICES[index].src;
    }
    void audio.play().catch(() => setPlaying(null));
  };

  return { playing, toggle };
}

export function Reviews() {
  const chatsRef = useRef<HTMLDivElement>(null);
  const { playing, toggle } = useVoicePlayer(chatsRef);
  const [openShot, setOpenShot] = useState<number | null>(null);

  return (
    <section className="py-24 bg-foreground text-background" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="text-5xl md:text-7xl font-black font-display mb-16 px-6 text-center text-white">
        Reseñas.
      </h2>

      <Marquee
        items={REVIEWS}
        repeats={3}
        render={(review, hidden, key) => <ReviewCard key={key} review={review} hidden={hidden} />}
      />

      {/* Va para el otro lado y se frena mientras suena un audio. */}
      <div ref={chatsRef} className="mt-6 md:mt-8">
        <Marquee
          items={CHATS}
          repeats={2}
          reverse
          paused={playing !== null}
          className="reviews-chats"
          render={(chat, hidden, key) =>
            chat.kind === "voice" ? (
              <VoiceCard
                key={key}
                index={chat.index}
                hidden={hidden}
                playing={playing === chat.index}
                onToggle={() => toggle(chat.index)}
              />
            ) : (
              <ShotCard key={key} index={chat.index} hidden={hidden} onOpen={() => setOpenShot(chat.index)} />
            )
          }
        />
      </div>

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
