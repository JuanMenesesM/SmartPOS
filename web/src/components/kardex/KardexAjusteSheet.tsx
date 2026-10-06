import { useState, useEffect } from "react";
import { X, ArrowRight, Save, Loader2, SlidersHorizontal } from "lucide-react";
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
        .catch((e) => console.error("Error loading products for adjustment:", e))
        .finally(() => setLoadingProductos(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedProduct = productos.find((p) => p.id === Number(productoId));
  const stockAnterior = selectedProduct ? selectedProduct.stock : 0;
  const delta = direccion === "ENTRADA" ? cantidad : -cantidad;
  const stockNuevo = stockAnterior + delta;

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
      // Reset form
      setProductoId("");
      setTipo("AJUSTE");
      setDireccion("SALIDA");
      setCantidad(1);
      setObservacion("");
      onClose();
    } catch (err) {
      console.error("Error saving inventory adjustment:", err);
      alert("Hubo un error al registrar el ajuste de inventario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Cabecera idéntica al primer modal */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-foreground">
                Nuevo Ajuste de Inventario
              </h2>
              <p className="text-xs text-muted-foreground">
                Registra entradas, salidas, mermas o devoluciones
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Formulario con scroll y estilos unificados */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Seleccionar Producto */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Producto *
            </label>
            {loadingProductos ? (
              <div className="h-10 w-full rounded-xl bg-muted/40 animate-pulse" />
            ) : (
              <select
                required
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
              >
                <option value="">Selecciona un producto...</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} (Stock: {p.stock})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Tipo de Ajuste */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Tipo de Movimiento *
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              <option value="AJUSTE">Ajuste Manual</option>
              <option value="MERMA">Merma / Desperdicio</option>
              <option value="DEVOLUCION">Devolución</option>
              <option value="ELIMINACION">Eliminación</option>
            </select>
          </div>

          {/* Dirección y Cantidad */}
          <div className="grid grid-cols-2 gap-4">
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
                      ? "bg-emerald-500 text-white shadow-sm"
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
                      ? "bg-rose-500 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Salida (-)
                </button>
              </div>
            </div>

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
                className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Live Preview de Stock */}
          {selectedProduct && (
            <div className="p-4 bg-muted/30 border border-border rounded-2xl space-y-1.5">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">Simulación de Stock</p>
              <div className="flex items-center gap-3 text-lg font-bold font-mono">
                <span className="text-muted-foreground">{stockAnterior}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span className={stockNuevo < 0 ? "text-rose-500" : "text-foreground"}>
                  {stockNuevo}
                </span>
              </div>
              {stockNuevo < 0 && (
                <p className="text-xs font-semibold text-rose-500">
                  Aviso: El stock quedará en números negativos.
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
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>

          {/* Botones de acción unificados con el primer modal */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold rounded-xl text-muted-foreground hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !productoId}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 transition-all duration-150 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Registrando...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Guardar Ajuste</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}