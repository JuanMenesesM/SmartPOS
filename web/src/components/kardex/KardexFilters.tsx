import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, Clock, CalendarDays, Calendar, CalendarRange, SlidersHorizontal } from "lucide-react";
import { useProveedores } from "@/hooks/useCompras";

interface Props {
  busqueda: string;
  onBusquedaChange: (v: string) => void;
  tipo: string;
  onTipoChange: (v: string) => void;
  proveedorId: string;
  onProveedorChange: (v: string) => void;
  fecha: string;
  onFechaChange: (v: string) => void;
  usuario: string;
  onUsuarioChange: (v: string) => void;
}

const TIPOS = [
  { value: "TODOS", label: "Todos los tipos" },
  { value: "COMPRA", label: "Compra" },
  { value: "VENTA", label: "Venta" },
  { value: "AJUSTE", label: "Ajuste manual" },
  { value: "MERMA", label: "Merma" },
  { value: "DEVOLUCION", label: "Devolución" },
  { value: "ELIMINACION", label: "Eliminación" },
];

type PeriodoClave = "hoy" | "semana" | "mes" | "anio";

const PERIODOS = [
  { value: "hoy" as PeriodoClave,    label: "Hoy",         sublabel: "Desde las 00:00 hrs",  icon: Clock          },
  { value: "semana" as PeriodoClave, label: "Esta semana", sublabel: "Lunes a domingo",       icon: CalendarDays   },
  { value: "mes" as PeriodoClave,    label: "Este mes",    sublabel: "Desde el 1° del mes",   icon: Calendar       },
  { value: "anio" as PeriodoClave,   label: "Este año",    sublabel: "Desde el 1° de enero",  icon: CalendarRange  },
];

const USUARIOS = [
  { value: "TODOS", label: "Todos los usuarios" },
  { value: "ADMIN", label: "Administrador" },
];

