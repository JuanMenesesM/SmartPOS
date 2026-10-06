import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, Clock, CalendarDays, Calendar, CalendarRange, SlidersHorizontal } from "lucide-react";

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
}

const USUARIOS = [{ value: "TODOS", label: "Todos los usuarios" }];

const MODULOS = [
  { value: "TODOS",         label: "Todos los módulos" },
  { value: "Productos",     label: "Productos"          },
  { value: "Ventas",        label: "Ventas"             },
  { value: "Compras",       label: "Compras"            },
  { value: "Usuarios",      label: "Usuarios"           },
  { value: "Empresa",       label: "Empresa"            },
  { value: "Dashboard",     label: "Dashboard"          },
  { value: "Configuracion", label: "Configuración"      },
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

const PERIODOS = [
  { value: "hoy" as PeriodoClave,    label: "Hoy",         sublabel: "Desde las 00:00 hrs",  icon: Clock         },
  { value: "semana" as PeriodoClave, label: "Esta semana", sublabel: "Lunes a domingo",       icon: CalendarDays  },
  { value: "mes" as PeriodoClave,    label: "Este mes",    sublabel: "Desde el 1° del mes",   icon: Calendar      },
  { value: "anio" as PeriodoClave,   label: "Este año",    sublabel: "Desde el 1° de enero",  icon: CalendarRange },
];

export default function AuditoriaFilters({
  busqueda, onBusquedaChange,
  usuario, onUsuarioChange,
  modulo, onModuloChange,
  accion, onAccionChange,
  fecha, onFechaChange,
}: Props) {
  const [openUser,   setOpenUser]   = useState(false);
  const [openMod,    setOpenMod]    = useState(false);
  const [openAccion, setOpenAccion] = useState(false);
  const [openFecha,  setOpenFecha]  = useState(false);

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

  const userLabel   = USUARIOS.find((u) => u.value === usuario)?.label ?? "Usuario";
  const moduloLabel = MODULOS.find((m) => m.value === modulo)?.label ?? "Módulo";
  const accionLabel = ACCIONES.find((a) => a.value === accion)?.label ?? "Acción";
  const fechaLabel  = fecha !== "TODOS" ? PERIODOS.find((p) => p.value === fecha)?.label ?? "Fecha" : "Fecha: Todas";

  const hayFiltros = !!(busqueda || usuario !== "TODOS" || modulo !== "TODOS" || accion !== "TODOS" || fecha !== "TODOS");

  function limpiarTodo() {
    onBusquedaChange(""); onUsuarioChange("TODOS"); onModuloChange("TODOS");
    onAccionChange("TODOS"); onFechaChange("TODOS");
  }

  // Botón dropdown genérico reutilizable
  function DropdownBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`
          w-full flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-semibold
          transition-all duration-200 select-none
          ${active
            ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
            : "bg-background text-foreground border-border hover:bg-accent hover:border-border/80 shadow-sm"
          }
        `}
      >
        <span className="truncate max-w-[120px]">{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${active ? "rotate-180 text-primary" : ""}`} />
      </button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full bg-card p-2.5 rounded-2xl border border-border shadow-sm">
      {/* ── Buscador ────────────────────────────────────────────────────────── */}
      <div className="relative flex-[1.8] w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          placeholder="Buscar usuario, acción o módulo..."
          className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-muted/40 border border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
        />
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 flex-1 sm:flex-none justify-end">

        {/* ── Usuario ──────────────────────────────────────────────────────── */}
        <div ref={refUser} className="relative flex-1 sm:flex-none">
          <DropdownBtn label={userLabel} active={openUser || usuario !== "TODOS"} onClick={() => { closeAll(); setOpenUser((p) => !p); }} />
          {openUser && (
            <div className="absolute right-0 top-full mt-2 w-52 z-50 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 pt-3 pb-1.5"><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Usuario</p></div>
              <div className="p-1.5 space-y-0.5">
                {USUARIOS.map((u) => (
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

        {/* ── Módulo ───────────────────────────────────────────────────────── */}
        <div ref={refMod} className="relative flex-1 sm:flex-none">
          <DropdownBtn label={moduloLabel} active={openMod || modulo !== "TODOS"} onClick={() => { closeAll(); setOpenMod((p) => !p); }} />
          {openMod && (
            <div className="absolute right-0 top-full mt-2 w-52 z-50 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 pt-3 pb-1.5"><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Módulo</p></div>
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

        {/* ── Acción ───────────────────────────────────────────────────────── */}
        <div ref={refAccion} className="relative flex-1 sm:flex-none">
          <DropdownBtn label={accionLabel} active={openAccion || accion !== "TODOS"} onClick={() => { closeAll(); setOpenAccion((p) => !p); }} />
          {openAccion && (
            <div className="absolute right-0 top-full mt-2 w-48 z-50 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 pt-3 pb-1.5"><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Acción</p></div>
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

        {/* ── Fecha ────────────────────────────────────────────────────────── */}
        <div ref={refFecha} className="relative flex-1 sm:flex-none">
          <button
            type="button"
            onClick={() => { closeAll(); setOpenFecha((p) => !p); }}
            className={`
              w-full flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold
              transition-all duration-200 select-none whitespace-nowrap
              ${openFecha || fecha !== "TODOS"
                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                : "bg-background text-foreground border-border hover:bg-accent hover:border-primary/30 shadow-sm"
              }
            `}
          >
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{fechaLabel}</span>
            <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${openFecha ? "rotate-180" : ""}`} />
          </button>
          {openFecha && (
            <div className="absolute right-0 top-full mt-2 w-56 z-50 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 pt-3 pb-1.5"><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Período</p></div>
              <div className="p-1.5 space-y-0.5">
                <button type="button" onClick={() => { onFechaChange("TODOS"); setOpenFecha(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${fecha === "TODOS" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"}`}>
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${fecha === "TODOS" ? "bg-primary-foreground/20" : "bg-muted group-hover:bg-background"}`}>
                    <SlidersHorizontal className={`h-3.5 w-3.5 ${fecha === "TODOS" ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${fecha === "TODOS" ? "text-primary-foreground" : ""}`}>Todas las fechas</p>
                    <p className={`text-[10px] mt-0.5 ${fecha === "TODOS" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>Sin filtro de período</p>
                  </div>
                  {fecha === "TODOS" && <div className="h-2 w-2 rounded-full bg-primary-foreground/80 shrink-0" />}
                </button>
                {PERIODOS.map((op) => {
                  const Icon = op.icon;
                  const isActive = op.value === fecha;
                  return (
                    <button key={op.value} type="button" onClick={() => { onFechaChange(op.value); setOpenFecha(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"}`}>
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-primary-foreground/20" : "bg-muted group-hover:bg-background"}`}>
                        <Icon className={`h-3.5 w-3.5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold ${isActive ? "text-primary-foreground" : ""}`}>{op.label}</p>
                        <p className={`text-[10px] mt-0.5 ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{op.sublabel}</p>
                      </div>
                      {isActive && <div className="h-2 w-2 rounded-full bg-primary-foreground/80 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Limpiar ──────────────────────────────────────────────────────── */}
        {hayFiltros && (
          <button type="button" onClick={limpiarTodo}
            className="px-3 py-2 text-[11px] font-semibold rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors shrink-0">
            ✕ Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
