import { TipoMovimientoKardex } from "@/types/producto";

interface Props {
  tipo: TipoMovimientoKardex;
  className?: string;
}

export default function KardexBadge({ tipo, className = "" }: Props) {
  let bgColor = "";
  let textColor = "";
  let dotColor = "";
  let label = "";

  switch (tipo) {
    case "COMPRA":
      bgColor = "bg-emerald-50 dark:bg-emerald-500/10";
      textColor = "text-emerald-700 dark:text-emerald-400";
      dotColor = "bg-emerald-500";
      label = "Compra";
      break;
    case "VENTA":
      bgColor = "bg-red-50 dark:bg-red-500/10";
      textColor = "text-red-700 dark:text-red-400";
      dotColor = "bg-red-500";
      label = "Venta";
      break;
    case "AJUSTE":
      bgColor = "bg-violet-50 dark:bg-violet-500/10";
      textColor = "text-violet-700 dark:text-violet-400";
      dotColor = "bg-violet-500";
      label = "Ajuste";
      break;
    case "MERMA":
      bgColor = "bg-orange-50 dark:bg-orange-500/10";
      textColor = "text-orange-700 dark:text-orange-400";
      dotColor = "bg-orange-500";
      label = "Merma";
      break;
    case "DEVOLUCION":
      bgColor = "bg-blue-50 dark:bg-blue-500/10";
      textColor = "text-blue-700 dark:text-blue-400";
      dotColor = "bg-blue-500";
      label = "Devolución";
      break;
    case "ELIMINACION":
      bgColor = "bg-slate-100 dark:bg-slate-500/10";
      textColor = "text-slate-700 dark:text-slate-300";
      dotColor = "bg-slate-700 dark:bg-slate-400";
      label = "Eliminación";
      break;
    default:
      bgColor = "bg-gray-100 dark:bg-gray-800";
      textColor = "text-gray-700 dark:text-gray-300";
      dotColor = "bg-gray-500";
      label = tipo;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase ${bgColor} ${textColor} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
}
