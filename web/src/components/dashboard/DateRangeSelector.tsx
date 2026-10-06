import { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar, Clock, CalendarDays, CalendarRange, SlidersHorizontal, Check } from "lucide-react";
import { RangoPeriodo, calcularRango, RangoFechas } from "@/services/dashboard.service";

interface Opcion {
  value: RangoPeriodo;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

const OPCIONES: Opcion[] = [
  {
    value: "hoy",
    label: "Hoy",
    sublabel: "Desde las 00:00 hrs",
    icon: Clock,
  },
  {
    value: "semana",
    label: "Esta semana",
    sublabel: "Lunes a domingo",
    icon: CalendarDays,
  },
  {
    value: "mes",
    label: "Este mes",
    sublabel: "Desde el 1° del mes",
    icon: Calendar,
  },
  {
    value: "anio",
    label: "Este año",
    sublabel: "Desde el 1° de enero",
    icon: CalendarRange,
  },
  {
    value: "personalizado",
    label: "Personalizado",
    sublabel: "Elige un rango exacto",
    icon: SlidersHorizontal,
  },
];

function toInputDate(d: Date): string {
  // yyyy-MM-dd
  return d.toISOString().slice(0, 10);
}

interface Props {
  value: RangoPeriodo;
  onChange: (rango: RangoFechas) => void;
}

export default function DateRangeSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  const today = toInputDate(new Date());
  const [customStart, setCustomStart] = useState(today);
  const [customEnd, setCustomEnd] = useState(today);

  const ref = useRef<HTMLDivElement>(null);

  // Cierra al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowCustom(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const opcionActiva = OPCIONES.find((o) => o.value === value) ?? OPCIONES[2];

  function seleccionar(periodo: RangoPeriodo) {
    if (periodo === "personalizado") {
      setShowCustom(true);
      return;
    }
    onChange(calcularRango(periodo));
    setOpen(false);
    setShowCustom(false);
  }

  function aplicarPersonalizado() {
    if (!customStart || !customEnd) return;
    const inicio = new Date(customStart + "T00:00:00");
    const fin    = new Date(customEnd   + "T23:59:59.999");
    if (inicio > fin) return;

    onChange({ periodo: "personalizado", inicio, fin });
    setOpen(false);
    setShowCustom(false);
  }

  // Etiqueta en el botón cuando hay rango personalizado
  const labelBoton =
    value === "personalizado"
      ? (() => {
          const fmt = (d: Date) =>
            d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
          return `${fmt(new Date(customStart))} – ${fmt(new Date(customEnd))}`;
        })()
      : opcionActiva.label;

  return (
    <div ref={ref} className="relative">
      {/* Botón de activación */}
      <button
        onClick={() => {
          setOpen((prev) => !prev);
          if (open) setShowCustom(false);
        }}
        className={`
          flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium
          transition-all duration-200 select-none whitespace-nowrap
          ${open
            ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
            : "bg-card text-foreground border-border hover:bg-accent hover:border-primary/30 shadow-sm"
          }
        `}
      >
        <Calendar className="h-3.5 w-3.5 shrink-0" />
        <span>{labelBoton}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute right-0 top-full mt-2 z-50
            bg-card border border-border rounded-2xl shadow-xl
            overflow-hidden
            animate-in fade-in slide-in-from-top-2 duration-150
          "
          style={{ width: showCustom ? "280px" : "224px" }}
        >
          {!showCustom ? (
            <>
              <div className="px-3 pt-3 pb-1.5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Período de análisis
                </p>
              </div>

              <div className="p-1.5 space-y-0.5">
                {OPCIONES.map((opcion) => {
                  const Icon = opcion.icon;
                  const isActive = opcion.value === value;

                  return (
                    <button
                      key={opcion.value}
                      onClick={() => seleccionar(opcion.value)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                        transition-all duration-150 group
                        ${isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent text-foreground"
                        }
                      `}
                    >
                      <div
                        className={`
                          h-8 w-8 rounded-lg flex items-center justify-center shrink-0
                          transition-colors duration-150
                          ${isActive
                            ? "bg-primary-foreground/20"
                            : "bg-muted group-hover:bg-background"
                          }
                        `}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold leading-tight ${isActive ? "text-primary-foreground" : ""}`}>
                          {opcion.label}
                        </p>
                        <p className={`text-[11px] leading-tight mt-0.5 ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {opcion.sublabel}
                        </p>
                      </div>
                      {isActive && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary-foreground/80 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="px-3 pb-3 pt-1">
                <div className="h-px bg-border mb-2.5" />
                <p className="text-[10px] text-muted-foreground text-center">
                  Los datos se actualizan automáticamente
                </p>
              </div>
            </>
          ) : (
            /* ── Panel de fecha personalizada ─────────────────────────────── */
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCustom(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Volver"
                >
                  <ChevronDown className="h-4 w-4 rotate-90" />
                </button>
                <p className="text-xs font-semibold text-foreground">Rango personalizado</p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                    Desde
                  </label>
                  <input
                    type="date"
                    value={customStart}
                    max={customEnd || today}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="
                      w-full px-3 py-2 text-sm rounded-lg border border-border
                      bg-background text-foreground
                      focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                      transition-all duration-150
                    "
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                    Hasta
                  </label>
                  <input
                    type="date"
                    value={customEnd}
                    min={customStart}
                    max={today}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="
                      w-full px-3 py-2 text-sm rounded-lg border border-border
                      bg-background text-foreground
                      focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                      transition-all duration-150
                    "
                  />
                </div>
              </div>

              <button
                onClick={aplicarPersonalizado}
                disabled={!customStart || !customEnd || customStart > customEnd}
                className="
                  w-full flex items-center justify-center gap-2
                  px-4 py-2.5 rounded-xl text-sm font-semibold
                  bg-primary text-primary-foreground
                  hover:bg-primary/90 active:scale-[0.98]
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-150
                "
              >
                <Check className="h-3.5 w-3.5" />
                Aplicar rango
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
