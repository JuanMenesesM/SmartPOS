import api from "@/lib/axios";
import {
  Producto,
  CreateProductoInput,
  UpdateProductoInput,
  ProductoKardexResponse,
} from "@/types/producto";

export async function getSiguienteCodigo(): Promise<string> {
  const { data } = await api.get("/productos/siguiente-codigo");
  return data.codigo;
}

export async function getProductos(): Promise<Producto[]> {
  const { data } = await api.get("/productos");
  return data;
}

export async function getProductoById(id: number): Promise<Producto> {
  const { data } = await api.get(`/productos/${id}`);
  return data;
}

export async function crearProducto(payload: CreateProductoInput): Promise<Producto> {
  const { data } = await api.post("/productos/crear", payload);
  return data;
}

export async function actualizarProducto(
  id: number,
  payload: UpdateProductoInput
): Promise<Producto> {
  const { data } = await api.put(`/productos/actualizar/${id}`, payload);
  return data;
}

export async function toggleEstadoProducto(id: number): Promise<Producto> {
  const { data } = await api.patch(`/productos/toggle/${id}`, {});
  return data;
}

export async function getKardexProducto(id: number): Promise<ProductoKardexResponse> {
  const { data } = await api.get(`/productos/${id}/kardex`);
  return data;
}

export function exportarProductosCSV(productos: Producto[]) {
  const headers = ["Código", "Producto", "Precio Venta (COP)", "Stock", "Estado"];
  const rows = productos.map((p) => [
    `"${p.codigo}"`,
    `"${p.nombre.replace(/"/g, '""')}"`,
    p.precioVenta,
    p.stock,
    p.activo ? "Activo" : "Inactivo",
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8,\uFEFF" +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `catalogo_productos_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
