import axios from "axios";

const API_URL = "http://localhost:3000";

export interface LoginPayload {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  message: string;
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    rolId: number;
    empresaId: number | null;
    licenciaActiva: boolean;
  };
  token: string;
}

/** Devuelve el usuario guardado en localStorage */
export function getUsuario(): LoginResponse['usuario'] | null {
  try {
    const raw = localStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Retorna true si el usuario logueado es Super Admin (rolId = 1) */
export function isSuperAdmin(): boolean {
  const u = getUsuario();
  return u?.rolId === 1;
}

export async function loginService(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await axios.post<LoginResponse>(`${API_URL}/auth/login`, payload);
  return data;
}

/** Guarda token y usuario en localStorage */
export function persistAuth(res: LoginResponse) {
  localStorage.setItem("token", res.token);
  localStorage.setItem("usuario", JSON.stringify(res.usuario));
}

/** Limpia la sesión */
export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

/** Verifica si hay token */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("token");
}
