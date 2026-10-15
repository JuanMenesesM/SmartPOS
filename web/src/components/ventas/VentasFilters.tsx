import { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Check,
  CreditCard,
  User,
  Package,
  Calendar,
  Clock,
  CalendarDays,
  CalendarRange,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";

export type PeriodoClaveVentas = "todas" | "hoy" | "semana" | "mes" | "anio" | "personalizado";

interface Props {
  busqueda: string;
  onBusquedaChange: (v: string) => void;
  producto: string;
  onProductoChange: (v: string) => void;
  metodoPago: string;
  onMetodoPagoChange: (v: string) => void;
  usuario: string;
  onUsuarioChange: (v: string) => void;
  periodo: PeriodoClaveVentas;
  onPeriodoChange: (p: PeriodoClaveVentas) => void;
  fechaDesde: string;
  onFechaDesdeChange: (v: string) => void;
  fechaHasta: string;
  onFechaHastaChange: (v: string) => void;
  usuariosDisponibles: string[];
  onLimpiarTodo: () => void;
  hayFiltrosActivos: boolean;
}

const METODOS_PAGO = [
  { value: "TODOS", label: "Todos los pagos" },
  { value: "EFECTIVO", label: "Efectivo" },
  { value: "TRANSFERENCIA", label: "Transferencia" },
];

const PERIODOS: { value: PeriodoClaveVentas; label: string; sublabel: string; icon: React.ElementType }[] = [
  { value: "todas", label: "Todas las fechas", sublabel: "Histórico completo", icon: Calendar },
  { value: "hoy", label: "Hoy", sublabel: "Desde las 00:00 hrs", icon: Clock },
  { value: "semana", label: "Esta semana", sublabel: "Lunes a domingo", icon: CalendarDays },
  { value: "mes", label: "Este mes", sublabel: "Desde el 1° del mes", icon: Calendar },
  { value: "anio", label: "Este año", sublabel: "Desde el 1° de enero", icon: CalendarRange },
  { value: "personalizado", label: "Personalizado", sublabel: "Rango de fechas", icon: Pencil },
];

const DIAS_SEMANA = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const MESES_NOMBRES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function toInputDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface MiniCalendarProps {
  viewYear: number;
  viewMonth: number;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  hoveredDay: Date | null;
  onDayClick: (d: Date) => void;
  onDayHover: (d: Date | null) => void;
  onPrev?: () => void;
  onNext?: () => void;
  showNav?: boolean;
}

function MiniCalendar({
  viewYear,
  viewMonth,
  rangeStart,
  rangeEnd,
  hoveredDay,
  onDayClick,
  onDayHover,
  onPrev,
  onNext,
  showNav = false,
}: MiniCalendarProps) {
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const offset = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const effectiveEnd = rangeStart && !rangeEnd && hoveredDay ? hoveredDay : rangeEnd;

  function classify(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    const isStart = !!(rangeStart && isSameDay(d, rangeStart));
    const isEnd = !!(effectiveEnd && isSameDay(d, effectiveEnd));
    const isToday = isSameDay(d, new Date());
    let inRange = false;
    if (rangeStart && effectiveEnd) {
      const lo = startOfDay(rangeStart) <= startOfDay(effectiveEnd) ? rangeStart : effectiveEnd;
      const hi = startOfDay(rangeStart) <= startOfDay(effectiveEnd) ? effectiveEnd : rangeStart;
      inRange = startOfDay(d) > startOfDay(lo) && startOfDay(d) < startOfDay(hi);
    }
    return { isStart, isEnd, isToday, inRange };
  }

  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="select-none">
      <div className="flex items-center justify-between px-1 mb-2.5">
        {showNav && onPrev ? (
          <button
            type="button"
            onClick={onPrev}
            className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        ) : (
          <div className="w-7" />
        )}
        <span className="text-xs font-bold text-foreground tracking-wide">
          {MESES_NOMBRES[viewMonth]} {viewYear}
        </span>
        {showNav && onNext ? (
          <button
            type="button"
            onClick={onNext}
            className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <div className="w-7" />
        )}
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-0.5">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const { isStart, isEnd, isToday, inRange } = classify(day);
          const isEdge = isStart || isEnd;
          const bothSelected = !!(rangeStart && effectiveEnd && !isSameDay(rangeStart, effectiveEnd));

          return (
            <div key={idx} className="relative flex items-center justify-center h-7">
              {inRange && <div className="absolute inset-y-0.5 inset-x-0 bg-primary/12 dark:bg-primary/20" />}
              {isEnd && bothSelected && (
                <div className="absolute inset-y-0.5 left-0 right-1/2 bg-primary/12 dark:bg-primary/20" />
              )}
              {isStart && bothSelected && (
                <div className="absolute inset-y-0.5 right-0 left-1/2 bg-primary/12 dark:bg-primary/20" />
              )}
              <button
                type="button"
                onClick={() => onDayClick(new Date(viewYear, viewMonth, day))}
                onMouseEnter={() => onDayHover(new Date(viewYear, viewMonth, day))}
                onMouseLeave={() => onDayHover(null)}
                className={`relative z-10 h-6 w-6 rounded-full text-xs font-medium transition-all duration-100 flex items-center justify-center cursor-pointer
                  ${
                    isEdge
                      ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/30"
                      : isToday
                      ? "border border-primary/50 text-primary font-semibold hover:bg-primary/10"
                      : inRange
                      ? "text-foreground hover:bg-primary/20"
                      : "text-foreground hover:bg-muted"
                  }`}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function VentasFilters({
  busqueda,
  onBusquedaChange,
  producto,
  onProductoChange,
  metodoPago,
  onMetodoPagoChange,
  usuario,
  onUsuarioChange,
  periodo,
  onPeriodoChange,
  fechaDesde,
  onFechaDesdeChange,
  fechaHasta,
  onFechaHastaChange,
  usuariosDisponibles,
  onLimpiarTodo,
  hayFiltrosActivos,
}: Props) {
  const [openPago, setOpenPago] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [openFecha, setOpenFecha] = useState(false);

  // Estado del calendario interactivo
  const [showCustom, setShowCustom] = useState(periodo === "personalizado");
  const [calStart, setCalStart] = useState<Date | null>(
    fechaDesde ? new Date(fechaDesde + "T00:00:00") : null
  );
  const [calEnd, setCalEnd] = useState<Date | null>(
    fechaHasta ? new Date(fechaHasta + "T00:00:00") : null
  );
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const refPago = useRef<HTMLDivElement>(null);
  const refUser = useRef<HTMLDivElement>(null);
  const refFecha = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (refPago.current && !refPago.current.contains(e.target as Node)) {
        setOpenPago(false);
      }
      if (refUser.current && !refUser.current.contains(e.target as Node)) {
        setOpenUser(false);
      }
      if (refFecha.current && !refFecha.current.contains(e.target as Node)) {
        setOpenFecha(false);
        if (periodo !== "personalizado") {
          setShowCustom(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [periodo]);

  // Sincronizar fechas externas si cambian
  useEffect(() => {
    if (fechaDesde && fechaHasta) {
      setCalStart(new Date(fechaDesde + "T00:00:00"));
      setCalEnd(new Date(fechaHasta + "T00:00:00"));
    } else if (!fechaDesde && !fechaHasta) {
      setCalStart(null);
      setCalEnd(null);
    }
  }, [fechaDesde, fechaHasta]);

  function handleSelectPreset(p: PeriodoClaveVentas) {
    if (p === "personalizado") {
      setShowCustom(true);
      return;
    }
    onPeriodoChange(p);
    onFechaDesdeChange("");
    onFechaHastaChange("");
    setCalStart(null);
    setCalEnd(null);
    setShowCustom(false);
    setOpenFecha(false);
  }

  function handleDayClick(day: Date) {
    if (!calStart || (calStart && calEnd)) {
      setCalStart(day);
      setCalEnd(null);
    } else {
      if (startOfDay(day) < startOfDay(calStart)) {
        setCalEnd(calStart);
        setCalStart(day);
      } else {
        setCalEnd(day);
      }
    }
  }

  function handleAplicarRango() {
    if (!calStart || !calEnd) return;
    onPeriodoChange("personalizado");
    onFechaDesdeChange(toInputDate(calStart));
    onFechaHastaChange(toInputDate(calEnd));
    setOpenFecha(false);
  }

  function handleLimpiarRango() {
    setCalStart(null);
    setCalEnd(null);
    onFechaDesdeChange("");
    onFechaHastaChange("");
  }

  const metodoLabel = METODOS_PAGO.find((m) => m.value === metodoPago)?.label || "Pago";
  const userLabel = usuario !== "TODOS" ? usuario : "Atendido por: Todos";

  const buildPeriodoLabel = () => {
    if (periodo === "todas") return "Fecha: Todas";
    if (periodo === "personalizado") {
      if (fechaDesde && fechaHasta) {
        const d = new Date(fechaDesde + "T00:00:00");
        const h = new Date(fechaHasta + "T00:00:00");
        const fmt = (date: Date) =>
          `${date.getDate()} ${MESES_NOMBRES[date.getMonth()].slice(0, 3)}`;
        return `${fmt(d)} – ${fmt(h)}`;
      }
      return "Rango personalizado";
    }
    return PERIODOS.find((p) => p.value === periodo)?.label || "Fechas";
  };

  const periodoLabel = buildPeriodoLabel();

  return (
    <div className="flex flex-col lg:flex-row items-center gap-2.5 w-full bg-card p-2.5 rounded-2xl border border-border shadow-xs">
      {/* ── 1. Buscador Comprobante / Cajero ───────────────────────────────── */}
      <div className="relative flex-1 w-full min-w-[180px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          placeholder="Buscar factura o atendido..."
          className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-muted/40 border border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-150"
        />
      </div>

      {/* ── 2. Filtro Producto ────────────────────────────────────────────── */}
      <div className="relative flex-1 w-full min-w-[180px]">
        <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={producto}
          onChange={(e) => onProductoChange(e.target.value)}
          placeholder="Filtrar por producto..."
          className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-muted/40 border border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-150"
        />
      </div>

      {/* ── Botones y Menús Compactos ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 flex-wrap sm:flex-nowrap justify-end">
        {/* Dropdown Método de Pago */}
        <div ref={refPago} className="relative flex-1 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setOpenPago((v) => !v);
              setOpenUser(false);
              setOpenFecha(false);
            }}
            className={`
              w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-xs font-semibold
              transition-all duration-150 select-none cursor-pointer
              ${
                openPago || metodoPago !== "TODOS"
                  ? "bg-primary/10 text-primary border-primary/30 shadow-xs"
                  : "bg-background text-foreground border-border hover:bg-accent hover:border-border/80 shadow-xs"
              }
            `}
          >
            <div className="flex items-center gap-1.5 truncate">
              <CreditCard className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate max-w-[110px]">{metodoLabel}</span>
            </div>
            <ChevronDown
              className={`h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-150 ${
                openPago ? "rotate-180 text-primary" : ""
              }`}
            />
          </button>

          {openPago && (
            <div className="absolute right-0 top-full mt-1.5 w-48 z-50 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 pt-2.5 pb-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Método de pago
                </p>
              </div>
              <div className="p-1 space-y-0.5">
                {METODOS_PAGO.map((m) => {
                  const isSelected = m.value === metodoPago;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => {
                        onMetodoPagoChange(m.value);
                        setOpenPago(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-xl text-left
                        transition-colors duration-150 cursor-pointer
                        ${
                          isSelected
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "hover:bg-accent text-foreground"
                        }
                      `}
                    >
                      <span>{m.label}</span>
                      {isSelected && <Check className="h-3 w-3 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Dropdown Atendido por */}
        <div ref={refUser} className="relative flex-1 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setOpenUser((v) => !v);
              setOpenPago(false);
              setOpenFecha(false);
            }}
            className={`
              w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-xs font-semibold
              transition-all duration-150 select-none cursor-pointer
              ${
                openUser || usuario !== "TODOS"
                  ? "bg-primary/10 text-primary border-primary/30 shadow-xs"
                  : "bg-background text-foreground border-border hover:bg-accent hover:border-border/80 shadow-xs"
              }
            `}
          >
            <div className="flex items-center gap-1.5 truncate">
              <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate max-w-[120px]">{userLabel}</span>
            </div>
            <ChevronDown
              className={`h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-150 ${
                openUser ? "rotate-180 text-primary" : ""
              }`}
            />
          </button>

          {openUser && (
            <div className="absolute right-0 top-full mt-1.5 w-52 z-50 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 max-h-60 overflow-y-auto">
              <div className="px-3 pt-2.5 pb-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Atendido por
                </p>
              </div>
              <div className="p-1 space-y-0.5">
                {["TODOS", ...usuariosDisponibles].map((u) => {
                  const isSelected = u === usuario;
                  return (
                    <button
                      key={u}
                      type="button"
                      onClick={() => {
                        onUsuarioChange(u);
                        setOpenUser(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-xl text-left
                        transition-colors duration-150 cursor-pointer truncate
                        ${
                          isSelected
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "hover:bg-accent text-foreground"
                        }
                      `}
                    >
                      <span className="truncate">{u === "TODOS" ? "Todos los operadores" : u}</span>
                      {isSelected && <Check className="h-3 w-3 shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Dropdown Fechas (Con MiniCalendar interactivo estandarizado) */}
        <div ref={refFecha} className="relative flex-1 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setOpenFecha((v) => !v);
              setOpenPago(false);
              setOpenUser(false);
            }}
            className={`
              w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold
              transition-all duration-150 select-none whitespace-nowrap cursor-pointer
              ${
                openFecha || periodo !== "todas"
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                  : "bg-background text-foreground border-border hover:bg-accent hover:border-border/80 shadow-xs"
              }
            `}
          >
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>{periodoLabel}</span>
            </div>
            <ChevronDown
              className={`h-3 w-3 shrink-0 transition-transform duration-150 ${
                openFecha ? "rotate-180" : ""
              }`}
            />
          </button>

          {openFecha && (
            <div
              className="absolute right-0 top-full mt-2 z-50 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
              style={{ width: showCustom ? "320px" : "230px" }}
            >
              {/* Encabezado selector de modo */}
              <div className="p-2 border-b border-border/60">
                <div className="flex items-center justify-between px-1.5 pb-1">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {showCustom ? "Calendario Personalizado" : "Período de Ventas"}
                  </p>
                  {showCustom && (
                    <button
                      type="button"
                      onClick={() => setShowCustom(false)}
                      className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Ver períodos
                    </button>
                  )}
                </div>

                {!showCustom ? (
                  <div className="space-y-0.5 pt-1">
                    {PERIODOS.map((op) => {
                      const Icon = op.icon;
                      const isActive = op.value === periodo;
                      return (
                        <button
                          key={op.value}
                          type="button"
                          onClick={() => handleSelectPreset(op.value)}
                          className={`
                            w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left
                            transition-all duration-150 cursor-pointer group
                            ${
                              isActive
                                ? "bg-primary text-primary-foreground font-semibold"
                                : "hover:bg-accent text-foreground"
                            }
                          `}
                        >
                          <div
                            className={`
                              h-6 w-6 rounded-lg flex items-center justify-center shrink-0
                              ${
                                isActive
                                  ? "bg-primary-foreground/20 text-primary-foreground"
                                  : "bg-muted text-muted-foreground group-hover:bg-background"
                              }
                            `}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold leading-tight">{op.label}</p>
                            <p
                              className={`text-[10px] leading-tight mt-0.5 ${
                                isActive ? "text-primary-foreground/75" : "text-muted-foreground"
                              }`}
                            >
                              {op.sublabel}
                            </p>
                          </div>
                          {isActive && <Check className="h-3.5 w-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* ── Calendario Visual Interactivo ───────────────────────── */
                  <div className="p-2 space-y-3">
                    {/* Status bar de fechas inicio y fin */}
                    <div className="flex items-center gap-2 px-1">
                      <div
                        className={`flex-1 rounded-xl border px-2.5 py-1.5 text-center text-xs transition-all ${
                          calStart
                            ? "border-primary/40 bg-primary/5 text-primary font-bold"
                            : "border-dashed border-border text-muted-foreground text-[11px]"
                        }`}
                      >
                        {calStart
                          ? `${calStart.getDate()} ${MESES_NOMBRES[calStart.getMonth()].slice(0, 3)}`
                          : "Fecha inicio"}
                      </div>
                      <span className="text-muted-foreground text-xs font-bold">→</span>
                      <div
                        className={`flex-1 rounded-xl border px-2.5 py-1.5 text-center text-xs transition-all ${
                          calEnd
                            ? "border-primary/40 bg-primary/5 text-primary font-bold"
                            : "border-dashed border-border text-muted-foreground text-[11px]"
                        }`}
                      >
                        {calEnd
                          ? `${calEnd.getDate()} ${MESES_NOMBRES[calEnd.getMonth()].slice(0, 3)}`
                          : "Fecha fin"}
                      </div>
                    </div>

                    {/* Mini Calendar del mes */}
                    <div className="bg-muted/30 rounded-xl p-2 border border-border/40">
                      <MiniCalendar
                        viewYear={calYear}
                        viewMonth={calMonth}
                        rangeStart={calStart}
                        rangeEnd={calEnd}
                        hoveredDay={hoveredDay}
                        onDayClick={handleDayClick}
                        onDayHover={setHoveredDay}
                        showNav
                        onPrev={() => {
                          if (calMonth === 0) {
                            setCalMonth(11);
                            setCalYear((y) => y - 1);
                          } else {
                            setCalMonth((m) => m - 1);
                          }
                        }}
                        onNext={() => {
                          if (calMonth === 11) {
                            setCalMonth(0);
                            setCalYear((y) => y + 1);
                          } else {
                            setCalMonth((m) => m + 1);
                          }
                        }}
                      />
                    </div>

                    {/* Acciones de pie de calendario */}
                    <div className="flex items-center justify-between pt-1 border-t border-border/50">
                      <button
                        type="button"
                        onClick={handleLimpiarRango}
                        className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-2 py-1"
                      >
                        Limpiar
                      </button>
                      <button
                        type="button"
                        onClick={handleAplicarRango}
                        disabled={!calStart || !calEnd}
                        className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
                      >
                        Aplicar rango
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Botón Limpiar Filtros */}
        {hayFiltrosActivos && (
          <button
            type="button"
            onClick={onLimpiarTodo}
            title="Limpiar todos los filtros"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all duration-150 cursor-pointer shadow-xs shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        )}
      </div>
    </div>
  );
}
