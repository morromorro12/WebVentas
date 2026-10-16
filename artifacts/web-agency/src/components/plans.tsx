import * as Popover from "@radix-ui/react-popover";
import { Check, X } from "lucide-react";
import "./plans.css";

// `tag` va arriba del nombre; el recomendado lleva la etiqueta roja.
const PLANS = [
  { name: "Primeros clientes", price: "$3.200", tag: "Plan más chico" },
  { name: "Avanzado", price: "$4.500", tag: "Recomendado", recommended: true },
  { name: "Profesional", price: "$9.000" },
];

// true / false se muestran como tick verde o cruz roja; un texto se muestra tal cual.
type Value = boolean | string;

// Lo que va entre ** se resalta.
const ROWS: { label: string; values: Value[] }[] = [
  { label: "Reunión inicial", values: [true, true, true] },
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

/* Comparación de los tres planes de anuncios. Es una tabla (roles ARIA) armada con grilla: en
   el celular el nombre de cada fila va arriba, a todo el ancho, y los tres valores debajo; en
   escritorio el nombre va en su propia columna a la izquierda. */
export function PlansTable() {
  return (
    <div className="pl-table" role="table" aria-label="Planes de anuncios, precios por mes">
      <div className="pl-row pl-head" role="row">
        <span className="pl-corner" role="cell" />
        {PLANS.map((plan) => (
          <div key={plan.name} className="pl-plan" role="columnheader">
            {plan.tag && (
              <span className="pl-tag" data-recommended={plan.recommended || undefined}>
                {plan.tag}
              </span>
            )}
            <span className="pl-name">{plan.name}</span>
            <span className="pl-price">{plan.price}</span>
            <span className="pl-per">por mes</span>
          </div>
        ))}
      </div>

      {ROWS.map((row) => (
        <div key={row.label} className="pl-row" role="row">
          <div className="pl-label" role="rowheader">
            {rich(row.label)}
          </div>
          {row.values.map((value, i) => (
            <div key={PLANS[i].name} className="pl-cell" role="cell">
              <Cell value={value} />
            </div>
          ))}
        </div>
      ))}

      <div className="pl-row" role="row">
        <div className="pl-label" role="rowheader">
          Inversión en anuncios
        </div>
        {/* Un solo "?", al medio, que explica la inversión para los tres planes. */}
        <div className="pl-cell pl-cell-all" role="cell" aria-colspan={PLANS.length}>
          <AdSpendHelp />
        </div>
      </div>
    </div>
  );
}
