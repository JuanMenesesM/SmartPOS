import axios from "axios";
import { MovimientoKardex } from "@/types/producto";

const API_URL = "http://localhost:3000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getKardexMovimientos(): Promise<MovimientoKardex[]> {
  try {
    const res = await axios.get(`${API_URL}/movimientos-inventario`, {
      headers: getAuthHeaders(),
    });
    if (Array.isArray(res.data)) {
      return res.data;
    }
  } catch (error) {
    console.error("Backend movimientos API error:", error);
  }
  return [];
}

export async function getKardexStats() {
  try {
    const res = await axios.get(`${API_URL}/movimientos-inventario/stats`, {
      headers: getAuthHeaders(),
    });
    if (res.data && typeof res.data.total === "number") {
      return res.data;
    }
  } catch (error) {
    console.error("Backend movimientos stats API error:", error);
  }
  return {
    total: 0,
    entradas: 0,
    salidas: 0,
    ajustes: 0,
  };
}

export async function crearMovimiento(payload: {
  productoId: number;
  usuarioId: number;
  tipo: "COMPRA" | "VENTA" | "AJUSTE" | "MERMA" | "DEVOLUCION" | "ELIMINACION";
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  observacion?: string;
}) {
  const { data } = await axios.post(`${API_URL}/movimientos-inventario`, payload, {
    headers: getAuthHeaders(),
  });
  return data;
}
