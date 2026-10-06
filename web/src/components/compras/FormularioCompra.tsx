import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Store,
  Loader2,
  ChevronDown,
  Check,
  Truck,
} from "lucide-react";
import { useCrearCompra, useProveedores, useProductosPorProveedor } from "@/hooks/useCompras";
import { ProductoCatalogo } from "@/services/compras.service";
import ProveedorModal from "@/components/compras/ProveedorModal";
import { formatCOP } from "@/utils/formatCOP";

interface ItemCarrito {
  productoId: number;
  productoNombre: string;
  productoCodigo: string;
  cantidad: number;
  precioCompra: number;
  subtotal: number;
}

interface FormularioCompraProps {
  onBack: () => void;
}



export function FormularioCompra({ onBack }: FormularioCompraProps) {
  const [proveedorId, setProveedorId] = useState("");
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [openProv, setOpenProv] = useState(false);
  const [modalProvOpen, setModalProvOpen] = useState(false);
  const refProv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (refProv.current && !refProv.current.contains(e.target as Node)) setOpenProv(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const { data: proveedores = [], isLoading: loadingProv } = useProveedores();
  const proveedorIdNum = proveedorId ? Number(proveedorId) : null;
  const { data: productos = [], isLoading: loadingProd } = useProductosPorProveedor(proveedorIdNum);
  const crearMutation = useCrearCompra();

  // Al cambiar el proveedor, limpiar el carrito para mantener consistencia
  const handleSeleccionarProveedor = (id: string) => {
    if (id !== proveedorId && items.length > 0) {
      setItems([]);
    }
    setProveedorId(id);
    setOpenProv(false);
  };

  // Filtrar catálogo de productos
  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busquedaProducto.toLowerCase())
  );

  const handleAgregarProducto = (prod: ProductoCatalogo) => {
    setItems((prev) => {
      const existe = prev.find((i) => i.productoId === prod.id);
      if (existe) {
        return prev.map((i) =>
          i.productoId === prod.id
            ? { ...i, cantidad: i.cantidad + 1, subtotal: (i.cantidad + 1) * i.precioCompra }
            : i
        );
      }
      // Precio compra sugerido: 60% del precio de venta como punto de partida
      const precioSugerido = Math.round(prod.precioVenta * 0.6);
      return [
        ...prev,
        {
          productoId: prod.id,
          productoNombre: prod.nombre,
          productoCodigo: prod.codigo,
          cantidad: 1,
          precioCompra: precioSugerido,
          subtotal: precioSugerido,
        },
      ];
    });
  };

  const handleCambiarCantidad = (productoId: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.productoId === productoId) {
            const nuevaCantidad = i.cantidad + delta;
            if (nuevaCantidad <= 0) return null;
            return { ...i, cantidad: nuevaCantidad, subtotal: nuevaCantidad * i.precioCompra };
          }
          return i;
        })
        .filter(Boolean) as ItemCarrito[]
    );
  };

  const handleCambiarCosto = (productoId: number, nuevoCosto: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productoId === productoId
          ? { ...i, precioCompra: nuevoCosto, subtotal: i.cantidad * nuevoCosto }
          : i
      )
    );
  };

  const totalGeneral = items.reduce((acc, i) => acc + i.subtotal, 0);

  const handleGuardar = async () => {
    setError("");
    if (!proveedorId) {
      setError("Debes seleccionar un proveedor.");
      return;
    }
    if (items.length === 0) {
      setError("Agrega al menos un producto a la orden.");
      return;
    }
    if (items.some((i) => i.precioCompra <= 0)) {
      setError("El precio de compra de cada producto debe ser mayor a 0.");
      return;
    }

    try {
      await crearMutation.mutateAsync({
        proveedorId: Number(proveedorId),
        productos: items.map((i) => ({
          productoId: i.productoId,
          cantidad: i.cantidad,
          precioCompra: i.precioCompra,
        })),
      });
      setExito(true);
      setTimeout(() => onBack(), 1500);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err instanceof Error ? err.message : "Error al guardar la compra.");
      setError(msg);
    }
  };

  // ── Pantalla de éxito ────────────────────────────────────────────────────────
  if (exito) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
        <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h2 className="text-lg font-extrabold text-foreground">¡Compra registrada!</h2>
        <p className="text-xs text-muted-foreground">
          El inventario ha sido actualizado correctamente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {modalProvOpen && (
        <ProveedorModal
          onClose={() => setModalProvOpen(false)}
          onSuccess={(nuevo) => handleSeleccionarProveedor(String(nuevo.id))}
        />
      )}

      {/* ── Encabezado ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Nueva Orden de Compra
            </h1>
            <div className="inline-flex items-center gap-1.5 bg-muted/60 border border-border rounded-lg px-2.5 py-1">
              <Store className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-muted-foreground">
                Registra los costos, proveedores e ingresa stock al inventario.
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-muted text-foreground hover:bg-muted/80 border border-border transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a Compras</span>
        </button>
      </div>

      {/* ── Selección de Proveedor ────────────────────────────────────── */}
      <div className="bg-card border border-border p-4 rounded-2xl shadow-sm space-y-2">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider">
          Proveedor *
        </label>

        <div className="flex items-center gap-2">
          <div ref={refProv} className="relative flex-1">
          <button
            id="nueva-compra-proveedor"
            type="button"
            disabled={loadingProv}
            onClick={() => setOpenProv((p) => !p)}
            className={`
              w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm font-medium
              transition-all duration-200 select-none
              ${openProv || proveedorId
                ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
                : "bg-background text-muted-foreground border-border hover:bg-accent hover:border-border/80 shadow-sm"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <span className="truncate">
              {loadingProv
                ? "Cargando proveedores..."
                : proveedorId
                ? proveedores.find((p) => String(p.id) === proveedorId)?.nombre ?? "Seleccione proveedor..."
                : "Seleccione proveedor..."}
            </span>
            <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${openProv ? "rotate-180 text-primary" : ""}`} />
          </button>

          {openProv && !loadingProv && (
            <div className="absolute left-0 top-full mt-2 w-full z-50 rounded-2xl border border-border/60 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
              style={{ background: "var(--card)", backdropFilter: "blur(12px)" }}
            >
              {/* Header del dropdown */}
              <div className="px-4 pt-3 pb-2 border-b border-border/50"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.06), hsl(var(--muted)/0.8))" }}
              >
                <div className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-primary/70" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Proveedores disponibles</p>
                </div>
              </div>

              {/* Lista */}
              <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
                {proveedores.map((p) => {
                  const isSelected = String(p.id) === proveedorId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSeleccionarProveedor(String(p.id))}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left
                        transition-all duration-150
                        ${
                          isSelected
                            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm"
                            : "hover:bg-primary/8 text-foreground hover:text-primary"
                        }
                      `}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate leading-tight">{p.nombre}</p>
                        {p.nit && (
                          <p className={`text-[10px] mt-0.5 font-mono ${isSelected ? "text-primary-foreground/65" : "text-muted-foreground"}`}>
                            NIT {p.nit}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <span className="shrink-0 ml-2 h-5 w-5 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
                {proveedores.length === 0 && (
                  <div className="py-5 text-center">
                    <Truck className="h-7 w-7 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-xs font-medium text-muted-foreground">No hay proveedores registrados</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">Crea uno con el botón de arriba</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-2 py-2 border-t border-border/50"
                style={{ background: "linear-gradient(135deg, hsl(var(--muted)/0.4), hsl(var(--muted)/0.2))" }}
              >
                <button
                  type="button"
                  onClick={() => { setOpenProv(false); setModalProvOpen(true); }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Crear Nuevo Proveedor</span>
                </button>
              </div>
            </div>
          )}
          </div>

          {/* Botón Nuevo Proveedor — mismo nivel vertical que el selector */}
          <button
            type="button"
            onClick={() => setModalProvOpen(true)}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-sm shadow-emerald-500/25 active:scale-[0.97] transition-all duration-150"
          >
            <Truck className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap">+ Nuevo Proveedor</span>
          </button>
        </div>
      </div>

      {/* ── Error Banner ───────────────────────────────────────────────────── */}
      {error && (
        <div className="p-3 text-xs font-semibold rounded-xl bg-red-500/10 text-red-600 border border-red-500/20">
          {error}
        </div>
      )}

      {/* ── Layout POS: Catálogo + Carrito ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Catálogo de Productos */}
        <div className="lg:col-span-5 space-y-4 bg-card/50 backdrop-blur-sm border border-border/60 p-5 rounded-3xl shadow-sm flex flex-col h-[600px] transition-all">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Store className="h-4 w-4" />
              Catálogo de Productos
            </h3>
            {proveedorId && (
              <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                Filtrado por proveedor
              </span>
            )}
          </div>

          {!proveedorId && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
                ⚠️ Selecciona un proveedor para ver solo sus productos
              </span>
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busquedaProducto}
              onChange={(e) => setBusquedaProducto(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {loadingProd ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-muted/50 rounded-xl animate-pulse" />
              ))
            ) : productosFiltrados.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-muted-foreground p-6">
                <p className="text-xs">No se encontraron productos.</p>
              </div>
            ) : (
              productosFiltrados.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => handleAgregarProducto(prod)}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-border/60 hover:border-primary/50 bg-card hover:bg-primary/5 hover:shadow-md cursor-pointer transition-all duration-200 group relative overflow-hidden"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary/50 to-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex flex-col flex-1 min-w-0 pl-1">
                    <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{prod.nombre}</p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{prod.codigo}</p>
                  </div>
                  <div className="text-right ml-3 shrink-0 flex flex-col items-end">
                    <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{formatCOP(prod.precioVenta)}</p>
                    <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-md bg-muted text-[9px] font-semibold text-muted-foreground">
                      Stock: {prod.stock}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Columna Derecha: Carrito de Compra */}
        <div className="lg:col-span-7 bg-card border border-border/60 p-1 rounded-3xl shadow-sm flex flex-col justify-between h-[600px] relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500/40 via-primary/40 to-blue-500/40" />
          
          <div className="p-4 space-y-4 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Detalle de la Orden
              </h3>
              {proveedorId && (() => {
                const prov = proveedores.find((p) => String(p.id) === proveedorId);
                return prov ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary">
                    <Store className="h-2.5 w-2.5" />
                    {prov.nombre}
                  </span>
                ) : null;
              })()}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-6">
                  <p className="text-xs">No hay productos agregados.</p>
                  <p className="text-[11px] mt-1">Selecciona desde el catálogo izquierdo.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.productoId}
                    className="relative rounded-xl border border-border/60 bg-gradient-to-r from-background to-muted/20 overflow-hidden group hover:border-primary/30 transition-all duration-200"
                  >
                    {/* Accent left bar */}
                    <div className="absolute left-0 inset-y-0 w-0.5 bg-gradient-to-b from-primary via-emerald-500 to-primary/30" />

                    <div className="pl-4 pr-3 py-2.5 flex items-center gap-3">
                      {/* Info producto */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground truncate leading-tight">{item.productoNombre}</p>
                        <span className="inline-block mt-0.5 text-[9px] font-mono text-muted-foreground bg-muted/70 px-1.5 py-0.5 rounded">
                          {item.productoCodigo}
                        </span>
                      </div>

                      {/* Cantidad */}
                      <div className="flex items-center rounded-lg overflow-hidden border border-border/60 shrink-0">
                        <button
                          onClick={() => handleCambiarCantidad(item.productoId, -1)}
                          className="h-7 w-6 flex items-center justify-center bg-muted hover:bg-muted/80 text-foreground transition-colors"
                        >
                          <Minus className="h-2.5 w-2.5" />
                        </button>
                        <span className="h-7 w-7 flex items-center justify-center text-xs font-bold font-mono bg-background border-x border-border/60">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => handleCambiarCantidad(item.productoId, 1)}
                          className="h-7 w-6 flex items-center justify-center bg-muted hover:bg-muted/80 text-foreground transition-colors"
                        >
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                      </div>

                      {/* Costo */}
                      <div className="relative shrink-0 w-24">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-muted-foreground">$</span>
                        <input
                          type="number"
                          min="0"
                          value={item.precioCompra}
                          onChange={(e) => handleCambiarCosto(item.productoId, Number(e.target.value))}
                          className="w-full h-7 bg-background border border-border/60 rounded-lg pl-5 pr-2 text-xs font-semibold text-right focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-colors"
                        />
                      </div>

                      {/* Subtotal */}
                      <div className="shrink-0 text-right w-20">
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                          {formatCOP(item.subtotal)}
                        </span>
                      </div>

                      {/* Eliminar */}
                      <button
                        onClick={() => setItems((prev) => prev.filter((i) => i.productoId !== item.productoId))}
                        className="shrink-0 h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground/50 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer: Total y Botón Guardar */}
          <div className="p-4 bg-muted/30 border-t border-border/50 space-y-4 rounded-b-3xl">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-bold text-muted-foreground">TOTAL GENERAL</span>
              <span className="text-2xl font-extrabold text-foreground font-mono tracking-tight bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                {formatCOP(totalGeneral)}
              </span>
            </div>

            {items.length > 0 && !proveedorId && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold text-center">
                ⚠️ Selecciona un proveedor para habilitar el botón
              </p>
            )}
            <button
              id="guardar-compra-btn"
              onClick={handleGuardar}
              disabled={crearMutation.isPending || items.length === 0 || !proveedorId}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {crearMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Procesando compra...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Confirmar e Ingresar al Inventario</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}