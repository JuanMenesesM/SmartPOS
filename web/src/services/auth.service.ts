import axios from "axios";

const API_URL = "http://localhost:3000";

export interface LoginPayload {
  correo: string;
  contrasena: string;
}

export interface ModulosConfig {
  pos?: boolean;
  inventario?: boolean;
  compras?: boolean;
  kardex?: boolean;
  auditoria?: boolean;
  whatsapp?: boolean;
  ia?: boolean;
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
    empresaNombre?: string;
    licenciaActiva: boolean;
    modulos?: ModulosConfig;
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

/** Retorna true si la empresa del usuario tiene contratado el módulo */
export function hasModule(moduleKey: keyof ModulosConfig): boolean {
  const u = getUsuario();
  if (!u) return false;
  if (!u.modulos) return moduleKey !== "whatsapp" && moduleKey !== "ia";
  return u.modulos[moduleKey] === true;
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

/** Decodifica el payload del JWT sin verificar firma */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/** Verifica si hay token y que no haya expirado */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem("token");
  if (!token) return false;

  const payload = decodeJwtPayload(token);
  if (!payload) {
    // Token malformado → limpiar
    clearAuth();
    return false;
  }

  const exp = payload["exp"] as number | undefined;
  if (exp && Date.now() / 1000 > exp) {
    // Token expirado → limpiar
    clearAuth();
    return false;
  }

  return true;
}
