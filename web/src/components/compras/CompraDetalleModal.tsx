import { X, ShoppingBag, Calendar, User, Hash, Package } from "lucide-react";
import { CompraAPI } from "@/services/compras.service";
import CompraStatusBadge from "./CompraStatusBadge";

function formatCOP(amount: number): string {
  return `$${new Intl.NumberFormat("es-CO").format(amount)}`;
}

interface Props {
  compra: CompraAPI | null;
  onClose: () => void;
}

export default function CompraDetalleModal({ compra, onClose }: Props) {
  if (!compra) return null;

  const facturaNum = `FC-${String(compra.id).padStart(4, "0")}`;

  return (
    <>
      <div 
        className="fixed inset-0 w-full h-full bg-background/70 backdrop-blur-sm z-[60] transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200">

        {/* ── Cabecera ───────────────────────────────────────────────────────── */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-foreground">{facturaNum}</h2>
              <p className="text-xs text-muted-foreground">Detalle de Compra</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Cuerpo ─────────────────────────────────────────────────────────── */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border border-border">
            <div className="bg-card px-4 py-3 space-y-1 flex flex-col items-center text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Fecha
              </p>
              <p className="text-sm font-semibold text-foreground">
                {new Date(compra.fecha).toLocaleDateString("es-CO", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="bg-card px-4 py-3 space-y-1 flex flex-col items-center text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Usuario
              </p>
              <p className="text-sm font-semibold text-foreground">
                {compra.usuario.nombre} {compra.usuario.apellido || ""}
              </p>
            </div>
            <div className="bg-card px-4 py-3 space-y-1 flex flex-col items-center text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Hash className="h-3.5 w-3.5" /> Proveedor
              </p>
              <p className="text-sm font-semibold text-foreground">{compra.proveedor.nombre}</p>
              {compra.proveedor.nit && (
                <p className="text-xs font-mono text-muted-foreground">NIT: {compra.proveedor.nit}</p>
              )}
            </div>
            <div className="bg-card px-4 py-3 space-y-1 flex flex-col items-center text-center justify-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Package className="h-3.5 w-3.5" /> Estado
              </p>
              <div className="pt-1">
                <CompraStatusBadge activo={compra.activo} />
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-wider text-foreground">
              Productos ({compra.detalles.length})
            </p>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {compra.detalles.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border/60"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{d.producto.nombre}</p>
                    <p className="text-xs font-mono text-muted-foreground">
                      {d.producto.codigo} · {d.cantidad} uds × {formatCOP(d.precioCompra)}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-sm text-foreground ml-3 shrink-0">
                    {formatCOP(d.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Total Factura
          </span>
          <span className="text-xl font-extrabold text-primary font-mono">
            {formatCOP(compra.total)}
          </span>
        </div>
      </div>
      </div>
    </>
  );
}
