import { useState, useRef, useEffect } from "react";
import {
  Search, ChevronDown, Check, Clock, CalendarDays, Calendar,
  CalendarRange, SlidersHorizontal, ChevronLeft, ChevronRight, Pencil,
} from "lucide-react";

interface Props {
  busqueda: string;
  onBusquedaChange: (v: string) => void;
  usuario: string;
  onUsuarioChange: (v: string) => void;
  modulo: string;
  onModuloChange: (v: string) => void;
  accion: string;
  onAccionChange: (v: string) => void;
  fecha: string;
  onFechaChange: (v: string) => void;
  fechaRangoStart: Date | null;
  fechaRangoEnd: Date | null;
  onFechaRangoChange: (start: Date | null, end: Date | null) => void;
  usuariosDisponibles: { value: string; label: string }[];
}

const MODULOS = [
  { value: "TODOS",         label: "Todos los modulos"  },
  { value: "Productos",     label: "Productos"           },
  { value: "Ventas",        label: "Ventas"              },
  { value: "Compras",       label: "Compras"             },
  { value: "Usuarios",      label: "Usuarios"            },
  { value: "Empresa",       label: "Empresa"             },
  { value: "Dashboard",     label: "Dashboard"           },
  { value: "Configuracion", label: "Configuracion"       },
];

const ACCIONES = [
  { value: "TODOS",    label: "Todas las acciones" },
  { value: "CREAR",    label: "Crear"              },
  { value: "EDITAR",   label: "Editar"             },
  { value: "ELIMINAR", label: "Eliminar"           },
  { value: "LOGIN",    label: "Login"              },
  { value: "LOGOUT",   label: "Logout"             },
  { value: "EXPORTAR", label: "Exportar"           },
];

type PeriodoClave = "hoy" | "semana" | "mes" | "anio";

const PERIODOS: { value: PeriodoClave; label: string; sublabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "hoy",    label: "Hoy",         sublabel: "Desde las 00:00 hrs",  icon: Clock         },
  { value: "semana", label: "Esta semana", sublabel: "Lunes a domingo",       icon: CalendarDays  },
  { value: "mes",    label: "Este mes",    sublabel: "Desde el 1 del mes",    icon: Calendar      },
  { value: "anio",   label: "Este año",    sublabel: "Desde el 1° de enero",   icon: CalendarRange },
];

const DIAS_SEMANA = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const MESES_NOMBRES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
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

