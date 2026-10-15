import { ShoppingBag, Plus } from "lucide-react";
import { CompraAPI } from "@/services/compras.service";
import CompraStatusBadge from "./CompraStatusBadge";
import CompraActions from "./CompraActions";
import { formatCOP } from "@/utils/formatCOP";

interface Props {
  compras: CompraAPI[];
  isLoading: boolean;
  onNuevaCompra: () => void;
  onVerDetalle: (c: CompraAPI) => void;
}

export default function ComprasTable({
  compras,
  isLoading,
  onNuevaCompra,
  onVerDetalle,
}: Props) {
  // ── Skeleton Loading ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border overflow-hidden p-4 space-y-2.5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-muted/60 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  // ── Empty State ──────────────────────────────────────────────────────────────
  if (compras.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border py-10 px-6 text-center flex flex-col items-center justify-center space-y-3 min-h-[240px]">
        <div className="h-12 w-12 rounded-2xl bg-muted/80 flex items-center justify-center text-muted-foreground">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">No se encontraron compras</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Registra tu primera orden de compra para comenzar a gestionar el inventario.
          </p>
        </div>
        <button
          onClick={onNuevaCompra}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-[0.98] transition-all duration-150 mt-1"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Nueva Compra</span>
        </button>
      </div>
    );
  }

  // ── Tabla Principal ──────────────────────────────────────────────────────────
  return (
    <div className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border/80 shadow-lg shadow-black/[0.03] dark:shadow-black/20 overflow-hidden ring-1 ring-border/40">
      <div className="h-1 w-full bg-gradient-to-r from-primary/30 via-primary to-primary/30 shrink-0" />
      <div className="overflow-x-auto">
        <table className="w-full text-center text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-muted/60 dark:bg-muted/30 backdrop-blur-md border-b border-border/80 text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 font-extrabold text-center">Factura</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Fecha</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Proveedor</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Productos</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Total</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Estado</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Usuario</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {compras.map((c) => (
              <tr
                key={c.id}
                className="even:bg-muted/[0.22] dark:even:bg-muted/[0.12] hover:bg-primary/[0.08] dark:hover:bg-primary/[0.15] transition-colors duration-150 group cursor-pointer"
                onClick={() => onVerDetalle(c)}
              >
                {/* Factura */}
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-muted/60 dark:bg-muted/40 border border-border/70 font-mono text-[11px] font-semibold text-foreground group-hover:border-primary/40 group-hover:text-primary transition-colors shadow-2xs">
                    FC-{String(c.id).padStart(4, "0")}
                  </span>
                </td>

                {/* Fecha */}
                <td className="py-3.5 px-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-foreground text-xs">
                      {new Date(c.fecha).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-[11px] text-muted-foreground/80 font-mono mt-0.5">
                      {new Date(c.fecha).toLocaleTimeString("es-CO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </td>

                {/* Proveedor */}
                <td className="py-3.5 px-4 text-center">
                  <div className="flex flex-col items-center">
                    <p className="font-semibold text-foreground text-xs group-hover:text-primary transition-colors">{c.proveedor.nombre}</p>
                    {c.proveedor.nit && (
                      <p className="text-[10px] text-muted-foreground/80 font-mono mt-0.5">
                        NIT: {c.proveedor.nit}
                      </p>
                    )}
                  </div>
                </td>

                {/* Productos */}
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center justify-center h-5 min-w-[1.5rem] px-2 rounded-full bg-muted/60 text-foreground text-[11px] font-semibold border border-border/60">
                    {c.detalles.length}
                  </span>
                </td>

                {/* Total */}
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-muted/50 border border-border/60 font-mono font-bold text-foreground text-xs tracking-tight tabular-nums shadow-2xs">
                    {formatCOP(c.total)}
                  </span>
                </td>

                {/* Estado */}
                <td className="py-3.5 px-4 text-center">
                  <div className="flex justify-center">
                    <CompraStatusBadge activo={c.activo} />
                  </div>
                </td>

                {/* Usuario */}
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-[10px] flex items-center justify-center border border-primary/25 shrink-0 shadow-2xs">
                      {c.usuario.nombre.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-foreground text-xs truncate max-w-[130px] group-hover:text-primary transition-colors">
                      {c.usuario.nombre} {c.usuario.apellido || ""}
                    </span>
                  </div>
                </td>

                {/* Acciones */}
                <td className="py-3.5 px-4 text-center">
                  <div className="flex justify-center">
                    <CompraActions compra={c} onVerDetalle={onVerDetalle} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
