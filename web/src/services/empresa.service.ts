import axios from "axios";
import { Empresa } from "@/types/empresa";

const API_URL = "http://localhost:3000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getEmpresa(): Promise<Empresa> {
  const res = await axios.get(`${API_URL}/empresa`, { headers: getAuthHeaders() });
  return res.data;
}

export async function updateEmpresa(id: number, data: Partial<Empresa>): Promise<Empresa> {
  const res = await axios.put(`${API_URL}/empresa/${id}`, data, { headers: getAuthHeaders() });
  return res.data;
}

export async function createEmpresa(data: Partial<Empresa>): Promise<Empresa> {
  const res = await axios.post(`${API_URL}/empresa`, data, { headers: getAuthHeaders() });
  return res.data;
}