export default function KardexFilters({
  busqueda,
  onBusquedaChange,
  tipo,
  onTipoChange,
  proveedorId,
  onProveedorChange,
  fecha,
  onFechaChange,
  usuario,
  onUsuarioChange,
}: Props) {
  const [openTipo,  setOpenTipo]  = useState(false);
  const [openProv,  setOpenProv]  = useState(false);
  const [openFecha, setOpenFecha] = useState(false);
  const [openUser,  setOpenUser]  = useState(false);

  const refTipo  = useRef<HTMLDivElement>(null);
  const refProv  = useRef<HTMLDivElement>(null);
  const refFecha = useRef<HTMLDivElement>(null);
  const refUser  = useRef<HTMLDivElement>(null);

  const { data: proveedores = [] } = useProveedores();

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (refTipo.current  && !refTipo.current.contains(e.target as Node))  setOpenTipo(false);
      if (refProv.current  && !refProv.current.contains(e.target as Node))  setOpenProv(false);
      if (refFecha.current && !refFecha.current.contains(e.target as Node)) setOpenFecha(false);
      if (refUser.current  && !refUser.current.contains(e.target as Node))  setOpenUser(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const tipoLabel       = TIPOS.find((t) => t.value === tipo)?.label ?? "Tipo";
  const proveedorActivo = proveedores.find((p) => String(p.id) === proveedorId);
  const userLabel       = USUARIOS.find((u) => u.value === usuario)?.label ?? "Usuario";
  const periodoLabel    = fecha !== "TODOS" ? PERIODOS.find((p) => p.value === fecha)?.label ?? "Fecha" : "Fecha: Todas";

  const hayFiltros = !!(tipo !== "TODOS" || proveedorId || fecha !== "TODOS" || usuario !== "TODOS" || busqueda);

  function limpiarTodo() {
    onBusquedaChange("");
    onTipoChange("TODOS");
    onProveedorChange("");
    onFechaChange("TODOS");
    onUsuarioChange("TODOS");
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
          placeholder="Buscar producto, tipo o usuario..."
          className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-muted/40 border border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
        />
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 flex-1 sm:flex-none justify-end">

        {/* ── Dropdown Tipo ─────────────────────────────────────────────────── */}
        <div ref={refTipo} className="relative flex-1 sm:flex-none">
          <button
            type="button"
            onClick={() => { setOpenTipo((p) => !p); setOpenProv(false); setOpenFecha(false); setOpenUser(false); }}
            className={`
              w-full flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-semibold
              transition-all duration-200 select-none
              ${openTipo || tipo !== "TODOS"
                ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
                : "bg-background text-foreground border-border hover:bg-accent hover:border-border/80 shadow-sm"
              }
            `}
          >
            <span className="truncate max-w-[120px]">{tipoLabel}</span>
            <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${openTipo ? "rotate-180 text-primary" : ""}`} />
          </button>

          {openTipo && (
            <div className="absolute right-0 top-full mt-2 w-52 z-50 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 pt-3 pb-1.5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Tipo de movimiento</p>
              </div>
              <div className="p-1.5 space-y-0.5">
                {TIPOS.map((t) => {
                  const isSelected = t.value === tipo;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => { onTipoChange(t.value); setOpenTipo(false); }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-left
                        transition-colors duration-150
                        ${isSelected ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-accent text-foreground"}
                      `}
                    >
                      <span>{t.label}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Dropdown Proveedor ───────────────────────────────────────────── */}
        <div ref={refProv} className="relative flex-1 sm:flex-none">
          <button
            type="button"
            onClick={() => { setOpenProv((p) => !p); setOpenTipo(false); setOpenFecha(false); setOpenUser(false); }}
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
                      type="button"
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

        {/* ── Dropdown Fecha ───────────────────────────────────────────────── */}
        <div ref={refFecha} className="relative flex-1 sm:flex-none">
          <button
            type="button"
            onClick={() => { setOpenFecha((p) => !p); setOpenTipo(false); setOpenProv(false); setOpenUser(false); }}
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
            <span>{periodoLabel}</span>
            <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${openFecha ? "rotate-180" : ""}`} />
          </button>

          {openFecha && (
            <div className="absolute right-0 top-full mt-2 w-56 z-50 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 pt-3 pb-1.5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Período</p>
              </div>
              <div className="p-1.5 space-y-0.5">
                <button
                  type="button"
                  onClick={() => { onFechaChange("TODOS"); setOpenFecha(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group ${fecha === "TODOS" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"}`}
                >
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${fecha === "TODOS" ? "bg-primary-foreground/20" : "bg-muted group-hover:bg-background"}`}>
                    <SlidersHorizontal className={`h-3.5 w-3.5 ${fecha === "TODOS" ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold leading-tight ${fecha === "TODOS" ? "text-primary-foreground" : ""}`}>Todas las fechas</p>
                    <p className={`text-[10px] leading-tight mt-0.5 ${fecha === "TODOS" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>Sin filtro de período</p>
                  </div>
                  {fecha === "TODOS" && <div className="ml-auto h-2 w-2 rounded-full bg-primary-foreground/80 shrink-0" />}
                </button>
                {PERIODOS.map((op) => {
                  const Icon = op.icon;
                  const isActive = op.value === fecha;
                  return (
                    <button
                      key={op.value}
                      type="button"
                      onClick={() => { onFechaChange(op.value); setOpenFecha(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"}`}
                    >
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive ? "bg-primary-foreground/20" : "bg-muted group-hover:bg-background"}`}>
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
            </div>
          )}
        </div>

        {/* ── Dropdown Usuario ─────────────────────────────────────────────── */}
        <div ref={refUser} className="relative flex-1 sm:flex-none">
          <button
            type="button"
            onClick={() => { setOpenUser((p) => !p); setOpenTipo(false); setOpenProv(false); setOpenFecha(false); }}
            className={`
              w-full flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-semibold
              transition-all duration-200 select-none
              ${openUser || usuario !== "TODOS"
                ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
                : "bg-background text-foreground border-border hover:bg-accent hover:border-border/80 shadow-sm"
              }
            `}
          >
            <span className="truncate max-w-[120px]">{userLabel}</span>
            <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${openUser ? "rotate-180 text-primary" : ""}`} />
          </button>

          {openUser && (
            <div className="absolute right-0 top-full mt-2 w-52 z-50 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 pt-3 pb-1.5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Usuario</p>
              </div>
              <div className="p-1.5 space-y-0.5">
                {USUARIOS.map((u) => {
                  const isSelected = u.value === usuario;
                  return (
                    <button
                      key={u.value}
                      type="button"
                      onClick={() => { onUsuarioChange(u.value); setOpenUser(false); }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-left
                        transition-colors duration-150
                        ${isSelected ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-accent text-foreground"}
                      `}
                    >
                      <span>{u.label}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Limpiar todo ─────────────────────────────────────────────────── */}
        {hayFiltros && (
          <button
            type="button"
            onClick={limpiarTodo}
            className="px-3 py-2 text-[11px] font-semibold rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors shrink-0"
          >
            ✕ Limpiar
          </button>
        )}

      </div>
    </div>
  );
}
