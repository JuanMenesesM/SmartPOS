import axios from "axios";
import { VentaBackend, CreateVentaPayload } from "@/types/venta";

const API_URL = "http://localhost:3000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export async function getVentas(): Promise<VentaBackend[]> {
  const { data } = await axios.get(`${API_URL}/ventas`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function getVentaById(id: number): Promise<VentaBackend> {
  const { data } = await axios.get(`${API_URL}/ventas/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function crearVentaBackend(payload: CreateVentaPayload): Promise<VentaBackend> {
  const { data } = await axios.post(`${API_URL}/ventas/crear`, payload, {
    headers: getAuthHeaders(),
  });
  return data;
}
