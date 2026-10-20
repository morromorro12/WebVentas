// Eventos del píxel de Meta (el código base está en index.html). Cada evento sale dos veces: por el
// píxel del navegador y por /api/eventos (Conversions API, desde el servidor), que llega aunque un
// bloqueador de anuncios frene el píxel. Las dos copias llevan el mismo eventID y Meta cuenta una.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    // eventID del PageView que manda index.html.
    metaPageViewId?: string;
  }
}

type MetaEvent = "PageView" | "Contact" | "ViewContent";
type MetaData = { content_name?: string; content_category?: string };

const newEventId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

// Para ver los eventos del servidor en "Probar eventos" de Meta: abrir la web con ?meta_test=TEST12345.
const testEventCode = () => new URLSearchParams(window.location.search).get("meta_test") ?? undefined;

function sendToServer(event: MetaEvent, eventId: string, data?: MetaData) {
  const body = JSON.stringify({
    event_name: event,
    event_id: eventId,
    event_source_url: window.location.href,
    custom_data: data,
    test_event_code: testEventCode(),
  });
  // sendBeacon termina de mandarse aunque la persona se vaya de la página (por ejemplo, a WhatsApp).
  if (!navigator.sendBeacon?.("/api/eventos", body)) {
    fetch("/api/eventos", { method: "POST", body, keepalive: true }).catch(() => {});
  }
}

export function trackMeta(event: MetaEvent, data?: MetaData) {
  const eventId = newEventId();
  window.fbq?.("track", event, data ?? {}, { eventID: eventId });
  sendToServer(event, eventId, data);
}

export function startMetaTracking() {
  // Copia del PageView para el servidor, cuando termina de cargar la página: para entonces el píxel ya
  // creó la cookie _fbp, que ayuda a Meta a reconocer a la persona.
  const pageViewId = window.metaPageViewId;
  if (pageViewId) {
    const send = () => sendToServer("PageView", pageViewId);
    if (document.readyState === "complete") send();
    else window.addEventListener("load", send, { once: true });
  }

  // Tocar un link con data-contact (los botones de WhatsApp y el mail del pie) es un Contact;
  // data-contact dice qué botón fue. El mail de /privacidad no lo lleva: escribir por tus datos no es un cliente.
  document.addEventListener("click", (e) => {
    const link = (e.target as Element).closest<HTMLAnchorElement>("a[data-contact]");
    if (!link) return;
    trackMeta("Contact", {
      content_name: link.dataset.contact,
      content_category: link.href.startsWith("mailto:") ? "Mail" : "WhatsApp",
    });
  });
}
