import { useState, useMemo } from "react";
import { Store, Plus, Truck } from "lucide-react";
import { useCompras, useProveedores } from "@/hooks/useCompras";
import { FormularioCompra } from "@/components/compras/FormularioCompra";
import ComprasTable from "@/components/compras/ComprasTable";
import ComprasFilters from "@/components/compras/ComprasFilters";
import CompraDetalleModal from "@/components/compras/CompraDetalleModal";
import ProveedorModal from "@/components/compras/ProveedorModal";
import { ExportDropdown } from "@/components/ui/ExportDropdown";
import { formatCOP } from "@/utils/formatCOP";

export default function ComprasPage() {
  const [vista, setVista] = useState<"lista" | "crear">("lista");
  const [compraDetalle, setCompraDetalle] = useState<any | null>(null);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [proveedorFiltro, setProveedorFiltro] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  // Datos
  const { data: compras = [], isLoading } = useCompras({
    proveedorId: proveedorFiltro ? Number(proveedorFiltro) : undefined,
    fechaInicio: fechaDesde || undefined,
    fechaFin: fechaHasta || undefined,
  });
  const { data: proveedores = [] } = useProveedores();

  // Filtrado local por búsqueda de texto
  const comprasFiltradas = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return compras;
    return compras.filter((c: any) => {
      const factura = `fc-${String(c.id).padStart(4, "0")}`;
      const proveedor = c.proveedor.nombre.toLowerCase();
      const usuario = `${c.usuario.nombre} ${c.usuario.apellido || ""}`.toLowerCase();
      return factura.includes(q) || proveedor.includes(q) || usuario.includes(q);
    });
  }, [compras, busqueda]);

  const comprasExportHeaders = ["Factura", "Fecha", "Proveedor", "Productos", "Total (COP)", "Atendido Por"];
  const comprasExportRows = useMemo(() => {
    return comprasFiltradas.map((c: any) => [
      `FC-${String(c.id).padStart(4, "0")}`,
      new Date(c.fecha).toLocaleDateString("es-CO"),
      c.proveedor?.nombre || "N/A",
      c.detalles?.map((d: any) => `${d.producto?.nombre} (${d.cantidad} un)`).join("; ") || "",
      formatCOP(c.total),
      `${c.usuario?.nombre || ""} ${c.usuario?.apellido || ""}`.trim(),
    ]);
  }, [comprasFiltradas]);

  if (vista === "crear") {
    return <FormularioCompra onBack={() => setVista("lista")} />;
  }

  return (
    <div className="space-y-6">
      {/* ── Encabezado ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Compras
            </h1>
            <div className="inline-flex items-center gap-1.5 bg-muted/60 border border-border rounded-lg px-2.5 py-1">
              <Store className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-muted-foreground">
                Gestiona el ingreso de mercancía y el abastecimiento del inventario.
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 mt-0.5">
          <ExportDropdown
            title="Reporte General de Compras"
            filename="compras"
            headers={comprasExportHeaders}
            rows={comprasExportRows}
          />

          <button
            id="nueva-compra-btn"
            onClick={() => setVista("crear")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 active:scale-[0.98] transition-all duration-150"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Compra</span>
          </button>
        </div>
      </div>

      {/* ── Filtros ────────────────────────────────────────────────────────── */}
      <ComprasFilters
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        proveedorId={proveedorFiltro}
        onProveedorChange={setProveedorFiltro}
        fechaDesde={fechaDesde}
        onFechaDesdeChange={setFechaDesde}
        fechaHasta={fechaHasta}
        onFechaHastaChange={setFechaHasta}
        proveedores={proveedores}
      />

      {/* ── Contador ───────────────────────────────────────────────────────── */}
      {!isLoading && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1 -mb-3">
          <span>
            <strong className="text-foreground font-semibold">{comprasFiltradas.length}</strong>{" "}
            {comprasFiltradas.length === 1 ? "compra encontrada" : "compras encontradas"}
          </span>
        </div>
      )}

      {/* ── Tabla ─────────────────────────────────────────────────────────── */}
      <ComprasTable
        compras={comprasFiltradas}
        isLoading={isLoading}
        onNuevaCompra={() => setVista("crear")}
        onVerDetalle={(c) => setCompraDetalle(c)}
      />

      {/* ── Modal de Detalle ───────────────────────────────────────────────── */}
      <CompraDetalleModal
        compra={compraDetalle}
        onClose={() => setCompraDetalle(null)}
      />
    </div>
  );
}