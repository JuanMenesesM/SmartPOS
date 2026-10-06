import { useState, useEffect, useRef } from "react";
import ModalPortal from "@/components/ui/ModalPortal";
import {
  X,
  PackagePlus,
  Edit3,
  Copy,
  ChevronDown,
  Check,
  Lock,
  Tag,
  DollarSign,
  Boxes,
  Sparkles,
} from "lucide-react";
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
        getSiguienteCodigo().then(setCodigo).catch(() => setCodigo(""));
        setNombre("");
        setPrecioVenta("");
        setStock("0");
        setActivo(true);
      }
    }
  }, [open, productoEditar, modoDuplicar]);

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
  const accentColor = esEdicion
    ? "from-amber-500 via-orange-400 to-yellow-500"
    : modoDuplicar
    ? "from-blue-500 via-cyan-400 to-teal-500"
    : "from-primary via-violet-500 to-blue-500";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!codigo.trim()) { setError("El código es obligatorio y se genera automáticamente"); return; }
    if (!nombre.trim()) { setError("El nombre del producto es obligatorio"); return; }
    const numPrecio = Number(precioVenta);
    if (isNaN(numPrecio) || numPrecio <= 0) { setError("El precio de venta debe ser mayor a $0"); return; }
    const numStock = Number(stock);
    if (isNaN(numStock) || numStock < 0) { setError("El stock no puede ser negativo"); return; }
    try {
      await onSubmit({ codigo: codigo.trim(), nombre: nombre.trim(), precioVenta: numPrecio, stock: numStock, activo });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Ocurrió un error al guardar");
    }
  };

  return (
    <ModalPortal>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-md bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col pointer-events-auto">

          {/* Barra de acento superior */}
          <div className={`h-1.5 w-full bg-gradient-to-r ${accentColor} shrink-0`} />

          {/* Cabecera */}
          <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between bg-muted/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 ring-1 ring-primary/20 shadow-sm">
                {esEdicion ? (
                  <Edit3 className="h-5 w-5" />
                ) : modoDuplicar ? (
                  <Copy className="h-5 w-5" />
                ) : (
                  <PackagePlus className="h-5 w-5" />
                )}
              </div>
              <div>
                <h2 className="text-base font-extrabold text-foreground leading-tight flex items-center gap-1.5">
                  {esEdicion ? "Editar Producto" : modoDuplicar ? "Duplicar Producto" : "Nuevo Producto"}
                  {!esEdicion && <Sparkles className="h-3.5 w-3.5 text-primary" />}
                </h2>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                  {esEdicion
                    ? "Modifica las propiedades del producto"
                    : "Ingresa los datos para registrarlo en el catálogo"}
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
            {error && (
              <div className="p-3 text-xs font-semibold rounded-xl bg-red-500/10 text-red-600 border border-red-500/20 animate-in fade-in">
                {error}
              </div>
            )}

            {/* Código + Estado */}
            <div className="grid grid-cols-2 gap-3">
              {/* Código */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                  Código
                  <Lock className="h-3 w-3 text-muted-foreground/60" />
                </label>
                <input
                  type="text"
                  value={codigo}
                  readOnly
                  disabled
                  placeholder="Generando..."
                  className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl border border-border bg-muted/50 text-muted-foreground cursor-not-allowed select-none focus:outline-none"
                />
              </div>

              {/* Estado */}
              <div className="space-y-1.5" ref={refEstado}>
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Estado
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenEstado((prev) => !prev)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm rounded-xl border transition-all duration-200 select-none ${
                      openEstado
                        ? "bg-background border-primary ring-2 ring-primary/20"
                        : "bg-background border-border hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${activo ? "bg-emerald-500" : "bg-slate-400"}`} />
                      <span className="text-sm font-medium text-foreground">{activo ? "Activo" : "Inactivo"}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${openEstado ? "rotate-180 text-primary" : ""}`} />
                  </button>

                  {openEstado && (
                    <div className="absolute left-0 top-full mt-1.5 w-full z-50 bg-card border border-border/80 rounded-2xl shadow-xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                      {[
                        { value: true, label: "Activo", dot: "bg-emerald-500" },
                        { value: false, label: "Inactivo", dot: "bg-slate-400" },
                      ].map(({ value, label, dot }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => { setActivo(value); setOpenEstado(false); }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-xl text-left transition-colors ${
                            activo === value
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${activo === value ? "bg-primary-foreground" : dot}`} />
                            <span>{label}</span>
                          </div>
                          {activo === value && <Check className="h-3.5 w-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nombre */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <PackagePlus className="h-3.5 w-3.5 text-primary" />
                Nombre del Producto *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Camisa Hugo Boss, Hilo Poliéster, etc."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
                autoFocus={!esEdicion}
              />
            </div>

            {/* Precio + Stock */}
            <div className="grid grid-cols-2 gap-3">
              {/* Precio Venta */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                  Precio Venta (COP) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
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
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm font-mono rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              {/* Stock */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Boxes className="h-3.5 w-3.5 text-blue-500" />
                  Stock Inicial *
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
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
                disabled={isSubmitting}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-150 disabled:opacity-50 flex items-center gap-2 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span>Guardando...</span>
                ) : (
                  <>
                    <PackagePlus className="h-4 w-4" />
                    <span>{esEdicion ? "Guardar Cambios" : "Guardar Producto"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
