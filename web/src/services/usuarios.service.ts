import api from "@/lib/axios";

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
  const { data } = await api.get(`/usuarios`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function getUsuarioById(id: number): Promise<Usuario> {
  const { data } = await api.get(`/usuarios/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function crearUsuario(payload: CreateUsuarioPayload): Promise<{ message: string }> {
  const { data } = await api.post(`/usuarios/crear`, payload, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function actualizarUsuario(id: number, payload: UpdateUsuarioPayload): Promise<{ message: string }> {
  const { data } = await api.put(`/usuarios/${id}`, payload, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function desactivarUsuario(id: number): Promise<{ message: string }> {
  const { data } = await api.put(`/usuarios/desactivar/${id}`, {}, {
    headers: getAuthHeaders(),
  });
  return data;
}
