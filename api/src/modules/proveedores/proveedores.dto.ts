export interface CreateProveedorDTO {
    nombre: string;
    nit?: string;
    telefono?: string;
    correo?: string;
    direccion?: string;
}

export interface UpdateProveedorDTO {
    nombre?: string;
    nit?: string;
    telefono?: string;
    correo?: string;
    direccion?: string;
    activo?: boolean;
}
