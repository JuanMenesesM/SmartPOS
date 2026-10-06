import { Package, Plus } from "lucide-react";
import { Producto } from "@/types/producto";
import ProductoStockBadge from "./ProductoStockBadge";
import ProductoStatusBadge from "./ProductoStatusBadge";
import ProductoActions from "./ProductoActions";

function formatCOP(amount: number): string {
  return `$${new Intl.NumberFormat("es-CO").format(amount)}`;
}

interface Props {
  productos: Producto[];
  isLoading: boolean;
  onNuevoProducto: () => void;
  onEditar: (p: Producto) => void;
  onDuplicar: (p: Producto) => void;
  onVerKardex: (p: Producto) => void;
  onToggleEstado: (p: Producto) => void;
}

export default function ProductosTable({
  productos,
  isLoading,
  onNuevoProducto,
  onEditar,
  onDuplicar,
  onVerKardex,
  onToggleEstado,
}: Props) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border overflow-hidden p-4 space-y-2.5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-9 bg-muted/60 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  // ── Empty State Compacto (Reducido ~25%) ────────────────────────────────────
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
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-md border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-4 font-bold text-center">Código</th>
              <th className="py-2.5 px-4 font-bold text-center">Producto</th>
              <th className="py-2.5 px-4 font-bold text-center">Precio</th>
              <th className="py-2.5 px-4 font-bold text-center">Stock</th>
              <th className="py-2.5 px-4 font-bold text-center">Estado</th>
              <th className="py-2.5 px-4 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {productos.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-accent/40 transition-colors duration-150"
              >
                {/* Código */}
                <td className="py-2.5 px-4 font-mono text-[11px] font-semibold text-muted-foreground text-center">
                  {p.codigo}
                </td>

                {/* Producto */}
                <td className="py-2.5 px-4 font-semibold text-foreground text-center">
                  {p.nombre}
                </td>

                {/* Precio */}
                <td className="py-2.5 px-4 text-center font-mono font-bold text-foreground">
                  {formatCOP(p.precioVenta)}
                </td>

                {/* Stock */}
                <td className="py-2.5 px-4 text-center flex justify-center">
                  <ProductoStockBadge stock={p.stock} />
                </td>

                {/* Estado */}
                <td className="py-2.5 px-4 text-center">
                  <div className="flex justify-center">
                    <ProductoStatusBadge activo={p.activo} />
                  </div>
                </td>

                {/* Acciones */}
                <td className="py-2.5 px-4 text-center">
                  <div className="flex justify-center">
                    <ProductoActions
                      producto={p}
                      onEditar={onEditar}
                      onDuplicar={onDuplicar}
                      onVerKardex={onVerKardex}
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
