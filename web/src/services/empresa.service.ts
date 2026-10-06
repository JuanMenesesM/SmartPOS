import api from "@/lib/axios";
import { Empresa } from "@/types/empresa";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getEmpresa(): Promise<Empresa> {
  const res = await api.get(`/empresa`);
  return res.data;
}

export async function updateEmpresa(id: number, data: Partial<Empresa>): Promise<Empresa> {
  const res = await api.put(`/empresa/${id}`, data);
  return res.data;
}

export async function createEmpresa(data: Partial<Empresa>): Promise<Empresa> {
  const res = await api.post(`/empresa`, data);
  return res.data;
}
