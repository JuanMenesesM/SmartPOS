import { Package, Plus } from "lucide-react";
import { Producto } from "@/types/producto";
import ProductoStockBadge from "./ProductoStockBadge";
import ProductoStatusBadge from "./ProductoStatusBadge";
import ProductoActions from "./ProductoActions";
import { formatCOP } from "@/utils/formatCOP";

interface Props {
  productos: Producto[];
  isLoading: boolean;
  onNuevoProducto: () => void;
  onEditar: (p: Producto) => void;
  onDuplicar: (p: Producto) => void;
  onToggleEstado: (p: Producto) => void;
}

export default function ProductosTable({
  productos,
  isLoading,
  onNuevoProducto,
  onEditar,
  onDuplicar,
  onToggleEstado,
}: Props) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border overflow-hidden p-4 space-y-2.5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-muted/60 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  // ── Empty State Compacto ────────────────────────────────────
  if (productos.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border py-7 px-6 text-center flex flex-col items-center justify-center space-y-2.5 min-h-[210px]">
        <div className="h-10 w-10 rounded-2xl bg-muted/80 flex items-center justify-center text-muted-foreground">
          <Package className="h-5 w-5" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-foreground">No se encontraron productos</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Crea tu primer producto para comenzar a gestionar tu catálogo.
          </p>
        </div>
        <button
          onClick={onNuevoProducto}
          className="
            inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold
            bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm
            active:scale-[0.98] transition-all duration-150 mt-1
          "
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Nuevo Producto</span>
        </button>
      </div>
    );
  }

  // ── Tabla Ultra Limpia ───────────────────────────────────────────────────────
  return (
    <div className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border/80 shadow-lg shadow-black/[0.03] dark:shadow-black/20 overflow-hidden ring-1 ring-border/40">
      <div className="h-1 w-full bg-gradient-to-r from-primary/30 via-primary to-primary/30 shrink-0" />
      <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-muted/60 dark:bg-muted/30 backdrop-blur-md border-b border-border/80 text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 font-extrabold text-center">Código</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Producto</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Precio</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Stock</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Estado</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {productos.map((p) => (
              <tr
                key={p.id}
                className="even:bg-muted/[0.22] dark:even:bg-muted/[0.12] hover:bg-primary/[0.08] dark:hover:bg-primary/[0.15] transition-colors duration-150 group cursor-pointer"
              >
                {/* Código */}
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-muted/60 dark:bg-muted/40 border border-border/70 font-mono text-[11px] font-semibold text-foreground group-hover:border-primary/40 group-hover:text-primary transition-colors shadow-2xs">
                    {p.codigo}
                  </span>
                </td>

                {/* Producto */}
                <td className="py-3.5 px-4 text-center">
                  <span className="font-semibold text-foreground text-xs group-hover:text-primary transition-colors">
                    {p.nombre}
                  </span>
                </td>

                {/* Precio */}
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-muted/50 border border-border/60 font-mono font-bold text-foreground text-xs tracking-tight tabular-nums shadow-2xs">
                    {formatCOP(p.precioVenta)}
                  </span>
                </td>

                {/* Stock */}
                <td className="py-3.5 px-4 text-center">
                  <div className="flex justify-center">
                    <ProductoStockBadge stock={p.stock} />
                  </div>
                </td>

                {/* Estado */}
                <td className="py-3.5 px-4 text-center">
                  <div className="flex justify-center">
                    <ProductoStatusBadge activo={p.activo} />
                  </div>
                </td>

                {/* Acciones */}
                <td className="py-3.5 px-4 text-center">
                  <div className="flex justify-center">
                    <ProductoActions
                      producto={p}
                      onEditar={onEditar}
                      onDuplicar={onDuplicar}
                      onToggleEstado={onToggleEstado}
                    />
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
