import * as Popover from "@radix-ui/react-popover";
import { Check, X } from "lucide-react";
import "./plans.css";

// El recomendado lleva la etiqueta roja arriba del nombre.
const PLANS = [
  { name: "Inicial", price: "$3.200" },
  { name: "Avanzado", price: "$4.500", recommended: true },
  { name: "Profesional", price: "$9.000" },
];

// true / false se muestran como tick verde o cruz roja; un texto se muestra tal cual.
type Value = boolean | string;

// Lo que va entre ** se resalta.
const ROWS: { label: string; values: Value[] }[] = [
  { label: "Anuncios creados por mes", values: ["2", "4", "6"] },
  { label: "Testeo **profundo** de anuncios para mejora constante de campaña", values: [false, true, true] },
  // El espacio duro deja "15 días" junto si no entra en una línea.
  { label: "Informe y mejoras", values: ["1 por mes", "1 cada 15 días", "1 cada 15 días"] },
  { label: "Página web gratis", values: [false, true, true] },
  { label: "Manejo de tu Instagram", values: [false, false, true] },
];

const rich = (text: string) =>
  text.split("**").map((part, i) =>
    i % 2 ? (
      <strong key={i} className="pl-em">
        {part}
      </strong>
    ) : (
      part
    ),
  );

function Cell({ value }: { value: Value }) {
  if (typeof value === "string") {
    return <span className={value.length <= 2 ? "pl-count" : "pl-text"}>{value}</span>;
  }
  return (
    <span className="pl-icon" data-included={value || undefined}>
      {value ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}
      <span className="sr-only">{value ? "Sí" : "No"}</span>
    </span>
  );
}

function AdSpendHelp() {
  return (
    <Popover.Root>
      <Popover.Trigger className="pl-help" aria-label="¿Qué es la inversión en anuncios?">
        ?
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="pl-pop" side="top" sideOffset={10} collisionPadding={16}>
          <p className="pl-pop-title">Inversión en anuncios</p>
          <p>
            Es la plata que va directo a Instagram y Facebook para mostrar tus anuncios. Se paga aparte del plan y la
            definimos juntos.
          </p>
          <Popover.Arrow className="pl-pop-arrow" width={14} height={7} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// Comparación de los tres planes de anuncios: nombres de fila a la izquierda, un plan por columna.
export function PlansTable() {
  return (
    <table className="pl-table">
      <caption className="sr-only">Planes de anuncios, precios por mes</caption>
      <colgroup>
        <col />
        {PLANS.map((plan) => (
          <col key={plan.name} className="pl-col" />
        ))}
      </colgroup>
      <thead>
        <tr>
          <td />
          {PLANS.map((plan) => (
            <th key={plan.name} scope="col">
              <div className="pl-plan">
                {plan.recommended && <span className="pl-tag">Recomendado</span>}
                <span className="pl-name">{plan.name}</span>
                <span className="pl-price">{plan.price}</span>
                <span className="pl-per">por mes</span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ROWS.map((row) => (
          <tr key={row.label}>
            <th scope="row">{rich(row.label)}</th>
            {row.values.map((value, i) => (
              <td key={PLANS[i].name}>
                <Cell value={value} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">Inversión en anuncios</th>
          {/* Un solo "?", al medio, que explica la inversión para los tres planes. */}
          <td colSpan={PLANS.length}>
            <AdSpendHelp />
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