function MiniCalendar({ viewYear, viewMonth, rangeStart, rangeEnd, hoveredDay, onDayClick, onDayHover, onPrev, onNext, showNav = false }: MiniCalendarProps) {
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const offset   = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const effectiveEnd = rangeStart && !rangeEnd && hoveredDay ? hoveredDay : rangeEnd;

  function classify(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    const isStart = !!(rangeStart && isSameDay(d, rangeStart));
    const isEnd   = !!(effectiveEnd && isSameDay(d, effectiveEnd));
    const isToday = isSameDay(d, new Date());
    let inRange = false;
    if (rangeStart && effectiveEnd) {
      const lo = startOfDay(rangeStart) <= startOfDay(effectiveEnd) ? rangeStart : effectiveEnd;
      const hi = startOfDay(rangeStart) <= startOfDay(effectiveEnd) ? effectiveEnd : rangeStart;
      inRange = startOfDay(d) > startOfDay(lo) && startOfDay(d) < startOfDay(hi);
    }
    return { isStart, isEnd, isToday, inRange };
  }

  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="select-none">
      <div className="flex items-center justify-between px-1 mb-3">
        {showNav && onPrev ? (
          <button type="button" onClick={onPrev} className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
          </button>
        ) : <div className="w-7" />}
        <span className="text-xs font-bold text-foreground tracking-wide">{MESES_NOMBRES[viewMonth]} {viewYear}</span>
        {showNav && onNext ? (
          <button type="button" onClick={onNext} className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : <div className="w-7" />}
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DIAS_SEMANA.map((d) => <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-0.5">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const { isStart, isEnd, isToday, inRange } = classify(day);
          const isEdge = isStart || isEnd;
          const bothSelected = !!(rangeStart && effectiveEnd && !isSameDay(rangeStart, effectiveEnd));
          return (
            <div key={idx} className="relative flex items-center justify-center h-8">
              {inRange && <div className="absolute inset-y-0.5 inset-x-0 bg-primary/12 dark:bg-primary/20" />}
              {isEnd && bothSelected && <div className="absolute inset-y-0.5 left-0 right-1/2 bg-primary/12 dark:bg-primary/20" />}
              {isStart && bothSelected && <div className="absolute inset-y-0.5 right-0 left-1/2 bg-primary/12 dark:bg-primary/20" />}
              <button
                type="button"
                onClick={() => onDayClick(new Date(viewYear, viewMonth, day))}
                onMouseEnter={() => onDayHover(new Date(viewYear, viewMonth, day))}
                onMouseLeave={() => onDayHover(null)}
                className={`relative z-10 h-7 w-7 rounded-full text-xs font-medium transition-all duration-100
                  ${isEdge ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/30"
                    : isToday ? "border border-primary/50 text-primary font-semibold hover:bg-primary/10"
                    : inRange ? "text-foreground hover:bg-primary/20"
                    : "text-foreground hover:bg-muted"}`}
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

export default function AuditoriaFilters({
  busqueda, onBusquedaChange,
  usuario, onUsuarioChange,
  modulo, onModuloChange,
  accion, onAccionChange,
  fecha, onFechaChange,
  fechaRangoStart, fechaRangoEnd, onFechaRangoChange,
  usuariosDisponibles,
}: Props) {
  const [openUser,   setOpenUser]   = useState(false);
  const [openMod,    setOpenMod]    = useState(false);
  const [openAccion, setOpenAccion] = useState(false);
  const [openFecha,  setOpenFecha]  = useState(false);
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  const today = new Date();
  const [calYear,  setCalYear]  = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const secondMonth = calMonth === 11 ? 0 : calMonth + 1;
  const secondYear  = calMonth === 11 ? calYear + 1 : calYear;

  const refUser   = useRef<HTMLDivElement>(null);
  const refMod    = useRef<HTMLDivElement>(null);
  const refAccion = useRef<HTMLDivElement>(null);
  const refFecha  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (refUser.current   && !refUser.current.contains(e.target as Node))   setOpenUser(false);
      if (refMod.current    && !refMod.current.contains(e.target as Node))    setOpenMod(false);
      if (refAccion.current && !refAccion.current.contains(e.target as Node)) setOpenAccion(false);
      if (refFecha.current  && !refFecha.current.contains(e.target as Node))  setOpenFecha(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const closeAll = () => { setOpenUser(false); setOpenMod(false); setOpenAccion(false); setOpenFecha(false); };

  function handleDayClick(day: Date) {
    if (!fechaRangoStart || (fechaRangoStart && fechaRangoEnd)) {
      onFechaRangoChange(day, null);
    } else {
      if (startOfDay(day) < startOfDay(fechaRangoStart)) {
        onFechaRangoChange(day, fechaRangoStart);
      } else {
        onFechaRangoChange(fechaRangoStart, day);
      }
    }
  }

  const userLabel   = usuario === "TODOS" ? "Todos los usuarios" : (usuariosDisponibles.find((u) => u.value === usuario)?.label ?? "Usuario");
  const moduloLabel = MODULOS.find((m) => m.value === modulo)?.label ?? "Modulo";
  const accionLabel = ACCIONES.find((a) => a.value === accion)?.label ?? "Accion";

  function buildFechaLabel() {
    if (fecha === "TODOS") return "Fecha: Todas";
    if (fecha === "personalizado") {
      if (fechaRangoStart && fechaRangoEnd) {
        const fmt = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        return `${fmt(fechaRangoStart)} - ${fmt(fechaRangoEnd)}`;
      }
      return "Rango personalizado";
    }
    return PERIODOS.find((p) => p.value === fecha)?.label ?? "Fecha";
  }

  const fechaLabel  = buildFechaLabel();
  const hayFiltros  = !!(busqueda || usuario !== "TODOS" || modulo !== "TODOS" || accion !== "TODOS" || fecha !== "TODOS");

  function limpiarTodo() {
    onBusquedaChange(""); onUsuarioChange("TODOS"); onModuloChange("TODOS");
    onAccionChange("TODOS"); onFechaChange("TODOS"); onFechaRangoChange(null, null);
  }

  function DropdownBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
      <button type="button" onClick={onClick}
        className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 select-none
          ${active ? "bg-primary/10 text-primary border-primary/30 shadow-sm" : "bg-background text-foreground border-border hover:bg-accent hover:border-border/80 shadow-sm"}`}>
        <span className="truncate max-w-[120px]">{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${active ? "rotate-180 text-primary" : ""}`} />
      </button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full bg-card p-2.5 rounded-2xl border border-border shadow-sm">
      <div className="relative flex-[1.8] w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" value={busqueda} onChange={(e) => onBusquedaChange(e.target.value)}
          placeholder="Buscar usuario, accion o modulo..."
          className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-muted/40 border border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200" />
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 flex-1 sm:flex-none justify-end">

        {/* Usuario */}
        <div ref={refUser} className="relative flex-1 sm:flex-none">
          <DropdownBtn label={userLabel} active={openUser || usuario !== "TODOS"} onClick={() => { closeAll(); setOpenUser((p) => !p); }} />
          {openUser && (
            <div className="absolute right-0 top-full mt-2 w-52 z-50 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 pt-3 pb-1.5"><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Usuario</p></div>
              <div className="p-1.5 space-y-0.5 max-h-52 overflow-y-auto">
                <button type="button" onClick={() => { onUsuarioChange("TODOS"); setOpenUser(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-left transition-colors ${"TODOS" === usuario ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-accent text-foreground"}`}>
                  <span>Todos los usuarios</span>
                  {"TODOS" === usuario && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
                {usuariosDisponibles.map((u) => (
                  <button key={u.value} type="button" onClick={() => { onUsuarioChange(u.value); setOpenUser(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-left transition-colors ${u.value === usuario ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-accent text-foreground"}`}>
                    <span>{u.label}</span>
                    {u.value === usuario && <Check className="h-3.5 w-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modulo */}
        <div ref={refMod} className="relative flex-1 sm:flex-none">
          <DropdownBtn label={moduloLabel} active={openMod || modulo !== "TODOS"} onClick={() => { closeAll(); setOpenMod((p) => !p); }} />
          {openMod && (
            <div className="absolute right-0 top-full mt-2 w-52 z-50 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 pt-3 pb-1.5"><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Modulo</p></div>
              <div className="p-1.5 space-y-0.5">
                {MODULOS.map((m) => (
                  <button key={m.value} type="button" onClick={() => { onModuloChange(m.value); setOpenMod(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-left transition-colors ${m.value === modulo ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-accent text-foreground"}`}>
                    <span>{m.label}</span>
                    {m.value === modulo && <Check className="h-3.5 w-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Accion */}
        <div ref={refAccion} className="relative flex-1 sm:flex-none">
          <DropdownBtn label={accionLabel} active={openAccion || accion !== "TODOS"} onClick={() => { closeAll(); setOpenAccion((p) => !p); }} />
          {openAccion && (
            <div className="absolute right-0 top-full mt-2 w-48 z-50 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 pt-3 pb-1.5"><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Accion</p></div>
              <div className="p-1.5 space-y-0.5">
                {ACCIONES.map((a) => (
                  <button key={a.value} type="button" onClick={() => { onAccionChange(a.value); setOpenAccion(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-left transition-colors ${a.value === accion ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-accent text-foreground"}`}>
                    <span>{a.label}</span>
                    {a.value === accion && <Check className="h-3.5 w-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fecha */}
        <div ref={refFecha} className="relative flex-1 sm:flex-none">
          <button type="button" onClick={() => { closeAll(); setOpenFecha((p) => !p); }}
            className={`w-full flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 select-none whitespace-nowrap
              ${openFecha || fecha !== "TODOS" ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20" : "bg-background text-foreground border-border hover:bg-accent hover:border-primary/30 shadow-sm"}`}>
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate max-w-[140px]">{fechaLabel}</span>
            <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${openFecha ? "rotate-180" : ""}`} />
          </button>

          {openFecha && (
            <div className="absolute right-0 top-full mt-2 z-50 bg-card border border-border rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden"
              style={{ minWidth: fecha === "personalizado" ? "560px" : "230px" }}>

              {/* Period shortcuts */}
              <div className="p-2 border-b border-border/60">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1 pb-1.5">Periodo</p>
                <div className={`grid gap-1 ${fecha === "personalizado" ? "grid-cols-3" : "grid-cols-1"}`}>

                  <button type="button" onClick={() => { onFechaChange("TODOS"); onFechaRangoChange(null, null); setOpenFecha(false); }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all group ${fecha === "TODOS" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"}`}>
                    <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${fecha === "TODOS" ? "bg-primary-foreground/20" : "bg-muted group-hover:bg-background"}`}>
                      <SlidersHorizontal className={`h-3 w-3 ${fecha === "TODOS" ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className={`text-xs font-semibold leading-none ${fecha === "TODOS" ? "text-primary-foreground" : ""}`}>Todas</p>
                      <p className={`text-[10px] mt-0.5 ${fecha === "TODOS" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>Sin filtro</p>
                    </div>
                  </button>

                  {PERIODOS.map((op) => {
                    const Icon = op.icon;
                    const isActive = op.value === fecha;
                    return (
                      <button key={op.value} type="button" onClick={() => { onFechaChange(op.value); onFechaRangoChange(null, null); setOpenFecha(false); }}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all group ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"}`}>
                        <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-primary-foreground/20" : "bg-muted group-hover:bg-background"}`}>
                          <Icon className={`h-3 w-3 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <p className={`text-xs font-semibold leading-none ${isActive ? "text-primary-foreground" : ""}`}>{op.label}</p>
                          <p className={`text-[10px] mt-0.5 ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{op.sublabel}</p>
                        </div>
                      </button>
                    );
                  })}

                  <button type="button" onClick={() => { onFechaChange("personalizado"); onFechaRangoChange(null, null); }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all group ${"personalizado" === fecha ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"}`}>
                    <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${"personalizado" === fecha ? "bg-primary-foreground/20" : "bg-muted group-hover:bg-background"}`}>
                      <Pencil className={`h-3 w-3 ${"personalizado" === fecha ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className={`text-xs font-semibold leading-none ${"personalizado" === fecha ? "text-primary-foreground" : ""}`}>Personalizado</p>
                      <p className={`text-[10px] mt-0.5 ${"personalizado" === fecha ? "text-primary-foreground/70" : "text-muted-foreground"}`}>Rango de fechas</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dual Calendar */}
              {fecha === "personalizado" && (
                <div className="p-4">
                  {/* Status bar */}
                  <div className="flex items-center gap-3 mb-4 px-1">
                    <div className={`flex-1 rounded-xl border px-3 py-1.5 text-center text-xs transition-all
                      ${fechaRangoStart ? "border-primary/40 bg-primary/5 text-primary font-semibold" : "border-dashed border-border text-muted-foreground"}`}>
                      {fechaRangoStart
                        ? `${fechaRangoStart.getDate()} ${MESES_NOMBRES[fechaRangoStart.getMonth()].slice(0,3)} ${fechaRangoStart.getFullYear()}`
                        : "Fecha inicio"}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className={`flex-1 rounded-xl border px-3 py-1.5 text-center text-xs transition-all
                      ${fechaRangoEnd ? "border-primary/40 bg-primary/5 text-primary font-semibold" : "border-dashed border-border text-muted-foreground"}`}>
                      {fechaRangoEnd
                        ? `${fechaRangoEnd.getDate()} ${MESES_NOMBRES[fechaRangoEnd.getMonth()].slice(0,3)} ${fechaRangoEnd.getFullYear()}`
                        : "Fecha fin"}
                    </div>
                  </div>

                  {/* Two months */}
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <MiniCalendar
                        viewYear={calYear} viewMonth={calMonth}
                        rangeStart={fechaRangoStart} rangeEnd={fechaRangoEnd}
                        hoveredDay={hoveredDay}
                        onDayClick={handleDayClick}
                        onDayHover={setHoveredDay}
                        showNav
                        onPrev={() => {
                          if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
                          else setCalMonth((m) => m - 1);
                        }}
                      />
                    </div>
                    <div className="w-px bg-border/60 self-stretch" />
                    <div className="flex-1">
                      <MiniCalendar
                        viewYear={secondYear} viewMonth={secondMonth}
                        rangeStart={fechaRangoStart} rangeEnd={fechaRangoEnd}
                        hoveredDay={hoveredDay}
                        onDayClick={handleDayClick}
                        onDayHover={setHoveredDay}
                        showNav
                        onNext={() => {
                          if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
                          else setCalMonth((m) => m + 1);
                        }}
                      />
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
                    <button type="button" onClick={() => onFechaRangoChange(null, null)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
                      Limpiar rango
                    </button>
                    <button type="button"
                      onClick={() => { if (fechaRangoStart && fechaRangoEnd) setOpenFecha(false); }}
                      disabled={!fechaRangoStart || !fechaRangoEnd}
                      className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-sm">
                      Aplicar rango
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Limpiar */}
        {hayFiltros && (
          <button type="button" onClick={limpiarTodo}
            className="px-3 py-2 text-[11px] font-semibold rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors shrink-0">
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
