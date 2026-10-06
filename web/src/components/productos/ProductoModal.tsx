import { useState, useEffect, useRef } from "react";
import ModalPortal from "@/components/ui/ModalPortal";
import { X, PackagePlus, Edit3, Copy, ChevronDown, Check, Lock } from "lucide-react";
import { Producto, CreateProductoInput } from "@/types/producto";
import { getSiguienteCodigo } from "@/services/productos.service";

interface Props {
  open: boolean;
  onClose: () => void;
  productoEditar?: Producto | null;
  modoDuplicar?: boolean;
  onSubmit: (data: CreateProductoInput) => Promise<void>;
  isSubmitting: boolean;
}

function getNextCodigo(codigo: string): string {
  const match = codigo.match(/^(.*?)(\d+)$/);
  if (match) {
    const prefix = match[1];
    const numStr = match[2];
    const num = parseInt(numStr, 10) + 1;
    return prefix + String(num).padStart(numStr.length, "0");
  }
  return codigo + "-COPIA";
}

export default function ProductoModal({
  open,
  onClose,
  productoEditar,
  modoDuplicar = false,
  onSubmit,
  isSubmitting,
}: Props) {
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [stock, setStock] = useState("");
  const [activo, setActivo] = useState(true);
  const [error, setError] = useState("");

  // Estado para el Dropdown de Estado personalizado
  const [openEstado, setOpenEstado] = useState(false);
  const refEstado = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setError("");
      setOpenEstado(false);
      if (productoEditar) {
        setCodigo(modoDuplicar ? getNextCodigo(productoEditar.codigo) : productoEditar.codigo);
        setNombre(modoDuplicar ? `${productoEditar.nombre} (Copia)` : productoEditar.nombre);
        setPrecioVenta(String(productoEditar.precioVenta));
        setStock(String(productoEditar.stock));
        setActivo(productoEditar.activo);
      } else {
        // Auto-generar código para nuevo producto
        getSiguienteCodigo().then(setCodigo).catch(() => setCodigo(""));
        setNombre("");
        setPrecioVenta("");
        setStock("0");
        setActivo(true);
      }
    }
  }, [open, productoEditar, modoDuplicar]);

  // Cerrar el dropdown de estado si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (refEstado.current && !refEstado.current.contains(e.target as Node)) {
        setOpenEstado(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!open) return null;

  const esEdicion = !!productoEditar && !modoDuplicar;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!codigo.trim()) {
      setError("El código es obligatorio y se genera automáticamente");
      return;
    }
    if (!nombre.trim()) {
      setError("El nombre del producto es obligatorio");
      return;
    }
    const numPrecio = Number(precioVenta);
    if (isNaN(numPrecio) || numPrecio <= 0) {
      setError("El precio de venta debe ser mayor a $0");
      return;
    }
    const numStock = Number(stock);
    if (isNaN(numStock) || numStock < 0) {
      setError("El stock no puede ser negativo");
      return;
    }

    try {
      await onSubmit({
        codigo: codigo.trim(),
        nombre: nombre.trim(),
        precioVenta: numPrecio,
        stock: numStock,
        activo,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Ocurrió un error al guardar");
    }
  };

  return (
    <ModalPortal>
      {/* Overlay blur pantalla completa */}
      <div className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose} />

      {/* Contenedor de posicionamiento */}
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-6 px-4 pointer-events-none">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col pointer-events-auto">
        {/* Cabecera Ultra-Compacta */}
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              {esEdicion ? (
                <Edit3 className="h-4 w-4" />
              ) : modoDuplicar ? (
                <Copy className="h-4 w-4" />
              ) : (
                <PackagePlus className="h-4 w-4" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-foreground leading-tight">
                {esEdicion
                  ? "Editar Producto"
                  : modoDuplicar
                  ? "Duplicar Producto"
                  : "Nuevo Producto"}
              </h2>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {esEdicion
                  ? "Modifica las propiedades del producto"
                  : "Ingresa los datos para registrarlo en el catálogo"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Formulario Ultra-Compacto */}
        <form onSubmit={handleSubmit} className="p-4 space-y-2.5">
          {error && (
            <div className="p-2.5 text-xs font-semibold rounded-lg bg-red-500/10 text-red-600 border border-red-500/20">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {/* Código (No editable) */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
                <span>Código</span>
                <Lock className="h-2.5 w-2.5 text-muted-foreground" />
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={codigo}
                  readOnly
                  disabled
                  placeholder="Generando..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-muted/60 text-muted-foreground font-mono cursor-not-allowed select-none focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Dropdown Estado Personalizado */}
            <div className="space-y-1" ref={refEstado}>
              <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                Estado
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenEstado((prev) => !prev)}
                  className={`
                    w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg border
                    transition-all duration-200 select-none
                    ${openEstado
                      ? "bg-background border-primary ring-2 ring-primary/20"
                      : "bg-background border-border hover:bg-accent/50"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        activo ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />
                    <span className="font-medium text-foreground">
                      {activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                      openEstado ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                {openEstado && (
                  <div className="absolute left-0 top-full mt-1 w-full z-50 bg-card border border-border rounded-xl shadow-xl p-1 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setActivo(true);
                        setOpenEstado(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg text-left
                        transition-colors duration-150
                        ${activo
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "hover:bg-accent text-foreground"
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            activo ? "bg-primary-foreground" : "bg-emerald-500"
                          }`}
                        />
                        <span>Activo</span>
                      </div>
                      {activo && <Check className="h-3 w-3" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActivo(false);
                        setOpenEstado(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg text-left
                        transition-colors duration-150
                        ${!activo
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "hover:bg-accent text-foreground"
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            !activo ? "bg-primary-foreground" : "bg-slate-400"
                          }`}
                        />
                        <span>Inactivo</span>
                      </div>
                      {!activo && <Check className="h-3 w-3" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Nombre */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
              Nombre del Producto *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Camisa Hugo Boss, Hilo Poliéster, etc."
              className="w-full px-3 py-1.5 text-xs rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Precio Venta */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                Precio Venta (COP) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                  $
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={precioVenta ? new Intl.NumberFormat("es-CO").format(Number(precioVenta.replace(/\./g, ""))) : ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\./g, "").replace(/[^0-9]/g, "");
                    setPrecioVenta(raw);
                  }}
                  placeholder="120.000"
                  className="w-full pl-7 pr-3 py-1.5 text-xs font-mono rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Stock Inicial */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                Stock Inicial *
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-muted-foreground hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 transition-all duration-150 disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </ModalPortal>
  );
}
