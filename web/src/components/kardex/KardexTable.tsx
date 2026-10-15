import { Eye, ClipboardList, Plus } from "lucide-react";
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
      <div className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border/80 py-12 px-6 text-center flex flex-col items-center justify-center space-y-3 min-h-[260px] shadow-sm">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-8 ring-primary/5">
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 active:scale-[0.98] transition-all duration-150 mt-1 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Registrar Ajuste</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border/80 shadow-lg shadow-black/[0.03] dark:shadow-black/20 overflow-hidden ring-1 ring-border/40">
      <div className="h-1 w-full bg-gradient-to-r from-primary/30 via-primary to-primary/30 shrink-0" />
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-muted/70 dark:bg-muted/40 backdrop-blur-md border-b border-border/80 text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 font-extrabold text-center">Fecha</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Producto</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Tipo</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Movimiento</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Cantidad</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Antes</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Después</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Usuario</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {movimientos.map((mov) => (
              <tr 
                key={mov.id} 
                className="even:bg-muted/[0.22] dark:even:bg-muted/[0.12] hover:bg-primary/[0.08] dark:hover:bg-primary/[0.15] cursor-pointer transition-colors duration-150 group"
                onClick={() => onRowClick(mov)}
              >
                <td className="py-3.5 px-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-foreground text-xs">
                      {new Date(mov.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    <span className="text-[11px] text-muted-foreground/80 font-mono mt-0.5">
                      {new Date(mov.fecha).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-semibold text-foreground text-center group-hover:text-primary transition-colors">
                  {mov.productoNombre}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex justify-center">
                    <KardexBadge tipo={mov.tipo} />
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-muted/60 dark:bg-muted/40 border border-border/70 font-mono text-[11px] font-semibold text-foreground group-hover:border-primary/40 group-hover:text-primary transition-colors shadow-2xs">
                    {mov.documento ? mov.documento.replace(/^DOC-/i, "MOV-") : `MOV-${String(mov.id).padStart(4, "0")}`}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md font-mono font-bold text-xs ${
                    mov.cantidad > 0 
                      ? "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" 
                      : "text-rose-700 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20"
                  }`}>
                    {mov.cantidad > 0 ? "+" : ""}{mov.cantidad}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-xs font-semibold text-muted-foreground/80 tabular-nums">
                  {mov.stockAnterior}
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-xs font-bold text-foreground tabular-nums">
                  {mov.stockNuevo}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-[10px] flex items-center justify-center border border-primary/25 shrink-0 shadow-2xs">
                      {mov.usuario.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-foreground text-xs truncate max-w-[130px] group-hover:text-primary transition-colors">
                      {mov.usuario}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onRowClick(mov)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground border border-primary/20 hover:border-primary shadow-2xs hover:shadow-md hover:shadow-primary/20 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
                    title="Ver detalle"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Ver</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
