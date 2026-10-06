import { useMemo } from "react";
import { Producto } from "@/types/producto";
import { ExportDropdown as UIExportDropdown } from "@/components/ui/ExportDropdown";

interface Props {
  productos: Producto[];
  disabled: boolean;
}

export default function ExportDropdown({ productos, disabled }: Props) {
  const headers = ["Código", "Producto", "Precio Venta (COP)", "Stock", "Estado"];

  const rows = useMemo(() => {
    return productos.map((p) => [
      p.codigo,
      p.nombre,
      `$${new Intl.NumberFormat("es-CO").format(p.precioVenta)}`,
      p.stock,
      p.activo ? "Activo" : "Inactivo",
    ]);
  }, [productos]);

  return (
    <UIExportDropdown
      title="Catálogo General de Productos"
      filename="catalogo_productos"
      headers={headers}
      rows={rows}
      disabled={disabled}
    />
  );
}
