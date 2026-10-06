import { Clock, ArrowUpRight, Receipt, Users2, Plus, UserCheck, Trash2 } from "lucide-react";
import { Mesa } from "@/types/venta";
import { formatCOP } from "@/utils/formatCOP";

function calcularTiempo(aperturaAt?: string): string {
  if (!aperturaAt) return "";
  const mins = Math.floor((Date.now() - new Date(aperturaAt).getTime()) / 60000);
  if (mins < 1) return "< 1 min";
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function extraerSeccion(nombre: string, numero: number): { seccion: string; codigo: string } {
  const seccion = "VENTA";
  const codigo = String(numero).padStart(2, "0");
  return { seccion, codigo };
}

interface Props {
  mesa: Mesa;
  onClick: (mesa: Mesa) => void;
  onEliminar?: (id: string) => void;
}

export default function MesaCard({ mesa, onClick, onEliminar }: Props) {
  const total = mesa.carrito.reduce((acc, i) => acc + i.subtotal, 0);
  const tiempo = calcularTiempo(mesa.aperturaAt);
  const itemCount = mesa.carrito.reduce((acc, i) => acc + i.cantidad, 0);
  const { seccion, codigo } = extraerSeccion(mesa.nombre, mesa.numero);

  const tieneProductos = mesa.carrito && mesa.carrito.length > 0;
  const esLibre = mesa.estado === "LIBRE" && !tieneProductos;
  const esConsumo = mesa.estado === "EN_CONSUMO" || (mesa.estado === "LIBRE" && tieneProductos);
  const esPorCobrar = mesa.estado === "POR_COBRAR";

  // Estilos vibrantes con gradientes más pronunciados y sombras sutiles
  const theme = esLibre
    ? {
        cardBg: "bg-gradient-to-br from-emerald-500/[0.1] via-emerald-500/[0.02] to-card hover:from-emerald-500/[0.15] dark:from-emerald-950/40 dark:via-emerald-950/10 dark:to-card",
        border: "border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)]",
        badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40",
        numColor: "text-emerald-900 dark:text-emerald-50",
        accentText: "text-emerald-600 dark:text-emerald-400",
        dotClass: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]",
        dotAnim: "",
        statusLabel: "DISPONIBLE",
        hoverGlow: "hover:shadow-emerald-500/20",
        accentLine: "bg-emerald-500",
      }
    : esConsumo
    ? {
        cardBg: "bg-gradient-to-br from-indigo-500/[0.1] via-indigo-500/[0.02] to-card hover:from-indigo-500/[0.15] dark:from-indigo-950/40 dark:via-indigo-950/10 dark:to-card",
        border: "border-indigo-500/30 hover:border-indigo-500/60 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.1)]",
        badge: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/40",
        numColor: "text-indigo-900 dark:text-indigo-50",
        accentText: "text-indigo-600 dark:text-indigo-400",
        dotClass: "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]",
        dotAnim: "animate-pulse",
        statusLabel: "EN SERVICIO",
        hoverGlow: "hover:shadow-indigo-500/20",
        accentLine: "bg-indigo-500",
      }
    : {
        cardBg: "bg-gradient-to-br from-rose-500/[0.1] via-rose-500/[0.02] to-card hover:from-rose-500/[0.15] dark:from-rose-950/40 dark:via-rose-950/10 dark:to-card",
        border: "border-rose-500/40 hover:border-rose-500/70 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.15)]",
        badge: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/40",
        numColor: "text-rose-900 dark:text-rose-50",
        accentText: "text-rose-600 dark:text-rose-400",
        dotClass: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]",
        dotAnim: "animate-ping",
        statusLabel: "POR COBRAR",
        hoverGlow: "hover:shadow-rose-500/25",
        accentLine: "bg-rose-500",
      };

  return (
    <div
      onClick={() => onClick(mesa)}
      className={`
        group relative flex flex-col justify-between
        min-h-[140px] rounded-2xl border ${theme.border} ${theme.cardBg}
        p-3 pt-4 overflow-hidden cursor-pointer select-none
        transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl ${theme.hoverGlow}
        backdrop-blur-md
      `}
    >
      {/* ── Acento superior (Línea de color vibrante) ───────────────────── */}
      <div className={`absolute top-0 left-0 w-full h-1.5 ${theme.accentLine} opacity-80`} />
      {/* ── Header: Sección y Badge de Estado ────────────────────────────── */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400 truncate">
          {seccion}
        </span>
        
        <div className="flex items-center gap-1.5">
          {esLibre && onEliminar && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEliminar(mesa.id);
              }}
              className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
              title="Eliminar venta"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-extrabold tracking-wider uppercase ${theme.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${theme.dotClass} ${theme.dotAnim}`} />
            <span>{theme.statusLabel}</span>
          </div>
        </div>
      </div>

      {/* ── Center: Número de Mesa ──────────────────────────────────────── */}
      <div className="my-1.5 flex items-baseline justify-between">
        <span className={`font-black font-mono tracking-tight text-4xl leading-none ${theme.numColor}`}>
          {codigo}
        </span>

        {/* Flecha de acción sutil en hover */}
        <div className={`
          h-7 w-7 rounded-xl flex items-center justify-center
          opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 
          transition-all duration-200 bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 ${theme.accentText}
        `}>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* ── Footer: Información detallada ──────────────────────────────── */}
      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 mt-auto">
        {esLibre ? (
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium h-8 w-full text-center">
            <div className="h-4 w-4 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <span>Lista para atención</span>
          </div>
        ) : (
          <div className="flex items-end justify-between gap-2">
            <div className="space-y-1 min-w-0">
              {mesa.mesero && mesa.mesero !== "—" && (
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1">
                  <UserCheck className="h-3 w-3 text-slate-400 shrink-0" />
                  {mesa.mesero}
                </p>
              )}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span>{itemCount} ítem{itemCount !== 1 ? "s" : ""}</span>
                {tiempo && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {tiempo}
                    </span>
                  </>
                )}
              </div>
              {esPorCobrar && (
                <div className="flex items-center gap-1 pt-0.5 text-rose-600 dark:text-rose-400 font-bold text-[10px] tracking-wide uppercase">
                  <Receipt className="h-3 w-3 shrink-0" />
                  <span>Cuenta lista</span>
                </div>
              )}
            </div>

            <span className={`text-base font-extrabold font-mono tabular-nums shrink-0 leading-none ${theme.accentText}`}>
              {formatCOP(total)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Botón "Agregar Venta" con diseño estilizado y pro ────────────────────────
export function AgregarMesaCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        min-h-[180px] rounded-2xl border-2 border-dashed border-indigo-300/60 dark:border-indigo-800/60
        flex flex-col items-center justify-center gap-3
        text-indigo-600/70 dark:text-indigo-400/70 hover:text-indigo-600 dark:hover:text-indigo-400
        hover:border-indigo-500/60 dark:hover:border-indigo-500/60
        transition-all duration-300 ease-out bg-indigo-50/30 dark:bg-indigo-950/20 
        hover:bg-indigo-500/[0.05] group cursor-pointer shadow-sm hover:shadow-indigo-500/10 hover:shadow-lg
      "
    >
      <div className="h-12 w-12 rounded-2xl border border-dashed border-indigo-300 dark:border-indigo-700 group-hover:border-indigo-500/60 flex items-center justify-center transition-all bg-white dark:bg-slate-800 shadow-sm group-hover:bg-indigo-500/10">
        <Plus className="h-5 w-5 transition-transform group-hover:scale-125" />
      </div>
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Nueva Venta</span>
    </button>
  );
}