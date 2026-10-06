import { ShoppingBag, Plus } from "lucide-react";
import { CompraAPI } from "@/services/compras.service";
import CompraStatusBadge from "./CompraStatusBadge";
import CompraActions from "./CompraActions";

function formatCOP(amount: number): string {
  return `$${new Intl.NumberFormat("es-CO").format(amount)}`;
}

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
    <div className="bg-card rounded-2xl border border-border shadow-sm min-h-[300px]">
      <div className="overflow-x-auto pb-16">
        <table className="w-full text-center text-sm border-collapse">
          <thead className="sticky top-0 z-10 bg-muted/50 backdrop-blur-md border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 font-bold text-center">Factura</th>
              <th className="py-3 px-4 font-bold text-center">Fecha</th>
              <th className="py-3 px-4 font-bold text-center">Proveedor</th>
              <th className="py-3 px-4 font-bold text-center">Productos</th>
              <th className="py-3 px-4 font-bold text-center">Total</th>
              <th className="py-3 px-4 font-bold text-center">Estado</th>
              <th className="py-3 px-4 font-bold text-center">Usuario</th>
              <th className="py-3 px-4 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {compras.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-accent/40 transition-colors duration-150 group"
              >
                {/* Factura */}
                <td className="py-3 px-4 font-semibold text-sm text-primary">
                  FC-{String(c.id).padStart(4, "0")}
                </td>

                {/* Fecha */}
                <td className="py-3 px-4 text-muted-foreground text-sm font-medium">
                  {new Date(c.fecha).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                {/* Proveedor */}
                <td className="py-3 px-4 font-semibold text-foreground text-sm">
                  <div className="flex flex-col items-center">
                    <p>{c.proveedor.nombre}</p>
                    {c.proveedor.nit && (
                      <p className="text-xs text-muted-foreground font-medium">
                        NIT: {c.proveedor.nit}
                      </p>
                    )}
                  </div>
                </td>

                {/* Productos */}
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center justify-center h-6 min-w-[1.5rem] px-2 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {c.detalles.length}
                  </span>
                </td>

                {/* Total */}
                <td className="py-3 px-4 text-center font-bold text-foreground text-sm">
                  {formatCOP(c.total)}
                </td>

                {/* Estado */}
                <td className="py-3 px-4 flex justify-center">
                  <CompraStatusBadge activo={c.activo} />
                </td>

                {/* Usuario */}
                <td className="py-3 px-4 text-muted-foreground text-sm">
                  {c.usuario.nombre} {c.usuario.apellido || ""}
                </td>

                {/* Acciones */}
                <td className="py-3 px-4 text-center">
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
