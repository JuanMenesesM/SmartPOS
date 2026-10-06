import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, Calendar, Clock, CalendarDays, CalendarRange, SlidersHorizontal } from "lucide-react";
import { Proveedor } from "@/services/compras.service";

interface Props {
  busqueda: string;
  onBusquedaChange: (v: string) => void;
  proveedorId: string;
  onProveedorChange: (v: string) => void;
  fechaDesde: string;
  onFechaDesdeChange: (v: string) => void;
  fechaHasta: string;
  onFechaHastaChange: (v: string) => void;
  proveedores: Proveedor[];
}

// ── Utilidades ─────────────────────────────────────────────────────────────────
function toInputDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function fmtShort(iso: string): string {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });
}

type PeriodoClave = "hoy" | "semana" | "mes" | "anio" | "personalizado";

interface Periodo {
  value: PeriodoClave;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

const PERIODOS: Periodo[] = [
  { value: "hoy",         label: "Hoy",           sublabel: "Desde las 00:00 hrs",   icon: Clock            },
  { value: "semana",      label: "Esta semana",    sublabel: "Lunes a domingo",        icon: CalendarDays     },
  { value: "mes",         label: "Este mes",       sublabel: "Desde el 1° del mes",    icon: Calendar         },
  { value: "anio",        label: "Este año",       sublabel: "Desde el 1° de enero",   icon: CalendarRange    },
  { value: "personalizado", label: "Personalizado", sublabel: "Elige un rango exacto", icon: SlidersHorizontal },
];

function calcularPeriodo(p: PeriodoClave): { desde: string; hasta: string } {
  const hoy = new Date();
  const toISO = (d: Date) => d.toISOString().slice(0, 10);

  if (p === "hoy") {
    const s = toISO(hoy);
    return { desde: s, hasta: s };
  }
  if (p === "semana") {
    const dow = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1; // lunes=0
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - dow);
    return { desde: toISO(lunes), hasta: toISO(hoy) };
  }
  if (p === "mes") {
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    return { desde: toISO(inicio), hasta: toISO(hoy) };
  }
  if (p === "anio") {
    const inicio = new Date(hoy.getFullYear(), 0, 1);
    return { desde: toISO(inicio), hasta: toISO(hoy) };
  }
  return { desde: toISO(hoy), hasta: toISO(hoy) };
}

