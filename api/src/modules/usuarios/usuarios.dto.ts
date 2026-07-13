export interface CreateUsuarioDTO {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  rolId: number;
}

export interface UpdateUsuarioDTO {
  nombre?: string;
  apellido?: string;
  correo?: string;
  rolId?: number;
}