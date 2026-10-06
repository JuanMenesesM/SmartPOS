import { useState } from "react";
import { ExportDropdown } from "@/components/ui/ExportDropdown";
import ModalPortal from "@/components/ui/ModalPortal";
import { Search, Download, Eye, Receipt } from "lucide-react";
import { useVentas } from "@/hooks/useVentas";
import { VentaBackend } from "@/types/venta";

function formatCOP(amount: number): string {
  return `$${new Intl.NumberFormat("es-CO").format(amount)}`;
}

export default function HistorialTab() {
  const { data: ventas = [], isLoading } = useVentas();
  const [busqueda, setBusqueda] = useState("");
  const [ventaDetalle, setVentaDetalle] = useState<VentaBackend | null>(null);

  const handleDescargarPDF = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/ventas/${id}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Error al descargar el PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (e) {
      console.error(e);
      alert("No se pudo generar el PDF");
    }
  };

  const ventasFiltradas = ventas.filter((v) => {
    const q = busqueda.toLowerCase().trim();
    const codigoFac = `fac-${String(v.id).padStart(4, "0")}`.toLowerCase();
    const cliente = `${v.usuario.nombre} ${v.usuario.apellido || ""}`.toLowerCase();
    return !q || codigoFac.includes(q) || cliente.includes(q);
  });

  return (
    <div className="space-y-4">
      {/* Buscador */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar factura o atendido por..."
          className="
            w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-card border border-border
            text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20
            transition-all duration-150
          "
        />
      </div>

      {/* Tabla de Facturas */}
      {isLoading ? (
        <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-muted/60 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : ventasFiltradas.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-10 text-center space-y-2">
          <Receipt className="h-8 w-8 text-muted-foreground mx-auto" />
          <h3 className="text-sm font-bold text-foreground">No hay facturas emitidas</h3>
          <p className="text-xs text-muted-foreground">Las ventas cobradas desde las mesas aparecerán consolidadas aquí.</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-muted/40 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 text-center">Comprobante</th>
                  <th className="py-3 px-3 text-center">Atendido por</th>
                  <th className="py-3 px-3 text-center">Fecha</th>
                  <th className="py-3 px-3 text-center">Total</th>
                  <th className="py-3 px-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {ventasFiltradas.map((v) => (
                  <tr key={v.id} className="hover:bg-accent/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-foreground text-center">
                      FAC-{String(v.id).padStart(4, "0")}
                    </td>
                    <td className="py-3 px-3 font-semibold text-foreground text-center">
                      {v.usuario.nombre} {v.usuario.apellido || ""}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground text-center">
                      {new Date(v.fecha).toLocaleString("es-CO", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-3 font-bold text-foreground text-center">
                      {formatCOP(v.total)}
                    </td>
                    <td className="py-3 px-3 text-center space-x-2">
                      <button
                        onClick={() => setVentaDetalle(v)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-muted hover:bg-accent text-foreground transition-colors"
                      >
                        <Eye className="h-3 w-3 text-blue-500" />
                        Ver detalle
                      </button>
                      <button
                        onClick={() => handleDescargarPDF(v.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-muted hover:bg-accent text-foreground transition-colors"
                      >
                        <Download className="h-3 w-3 text-emerald-500" />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Detalle de Factura Centralizado */}
      {ventaDetalle && (
        <ModalPortal>
        <div className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setVentaDetalle(null)} />
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-6 px-4 pointer-events-none">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col pointer-events-auto">
            {/* Cabecera */}
            <div className="px-4 py-2.5 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-foreground leading-tight">
                    FAC-{String(ventaDetalle.id).padStart(4, "0")}
                  </h2>
                  <p className="text-[11px] text-muted-foreground leading-tight">Comprobante de Venta</p>
                </div>
              </div>
              <button
                onClick={() => setVentaDetalle(null)}
                className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Cuerpo */}
            <div className="p-3.5 space-y-3">
              <div className="grid grid-cols-2 gap-px bg-border rounded-lg overflow-hidden border border-border">
                <div className="bg-card px-3 py-2 space-y-0.5 flex flex-col items-center text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fecha</p>
                  <p className="text-xs font-semibold text-foreground">
                    {new Date(ventaDetalle.fecha).toLocaleDateString("es-CO", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-card px-3 py-2 space-y-0.5 flex flex-col items-center text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Atendido por</p>
                  <p className="text-xs font-semibold text-foreground">
                    {ventaDetalle.usuario.nombre} {ventaDetalle.usuario.apellido || ""}
                  </p>
                </div>
              </div>

              {/* Lista de productos */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Productos ({ventaDetalle.detalles.length})
                </p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {ventaDetalle.detalles.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/60"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{d.producto.nombre}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {d.cantidad} un. x {formatCOP(d.precioUnitario)}
                        </p>
                      </div>
                      <span className="text-xs font-extrabold text-foreground font-mono ml-2 shrink-0">
                        {formatCOP(d.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="p-3 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Facturado</span>
                <span className="text-lg font-extrabold text-primary font-mono">
                  {formatCOP(ventaDetalle.total)}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-border bg-muted/20 flex items-center justify-between shrink-0">
              <button
                onClick={() => handleDescargarPDF(ventaDetalle.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Descargar PDF
              </button>
              <button
                onClick={() => setVentaDetalle(null)}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-muted hover:bg-accent text-foreground transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}
    </div>
  );
}
