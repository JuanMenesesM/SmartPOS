import React, { useState } from "react";
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
  Hash,
  Clock
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
        gradientBorder: "from-rose-500 via-orange-500 to-amber-500",
        glowColor: "rgba(244, 63, 94, 0.15)",
        badgeBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
        icon: TrendingDown,
        iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/20",
        deltaText: "text-rose-600 dark:text-rose-400",
        deltaBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
        label: "Salida por Venta",
        barColor: "bg-rose-500",
      }
    : esCompra
    ? {
        gradientBorder: "from-emerald-400 via-teal-500 to-cyan-500",
        glowColor: "rgba(16, 185, 129, 0.15)",
        badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        icon: TrendingUp,
        iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20",
        deltaText: "text-emerald-600 dark:text-emerald-400",
        deltaBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        label: "Ingreso por Compra",
        barColor: "bg-emerald-500",
      }
    : {
        gradientBorder: "from-violet-500 via-purple-500 to-indigo-500",
        glowColor: "rgba(139, 92, 246, 0.15)",
        badgeBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30",
        icon: RefreshCw,
        iconBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-1 ring-violet-500/20",
        deltaText: "text-violet-600 dark:text-violet-400",
        deltaBg: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
        label: "Ajuste de Inventario",
        barColor: "bg-violet-500",
      };

  const IconComponent = theme.icon;

  const handleCopyId = () => {
    navigator.clipboard.writeText(`MOV-${movimiento.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ModalPortal>
      {/* Overlay blur pantalla completa */}
      <div className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose} />

      {/* Contenedor de posicionamiento (sin blur para no interferir) */}
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-6 px-4 sm:px-6 pointer-events-none animate-in fade-in duration-200">
      {/* Halo de luz suave */}
      <div
        className="absolute w-96 h-96 rounded-full filter blur-[90px] opacity-30 pointer-events-none -z-10"
        style={{ backgroundColor: theme.glowColor }}
      />

      {/* Modal Principal Compacto y Proporcional */}
      <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col pointer-events-auto">
        
        {/* Barra superior con gradiente de color */}
        <div className={`h-1 w-full bg-gradient-to-r ${theme.gradientBorder} shrink-0`} />

        {/* ── Cabecera Compacta ─────────────────────────────────────────────── */}
        <div className="px-4 py-2.5 border-b border-border/60 flex items-center justify-between bg-muted/20 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`h-8 w-8 rounded-xl flex items-center justify-center shadow-xs shrink-0 ${theme.iconBg}`}>
              <IconComponent className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-black text-foreground tracking-tight truncate leading-snug">
                {movimiento.productoNombre}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-muted-foreground bg-muted hover:bg-accent px-1.5 py-0.5 rounded-md border border-border transition-colors"
                  title="Copiar ID"
                >
                  <Hash className="h-3 w-3" />
                  <span>MOV-{String(movimiento.id).padStart(4, "0")}</span>
                  {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                </button>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-xs font-bold text-muted-foreground truncate">
                  {theme.label}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150 active:scale-95 border border-border/60"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* ── Contenido con Letras Grandes y Scroll Ajustado ─────────────────── */}
        <div className="p-3.5 space-y-3">
          
          {/* Card Flujo de Stock */}
          <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-muted/40 via-card to-background p-4 text-center shadow-inner space-y-2.5">
            <div className="flex items-center justify-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Variación de Existencias
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${theme.badgeBg}`}>
                {movimiento.tipo}
              </span>
            </div>

            {/* Visual Pipeline */}
            <div className="grid grid-cols-3 gap-2 items-center bg-card border border-border/70 p-3 rounded-2xl shadow-xs">
              {/* Stock Anterior */}
              <div className="text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Stock Antes
                </span>
                <span className="text-2xl font-black font-mono text-muted-foreground mt-0.5 block">
                  {movimiento.stockAnterior}
                </span>
              </div>

              {/* Delta Central */}
              <div className="flex flex-col items-center justify-center">
                <div className={`px-3 py-1 rounded-full text-xs font-black font-mono shadow-xs border ${theme.deltaBg}`}>
                  {movimiento.cantidad > 0 ? `+${movimiento.cantidad}` : movimiento.cantidad} un.
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <div className={`h-1 w-5 rounded-full ${theme.barColor} opacity-70`} />
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>

              {/* Nuevo Stock */}
              <div className="text-center bg-muted/40 py-1.5 rounded-xl border border-border/50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-foreground block">
                  Nuevo Stock
                </span>
                <span className={`text-2xl font-black font-mono mt-0.5 block ${theme.deltaText}`}>
                  {movimiento.stockNuevo}
                </span>
              </div>
            </div>
          </div>

          {/* ── Bento Grid de Información ───────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            {/* Fecha y Hora */}
            <div className="p-3.5 rounded-2xl bg-card border border-border/80 hover:border-border text-center space-y-1 shadow-xs flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>Fecha y Hora</span>
              </div>
              <p className="text-sm font-bold text-foreground pt-0.5">
                {new Date(movimiento.fecha).toLocaleDateString("es-CO", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs font-mono text-muted-foreground flex items-center justify-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(movimiento.fecha).toLocaleTimeString("es-CO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Documento / Comprobante */}
            <div className="p-3.5 rounded-2xl bg-card border border-border/80 hover:border-border text-center space-y-1 shadow-xs flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span>Documento</span>
              </div>
              <p className="text-sm font-mono font-bold text-foreground truncate max-w-full pt-0.5">
                {movimiento.documento || "Registro Interno"}
              </p>
              <span className="inline-block text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                Verificado
              </span>
            </div>

            {/* Operador */}
            <div className="p-3.5 rounded-2xl bg-card border border-border/80 hover:border-border text-center space-y-1 shadow-xs flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <User className="h-3.5 w-3.5 text-primary" />
                <span>Operador</span>
              </div>
              <p className="text-sm font-bold text-foreground truncate max-w-full pt-0.5">
                {movimiento.usuario}
              </p>
              <p className="text-xs text-muted-foreground">Sesión activa</p>
            </div>

            {/* Naturaleza */}
            <div className="p-3.5 rounded-2xl bg-card border border-border/80 hover:border-border text-center space-y-1 shadow-xs flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span>Naturaleza</span>
              </div>
              <div className="pt-0.5">
                <KardexBadge tipo={movimiento.tipo} className="text-xs font-bold px-3 py-1" />
              </div>
            </div>
          </div>

          {/* Proveedor si existe */}
          {movimiento.proveedor && (
            <div className="p-3 rounded-2xl bg-card border border-border/80 text-center space-y-0.5 shadow-xs flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Truck className="h-3.5 w-3.5 text-primary" />
                <span>Proveedor de Origen</span>
              </div>
              <p className="text-sm font-extrabold text-foreground truncate mt-0.5">
                {movimiento.proveedor}
              </p>
            </div>
          )}

          {/* Observación si existe */}
          {movimiento.observacion && (
            <div className="p-3 rounded-2xl bg-muted/30 border border-border/60 text-center space-y-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Nota u Observación
              </span>
              <p className="text-sm text-foreground leading-relaxed italic">
                "{movimiento.observacion}"
              </p>
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <div className="px-5 py-3.5 border-t border-border/70 bg-muted/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">
              Auditoría sellada en sistema
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-extrabold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/25 active:scale-95 transition-all"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
}
