import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Plus, Minus, Trash2, CreditCard, CheckCircle2, ShoppingCart, Package } from "lucide-react";
import { useProductos } from "@/hooks/useProductos";
import { useCrearVenta } from "@/hooks/useVentas";
import {
  getMesaById,
  agregarItemMesa,
  modificarCantidadItemMesa,
  vaciarYLiberarMesa,
  solicitarCuenta,
} from "@/services/mesas.service";
import { Mesa } from "@/types/venta";

function formatCOP(amount: number): string {
  return `$${new Intl.NumberFormat("es-CO").format(amount)}`;
}

export default function MesaPOSPage() {
  const { mesaId } = useParams<{ mesaId: string }>();
  const navigate = useNavigate();

  const [mesa, setMesa] = useState<Mesa | undefined>(() =>
    mesaId ? getMesaById(mesaId) : undefined
  );

  const { data: productos = [], isLoading: loadingProds } = useProductos();
  const crearVentaMutation = useCrearVenta();

  const [busqueda, setBusqueda] = useState("");
  const [modalCobrarOpen, setModalCobrarOpen] = useState(false);
  const [metodoPago, setMetodoPago] = useState<"EFECTIVO" | "TRANSFERENCIA">("EFECTIVO");
  const [referencia, setReferencia] = useState("");
  const [ventaCompletada, setVentaCompletada] = useState(false);

  if (!mesaId || !mesa) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-foreground">Mesa no encontrada</h2>
        <button
          onClick={() => navigate("/ventas")}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground"
        >
          Volver a Ventas
        </button>
      </div>
    );
  }

  // Filtrado de productos disponibles (solo activos y con stock > 0)
  const productosDisponibles = useMemo(() => {
    return productos.filter((p) => {
      const matchQuery =
        !busqueda ||
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.codigo.toLowerCase().includes(busqueda.toLowerCase());
      return p.activo && p.stock > 0 && matchQuery;
    });
  }, [productos, busqueda]);

  const totalMesa = mesa.carrito.reduce((acc, i) => acc + i.subtotal, 0);

  // Manejadores
  const handleAgregarProducto = (p: typeof productos[0]) => {
    const actualizada = agregarItemMesa(mesa.id, {
      productoId: p.id,
      codigo: p.codigo,
      nombre: p.nombre,
      precioUnitario: p.precioVenta,
      cantidad: 1,
    });
    setMesa(actualizada);
  };

  const handleModificarCantidad = (productoId: number, delta: number) => {
    const actualizada = modificarCantidadItemMesa(mesa.id, productoId, delta);
    setMesa(actualizada);
  };

  const handleSolicitarCuenta = () => {
    const actualizada = solicitarCuenta(mesa.id);
    setMesa(actualizada);
  };

  const handleCobrar = async () => {
    if (mesa.carrito.length === 0) return;
    if (metodoPago === "TRANSFERENCIA" && referencia.trim().length !== 4) {
      alert("Por favor ingresa los últimos 4 dígitos de la transferencia.");
      return;
    }

    try {
      // 1. Crear venta en el backend
      await crearVentaMutation.mutateAsync({
        productos: mesa.carrito.map((i) => ({
          productoId: i.productoId,
          cantidad: i.cantidad,
        })),
        metodoPago,
        referencia: metodoPago === "TRANSFERENCIA" ? referencia.trim() : undefined,
      });

      // 2. Liberar mesa en localStorage
      vaciarYLiberarMesa(mesa.id);
      setVentaCompletada(true);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Error al procesar el cobro");
    }
  };

  const handleFinalizarYVolver = () => {
    setVentaCompletada(false);
    setModalCobrarOpen(false);
    setReferencia("");
    setMetodoPago("EFECTIVO");
    navigate("/ventas");
  };

  return (
    <div className="space-y-4">
      {/* Encabezado POS */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/ventas")}
            className="h-9 w-9 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-foreground tracking-tight">
                {mesa.nombre}
              </h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                mesa.estado === "LIBRE"
                  ? "bg-emerald-500/10 text-emerald-600"
                  : mesa.estado === "EN_CONSUMO"
                  ? "bg-amber-500/10 text-amber-600"
                  : "bg-red-500/10 text-red-600"
              }`}>
                {mesa.estado === "LIBRE" ? "Libre" : mesa.estado === "EN_CONSUMO" ? "En consumo" : "Por cobrar"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">POS de atención directa y toma de pedidos</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mesa.estado === "EN_CONSUMO" && (
            <button
              onClick={handleSolicitarCuenta}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-500/10 px-3.5 py-1.5 rounded-xl border border-amber-500/20 transition-colors"
            >
              🔔 Solicitar Cuenta
            </button>
          )}

          {mesa.carrito.length > 0 && (
            <button
              onClick={() => {
                vaciarYLiberarMesa(mesa.id);
                setMesa(getMesaById(mesa.id));
              }}
              className="text-xs font-semibold text-red-500 hover:text-red-600 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20 transition-colors"
            >
              Cancelar / Liberar mesa
            </button>
          )}
        </div>
      </div>


      {/* Grid Principal POS (Izquierda: Productos | Derecha: Carrito) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Columna Izquierda — Catálogo de Productos (7 columnas) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Buscador de productos */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar producto por nombre o código..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Grid de Productos */}
          {loadingProds ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-muted/60 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : productosDisponibles.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-8 text-center text-xs text-muted-foreground space-y-2">
              <Package className="h-6 w-6 mx-auto" />
              <p>No hay productos disponibles para agregar</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[520px] overflow-y-auto p-1.5 pt-2.5">
              {productosDisponibles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleAgregarProducto(p)}
                  className="
                    group text-left p-3.5 rounded-2xl border border-border/80 bg-card
                    hover:border-primary hover:ring-2 hover:ring-primary/20 hover:shadow-md
                    active:scale-[0.98] transition-all duration-150 flex flex-col justify-between h-28 relative
                  "
                >
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground block">
                      {p.codigo}
                    </span>
                    <h4 className="text-xs font-bold text-foreground line-clamp-2 mt-0.5 group-hover:text-primary transition-colors">
                      {p.nombre}
                    </h4>
                  </div>
                  <div className="flex items-baseline justify-between w-full pt-2 border-t border-border/40">
                    <span className="text-[10px] text-muted-foreground">
                      Stock: {p.stock}
                    </span>
                    <span className="text-xs font-extrabold font-mono text-foreground">
                      {formatCOP(p.precioVenta)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Columna Derecha — Carrito de la Mesa (5 columnas) */}
        <div className="lg:col-span-5 bg-card rounded-2xl border border-border p-4 shadow-sm space-y-4 sticky top-20">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Pedido {mesa.nombre}</h3>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              {mesa.carrito.reduce((acc, i) => acc + i.cantidad, 0)} ítems
            </span>
          </div>

          {/* Lista de ítems en carrito */}
          {mesa.carrito.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
              <ShoppingCart className="h-8 w-8 mx-auto text-muted-foreground/50" />
              <p className="font-medium">El pedido está vacío</p>
              <p className="text-[11px]">Haz clic en los productos de la izquierda para agregarlos</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {mesa.carrito.map((item) => (
                <div
                  key={item.productoId}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-muted/20"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-xs font-bold text-foreground truncate">{item.nombre}</p>
                    <p className="text-[11px] font-mono text-muted-foreground">
                      {formatCOP(item.precioUnitario)} c/u
                    </p>
                  </div>

                  {/* Controles de Cantidad */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-border rounded-lg bg-card">
                      <button
                        onClick={() => handleModificarCantidad(item.productoId, -1)}
                        className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        {item.cantidad === 1 ? <Trash2 className="h-3 w-3 text-red-500" /> : <Minus className="h-3 w-3" />}
                      </button>
                      <span className="w-7 text-center text-xs font-mono font-bold text-foreground">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => handleModificarCantidad(item.productoId, 1)}
                        className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <span className="w-16 text-right font-mono text-xs font-bold text-foreground">
                      {formatCOP(item.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Resumen & Botón Cobrar */}
          <div className="border-t border-border pt-3 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">Total a pagar</span>
              <span className="text-xl font-extrabold font-mono text-foreground">{formatCOP(totalMesa)}</span>
            </div>

            <button
              onClick={() => setModalCobrarOpen(true)}
              disabled={mesa.carrito.length === 0}
              className="
                w-full py-3 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2
                bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20
                disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150
              "
            >
              <CreditCard className="h-4 w-4" />
              <span>Cobrar {formatCOP(totalMesa)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Cobro */}
      {modalCobrarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 space-y-4">
            {!ventaCompletada ? (
              <>
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-extrabold text-foreground">Cobrar {mesa.nombre}</h3>
                  <p className="text-xs text-muted-foreground">Selecciona el método de pago para emitir la factura</p>
                </div>

                <div className="bg-muted/40 p-4 rounded-2xl border border-border text-center">
                  <p className="text-xs text-muted-foreground uppercase font-bold">Monto Total</p>
                  <p className="text-3xl font-extrabold font-mono text-foreground mt-0.5">{formatCOP(totalMesa)}</p>
                </div>

                {/* Métodos de Pago */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">Método de Pago</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["EFECTIVO", "TRANSFERENCIA"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => { setMetodoPago(m); setReferencia(""); }}
                        className={`
                          py-2.5 text-xs font-semibold rounded-xl border text-center transition-all
                          ${metodoPago === m
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-background border-border text-foreground hover:bg-accent"
                          }
                        `}
                      >
                        {m === "EFECTIVO" ? "💵 Efectivo" : "📱 Nequi / Transf."}
                      </button>
                    ))}
                  </div>

                  {/* Campo referencia para Nequi/Transferencia */}
                  {metodoPago === "TRANSFERENCIA" && (
                    <div className="mt-3 space-y-1.5 animate-in fade-in duration-200">
                      <label className="text-xs font-bold text-foreground uppercase tracking-wider">Últimos 4 dígitos de la transacción</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={referencia}
                        onChange={(e) => setReferencia(e.target.value.replace(/\D/g, ""))}
                        placeholder="Ej. 3842"
                        className="w-full px-3.5 py-2.5 text-center text-xl font-bold font-mono tracking-widest rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                      <p className="text-[10px] text-muted-foreground">Ingresa solo los 4 últimos dígitos del comprobante Nequi o transferencia bancaria.</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setModalCobrarOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl text-muted-foreground hover:bg-accent"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCobrar}
                    disabled={crearVentaMutation.isPending}
                    className="px-5 py-2 text-xs font-extrabold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-md"
                  >
                    {crearVentaMutation.isPending ? "Procesando..." : "Confirmar y Emitir Factura"}
                  </button>
                </div>
              </>
            ) : (
              /* Venta Exitosa */
              <div className="text-center py-4 space-y-4">
                <div className="h-14 w-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-foreground">¡Venta Cobrada con Éxito!</h3>
                  <p className="text-xs text-muted-foreground">La factura fue emitida, el stock fue actualizado y la {mesa.nombre} está nuevamente 🟢 Libre.</p>
                </div>
                <button
                  onClick={handleFinalizarYVolver}
                  className="w-full py-2.5 text-xs font-extrabold rounded-xl bg-primary text-primary-foreground shadow-md"
                >
                  Volver al Mapa de Mesas
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
