import { useState, useMemo } from "react";
import {
  Download,
  Eye,
  Receipt,
  Banknote,
  ArrowRightLeft,
  RotateCcw,
} from "lucide-react";
import { useVentas } from "@/hooks/useVentas";
import { VentaBackend } from "@/types/venta";
import { formatCOP } from "@/utils/formatCOP";
import VentaDetalleModal from "@/components/ventas/VentaDetalleModal";
import VentasFilters, { PeriodoClaveVentas } from "@/components/ventas/VentasFilters";

export default function HistorialTab() {
  const { data: ventas = [], isLoading } = useVentas();
  const [busqueda, setBusqueda] = useState("");
  const [producto, setProducto] = useState("");
  const [metodoPago, setMetodoPago] = useState<string>("TODOS");
  const [usuario, setUsuario] = useState<string>("TODOS");
  const [periodo, setPeriodo] = useState<PeriodoClaveVentas>("todas");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const [ventaDetalle, setVentaDetalle] = useState<VentaBackend | null>(null);

  // Lista única de usuarios que atendieron
  const usuariosDisponibles = useMemo(() => {
    const map = new Map<string, string>();
    ventas.forEach((v) => {
      const nombreCompleto = `${v.usuario.nombre} ${v.usuario.apellido || ""}`.trim();
      if (nombreCompleto) {
        map.set(nombreCompleto, nombreCompleto);
      }
    });
    return Array.from(map.values()).sort();
  }, [ventas]);

  const hayFiltrosActivos =
    busqueda.trim() !== "" ||
    producto.trim() !== "" ||
    metodoPago !== "TODOS" ||
    usuario !== "TODOS" ||
    periodo !== "todas" ||
    fechaDesde !== "" ||
    fechaHasta !== "";

  const handleLimpiarTodo = () => {
    setBusqueda("");
    setProducto("");
    setMetodoPago("TODOS");
    setUsuario("TODOS");
    setPeriodo("todas");
    setFechaDesde("");
    setFechaHasta("");
  };

  const handleDescargarPDF = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/ventas/${id}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al descargar el PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (e) {
      console.error(e);
      alert("No se pudo generar el PDF");
    }
  };

  const matchFecha = (fechaIso: string): boolean => {
    if (periodo === "todas") return true;
    const f = new Date(fechaIso);
    const ahora = new Date();

    if (periodo === "hoy") {
      return (
        f.getFullYear() === ahora.getFullYear() &&
        f.getMonth() === ahora.getMonth() &&
        f.getDate() === ahora.getDate()
      );
    }
    if (periodo === "semana") {
      const dow = ahora.getDay() === 0 ? 6 : ahora.getDay() - 1; // lunes=0
      const lunes = new Date(ahora);
      lunes.setDate(ahora.getDate() - dow);
      lunes.setHours(0, 0, 0, 0);
      return f >= lunes;
    }
    if (periodo === "mes") {
      return (
        f.getMonth() === ahora.getMonth() &&
        f.getFullYear() === ahora.getFullYear()
      );
    }
    if (periodo === "anio") {
      return f.getFullYear() === ahora.getFullYear();
    }
    if (periodo === "personalizado") {
      if (fechaDesde) {
        const d = new Date(fechaDesde + "T00:00:00");
        if (f < d) return false;
      }
      if (fechaHasta) {
        const h = new Date(fechaHasta + "T23:59:59");
        if (f > h) return false;
      }
      return true;
    }
    return true;
  };

  const ventasFiltradas = useMemo(() => {
    return ventas.filter((v) => {
      // Filtro Comprobante / Atendido por
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase().trim();
        const codigoFac = `fac-${String(v.id).padStart(4, "0")}`.toLowerCase();
        const atendido = `${v.usuario.nombre} ${v.usuario.apellido || ""}`.toLowerCase();
        if (!codigoFac.includes(q) && !atendido.includes(q)) {
          return false;
        }
      }

      // Filtro Producto
      if (producto.trim()) {
        const pQuery = producto.toLowerCase().trim();
        const tieneProducto = v.detalles?.some((d) =>
          d.producto.nombre.toLowerCase().includes(pQuery) ||
          d.producto.codigo.toLowerCase().includes(pQuery)
        );
        if (!tieneProducto) return false;
      }

      // Filtro Método de Pago
      if (metodoPago !== "TODOS") {
        const pago = (v.metodoPago || "EFECTIVO").toUpperCase();
        if (pago !== metodoPago.toUpperCase()) {
          return false;
        }
      }

      // Filtro Quién Atendió
      if (usuario !== "TODOS") {
        const atendido = `${v.usuario.nombre} ${v.usuario.apellido || ""}`.trim();
        if (atendido !== usuario) {
          return false;
        }
      }

      // Filtro Fecha
      if (!matchFecha(v.fecha)) {
        return false;
      }

      return true;
    });
  }, [ventas, busqueda, producto, metodoPago, usuario, periodo, fechaDesde, fechaHasta]);

  // Total acumulado dinámico de las ventas filtradas
  const totalVentasFiltradas = useMemo(() => {
    return ventasFiltradas.reduce((acc, v) => acc + (v.total || 0), 0);
  }, [ventasFiltradas]);

  const ticketPromedio = useMemo(() => {
    if (ventasFiltradas.length === 0) return 0;
    return Math.round(totalVentasFiltradas / ventasFiltradas.length);
  }, [totalVentasFiltradas, ventasFiltradas.length]);

  return (
    <div className="space-y-4">
      {/* ── Barra de Filtros Estandarizada y Compacta ───────────────────────── */}
      <VentasFilters
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        producto={producto}
        onProductoChange={setProducto}
        metodoPago={metodoPago}
        onMetodoPagoChange={setMetodoPago}
        usuario={usuario}
        onUsuarioChange={setUsuario}
        periodo={periodo}
        onPeriodoChange={setPeriodo}
        fechaDesde={fechaDesde}
        onFechaDesdeChange={setFechaDesde}
        fechaHasta={fechaHasta}
        onFechaHastaChange={setFechaHasta}
        usuariosDisponibles={usuariosDisponibles}
        onLimpiarTodo={handleLimpiarTodo}
        hayFiltrosActivos={hayFiltrosActivos}
      />

      {/* ── Tabla de Facturas con Totales Dinámicos ─────────────────────────── */}
      {isLoading ? (
        <div className="bg-card rounded-2xl border border-border p-4 space-y-2.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-11 bg-muted/60 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : ventasFiltradas.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border py-10 px-6 text-center flex flex-col items-center justify-center space-y-3 min-h-[240px]">
          <div className="h-12 w-12 rounded-2xl bg-muted/80 flex items-center justify-center text-muted-foreground">
            <Receipt className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">
              {hayFiltrosActivos ? "No hay resultados para estos filtros" : "No hay facturas emitidas"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              {hayFiltrosActivos
                ? "Prueba cambiando los criterios de búsqueda o limpiando los filtros activos."
                : "Las ventas cobradas desde las mesas aparecerán consolidadas aquí."}
            </p>
          </div>
          {hayFiltrosActivos && (
            <button
              type="button"
              onClick={handleLimpiarTodo}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground border border-primary/20 transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restablecer filtros</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border/80 shadow-lg shadow-black/[0.03] dark:shadow-black/20 overflow-hidden ring-1 ring-border/40">
            <div className="h-1 w-full bg-gradient-to-r from-primary/30 via-primary to-primary/30 shrink-0" />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-10 bg-muted/60 dark:bg-muted/30 backdrop-blur-md border-b border-border/80 text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 font-extrabold text-center">Comprobante</th>
                    <th className="py-3.5 px-4 font-extrabold text-center">Atendido por</th>
                    <th className="py-3.5 px-4 font-extrabold text-center">Método de Pago</th>
                    <th className="py-3.5 px-4 font-extrabold text-center">Fecha</th>
                    <th className="py-3.5 px-4 font-extrabold text-center">Total</th>
                    <th className="py-3.5 px-4 font-extrabold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {ventasFiltradas.map((v) => {
                    const metodoPagoUpper = (v.metodoPago || "EFECTIVO").toUpperCase();
                    const esTransferencia = metodoPagoUpper === "TRANSFERENCIA";

                    return (
                      <tr
                        key={v.id}
                        className="even:bg-muted/[0.22] dark:even:bg-muted/[0.12] hover:bg-primary/[0.08] dark:hover:bg-primary/[0.15] transition-colors duration-150 group cursor-pointer"
                        onClick={() => setVentaDetalle(v)}
                      >
                        {/* Comprobante */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-muted/60 dark:bg-muted/40 border border-border/70 font-mono text-[11px] font-semibold text-foreground group-hover:border-primary/40 group-hover:text-primary transition-colors shadow-2xs">
                            FAC-{String(v.id).padStart(4, "0")}
                          </span>
                        </td>

                        {/* Atendido por */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-[10px] flex items-center justify-center border border-primary/25 shrink-0 shadow-2xs">
                              {v.usuario.nombre.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-foreground text-xs truncate max-w-[150px] group-hover:text-primary transition-colors">
                              {v.usuario.nombre} {v.usuario.apellido || ""}
                            </span>
                          </div>
                        </td>

                        {/* Método de Pago */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            {esTransferencia ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-2xs">
                                <ArrowRightLeft className="h-3 w-3" />
                                <span>Transferencia</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                                <Banknote className="h-3 w-3" />
                                <span>Efectivo</span>
                              </span>
                            )}
                            {v.referencia && (
                              <span
                                className="text-[10px] font-mono text-muted-foreground mt-0.5 max-w-[130px] truncate"
                                title={v.referencia}
                              >
                                Ref: {v.referencia}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Fecha */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold text-foreground text-xs">
                              {new Date(v.fecha).toLocaleDateString("es-CO", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span className="text-[11px] text-muted-foreground/80 font-mono mt-0.5">
                              {new Date(v.fecha).toLocaleTimeString("es-CO", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-muted/50 border border-border/60 font-mono font-bold text-foreground text-xs tracking-tight tabular-nums shadow-2xs">
                            {formatCOP(v.total)}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setVentaDetalle(v)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground border border-primary/20 hover:border-primary shadow-2xs hover:shadow-md hover:shadow-primary/20 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Ver</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDescargarPDF(v.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-600 hover:text-white border border-emerald-500/20 hover:border-emerald-600 shadow-2xs hover:shadow-md hover:shadow-emerald-500/20 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>PDF</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* ── Fila de Totales Dinámicos al pie de la tabla ─────── */}
                <tfoot className="border-t-2 border-border/80 bg-muted/50 font-semibold text-xs text-foreground">
                  <tr>
                    <td className="py-3.5 px-4 text-center font-bold text-foreground uppercase tracking-wider text-[11px]">
                      Totales
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-muted-foreground text-xs">
                      {ventasFiltradas.length} comprobante{ventasFiltradas.length !== 1 ? "s" : ""}
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs text-muted-foreground">
                      —
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Promedio</span>
                        <span className="font-mono font-bold text-foreground text-xs">{formatCOP(ticketPromedio)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Total</span>
                        <span className="inline-block px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm tracking-tight tabular-nums shadow-xs">
                          {formatCOP(totalVentasFiltradas)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle Estandarizado */}
      <VentaDetalleModal
        venta={ventaDetalle}
        onClose={() => setVentaDetalle(null)}
        onDescargarPDF={handleDescargarPDF}
      />
    </div>
  );
}
