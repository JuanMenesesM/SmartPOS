export interface DetalleVentaDTO {
    productoId: number;
    cantidad: number;
}

export interface CreateVentaDTO {
    productos: DetalleVentaDTO[];
    metodoPago?: "EFECTIVO" | "TRANSFERENCIA";
    referencia?: string;
}

export interface DetalleCalculado {
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    stockAnterior: number;
    stockNuevo: number;
}

export interface FiltrosVentaDTO {
    fechaInicio?: string;
    fechaFin?: string;
    usuarioId?: number;
    empresaId?: number;
}