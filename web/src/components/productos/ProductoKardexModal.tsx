import { X, Layers, ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react";
import { Producto } from "@/types/producto";
import { useProductoKardex } from "@/hooks/useProductos";

interface Props {
  producto: Producto | null;
  onClose: () => void;
}

export default function ProductoKardexModal({ producto, onClose }: Props) {
  const { data, isLoading } = useProductoKardex(producto?.id ?? null);

  if (!producto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-foreground">{producto.nombre}</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-semibold">
                  {producto.codigo}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Historial de movimientos de inventario (Kardex)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Card destacado Stock Actual */}
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Stock actual en inventario</p>
              <p className="text-3xl font-extrabold text-foreground font-mono mt-0.5">
                {producto.stock} <span className="text-xs font-normal text-muted-foreground">unidades</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-muted-foreground">Precio de Venta</p>
              <p className="text-lg font-bold text-foreground font-mono">
                ${new Intl.NumberFormat("es-CO").format(producto.precioVenta)}
              </p>
            </div>
          </div>

          {/* Lista de movimientos */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
              Últimos movimientos
            </h3>

            {isLoading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 bg-muted/60 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : !data || data.movimientos.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border rounded-2xl text-xs text-muted-foreground">
                No hay movimientos registrados para este producto aún.
              </div>
            ) : (
              <div className="space-y-2">
                {data.movimientos.map((m) => {
                  const esVenta = m.tipo === "VENTA";
                  const esCompra = m.tipo === "COMPRA";

                  return (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:bg-accent/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                            esVenta
                              ? "bg-red-500/10 text-red-500"
                              : esCompra
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {esVenta ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : esCompra ? (
                            <ArrowDownLeft className="h-4 w-4" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-bold text-foreground">
                            {m.tipo === "VENTA"
                              ? `Venta`
                              : m.tipo === "COMPRA"
                              ? `Compra`
                              : `Ajuste de inventario`}
                            {m.observacion ? ` — ${m.observacion}` : ""}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {new Date(m.fecha).toLocaleString("es-CO", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            • {m.usuario}
                          </p>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <p
                          className={`text-xs font-bold ${
                            esVenta
                              ? "text-red-500"
                              : esCompra
                              ? "text-emerald-500"
                              : "text-blue-500"
                          }`}
                        >
                          {esVenta ? `-${m.cantidad}` : `+${m.cantidad}`}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {m.stockAnterior} → {m.stockNuevo}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-muted hover:bg-accent text-foreground transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
