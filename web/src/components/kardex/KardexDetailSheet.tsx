import { X, Calendar, Package, FileText, User, Truck, Activity, ArrowRight } from "lucide-react";
import { MovimientoKardex } from "@/types/producto";
import KardexBadge from "./KardexBadge";

interface Props {
  movimiento: MovimientoKardex | null;
  onClose: () => void;
}

export default function KardexDetailSheet({ movimiento, onClose }: Props) {
  if (!movimiento) return null;

  let accentGradient = "from-slate-500 to-slate-700";
  let iconColor = "text-slate-500";

  if (movimiento.tipo === "COMPRA")     { accentGradient = "from-emerald-400 to-emerald-600"; iconColor = "text-emerald-500"; }
  if (movimiento.tipo === "VENTA")      { accentGradient = "from-rose-400 to-rose-600";       iconColor = "text-rose-500"; }
  if (movimiento.tipo === "AJUSTE")     { accentGradient = "from-violet-400 to-violet-600";   iconColor = "text-violet-500"; }
  if (movimiento.tipo === "MERMA")      { accentGradient = "from-orange-400 to-orange-600";   iconColor = "text-orange-500"; }
  if (movimiento.tipo === "DEVOLUCION") { accentGradient = "from-blue-400 to-blue-600";       iconColor = "text-blue-500"; }

  const Row = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
    <div className="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-0">
      <Icon className={`h-4 w-4 shrink-0 ${iconColor}`} />
      <span className="text-[11px] font-bold text-muted-foreground uppercase w-24 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-foreground truncate">{value}</span>
    </div>
  );

  return (
    <>
      {/* Backdrop — click fuera cierra */}
      <div
        className="fixed inset-0 bg-background/70 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        {/* Stopropagation para que click dentro no cierre */}
        <div
          className="w-full max-w-md bg-card rounded-2xl border border-border/60 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Barra acento */}
          <div className={`h-1 bg-gradient-to-r ${accentGradient}`} />

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-muted ${iconColor}`}>
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Detalle de Movimiento</p>
                <KardexBadge tipo={movimiento.tipo} className="text-xs px-2.5 py-0.5 mt-0.5" />
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Producto destacado */}
          <div className="px-5 py-4 border-b border-border/40 flex items-center gap-4">
            <div className="p-2.5 bg-muted rounded-xl">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Producto</p>
              <p className="font-extrabold text-foreground text-base leading-tight">{movimiento.productoNombre}</p>
            </div>
          </div>

          {/* Filas de info */}
          <div className="px-5 py-1">
            <Row
              icon={Calendar}
              label="Fecha"
              value={`${new Date(movimiento.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })} · ${new Date(movimiento.fecha).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}`}
            />
            <Row icon={FileText} label="Documento" value={movimiento.documento || "—"} />
            {movimiento.proveedor && <Row icon={Truck} label="Proveedor" value={movimiento.proveedor} />}
            <Row icon={User} label="Usuario" value={movimiento.usuario} />
          </div>

          {/* Stock */}
          <div className="mx-5 mb-5 mt-3 p-4 bg-muted/40 rounded-xl border border-border/40 flex items-center justify-between">
            <div className="text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">Antes</p>
              <span className="text-xl font-bold font-mono text-muted-foreground">{movimiento.stockAnterior}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground/30 mx-3" />
            <div className="text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">Después</p>
              <span className="text-xl font-black font-mono text-foreground">{movimiento.stockNuevo}</span>
            </div>
            <div className={`ml-4 px-4 py-1.5 rounded-full text-base font-black bg-gradient-to-r ${accentGradient} text-white shadow-sm`}>
              {movimiento.cantidad > 0 ? "+" : ""}{movimiento.cantidad}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
