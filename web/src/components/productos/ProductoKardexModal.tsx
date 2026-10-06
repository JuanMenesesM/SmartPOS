import React from "react";
import ModalPortal from "@/components/ui/ModalPortal";
import { X, Layers, ArrowDownLeft, ArrowUpRight, RefreshCw, Package, ShieldCheck } from "lucide-react";
import { Producto } from "@/types/producto";
import { useProductoKardex } from "@/hooks/useProductos";

interface Props {
  producto: Producto | null;
  onClose: () => void;
}

function formatCOP(amount: number): string {
  return `$${new Intl.NumberFormat("es-CO").format(amount)}`;
}

export default function ProductoKardexModal({ producto, onClose }: Props) {
  const { data, isLoading } = useProductoKardex(producto?.id ?? null);

  if (!producto) return null;

  return (
    <ModalPortal>
      {/* Overlay blur pantalla completa */}
      <div className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose} />

      {/* Contenedor de posicionamiento */}
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-6 px-4 sm:px-6 pointer-events-none">
      <div className="w-full max-w-md bg-card/95 backdrop-blur-2xl border border-border/80 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] overflow-hidden animate-in zoom-in-95 duration-200 relative flex flex-col pointer-events-auto">
        
        {/* Barra superior con gradiente */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-primary to-indigo-500" />

        {/* ── Cabecera Centrada Compacta ────────────────────────────────────── */}
        <div className="px-4 py-2.5 border-b border-border/60 relative bg-muted/20 text-center">
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150 active:scale-95 border border-border/60 shadow-2xs"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs ring-1 ring-emerald-500/20">
              <Layers className="h-4 w-4" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1.5">
                <h2 className="text-sm font-extrabold text-foreground tracking-tight">
                  {producto.nombre}
                </h2>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-muted text-muted-foreground border border-border/80">
                  {producto.codigo}
                </span>
              </div>
              <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                <span>Historial de Movimientos de Inventario</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Contenido con Altura Acotada ──────────────────────────────────── */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[58vh] overflow-y-auto">
          {/* Card Hero Centrado: Estado del Inventario */}
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-primary/10 via-primary/5 to-muted/30 p-4 shadow-inner text-center">
            <div className="grid grid-cols-2 gap-3 items-center">
              <div className="border-r border-border/60 pr-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1">
                  <Package className="h-3.5 w-3.5 text-primary" />
                  Stock Disponible
                </span>
                <p className="text-2xl font-black text-foreground font-mono mt-0.5">
                  {producto.stock} <span className="text-xs font-normal text-muted-foreground">un.</span>
                </p>
              </div>

              <div className="pl-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Precio Venta
                </span>
                <p className="text-xl font-black text-primary font-mono mt-0.5">
                  {formatCOP(producto.precioVenta)}
                </p>
              </div>
            </div>
          </div>

          {/* Lista de movimientos */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                Auditoría y Trazabilidad
              </h3>
              {data?.movimientos && (
                <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.2 rounded-full border border-border/50">
                  {data.movimientos.length} eventos
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-14 bg-muted/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : !data || data.movimientos.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border rounded-2xl text-xs text-muted-foreground space-y-1">
                <p className="font-bold text-foreground">No hay movimientos registrados</p>
                <p>Las compras y ventas de este producto se listarán automáticamente aquí.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.movimientos.map((m) => {
                  const esVenta = m.tipo === "VENTA";
                  const esCompra = m.tipo === "COMPRA";

                  return (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 rounded-2xl border border-border/70 bg-card hover:bg-accent/40 transition-all duration-150 group shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                            esVenta
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                              : esCompra
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
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

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">
                            {m.tipo === "VENTA"
                              ? `Venta Facturada`
                              : m.tipo === "COMPRA"
                              ? `Ingreso por Compra`
                              : `Ajuste de Inventario`}
                            {m.observacion ? ` — ${m.observacion}` : ""}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {new Date(m.fecha).toLocaleString("es-CO", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            • <span className="font-semibold text-foreground/80">{m.usuario}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-3">
                        <p
                          className={`text-xs font-black font-mono ${
                            esVenta
                              ? "text-rose-600 dark:text-rose-400"
                              : esCompra
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {esVenta ? `-${m.cantidad}` : `+${m.cantidad}`}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono">
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

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <div className="px-5 py-3 border-t border-border/70 bg-muted/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-extrabold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 active:scale-95 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
}
