import * as Popover from "@radix-ui/react-popover";
import { Check, X } from "lucide-react";
import "./plans.css";

const PLANS = [
  { name: "Arranque", price: "$3.000", spend: "$2.500" },
  { name: "Crecimiento", price: "$6.000", spend: "$7.000", recommended: true },
  { name: "Todo incluido", price: "$10.000", spend: "$7.000" },
];

// true / false se muestran como tick verde o cruz roja; un texto se muestra tal cual.
type Value = boolean | string;

// Corto y sin palabras técnicas: lo tiene que entender cualquiera.
const ROWS: { label: string; values: Value[] }[] = [
  { label: "Reunión inicial", values: [true, true, true] },
  { label: "Anuncios por mes", values: ["2", "4", "8"] },
  { label: "Testeo a fondo para vender más", values: [false, true, true] },
  { label: "Informe y mejoras", values: ["1 por mes", "2 por mes", "2 por mes"] },
  { label: "Página web gratis", values: [false, true, true] },
  { label: "Manejo de tu Instagram", values: [false, false, true] },
];

const highlight = (i: number) => (PLANS[i].recommended ? "pl-hl" : undefined);

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
          <p>Es la plata que va directo a Instagram y Facebook para mostrar tus anuncios. Se paga aparte del plan.</p>
          <Popover.Arrow className="pl-pop-arrow" width={14} height={7} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// Comparación de los tres planes de anuncios, con el recomendado resaltado en negro.
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
          {PLANS.map((plan, i) => (
            <th key={plan.name} scope="col" className={highlight(i)}>
              {plan.recommended && <span className="pl-chip">Recomendado</span>}
              <span className="pl-name">{plan.name}</span>
              <span className="pl-price">{plan.price}</span>
              <span className="pl-per">por mes</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ROWS.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}</th>
            {row.values.map((value, i) => (
              <td key={PLANS[i].name} className={highlight(i)}>
                <Cell value={value} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">
            <span className="pl-spend">
              Inversión en anuncios <AdSpendHelp />
            </span>
          </th>
          {PLANS.map((plan, i) => (
            <td key={plan.name} className={highlight(i)}>
              <span className="pl-from">desde</span>
              <span className="pl-text">{plan.spend}</span>
            </td>
          ))}
        </tr>
      </tfoot>
    </table>
  );
}
