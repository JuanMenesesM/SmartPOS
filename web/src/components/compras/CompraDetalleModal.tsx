import { X, ShoppingBag, Calendar, User, Building2, Package, BadgeCheck, TrendingUp } from "lucide-react";
import ModalPortal from "@/components/ui/ModalPortal";
import { CompraAPI } from "@/services/compras.service";
import { formatCOP } from "@/utils/formatCOP";

interface Props {
  compra: CompraAPI | null;
  onClose: () => void;
}

export default function CompraDetalleModal({ compra, onClose }: Props) {
  if (!compra) return null;

  const facturaNum = `FC-${String(compra.id).padStart(4, "0")}`;

  const fechaFormateada = new Date(compra.fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const horaFormateada = new Date(compra.fecha).toLocaleTimeString("es-CO", {
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
          <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 px-6 pt-6 pb-8 text-white shrink-0 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-black/10 blur-xl pointer-events-none" />

            {/* Close button with darker hover and cursor-pointer */}
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
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">{facturaNum}</h2>
              <p className="text-sm text-white/85 mt-0.5 font-normal">Detalle de Compra</p>
            </div>
          </div>

          {/* Wave separator */}
          <div className="h-4 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 shrink-0 relative">
            <div className="absolute inset-0 bg-card rounded-t-3xl" />
          </div>

          {/* -- Body -- */}
          <div className="px-5 pb-5 space-y-4 overflow-y-auto flex-1">

            {/* Ficha Técnica de la Compra (Diseño elegante y sobrio) */}
            <div className="rounded-2xl border border-border/60 bg-card divide-y divide-border/40 overflow-hidden text-xs">
              {/* Fecha */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/15 transition-colors">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-muted-foreground/70" />
                  <span className="font-medium text-muted-foreground">Fecha de compra</span>
                </div>
                <div className="text-right font-medium text-foreground">
                  <span>{fechaFormateada}</span>
                  <span className="text-muted-foreground/60 mx-1.5">•</span>
                  <span className="text-muted-foreground">{horaFormateada}</span>
                </div>
              </div>

              {/* Registrado por */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/15 transition-colors">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <User className="h-4 w-4 text-muted-foreground/70" />
                  <span className="font-medium text-muted-foreground">Registrado por</span>
                </div>
                <div className="font-medium text-foreground">
                  <span>
                    {compra.usuario.nombre} {compra.usuario.apellido || ""}
                  </span>
                </div>
              </div>

              {/* Proveedor */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/15 transition-colors">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Building2 className="h-4 w-4 text-muted-foreground/70" />
                  <span className="font-medium text-muted-foreground">Proveedor</span>
                </div>
                <div className="text-right font-medium text-foreground">
                  <span className="truncate max-w-[200px] block">{compra.proveedor.nombre}</span>
                  {compra.proveedor.nit && (
                    <span className="text-[10px] font-mono text-muted-foreground block">NIT: {compra.proveedor.nit}</span>
                  )}
                </div>
              </div>

              {/* Estado */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/15 transition-colors">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <BadgeCheck className="h-4 w-4 text-muted-foreground/70" />
                  <span className="font-medium text-muted-foreground">Estado</span>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium
                    ${compra.activo
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20"
                    }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${compra.activo ? "bg-emerald-500" : "bg-rose-500"}`} />
                    {compra.activo ? "Activa" : "Anulada"}
                  </span>
                </div>
              </div>
            </div>

            {/* Productos */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground/70" />
                  <span className="text-xs font-semibold text-foreground">Productos en orden</span>
                </div>
                <span className="text-[11px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border/50">
                  {compra.detalles.length} Item{compra.detalles.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
                {compra.detalles.map((d) => (
                  <div
                    key={d.id}
                    className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-card border border-border/60 hover:border-border transition-all duration-150"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="text-xs font-medium text-foreground truncate">{d.producto.nombre}</p>
                      <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        {d.producto.codigo} • {d.cantidad} uds • {formatCOP(d.precioCompra)}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-foreground font-mono shrink-0">
                      {formatCOP(d.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-muted/20 border border-border/60">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold text-foreground">Total Factura</span>
              </div>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                {formatCOP(compra.total)}
              </span>
            </div>
          </div>

          {/* -- Footer -- */}
          <div className="px-5 py-3.5 border-t border-border/60 bg-muted/20 flex items-center justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Cerrar Detalles
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
