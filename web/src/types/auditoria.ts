// ── Tipos para el módulo de Auditoría ────────────────────────────────────────

export type AccionAuditoria =
  | "CREAR"
  | "EDITAR"
  | "ELIMINAR"
  | "LOGIN"
  | "LOGOUT"
  | "EXPORTAR";

export type ModuloAuditoria =
  | "Productos"
  | "Ventas"
  | "Compras"
  | "Usuarios"
  | "Empresa"
  | "Dashboard"
  | "Configuracion";

export interface EventoAuditoria {
  id: number;
  fecha: string;
  usuarioNombre: string;
  usuarioId: number;
  modulo: ModuloAuditoria;
  accion: AccionAuditoria;
  descripcion: string;
  datosAnteriores?: Record<string, unknown> | null;
  datosNuevos?: Record<string, unknown> | null;
  ip?: string;
  navegador?: string;
}

export interface AuditoriaStats {
  eventosHoy: number;
  usuariosActivos: number;
  productosModificados: number;
  ventasRegistradas: number;
}
