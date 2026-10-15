import { X, Receipt, Calendar, User, Download, Package, TrendingUp, CreditCard } from "lucide-react";
import ModalPortal from "@/components/ui/ModalPortal";
import { VentaBackend } from "@/types/venta";
import { formatCOP } from "@/utils/formatCOP";

interface Props {
  venta: VentaBackend | null;
  onClose: () => void;
  onDescargarPDF: (id: number) => void;
}

export default function VentaDetalleModal({ venta, onClose, onDescargarPDF }: Props) {
  if (!venta) return null;

  const facturaNum = `FAC-${String(venta.id).padStart(4, "0")}`;

  const fechaFormateada = new Date(venta.fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const horaFormateada = new Date(venta.fecha).toLocaleTimeString("es-CO", {
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

          {/* -- Hero header with soft pastel blue gradient -- */}
          <div className="relative bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-300 px-6 pt-6 pb-8 text-white shrink-0 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/15 blur-2xl pointer-events-none" />
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
                <Receipt className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">{facturaNum}</h2>
              <p className="text-sm text-white/85 mt-0.5 font-normal">Comprobante de Venta</p>
            </div>
          </div>

          {/* Wave separator */}
          <div className="h-4 bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-300 shrink-0 relative">
            <div className="absolute inset-0 bg-card rounded-t-3xl" />
          </div>

          {/* -- Body -- */}
          <div className="px-5 pb-5 space-y-4 overflow-y-auto flex-1">

            {/* Ficha Técnica de la Venta (Diseño elegante y sobrio) */}
            <div className="rounded-2xl border border-border/60 bg-card divide-y divide-border/40 overflow-hidden text-xs">
              {/* Fecha */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/15 transition-colors">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-muted-foreground/70" />
                  <span className="font-medium text-muted-foreground">Fecha de emisión</span>
                </div>
                <div className="text-right font-medium text-foreground">
                  <span>{fechaFormateada}</span>
                  <span className="text-muted-foreground/60 mx-1.5">•</span>
                  <span className="text-muted-foreground">{horaFormateada}</span>
                </div>
              </div>

              {/* Atendido por */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/15 transition-colors">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <User className="h-4 w-4 text-muted-foreground/70" />
                  <span className="font-medium text-muted-foreground">Atendido por</span>
                </div>
                <div className="font-medium text-foreground">
                  <span>
                    {venta.usuario.nombre} {venta.usuario.apellido || ""}
                  </span>
                </div>
              </div>

              {/* Método de pago */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/15 transition-colors">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <CreditCard className="h-4 w-4 text-muted-foreground/70" />
                  <span className="font-medium text-muted-foreground">Método de pago</span>
                </div>
                <div className="font-medium text-foreground flex items-center gap-2">
                  <span className="capitalize px-2 py-0.5 rounded-md bg-muted/60 text-foreground font-semibold">
                    {venta.metodoPago?.toLowerCase() || "Efectivo"}
                  </span>
                  {venta.referencia && (
                    <span className="text-[11px] text-muted-foreground font-mono">
                      (Ref: {venta.referencia})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Productos */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground/70" />
                  <span className="text-xs font-semibold text-foreground">Productos facturados</span>
                </div>
                <span className="text-[11px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border/50">
                  {venta.detalles.length} Item{venta.detalles.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-0.5">
                {venta.detalles.map((d) => (
                  <div
                    key={d.id}
                    className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-card border border-border/60 hover:border-border transition-all duration-150"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="text-xs font-medium text-foreground truncate">{d.producto.nombre}</p>
                      <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        {d.cantidad} un. • {formatCOP(d.precioUnitario)}
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
                <TrendingUp className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                <span className="text-xs font-semibold text-foreground">Total Facturado</span>
              </div>
              <span className="text-lg font-bold text-sky-600 dark:text-sky-400 font-mono tabular-nums">
                {formatCOP(venta.total)}
              </span>
            </div>
          </div>

          {/* -- Footer -- */}
          <div className="px-5 py-3.5 border-t border-border/60 bg-muted/20 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onDescargarPDF(venta.id)}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Descargar PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-medium rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer active:scale-95"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
