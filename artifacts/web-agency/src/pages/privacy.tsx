import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { EMAIL } from "@/lib/contact";
import "./privacy.css";

// /privacidad: lo que piden las condiciones de Meta por usar su píxel (qué se junta, para qué y
// cómo desactivarlo). En Vercel la ruta va a index.html por el rewrite de vercel.json.
export default function Privacy() {
  useEffect(() => {
    const previous = document.title;
    document.title = "Privacidad | Píxel.";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <main className="pv">
      <nav className="pv-nav">
        <a href="/" className="pv-logo" aria-label="Píxel, ir al inicio">
          PÍXEL<span>.</span>
        </a>
        <a href="/" className="pv-back">
          <ArrowLeft aria-hidden="true" /> Volver
        </a>
      </nav>

      <article className="pv-body">
        <h1>Privacidad.</h1>
        <p className="pv-date">Actualizado el 20 de octubre de 2026.</p>

        <p>
          Esta web es de Estudio Píxel, agencia de marketing digital en Uruguay. Acá te contamos qué datos se juntan
          cuando la visitás, para qué, y cómo podés evitarlo.
        </p>

        <h2>Qué datos se juntan</h2>
        <p>
          La web no tiene formularios ni cuentas: no te pedimos tu nombre, tu mail ni tu teléfono. Cuando la visitás se
          registran datos técnicos: las páginas que ves, los botones que tocás (por ejemplo, los de WhatsApp), tu
          dirección IP y el tipo de navegador y de dispositivo.
        </p>

        <h2>Cookies de Meta</h2>
        <p>
          Usamos el píxel y la API de conversiones de Meta (la empresa de Facebook, Instagram y WhatsApp) para saber
          cuántas personas llegan desde nuestros anuncios y cuántas nos escriben. Meta y otros terceros pueden usar
          cookies, web beacons y tecnologías parecidas para recopilar o recibir información de esta web y de otros sitios
          de internet, y usarla para medir anuncios y mostrarte anuncios que te puedan interesar. Las cookies que usa en
          esta web se llaman _fbp y _fbc.
        </p>
        <p>
          Cómo usa Meta esa información lo explica su{" "}
          <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">
            Política de privacidad
          </a>
          .
        </p>

        <h2>Cómo desactivarlo</h2>
        <ul>
          <li>
            En las{" "}
            <a href="https://www.facebook.com/adpreferences" target="_blank" rel="noopener noreferrer">
              preferencias de anuncios de Meta
            </a>{" "}
            podés elegir que no use la información de otras webs para mostrarte anuncios.
          </li>
          <li>
            En{" "}
            <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer">
              aboutads.info/choices
            </a>{" "}
            o{" "}
            <a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer">
              youronlinechoices.eu
            </a>{" "}
            podés desactivar los anuncios personalizados de muchas empresas a la vez.
          </li>
          <li>Desde la configuración de tu navegador podés borrar o bloquear las cookies.</li>
        </ul>

        <h2>Cuando nos escribís</h2>
        <p>
          Si nos escribís por WhatsApp o por mail, usamos tu nombre, tu número o tu mail y tu mensaje solo para
          responderte. No se los pasamos a nadie.
        </p>

        <h2>Dónde está alojada</h2>
        <p>
          La web está alojada en Vercel, que guarda por un tiempo limitado registros técnicos de las visitas, como la
          dirección IP, para que la web funcione y sea segura.
        </p>

        <h2>Tus derechos</h2>
        <p>
          Según la Ley 18.331 de Protección de Datos Personales de Uruguay, podés pedirnos ver, corregir o borrar tus
          datos. Escribinos a <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      </article>
    </main>
  );
}
