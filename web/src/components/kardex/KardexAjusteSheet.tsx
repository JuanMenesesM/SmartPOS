import { useState, useEffect } from "react";
import ModalPortal from "@/components/ui/ModalPortal";
import { X, Save, Loader2, SlidersHorizontal, Package, ArrowRight } from "lucide-react";
import { Producto } from "@/types/producto";
import { getProductos } from "@/services/productos.service";
import { crearMovimiento } from "@/services/kardex.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

function getUsuarioIdActual(): number {
  try {
    const token = localStorage.getItem("token");
    if (!token) return 1;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Number(payload.id || payload.sub || 1);
  } catch {
    return 1;
  }
}

export default function KardexAjusteSheet({ isOpen, onClose, onSave }: Props) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoId, setProductoId] = useState<string>("");
  const [tipo, setTipo] = useState<"AJUSTE" | "MERMA" | "DEVOLUCION" | "ELIMINACION">("AJUSTE");
  const [direccion, setDireccion] = useState<"ENTRADA" | "SALIDA">("SALIDA");
  const [cantidad, setCantidad] = useState<number>(1);
  const [observacion, setObservacion] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoadingProductos(true);
      getProductos()
        .then((data) => setProductos(data.filter((p) => p.activo)))
        .catch((e) => console.error(e))
        .finally(() => setLoadingProductos(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedProduct = productos.find((p) => p.id === Number(productoId));
  const stockAnterior = selectedProduct ? selectedProduct.stock : 0;
  const delta = direccion === "ENTRADA" ? cantidad : -cantidad;
  const stockNuevo = stockAnterior + delta;
  const isNegative = stockNuevo < 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoId) return;
    setLoading(true);
    try {
      await crearMovimiento({
        productoId: Number(productoId),
        usuarioId: getUsuarioIdActual(),
        tipo,
        cantidad: delta,
        stockAnterior,
        stockNuevo,
        observacion: observacion.trim() || undefined,
      });
      onSave();
      setProductoId(""); setTipo("AJUSTE"); setDireccion("SALIDA");
      setCantidad(1); setObservacion("");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Hubo un error al registrar el ajuste de inventario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-md bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col pointer-events-auto">

          {/* Barra de acento superior */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-violet-500 to-blue-500 shrink-0" />

          {/* Cabecera */}
          <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between bg-muted/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 ring-1 ring-primary/20 shadow-sm">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-foreground leading-tight">
                  Nuevo Ajuste de Inventario
                </h2>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                  Registra entradas, salidas, mermas o devoluciones
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-border/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Producto */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-primary" />
                Producto *
              </label>
              {loadingProductos ? (
                <div className="h-10 rounded-xl bg-muted/40 animate-pulse" />
              ) : (
                <div className="relative">
                  <select
                    required
                    value={productoId}
                    onChange={(e) => setProductoId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all appearance-none pr-9"
                  >
                    <option value="">Selecciona un producto...</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} — Stock: {p.stock}
                      </option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Tipo de movimiento */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                Tipo de Movimiento *
              </label>
              <div className="relative">
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as typeof tipo)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all appearance-none pr-9"
                >
                  <option value="AJUSTE">Ajuste Manual</option>
                  <option value="MERMA">Merma / Desperdicio</option>
                  <option value="DEVOLUCION">Devolución</option>
                  <option value="ELIMINACION">Eliminación</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Operación y Cantidad en la misma fila */}
            <div className="grid grid-cols-2 gap-3">
              {/* Operación */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Operación *
                </label>
                <div className="flex bg-muted/50 p-1 rounded-xl gap-1 border border-border">
                  <button
                    type="button"
                    onClick={() => setDireccion("ENTRADA")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all uppercase select-none ${
                      direccion === "ENTRADA"
                        ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Entrada (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDireccion("SALIDA")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all uppercase select-none ${
                      direccion === "SALIDA"
                        ? "bg-rose-500 text-white shadow-sm shadow-rose-500/30"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Salida (-)
                  </button>
                </div>
              </div>

              {/* Cantidad */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Cantidad *
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Simulación de stock — solo si hay producto */}
            {selectedProduct && (
              <div className={`p-3.5 rounded-2xl border ${
                isNegative
                  ? "bg-rose-500/5 border-rose-500/20"
                  : "bg-muted/30 border-border/60"
              }`}>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
                  Simulación de Stock
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 text-center">
                    <p className="text-[9px] text-muted-foreground uppercase mb-1">Antes</p>
                    <p className="text-xl font-black font-mono text-muted-foreground">{stockAnterior}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    direccion === "ENTRADA"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/10 text-rose-500"
                  }`}>
                    <span>{direccion === "ENTRADA" ? `+${cantidad}` : `−${cantidad}`}</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-[9px] text-muted-foreground uppercase mb-1">Después</p>
                    <p className={`text-xl font-black font-mono ${isNegative ? "text-rose-500" : "text-foreground"}`}>
                      {stockNuevo}
                    </p>
                  </div>
                </div>
                {isNegative && (
                  <p className="text-[10px] font-semibold text-rose-500 mt-2 text-center">
                    ⚠ El stock quedará en números negativos
                  </p>
                )}
              </div>
            )}

            {/* Observación */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                Observación / Motivo
              </label>
              <textarea
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                placeholder="Explica brevemente el motivo del ajuste..."
                rows={2}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
              />
            </div>

            {/* Botones */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-border/60">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl text-muted-foreground hover:bg-accent transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !productoId}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 active:scale-[0.98]"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /><span>Registrando...</span></>
                ) : (
                  <><Save className="h-4 w-4" /><span>Guardar Ajuste</span></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}