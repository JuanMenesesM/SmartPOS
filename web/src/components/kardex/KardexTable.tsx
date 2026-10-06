import { MoreVertical, ExternalLink, Printer, Copy, Package, FileText, ClipboardList, Plus } from "lucide-react";
import { MovimientoKardex } from "@/types/producto";
import KardexBadge from "./KardexBadge";

interface Props {
  movimientos: MovimientoKardex[];
  onRowClick: (movimiento: MovimientoKardex) => void;
  onNuevoAjuste: () => void;
}

export default function KardexTable({ movimientos, onRowClick, onNuevoAjuste }: Props) {
  if (movimientos.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border py-10 px-6 text-center flex flex-col items-center justify-center space-y-3 min-h-[240px]">
        <div className="h-12 w-12 rounded-2xl bg-muted/80 flex items-center justify-center text-muted-foreground">
          <ClipboardList className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">No existen movimientos</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Los movimientos aparecerán cuando se registren compras, ventas o ajustes en el inventario.
          </p>
        </div>
        <button
          onClick={onNuevoAjuste}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-[0.98] transition-all duration-150 mt-1"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Registrar Ajuste</span>
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm">
      <table className="w-full text-xs text-left">
        <thead className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/30 border-b border-border/60">
          <tr>
            <th className="px-4 py-3 font-semibold text-center">Fecha</th>
            <th className="px-4 py-3 font-semibold text-center">Producto</th>
            <th className="px-4 py-3 font-semibold text-center">Tipo</th>
            <th className="px-4 py-3 font-semibold text-center">Documento</th>
            <th className="px-4 py-3 font-semibold text-center">Cantidad</th>
            <th className="px-4 py-3 font-semibold text-center">Antes</th>
            <th className="px-4 py-3 font-semibold text-center">Después</th>
            <th className="px-4 py-3 font-semibold text-center">Usuario</th>
            <th className="px-4 py-3 text-center w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {movimientos.map((mov) => (
            <tr 
              key={mov.id} 
              className="hover:bg-muted/40 cursor-pointer transition-colors group"
              onClick={() => onRowClick(mov)}
            >
              <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap font-medium text-center">
                {new Date(mov.fecha).toLocaleString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </td>
              <td className="px-4 py-2.5 font-semibold text-foreground whitespace-nowrap text-center">
                {mov.productoNombre}
              </td>
              <td className="px-4 py-2.5 whitespace-nowrap text-center">
                <KardexBadge tipo={mov.tipo} />
              </td>
              <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground whitespace-nowrap text-center">
                {mov.documento || "—"}
              </td>
              <td className={`px-4 py-2.5 font-extrabold text-center whitespace-nowrap ${mov.cantidad > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {mov.cantidad > 0 ? "+" : ""}{mov.cantidad}
              </td>
              <td className="px-4 py-2.5 text-center font-mono text-muted-foreground">
                {mov.stockAnterior}
              </td>
              <td className="px-4 py-2.5 text-center font-black font-mono text-foreground">
                {mov.stockNuevo}
              </td>
              <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap font-medium text-center">
                {mov.usuario}
              </td>
              <td className="px-4 py-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onRowClick(mov)}
                  className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold rounded-lg bg-muted/60 hover:bg-primary hover:text-primary-foreground text-muted-foreground border border-border/60 hover:border-primary transition-all duration-150"
                  title="Ver detalle"
                >
                  <Package className="h-3 w-3 shrink-0" />
                  <span>Ver Detalle</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
