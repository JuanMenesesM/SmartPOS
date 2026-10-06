import { useState } from "react";
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

      {/* Modal Detalle de Factura */}
      {ventaDetalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div>
                <h2 className="text-base font-extrabold text-foreground">
                  Comprobante FAC-{String(ventaDetalle.id).padStart(4, "0")}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {new Date(ventaDetalle.fecha).toLocaleString("es-CO")}
                </p>
              </div>
              <button
                onClick={() => setVentaDetalle(null)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-muted hover:bg-accent text-foreground"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ítems comprados</p>
              {ventaDetalle.detalles.map((d) => (
                <div key={d.id} className="flex justify-between items-center text-xs py-1 border-b border-border/40">
                  <div>
                    <p className="font-semibold text-foreground">{d.producto.nombre}</p>
                    <p className="text-[10px] text-muted-foreground">{d.cantidad} x {formatCOP(d.precioUnitario)}</p>
                  </div>
                  <span className="font-mono font-bold text-foreground">{formatCOP(d.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 flex justify-between items-center text-sm font-extrabold">
              <span>Total Facturado</span>
              <span className="font-mono text-base text-primary">{formatCOP(ventaDetalle.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
