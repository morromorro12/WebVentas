/// <reference lib="dom" />

// Conversions API de Meta (función de Vercel en /api/eventos). La web manda acá una copia de cada
// evento del píxel (artifacts/web-agency/src/lib/meta.ts) y esta función se la pasa a Meta desde el
// servidor, con el mismo event_id que el navegador para que Meta no la cuente doble.
// Necesita el token de la variable de entorno META_CAPI_TOKEN de Vercel; sin él no manda nada.

// Solo lo que esta función usa de Node; Vercel la corre en Node.
declare const process: { env: Record<string, string | undefined> };

const PIXEL_ID = "1487876526446275"; // el mismo de artifacts/web-agency/index.html
const GRAPH_URL = `https://graph.facebook.com/v26.0/${PIXEL_ID}/events`;
const EVENTS = new Set(["PageView", "Contact", "ViewContent"]);

const text = (value: unknown, max: number) =>
  typeof value === "string" && value.length > 0 && value.length <= max ? value : undefined;

function cookie(header: string | null, name: string) {
  for (const part of header?.split(";") ?? []) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

export async function POST(request: Request) {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return new Response(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }

  const eventName = text(body.event_name, 50);
  const eventId = text(body.event_id, 100);
  const sourceUrl = text(body.event_source_url, 2000);
  let page: URL;
  try {
    page = new URL(sourceUrl ?? "");
  } catch {
    return new Response(null, { status: 400 });
  }
  // Solo eventos de esta misma web.
  if (!eventName || !EVENTS.has(eventName) || !eventId || page.host !== new URL(request.url).host) {
    return new Response(null, { status: 400 });
  }

  const custom = (body.custom_data ?? {}) as Record<string, unknown>;
  const contentName = text(custom.content_name, 100);
  const contentCategory = text(custom.content_category, 50);
  const testCode = text(body.test_event_code, 50);

  // _fbc lo crea el píxel cuando la persona llega desde un anuncio (?fbclid=...). Si el píxel estaba
  // bloqueado no existe, y se arma igual con el fbclid de la URL.
  const cookies = request.headers.get("cookie");
  const fbclid = page.searchParams.get("fbclid");
  const fbc = cookie(cookies, "_fbc") ?? (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);

  const event = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    action_source: "website",
    event_source_url: sourceUrl,
    user_data: {
      client_ip_address: request.headers.get("x-forwarded-for")?.split(",")[0].trim(),
      client_user_agent: request.headers.get("user-agent") ?? undefined,
      fbp: cookie(cookies, "_fbp"),
      fbc,
    },
    custom_data: contentName || contentCategory ? { content_name: contentName, content_category: contentCategory } : undefined,
  };

  const res = await fetch(`${GRAPH_URL}?access_token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ data: [event], test_event_code: testCode && /^TEST\w+$/.test(testCode) ? testCode : undefined }),
  });
  // Se ve en los logs de la función en Vercel.
  if (!res.ok) console.error("Meta Conversions API", res.status, await res.text());

  return new Response(null, { status: 204 });
}
