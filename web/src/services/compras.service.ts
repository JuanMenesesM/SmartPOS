import axios from "axios";

const API_URL = "http://localhost:3000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

// ── Tipos ──────────────────────────────────────────────────────────────────────

export interface Proveedor {
  id: number;
  nombre: string;
  nit?: string;
  telefono?: string;
  activo?: boolean;
}

export interface ProductoCatalogo {
  id: number;
  nombre: string;
  codigo: string;
  precioVenta: number;
  stock: number;
}

export interface DetalleCompra {
  id: number;
  productoId: number;
  cantidad: number;
  precioCompra: number;
  subtotal: number;
  producto: {
    id: number;
    nombre: string;
    codigo: string;
  };
}

export interface CompraAPI {
  id: number;
  fecha: string;
  total: number;
  activo: boolean;
  usuario: {
    nombre: string;
    correo: string;
    apellido?: string;
  };
  proveedor: {
    nombre: string;
    nit: string | null;
  };
  detalles: DetalleCompra[];
}

export interface CreateCompraPayload {
  proveedorId: number;
  productos: {
    productoId: number;
    cantidad: number;
    precioCompra: number;
  }[];
}

// ── Funciones del Servicio ─────────────────────────────────────────────────────

export async function getCompras(filtros?: {
  fechaInicio?: string;
  fechaFin?: string;
  proveedorId?: number;
}): Promise<CompraAPI[]> {
  const params = new URLSearchParams();
  if (filtros?.fechaInicio) params.append("fechaInicio", filtros.fechaInicio);
  if (filtros?.fechaFin) params.append("fechaFin", filtros.fechaFin);
  if (filtros?.proveedorId) params.append("proveedorId", String(filtros.proveedorId));

  const { data } = await axios.get(`${API_URL}/compras?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function getCompraById(id: number): Promise<CompraAPI> {
  const { data } = await axios.get(`${API_URL}/compras/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function crearCompra(payload: CreateCompraPayload): Promise<{ message: string; compra: CompraAPI }> {
  const { data } = await axios.post(`${API_URL}/compras/crear`, payload, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function getProveedores(): Promise<Proveedor[]> {
  const { data } = await axios.get(`${API_URL}/proveedores`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function getProductosCatalogo(): Promise<ProductoCatalogo[]> {
  const { data } = await axios.get(`${API_URL}/productos`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function getProductosPorProveedor(proveedorId: number): Promise<ProductoCatalogo[]> {
  const { data } = await axios.get(`${API_URL}/compras/productos/por-proveedor/${proveedorId}`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function anularCompra(id: number): Promise<void> {
  await axios.put(`${API_URL}/compras/${id}/anular`, {}, {
    headers: getAuthHeaders(),
  });
}

// ── Exportación CSV ────────────────────────────────────────────────────────────

export function exportarComprasCSV(compras: CompraAPI[]) {
  const headers = ["Factura", "Fecha", "Proveedor", "Productos", "Total", "Usuario"];
  const rows = compras.map((c) => [
    `"FC-${String(c.id).padStart(4, "0")}"`,
    `"${new Date(c.fecha).toLocaleDateString("es-CO")}"`,
    `"${c.proveedor.nombre}"`,
    c.detalles.length,
    c.total,
    `"${c.usuario.nombre} ${c.usuario.apellido || ""}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8,\uFEFF" +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `compras_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