export default function ComprasFilters({
  busqueda, onBusquedaChange,
  proveedorId, onProveedorChange,
  fechaDesde, onFechaDesdeChange,
  fechaHasta, onFechaHastaChange,
  proveedores,
}: Props) {
  const today = toInputDate(new Date());

  const [openProv, setOpenProv] = useState(false);
  const [openFecha, setOpenFecha] = useState(false);
  const [periodoActivo, setPeriodoActivo] = useState<PeriodoClave | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState(today);
  const [customEnd, setCustomEnd] = useState(today);

  const refProv = useRef<HTMLDivElement>(null);
  const refFecha = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (refProv.current && !refProv.current.contains(e.target as Node)) setOpenProv(false);
      if (refFecha.current && !refFecha.current.contains(e.target as Node)) {
        setOpenFecha(false);
        setShowCustom(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const proveedorActivo = proveedores.find((p) => String(p.id) === proveedorId);
  const hayFecha = !!(fechaDesde || fechaHasta);
  const hayFiltros = !!(proveedorId || hayFecha || busqueda);

  // Etiqueta del botón de fecha
  const labelFecha = (() => {
    if (!hayFecha) return "Fecha: Todas";
    if (periodoActivo && periodoActivo !== "personalizado") {
      return PERIODOS.find(p => p.value === periodoActivo)?.label ?? "Personalizado";
    }
    if (fechaDesde === fechaHasta && fechaDesde) return fmtShort(fechaDesde);
    return `${fmtShort(fechaDesde)} – ${fmtShort(fechaHasta)}`;
  })();

  function seleccionarPeriodo(p: PeriodoClave) {
    if (p === "personalizado") {
      setShowCustom(true);
      return;
    }
    const { desde, hasta } = calcularPeriodo(p);
    setPeriodoActivo(p);
    onFechaDesdeChange(desde);
    onFechaHastaChange(hasta);
    setOpenFecha(false);
    setShowCustom(false);
  }

  function aplicarPersonalizado() {
    if (!customStart || !customEnd || customStart > customEnd) return;
    setPeriodoActivo("personalizado");
    onFechaDesdeChange(customStart);
    onFechaHastaChange(customEnd);
    setOpenFecha(false);
    setShowCustom(false);
  }

  function limpiarFechas() {
    setPeriodoActivo(null);
    onFechaDesdeChange("");
    onFechaHastaChange("");
    setCustomStart(today);
    setCustomEnd(today);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full bg-card p-2.5 rounded-2xl border border-border shadow-sm">
      {/* ── Buscador ─────────────────────────────────────────────────────────── */}
      <div className="relative flex-[1.8] w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          id="compras-busqueda"
          type="text"
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          placeholder="Buscar compra, proveedor o factura..."
          className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-muted/40 border border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
        />
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 flex-1 sm:flex-none justify-end">

        {/* ── Dropdown Proveedor ─────────────────────────────────────────────── */}
        <div ref={refProv} className="relative flex-1 sm:flex-none">
          <button
            id="compras-filtro-proveedor"
            onClick={() => { setOpenProv((p) => !p); setOpenFecha(false); }}
            className={`
              w-full flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-semibold
              transition-all duration-200 select-none
              ${openProv || proveedorId
                ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
                : "bg-background text-foreground border-border hover:bg-accent hover:border-border/80 shadow-sm"
              }
            `}
          >
            <span className="truncate max-w-[120px]">
              {proveedorActivo ? proveedorActivo.nombre : "Proveedor: Todos"}
            </span>
            <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${openProv ? "rotate-180 text-primary" : ""}`} />
          </button>

          {openProv && (
            <div className="absolute right-0 top-full mt-2 w-56 z-50 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 pt-3 pb-1.5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Proveedor</p>
              </div>
              <div className="p-1.5 space-y-0.5">
                {[{ id: "", nombre: "Todos los proveedores" }, ...proveedores].map((p) => {
                  const isSelected = String(p.id) === proveedorId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => { onProveedorChange(String(p.id)); setOpenProv(false); }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-left
                        transition-colors duration-150
                        ${isSelected ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-accent text-foreground"}
                      `}
                    >
                      <span>{p.nombre}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Dropdown Fecha (estilo DateRangeSelector) ─────────────────────── */}
        <div ref={refFecha} className="relative flex-1 sm:flex-none">
          <button
            id="compras-filtro-fecha"
            onClick={() => { setOpenFecha((p) => !p); setOpenProv(false); if (openFecha) setShowCustom(false); }}
            className={`
              w-full flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold
              transition-all duration-200 select-none whitespace-nowrap
              ${openFecha || hayFecha
                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                : "bg-background text-foreground border-border hover:bg-accent hover:border-primary/30 shadow-sm"
              }
            `}
          >
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{labelFecha}</span>
            <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${openFecha ? "rotate-180" : ""}`} />
          </button>

          {openFecha && (
            <div
              className="absolute right-0 top-full mt-2 z-50 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
              style={{ width: showCustom ? "272px" : "220px" }}
            >
              {!showCustom ? (
                <>
                  <div className="px-3 pt-3 pb-1.5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Período de compras</p>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    {PERIODOS.map((op) => {
                      const Icon = op.icon;
                      const isActive = op.value === periodoActivo;
                      return (
                        <button
                          key={op.value}
                          onClick={() => seleccionarPeriodo(op.value)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                            transition-all duration-150 group
                            ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"}
                          `}
                        >
                          <div className={`
                            h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors
                            ${isActive ? "bg-primary-foreground/20" : "bg-muted group-hover:bg-background"}
                          `}>
                            <Icon className={`h-3.5 w-3.5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-semibold leading-tight ${isActive ? "text-primary-foreground" : ""}`}>{op.label}</p>
                            <p className={`text-[10px] leading-tight mt-0.5 ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{op.sublabel}</p>
                          </div>
                          {isActive && <div className="ml-auto h-2 w-2 rounded-full bg-primary-foreground/80 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {hayFecha && (
                    <div className="px-3 pb-3 pt-1">
                      <div className="h-px bg-border mb-2" />
                      <button
                        onClick={() => { limpiarFechas(); setOpenFecha(false); }}
                        className="w-full text-center text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl py-1.5 transition-colors"
                      >
                        ✕ Quitar filtro de fecha
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* ── Panel personalizado ───────────────────────────────────── */
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowCustom(false)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronDown className="h-4 w-4 rotate-90" />
                    </button>
                    <p className="text-xs font-semibold text-foreground">Rango personalizado</p>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Desde</label>
                      <input
                        type="date"
                        value={customStart}
                        max={customEnd || today}
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Hasta</label>
                      <input
                        type="date"
                        value={customEnd}
                        min={customStart}
                        max={today}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <button
                    onClick={aplicarPersonalizado}
                    disabled={!customStart || !customEnd || customStart > customEnd}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Aplicar rango
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Limpiar todo ───────────────────────────────────────────────────── */}
        {hayFiltros && (
          <button
            onClick={() => {
              onBusquedaChange("");
              onProveedorChange("");
              limpiarFechas();
            }}
            className="px-3 py-2 text-[11px] font-semibold rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors shrink-0"
          >
            ✕ Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
