import { useState, useMemo } from "react";
import { Plus, Package } from "lucide-react";
import {
  useProductos,
  useCrearProducto,
  useActualizarProducto,
  useToggleEstadoProducto,
} from "@/hooks/useProductos";
import {
  Producto,
  FiltroEstado,
  FiltroStock,
  CreateProductoInput,
} from "@/types/producto";
import ExportDropdown from "@/components/productos/ExportDropdown";
import ProductoFilters from "@/components/productos/ProductoFilters";
import ProductosTable from "@/components/productos/ProductosTable";
import ProductoModal from "@/components/productos/ProductoModal";
import ProductoKardexModal from "@/components/productos/ProductoKardexModal";

export default function ProductosPage() {
  const { data: productos = [], isLoading } = useProductos();
  const crearMutation = useCrearProducto();
  const actualizarMutation = useActualizarProducto();
  const toggleMutation = useToggleEstadoProducto();

  // Estados de Filtro
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState<FiltroEstado>("todos");
  const [stock, setStock] = useState<FiltroStock>("todos");

  // Estados de Modales
  const [modalOpen, setModalOpen] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  const [modoDuplicar, setModoDuplicar] = useState(false);

  const [kardexProducto, setKardexProducto] = useState<Producto | null>(null);

  // ── Lógica de Filtrado ───────────────────────────────────────────────────────
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      // 1. Busqueda por texto (nombre o codigo)
      const query = busqueda.toLowerCase().trim();
      const coincideTexto =
        !query ||
        p.nombre.toLowerCase().includes(query) ||
        p.codigo.toLowerCase().includes(query);

      if (!coincideTexto) return false;

      // 2. Filtro por Estado
      if (estado === "activo" && !p.activo) return false;
      if (estado === "inactivo" && p.activo) return false;

      // 3. Filtro por Stock
      if (stock === "sinstock" && p.stock !== 0) return false;
      if (stock === "bajo" && (p.stock < 1 || p.stock > 5)) return false;

      return true;
    });
  }, [productos, busqueda, estado, stock]);

  // ── Manejadores de Modales ───────────────────────────────────────────────────
  const handleNuevo = () => {
    setProductoEditar(null);
    setModoDuplicar(false);
    setModalOpen(true);
  };

  const handleEditar = (p: Producto) => {
    setProductoEditar(p);
    setModoDuplicar(false);
    setModalOpen(true);
  };

  const handleDuplicar = (p: Producto) => {
    setProductoEditar(p);
    setModoDuplicar(true);
    setModalOpen(true);
  };

  const handleVerKardex = (p: Producto) => {
    setKardexProducto(p);
  };

  const handleToggleEstado = async (p: Producto) => {
    await toggleMutation.mutateAsync(p.id);
  };

  const handleGuardarProducto = async (data: CreateProductoInput) => {
    if (productoEditar && !modoDuplicar) {
      await actualizarMutation.mutateAsync({
        id: productoEditar.id,
        payload: data,
      });
    } else {
      await crearMutation.mutateAsync(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Encabezado Limpio ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent mt-0.5 shrink-0" />

          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Productos
            </h1>

            <div className="inline-flex items-center gap-1.5 bg-muted/60 border border-border rounded-lg px-2.5 py-1">
              <Package className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-muted-foreground">
                Gestiona productos, precios e inventario.
              </span>
            </div>
          </div>
        </div>

        {/* Únicamente dos botones arriba */}
        <div className="flex items-center gap-2.5 mt-0.5">
          <ExportDropdown
            productos={productosFiltrados}
            disabled={productosFiltrados.length === 0}
          />

          <button
            onClick={handleNuevo}
            className="
              flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold
              bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20
              active:scale-[0.98] transition-all duration-150
            "
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* ── Filtros en una sola línea ──────────────────────────────────────── */}
      <ProductoFilters
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        estado={estado}
        onEstadoChange={setEstado}
        stock={stock}
        onStockChange={setStock}
      />

      {/* ── Plural Inteligente (Estilo Notion / Stripe) ───────────────────────── */}
      {!isLoading && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1 -mb-3">
          <span>
            <strong className="text-foreground font-semibold">
              {productosFiltrados.length}
            </strong>{" "}
            {productosFiltrados.length === 1
              ? "producto encontrado"
              : "productos encontrados"}
          </span>
        </div>
      )}

      {/* ── Tabla de Productos ──────────────────────────────────────────────── */}
      <ProductosTable
        productos={productosFiltrados}
        isLoading={isLoading}
        onNuevoProducto={handleNuevo}
        onEditar={handleEditar}
        onDuplicar={handleDuplicar}
        onVerKardex={handleVerKardex}
        onToggleEstado={handleToggleEstado}
      />

      {/* ── Modales ────────────────────────────────────────────────────────── */}
      <ProductoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        productoEditar={productoEditar}
        modoDuplicar={modoDuplicar}
        onSubmit={handleGuardarProducto}
        isSubmitting={crearMutation.isPending || actualizarMutation.isPending}
      />

      <ProductoKardexModal
        producto={kardexProducto}
        onClose={() => setKardexProducto(null)}
      />
    </div>
  );
}
