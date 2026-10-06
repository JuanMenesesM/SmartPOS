import { useState, useEffect, useRef } from "react";
import { X, PackagePlus, Edit3, Copy, ChevronDown, Check } from "lucide-react";
import { Producto, CreateProductoInput } from "@/types/producto";

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
    return prefix + String(num).padStart(numStr.length, '0');
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
        setCodigo("");
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
      setError("El código es obligatorio");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              {esEdicion ? (
                <Edit3 className="h-5 w-5" />
              ) : modoDuplicar ? (
                <Copy className="h-5 w-5" />
              ) : (
                <PackagePlus className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-foreground">
                {esEdicion
                  ? "Editar Producto"
                  : modoDuplicar
                  ? "Duplicar Producto"
                  : "Nuevo Producto"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {esEdicion
                  ? "Modifica las propiedades del producto"
                  : "Ingresa los datos para registrarlo en el catálogo"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs font-semibold rounded-xl bg-red-500/10 text-red-600 border border-red-500/20">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Código */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                Código *
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ej. P0001"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono ${
                  esEdicion ? "bg-muted cursor-not-allowed opacity-70 border-border" : "bg-background border-border"
                }`}
                required
                disabled={esEdicion}
              />
            </div>

            {/* Dropdown Estado Personalizado */}
            <div className="space-y-1.5" ref={refEstado}>
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                Estado
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenEstado((prev) => !prev)}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 text-sm rounded-xl border
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
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                      openEstado ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                {openEstado && (
                  <div className="absolute left-0 top-full mt-1.5 w-full z-50 bg-card border border-border rounded-2xl shadow-xl p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setActivo(true);
                        setOpenEstado(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl text-left
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
                      {activo && <Check className="h-3.5 w-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActivo(false);
                        setOpenEstado(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl text-left
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
                      {!activo && <Check className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Nombre del Producto *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Nike Air Max"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Precio Venta */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                Precio Venta (COP) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  value={precioVenta}
                  onChange={(e) => setPrecioVenta(e.target.value)}
                  placeholder="85000"
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm font-mono rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Stock Inicial */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                Stock Inicial *
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold rounded-xl text-muted-foreground hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 transition-all duration-150 disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
