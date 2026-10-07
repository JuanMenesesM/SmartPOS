import { X, ShoppingBag, Calendar, User, Hash, Package } from "lucide-react";
import ModalPortal from "@/components/ui/ModalPortal";
import { CompraAPI } from "@/services/compras.service";
import CompraStatusBadge from "./CompraStatusBadge";
import { formatCOP } from "@/utils/formatCOP";

interface Props {
  compra: CompraAPI | null;
  onClose: () => void;
}

export default function CompraDetalleModal({ compra, onClose }: Props) {
  if (!compra) return null;

  const facturaNum = `FC-${String(compra.id).padStart(4, "0")}`;

  return (
    <ModalPortal>
      <div 
        className="fixed inset-0 w-full h-full bg-background/80 backdrop-blur-md z-[9998] transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200 flex flex-col">

          {/* Borde superior decorativo con gradiente */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40 shrink-0" />

          {/* ── Cabecera ───────────────────────────────────────────────────────── */}
          <div className="relative px-6 pt-4 pb-3 flex flex-col items-center text-center border-b border-border shrink-0">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2 shadow-sm">
              <ShoppingBag className="h-6 w-6" />
            </div>

            <h2 className="text-lg font-extrabold text-foreground tracking-tight">
              {facturaNum}
            </h2>
            <p className="text-xs text-muted-foreground">Detalle de Compra y Proveedor</p>
          </div>

          {/* ── Cuerpo (Sin Scroll) ────────────────────────────────────────────── */}
          <div className="p-5 space-y-3">
            {/* Grid de información principal */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-2xl border border-border bg-card/50 space-y-0.5 text-center flex flex-col items-center justify-center">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-primary" /> Fecha
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {new Date(compra.fecha).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="p-2.5 rounded-2xl border border-border bg-card/50 space-y-0.5 text-center flex flex-col items-center justify-center">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-primary" /> Usuario
                </p>
                <p className="text-sm font-semibold text-foreground truncate max-w-full px-1">
                  {compra.usuario.nombre} {compra.usuario.apellido || ""}
                </p>
              </div>

              <div className="p-2.5 rounded-2xl border border-border bg-card/50 space-y-0.5 text-center flex flex-col items-center justify-center">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5 text-primary" /> Proveedor
                </p>
                <p className="text-sm font-semibold text-foreground truncate max-w-full px-1">{compra.proveedor.nombre}</p>
                {compra.proveedor.nit && (
                  <p className="text-[11px] font-mono text-muted-foreground">NIT: {compra.proveedor.nit}</p>
                )}
              </div>

              <div className="p-2.5 rounded-2xl border border-border bg-card/50 space-y-0.5 text-center flex flex-col items-center justify-center">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Package className="h-3.5 w-3.5 text-primary" /> Estado
                </p>
                <div className="pt-0.5 scale-105">
                  <CompraStatusBadge activo={compra.activo} />
                </div>
              </div>
            </div>

            {/* Productos */}
            <div className="space-y-1.5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                Productos ({compra.detalles.length})
              </p>
              <div className="space-y-1.5">
                {compra.detalles.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between px-3 py-2 rounded-2xl border border-border bg-card/40"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-xs font-bold text-foreground truncate">{d.producto.nombre}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        {d.producto.codigo} · {d.cantidad} uds × {formatCOP(d.precioCompra)}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-xs text-foreground shrink-0">
                      {formatCOP(d.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Factura Box */}
            <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-primary/5 border border-primary/15">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Total Factura
              </span>
              <span className="text-base font-extrabold text-primary font-mono">
                {formatCOP(compra.total)}
              </span>
            </div>
          </div>

          {/* ── Footer ─────────────────────────────────────────────────────────── */}
          <div className="px-5 py-3 border-t border-border flex items-center justify-end bg-muted/20 shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-all"
            >
              Cerrar Detalles
            </button>
          </div>

        </div>
      </div>
    </ModalPortal>
  );
}