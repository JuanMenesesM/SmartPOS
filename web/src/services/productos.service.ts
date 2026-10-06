import axios from "axios";
import {
  Producto,
  CreateProductoInput,
  UpdateProductoInput,
  ProductoKardexResponse,
} from "@/types/producto";

const API_URL = "http://localhost:3000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export async function getProductos(): Promise<Producto[]> {
  const { data } = await axios.get(`${API_URL}/productos`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function getProductoById(id: number): Promise<Producto> {
  const { data } = await axios.get(`${API_URL}/productos/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function crearProducto(payload: CreateProductoInput): Promise<Producto> {
  const { data } = await axios.post(`${API_URL}/productos/crear`, payload, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function actualizarProducto(
  id: number,
  payload: UpdateProductoInput
): Promise<Producto> {
  const { data } = await axios.put(
    `${API_URL}/productos/actualizar/${id}`,
    payload,
    {
      headers: getAuthHeaders(),
    }
  );
  return data;
}

export async function toggleEstadoProducto(id: number): Promise<Producto> {
  const { data } = await axios.patch(
    `${API_URL}/productos/toggle/${id}`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
  return data;
}

export async function getKardexProducto(id: number): Promise<ProductoKardexResponse> {
  const { data } = await axios.get(`${API_URL}/productos/${id}/kardex`, {
    headers: getAuthHeaders(),
  });
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
