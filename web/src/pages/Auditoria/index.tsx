import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { EventoAuditoria, AuditoriaStats as AuditoriaStatsType } from "@/types/auditoria";

import AuditoriaStats from "@/components/auditoria/AuditoriaStats";
import AuditoriaFilters from "@/components/auditoria/AuditoriaFilters";
import AuditoriaTable from "@/components/auditoria/AuditoriaTable";
import AuditoriaDetailSheet from "@/components/auditoria/AuditoriaDetailSheet";
import VentaDetalleModal from "@/components/ventas/VentaDetalleModal";
import CompraDetalleModal from "@/components/compras/CompraDetalleModal";
import { getAuditoriaEventos, getAuditoriaStats } from "@/services/auditoria.service";
import { getVentaById } from "@/services/ventas.service";
import { getCompraById, CompraAPI } from "@/services/compras.service";
import { VentaBackend } from "@/types/venta";
import { ExportDropdown } from "@/components/ui/ExportDropdown";

export default function AuditoriaPage() {
  const [eventos, setEventos] = useState<EventoAuditoria[]>([]);
  const [stats, setStats] = useState<AuditoriaStatsType>({
    eventosHoy: 0,
    usuariosActivos: 0,
    productosModificados: 0,
    ventasRegistradas: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Modales unificados
  const [selectedEvento, setSelectedEvento] = useState<EventoAuditoria | null>(null);
  const [selectedVenta, setSelectedVenta] = useState<VentaBackend | null>(null);
  const [selectedCompra, setSelectedCompra] = useState<CompraAPI | null>(null);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState("TODOS");
  const [modulo, setModulo] = useState("TODOS");
  const [accion, setAccion] = useState("TODOS");
  const [fecha, setFecha] = useState("TODOS");
  const [fechaRangoStart, setFechaRangoStart] = useState<Date | null>(null);
  const [fechaRangoEnd, setFechaRangoEnd] = useState<Date | null>(null);

  function handleFechaRangoChange(start: Date | null, end: Date | null) {
    setFechaRangoStart(start);
    setFechaRangoEnd(end);
  }

  const loadData = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const [eventsData, statsData] = await Promise.all([
        getAuditoriaEventos(),
        getAuditoriaStats(),
      ]);
      setEventos(eventsData);
      setStats(statsData);
    } catch (e) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDescargarPDF = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/ventas/${id}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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

  // Manejo de clic unificado: redirige directamente al modal de Venta o Compra oficial
  const handleVerEvento = async (ev: EventoAuditoria) => {
    if (ev.modulo === "Ventas") {
      const match = ev.descripcion.match(/(?:VNT|FAC)-(\d+)/i);
      const ventaId = match ? parseInt(match[1], 10) : null;
      if (ventaId) {
        try {
          const venta = await getVentaById(ventaId);
          if (venta) {
            setSelectedVenta(venta);
            return;
          }
        } catch (err) {
          console.error("Error al obtener detalle de venta:", err);
        }
      }
    }

    if (ev.modulo === "Compras") {
      const match = ev.descripcion.match(/FC-(\d+)/i);
      const compraId = match ? parseInt(match[1], 10) : null;
      if (compraId) {
        try {
          const compra = await getCompraById(compraId);
          if (compra) {
            setSelectedCompra(compra);
            return;
          }
        } catch (err) {
          console.error("Error al obtener detalle de compra:", err);
        }
      }
    }

    // Para cualquier otro módulo o si no se detectó ID específico, muestra el detalle de auditoría
    setSelectedEvento(ev);
  };

  // Lista dinámica de usuarios deducida de los eventos cargados
  const usuariosDisponibles = Array.from(
    new Map(eventos.map((ev) => [String(ev.usuarioId), ev.usuarioNombre])).entries()
  ).map(([id, nombre]) => ({ value: id, label: nombre }));

  // Filtrado local
  const eventosFiltrados = eventos.filter((ev) => {
    if (usuario !== "TODOS" && String(ev.usuarioId) !== usuario) return false;
    if (modulo !== "TODOS" && ev.modulo !== modulo) return false;
    if (accion !== "TODOS" && ev.accion !== accion) return false;

    // Filtro por período de fecha
    if (fecha !== "TODOS") {
      const evFecha = new Date(ev.fecha);
      const ahora = new Date();
      if (fecha === "hoy") {
        if (
          evFecha.getFullYear() !== ahora.getFullYear() ||
          evFecha.getMonth() !== ahora.getMonth() ||
          evFecha.getDate() !== ahora.getDate()
        ) return false;
      } else if (fecha === "semana") {
        const inicioSemana = new Date(ahora);
        inicioSemana.setDate(ahora.getDate() - ahora.getDay() + (ahora.getDay() === 0 ? -6 : 1));
        inicioSemana.setHours(0, 0, 0, 0);
        if (evFecha < inicioSemana) return false;
      } else if (fecha === "mes") {
        if (
          evFecha.getFullYear() !== ahora.getFullYear() ||
          evFecha.getMonth() !== ahora.getMonth()
        ) return false;
      } else if (fecha === "anio") {
        if (evFecha.getFullYear() !== ahora.getFullYear()) return false;
      } else if (fecha === "personalizado" && fechaRangoStart && fechaRangoEnd) {
        const evDay = new Date(evFecha.getFullYear(), evFecha.getMonth(), evFecha.getDate());
        const inicio = new Date(fechaRangoStart.getFullYear(), fechaRangoStart.getMonth(), fechaRangoStart.getDate());
        const fin    = new Date(fechaRangoEnd.getFullYear(), fechaRangoEnd.getMonth(), fechaRangoEnd.getDate());
        if (evDay < inicio || evDay > fin) return false;
      }
    }

    if (busqueda) {
      const q = busqueda.toLowerCase();
      if (
        !ev.usuarioNombre.toLowerCase().includes(q) &&
        !ev.modulo.toLowerCase().includes(q) &&
        !ev.accion.toLowerCase().includes(q) &&
        !ev.descripcion.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ── Encabezado ───────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Auditoría
            </h1>
            <div className="inline-flex items-center gap-1.5 bg-muted/60 border border-border rounded-lg px-2.5 py-1">
              <ShieldCheck className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-muted-foreground">
                Registro completo de las acciones realizadas por los usuarios.
              </span>
            </div>
          </div>
        </div>

        <ExportDropdown
          title="Registro de Auditoría de Sistema"
          filename="auditoria_eventos"
          headers={["ID", "Fecha", "Usuario", "Módulo", "Acción", "Detalle"]}
          rows={eventosFiltrados.map((ev) => [
            `AUD-${String(ev.id).padStart(4, "0")}`,
            new Date(ev.fecha).toLocaleString("es-CO"),
            ev.usuarioNombre,
            ev.modulo,
            ev.accion,
            ev.descripcion,
          ])}
        />
      </div>

      {/* ── KPIs ─────────────────────────────────────────────────────────────── */}
      <AuditoriaStats
        eventosHoy={stats.eventosHoy}
        usuariosActivos={stats.usuariosActivos}
        productosModificados={stats.productosModificados}
        ventasRegistradas={stats.ventasRegistradas}
      />

      {/* ── Filtros ──────────────────────────────────────────────────────────── */}
      <AuditoriaFilters
        busqueda={busqueda}    onBusquedaChange={setBusqueda}
        usuario={usuario}      onUsuarioChange={setUsuario}
        modulo={modulo}        onModuloChange={setModulo}
        accion={accion}        onAccionChange={setAccion}
        fecha={fecha}          onFechaChange={setFecha}
        fechaRangoStart={fechaRangoStart}
        fechaRangoEnd={fechaRangoEnd}
        onFechaRangoChange={handleFechaRangoChange}
        usuariosDisponibles={usuariosDisponibles}
      />

      {/* ── Tabla ────────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20 bg-card rounded-2xl border border-border shadow-sm min-h-[240px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-20 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-500/20 shadow-sm min-h-[240px] text-rose-600 dark:text-rose-400 font-semibold text-sm">
          Error al cargar los registros de auditoría. Verifica la conexión con el servidor.
        </div>
      ) : (
        <AuditoriaTable
          eventos={eventosFiltrados}
          onRowClick={handleVerEvento}
        />
      )}

      {/* ── Paginación ───────────────────────────────────────────────────────── */}
      {!isLoading && !error && eventosFiltrados.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground bg-card p-4 rounded-xl border border-border shadow-sm">
          <span>Mostrando {eventosFiltrados.length} de {eventos.length} eventos</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-md text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 disabled:opacity-50 font-semibold transition-colors" disabled>Anterior</button>
            <button className="px-3 py-1 rounded-md text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 font-semibold transition-colors">Siguiente</button>
          </div>
        </div>
      )}

      {/* ── Modal de Detalle de Venta Reutilizado ─────────────────────────────── */}
      <VentaDetalleModal
        venta={selectedVenta}
        onClose={() => setSelectedVenta(null)}
        onDescargarPDF={handleDescargarPDF}
      />

      {/* ── Modal de Detalle de Compra Reutilizado ────────────────────────────── */}
      <CompraDetalleModal
        compra={selectedCompra}
        onClose={() => setSelectedCompra(null)}
      />

      {/* ── Modal de Auditoría Genérico (Otros Módulos) ───────────────────────── */}
      <AuditoriaDetailSheet
        evento={selectedEvento}
        onClose={() => setSelectedEvento(null)}
      />
    </div>
  );
}
