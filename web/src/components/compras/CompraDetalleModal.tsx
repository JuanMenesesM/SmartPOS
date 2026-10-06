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
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-6 px-4 pointer-events-none">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200 flex flex-col">

        {/* ── Cabecera ───────────────────────────────────────────────────────── */}
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-foreground leading-tight">{facturaNum}</h2>
              <p className="text-[11px] text-muted-foreground leading-tight">Detalle de Compra</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* ── Cuerpo ─────────────────────────────────────────────────────────── */}
        <div className="p-3.5 space-y-3">
          <div className="grid grid-cols-2 gap-px bg-border rounded-lg overflow-hidden border border-border">
            <div className="bg-card px-3 py-2 space-y-0.5 flex flex-col items-center text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-1">
                <Calendar className="h-3 w-3" /> Fecha
              </p>
              <p className="text-xs font-semibold text-foreground">
                {new Date(compra.fecha).toLocaleDateString("es-CO", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="bg-card px-3 py-2 space-y-0.5 flex flex-col items-center text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-1">
                <User className="h-3 w-3" /> Usuario
              </p>
              <p className="text-xs font-semibold text-foreground">
                {compra.usuario.nombre} {compra.usuario.apellido || ""}
              </p>
            </div>
            <div className="bg-card px-3 py-2 space-y-0.5 flex flex-col items-center text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-1">
                <Hash className="h-3 w-3" /> Proveedor
              </p>
              <p className="text-xs font-semibold text-foreground">{compra.proveedor.nombre}</p>
              {compra.proveedor.nit && (
                <p className="text-[10px] font-mono text-muted-foreground">NIT: {compra.proveedor.nit}</p>
              )}
            </div>
            <div className="bg-card px-3 py-2 space-y-0.5 flex flex-col items-center text-center justify-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-1">
                <Package className="h-3 w-3" /> Estado
              </p>
              <div className="pt-0.5">
                <CompraStatusBadge activo={compra.activo} />
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
              Productos ({compra.detalles.length})
            </p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {compra.detalles.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/60"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{d.producto.nombre}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">
                      {d.producto.codigo} · {d.cantidad} uds × {formatCOP(d.precioCompra)}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-xs text-foreground ml-2 shrink-0">
                    {formatCOP(d.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <div className="px-4 py-2 border-t border-border flex items-center justify-between bg-muted/20">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Total Factura
          </span>
          <span className="text-lg font-extrabold text-primary font-mono">
            {formatCOP(compra.total)}
          </span>
        </div>
      </div>
      </div>
    </ModalPortal>
  );
}
