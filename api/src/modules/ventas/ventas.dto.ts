export interface DetalleVentaDTO {
    productoId: number;
    cantidad: number;
}

export interface CreateVentaDTO {
    productos: DetalleVentaDTO[];
}

export interface DetalleCalculado {
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export interface FiltrosVentaDTO {
    fechaInicio?: string;
    fechaFin?: string;
    usuarioId?: number;
}