import api from "@/lib/axios";
import { VentaBackend, CreateVentaPayload } from "@/types/venta";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export async function getVentas(): Promise<VentaBackend[]> {
  const { data } = await api.get(`/ventas`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function getVentaById(id: number): Promise<VentaBackend> {
  const { data } = await api.get(`/ventas/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function crearVentaBackend(payload: CreateVentaPayload): Promise<VentaBackend> {
  const { data } = await api.post(`/ventas/crear`, payload, {
    headers: getAuthHeaders(),
  });
  return data;
}
