import axios from "axios";

const API_URL = "http://localhost:3000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Tipos ──────────────────────────────────────────────────────────────────────

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  rolId: number;
  activo: boolean;
  rol?: {
    id: number;
    nombre: string;
  };
}

export interface CreateUsuarioPayload {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  rolId: number;
}

export interface UpdateUsuarioPayload {
  nombre?: string;
  apellido?: string;
  correo?: string;
  contrasena?: string;
  rolId?: number;
}

// ── Funciones del Servicio ─────────────────────────────────────────────────────

export async function getUsuarios(): Promise<Usuario[]> {
  const { data } = await axios.get(`${API_URL}/usuarios`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function getUsuarioById(id: number): Promise<Usuario> {
  const { data } = await axios.get(`${API_URL}/usuarios/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function crearUsuario(payload: CreateUsuarioPayload): Promise<{ message: string }> {
  const { data } = await axios.post(`${API_URL}/usuarios/crear`, payload, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function actualizarUsuario(id: number, payload: UpdateUsuarioPayload): Promise<{ message: string }> {
  const { data } = await axios.put(`${API_URL}/usuarios/${id}`, payload, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function desactivarUsuario(id: number): Promise<{ message: string }> {
  const { data } = await axios.put(`${API_URL}/usuarios/desactivar/${id}`, {}, {
    headers: getAuthHeaders(),
  });
  return data;
}
