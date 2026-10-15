import { useState } from "react";
import ModalPortal from "@/components/ui/ModalPortal";
import {
  X,
  Layers,
  Calendar,
  User,
  FileText,
  Truck,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Package,
  Check,
  Copy,
  MessageSquare
} from "lucide-react";
import { MovimientoKardex } from "@/types/producto";
import KardexBadge from "./KardexBadge";

interface Props {
  movimiento: MovimientoKardex | null;
  onClose: () => void;
}

export default function KardexDetailSheet({ movimiento, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  if (!movimiento) return null;

  const esVenta = movimiento.tipo === "VENTA";
  const esCompra = movimiento.tipo === "COMPRA";

  const theme = esVenta
    ? {
        heroGradient: "from-rose-500 via-rose-600 to-amber-600",
        badgeBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        icon: TrendingDown,
        deltaText: "text-rose-600 dark:text-rose-400",
        deltaBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25",
        finalStockBg: "bg-rose-500/5 border-rose-500/20 text-rose-600 dark:text-rose-400",
        label: "Salida por Venta",
        barColor: "bg-rose-500",
        btnColor: "bg-rose-600 hover:bg-rose-500 shadow-rose-500/20",
      }
    : esCompra
    ? {
        heroGradient: "from-emerald-600 via-teal-500 to-cyan-600",
        badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        icon: TrendingUp,
        deltaText: "text-emerald-600 dark:text-emerald-400",
        deltaBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
        finalStockBg: "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
        label: "Ingreso por Compra",
        barColor: "bg-emerald-500",
        btnColor: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20",
      }
    : {
        heroGradient: "from-violet-600 via-purple-600 to-indigo-600",
        badgeBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
        icon: RefreshCw,
        deltaText: "text-violet-600 dark:text-violet-400",
        deltaBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/25",
        finalStockBg: "bg-violet-500/5 border-violet-500/20 text-violet-600 dark:text-violet-400",
        label: "Ajuste de Inventario",
        barColor: "bg-violet-500",
        btnColor: "bg-violet-600 hover:bg-violet-500 shadow-violet-500/20",
      };

  const IconComponent = theme.icon;
  const movIdStr = `MOV-${String(movimiento.id).padStart(4, "0")}`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(movIdStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const fechaFormateada = new Date(movimiento.fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const horaFormateada = new Date(movimiento.fecha).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <ModalPortal>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-md bg-card border border-border/60 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto animate-in zoom-in-95 fade-in duration-200 flex flex-col max-h-[92vh]">

          {/* -- Hero header with gradient -- */}
          <div className={`relative bg-gradient-to-br ${theme.heroGradient} px-6 pt-6 pb-8 text-white shrink-0 overflow-hidden`}>
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/15 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-black/10 blur-xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              type="button"
              className="absolute right-4 top-4 z-20 h-8 w-8 rounded-xl bg-black/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/90 hover:bg-black/40 hover:text-white transition-all cursor-pointer active:scale-95 select-none"
              aria-label="Cerrar modal"
            >
              <X className="h-4 w-4 pointer-events-none" />
            </button>

            {/* Icon + title */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-3 shadow-xl">
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-white">{movIdStr}</h2>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="h-6 w-6 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="Copiar ID"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="text-sm text-white/95 font-medium mt-1 line-clamp-1 max-w-[280px]">
                {movimiento.productoNombre}
              </p>
              <span className="text-xs text-white/75 mt-0.5">{theme.label}</span>
            </div>
          </div>

          {/* Wave separator */}
          <div className={`h-4 bg-gradient-to-br ${theme.heroGradient} shrink-0 relative`}>
            <div className="absolute inset-0 bg-card rounded-t-3xl" />
          </div>

          {/* -- Body -- */}
          <div className="px-5 pb-5 space-y-4 overflow-y-auto flex-1">

            {/* Variación de Existencias (Flujo Horizontal Limpio) */}
            <div className="rounded-2xl border border-border/60 bg-muted/15 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-background border border-border/60 flex items-center justify-center">
                    <Package className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    Variación de Existencias
                  </span>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${theme.badgeBg}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${theme.barColor}`} />
                  {movimiento.tipo}
                </span>
              </div>

              {/* Connected Metric Strip */}
              <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center bg-card border border-border/50 p-2.5 rounded-xl">
                {/* Stock Inicial */}
                <div className="text-center py-1">
                  <span className="text-[10px] font-medium text-muted-foreground block">
                    Stock inicial
                  </span>
                  <span className="text-xl font-semibold font-mono text-muted-foreground/80 mt-0.5 block tabular-nums">
                    {movimiento.stockAnterior}
                  </span>
                </div>

                {/* Delta con conector */}
                <div className="flex flex-col items-center justify-center px-1">
                  <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold font-mono border ${theme.deltaBg}`}>
                    <IconComponent className="h-3.5 w-3.5" />
                    <span>{movimiento.cantidad > 0 ? `+${movimiento.cantidad}` : movimiento.cantidad} un.</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-muted-foreground/30">
                    <div className="h-px w-3 bg-border" />
                    <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                    <div className="h-px w-3 bg-border" />
                  </div>
                </div>

                {/* Nuevo Stock */}
                <div className={`text-center py-1 rounded-lg border ${theme.finalStockBg}`}>
                  <span className="text-[10px] font-medium text-foreground/80 block">
                    Stock final
                  </span>
                  <span className={`text-xl font-semibold font-mono mt-0.5 block tabular-nums ${theme.deltaText}`}>
                    {movimiento.stockNuevo}
                  </span>
                </div>
              </div>
            </div>

            {/* Ficha Técnica / Lista Elegante (Tipografía fina y sobria) */}
            <div className="rounded-2xl border border-border/60 bg-card divide-y divide-border/40 overflow-hidden text-xs">
              {/* Fecha y Hora */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/15 transition-colors">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-muted-foreground/70" />
                  <span className="font-medium text-muted-foreground">Fecha y hora</span>
                </div>
                <div className="text-right font-medium text-foreground">
                  <span>{fechaFormateada}</span>
                  <span className="text-muted-foreground/60 mx-1.5">•</span>
                  <span className="text-muted-foreground">{horaFormateada}</span>
                </div>
              </div>

              {/* Movimiento */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/15 transition-colors">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <FileText className="h-4 w-4 text-muted-foreground/70" />
                  <span className="font-medium text-muted-foreground">Documento</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-foreground">
                    {movimiento.documento ? movimiento.documento.replace(/^DOC-/i, "MOV-") : movIdStr}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Check className="h-3 w-3" /> Verificado
                  </span>
                </div>
              </div>

              {/* Operador */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/15 transition-colors">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <User className="h-4 w-4 text-muted-foreground/70" />
                  <span className="font-medium text-muted-foreground">Operador</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <span>{movimiento.usuario}</span>
                </div>
              </div>

              {/* Tipo de Movimiento */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/15 transition-colors">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Layers className="h-4 w-4 text-muted-foreground/70" />
                  <span className="font-medium text-muted-foreground">Tipo de movimiento</span>
                </div>
                <div>
                  <KardexBadge tipo={movimiento.tipo} className="text-[11px] font-medium px-2 py-0.5 rounded-md" />
                </div>
              </div>

              {/* Proveedor si existe */}
              {movimiento.proveedor && (
                <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/15 transition-colors">
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <Truck className="h-4 w-4 text-muted-foreground/70" />
                    <span className="font-medium text-muted-foreground">Proveedor</span>
                  </div>
                  <span className="font-medium text-foreground truncate max-w-[200px]">
                    {movimiento.proveedor}
                  </span>
                </div>
              )}
            </div>

            {/* Observación si existe */}
            {movimiento.observacion && (
              <div className="p-3 bg-muted/15 border border-border/50 rounded-xl flex items-start gap-2.5 text-xs">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                    Observación
                  </span>
                  <p className="text-foreground/80 leading-relaxed font-normal">
                    {movimiento.observacion}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* -- Footer -- */}
          <div className="px-5 py-3.5 border-t border-border/60 bg-muted/20 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-muted-foreground">
                Auditoría sellada en sistema
              </span>
            </div>

            <button
              onClick={onClose}
              className={`px-5 py-2 text-xs font-medium rounded-xl text-white transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${theme.btnColor}`}
            >
              Cerrar Detalle
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
