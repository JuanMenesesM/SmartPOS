import { useState, useMemo } from "react";
import { Store, Plus, Download, ChevronDown, FileSpreadsheet, FileCode, FileText } from "lucide-react";
import { useCompras, useProveedores } from "@/hooks/useCompras";
import { CompraAPI, exportarComprasCSV } from "@/services/compras.service";
import { FormularioCompra } from "@/components/compras/FormularioCompra";
import ComprasTable from "@/components/compras/ComprasTable";
import ComprasFilters from "@/components/compras/ComprasFilters";
import CompraDetalleModal from "@/components/compras/CompraDetalleModal";
import { useRef, useEffect } from "react";

// ── Export Dropdown Interno ────────────────────────────────────────────────────
function ExportarComprasDropdown({ compras, disabled }: { compras: CompraAPI[]; disabled: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        id="exportar-compras-btn"
        onClick={() => setOpen((p) => !p)}
        disabled={disabled}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all duration-200 select-none ${
          disabled
            ? "opacity-40 cursor-not-allowed bg-card border-border text-foreground"
            : open
            ? "bg-emerald-600 text-white border-transparent shadow-sm"
            : "bg-emerald-500 text-white border-transparent hover:bg-emerald-600 shadow-sm"
        }`}
      >
        <Download className="h-3.5 w-3.5" />
        <span>Exportar</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 z-50 bg-card border border-border rounded-2xl shadow-xl p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Formato
          </div>
          <button
            onClick={() => { setOpen(false); exportarComprasCSV(compras); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-accent transition-colors text-left"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
            Excel (.xlsx)
          </button>
          <button
            onClick={() => { setOpen(false); exportarComprasCSV(compras); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-accent transition-colors text-left"
          >
            <FileCode className="h-3.5 w-3.5 text-blue-500" />
            CSV (.csv)
          </button>
          <button
            onClick={() => { setOpen(false); window.print(); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-accent transition-colors text-left"
          >
            <FileText className="h-3.5 w-3.5 text-red-500" />
            PDF (.pdf)
          </button>
        </div>
      )}
    </div>
  );
}

// ── Página Principal ───────────────────────────────────────────────────────────
export default function ComprasPage() {
  const [vista, setVista] = useState<"lista" | "crear">("lista");
  const [compraDetalle, setCompraDetalle] = useState<CompraAPI | null>(null);

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
    return compras.filter((c) => {
      const factura = `fc-${String(c.id).padStart(4, "0")}`;
      const proveedor = c.proveedor.nombre.toLowerCase();
      const usuario = `${c.usuario.nombre} ${c.usuario.apellido || ""}`.toLowerCase();
      return factura.includes(q) || proveedor.includes(q) || usuario.includes(q);
    });
  }, [compras, busqueda]);

  // Si el usuario quiere crear una compra, mostramos el formulario completo
  if (vista === "crear") {
    return (
      <FormularioCompra
        onBack={() => setVista("lista")}
      />
    );
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
          <ExportarComprasDropdown
            compras={comprasFiltradas}
            disabled={comprasFiltradas.length === 0}
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