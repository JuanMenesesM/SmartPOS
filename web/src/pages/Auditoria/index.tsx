import { useState, useEffect } from "react";
import { Download, ShieldCheck } from "lucide-react";
import { EventoAuditoria, AuditoriaStats as AuditoriaStatsType } from "@/types/auditoria";

import AuditoriaStats from "@/components/auditoria/AuditoriaStats";
import AuditoriaFilters from "@/components/auditoria/AuditoriaFilters";
import AuditoriaTable from "@/components/auditoria/AuditoriaTable";
import AuditoriaDetailSheet from "@/components/auditoria/AuditoriaDetailSheet";
import { getAuditoriaEventos, getAuditoriaStats } from "@/services/auditoria.service";

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
  const [selectedEvento, setSelectedEvento] = useState<EventoAuditoria | null>(null);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState("TODOS");
  const [modulo, setModulo] = useState("TODOS");
  const [accion, setAccion] = useState("TODOS");
  const [fecha, setFecha] = useState("TODOS");

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

  // Filtrado local
  const eventosFiltrados = eventos.filter((ev) => {
    if (usuario !== "TODOS" && String(ev.usuarioId) !== usuario) return false;
    if (modulo !== "TODOS" && ev.modulo !== modulo) return false;
    if (accion !== "TODOS" && ev.accion !== accion) return false;
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

        <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-transparent bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-bold shadow-sm transition-all select-none">
          <Download className="h-3.5 w-3.5 text-white" />
          <span>Exportar</span>
        </button>
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
          onRowClick={setSelectedEvento}
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

      {/* ── Detail Sheet ─────────────────────────────────────────────────────── */}
      <AuditoriaDetailSheet
        evento={selectedEvento}
        onClose={() => setSelectedEvento(null)}
      />
    </div>
  );
}
