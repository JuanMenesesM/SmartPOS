import { useState, useEffect, useMemo } from "react";
import { Plus, History } from "lucide-react";
import { MovimientoKardex } from "@/types/producto";
import { getKardexMovimientos, getKardexStats } from "@/services/kardex.service";

import KardexStats from "@/components/kardex/KardexStats";
import KardexFilters from "@/components/kardex/KardexFilters";
import KardexTable from "@/components/kardex/KardexTable";
import KardexDetailSheet from "@/components/kardex/KardexDetailSheet";
import KardexAjusteSheet from "@/components/kardex/KardexAjusteSheet";
import { ExportDropdown } from "@/components/ui/ExportDropdown";

export default function KardexPage() {
  const [movimientos, setMovimientos] = useState<MovimientoKardex[]>([]);
  const [stats, setStats] = useState({ total: 0, entradas: 0, salidas: 0, ajustes: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isAjusteOpen, setIsAjusteOpen] = useState(false);
  const [selectedMov, setSelectedMov] = useState<MovimientoKardex | null>(null);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState("TODOS");
  const [proveedorId, setProveedorId] = useState("");
  const [fecha, setFecha] = useState("TODOS");
  const [usuario, setUsuario] = useState("TODOS");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [movData, statsData] = await Promise.all([
        getKardexMovimientos(),
        getKardexStats()
      ]);
      setMovimientos(movData);
      setStats(statsData);
    } catch (error) {
      console.error("Error cargando kardex:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNuevoAjuste = () => {
    setIsAjusteOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* ── Encabezado Principal Kardex (Estilo Ventas) ─────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent mt-0.5 shrink-0" />

          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Kardex
            </h1>
            <div className="inline-flex items-center gap-1.5 bg-muted/60 border border-border rounded-lg px-2.5 py-1">
              <History className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-muted-foreground">
                Historial completo de auditoría, trazabilidad y movimientos de inventario.
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5">
          <ExportDropdown
            title="Historial de Movimientos de Inventario (Kardex)"
            filename="kardex_movimientos"
            headers={["ID", "Fecha", "Producto", "Tipo", "Cantidad", "Stock Antes", "Nuevo Stock", "Usuario", "Observación"]}
            rows={movimientos.map((m) => [
              `MOV-${String(m.id).padStart(4, "0")}`,
              new Date(m.fecha).toLocaleString("es-CO"),
              m.productoNombre,
              m.tipo,
              m.cantidad > 0 ? `+${m.cantidad}` : m.cantidad,
              m.stockAnterior,
              m.stockNuevo,
              m.usuario,
              m.observacion || "-",
            ])}
          />
          
          <button 
            onClick={handleNuevoAjuste}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all select-none"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Ajuste</span>
          </button>
        </div>
      </div>

      {/* ── KPIs (Tarjetas de resumen) ──────────────────────────────────────── */}
      <KardexStats 
        total={stats.total} 
        entradas={stats.entradas} 
        salidas={stats.salidas} 
        ajustes={stats.ajustes} 
      />

      {/* ── Filtros ─────────────────────────────────────────────────────────── */}
      <KardexFilters
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        tipo={tipo}
        onTipoChange={setTipo}
        proveedorId={proveedorId}
        onProveedorChange={setProveedorId}
        fecha={fecha}
        onFechaChange={setFecha}
        usuario={usuario}
        onUsuarioChange={setUsuario}
      />

      {/* ── Tabla de Movimientos ────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <KardexTable 
          movimientos={movimientos} 
          onRowClick={setSelectedMov} 
          onNuevoAjuste={handleNuevoAjuste}
        />
      )}

      {/* ── Paginación (Mock) ─────────────────────────────────────────────── */}
      {!isLoading && movimientos.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground bg-card p-4 rounded-xl border border-border shadow-sm">
          <span>Mostrando 1 a {movimientos.length} de {stats.total} movimientos</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-md text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 disabled:opacity-50 font-semibold transition-colors" disabled>Anterior</button>
            <button className="px-3 py-1 rounded-md text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 font-semibold transition-colors">Siguiente</button>
          </div>
        </div>
      )}

      {/* ── Panel Lateral (Detalle) ───────────────────────────────────────── */}
      <KardexDetailSheet 
        movimiento={selectedMov} 
        onClose={() => setSelectedMov(null)} 
      />

      {/* ── Panel Lateral (Nuevo Ajuste) ──────────────────────────────────── */}
      <KardexAjusteSheet 
        isOpen={isAjusteOpen}
        onClose={() => setIsAjusteOpen(false)}
        onSave={loadData}
      />
      
    </div>
  );
}
