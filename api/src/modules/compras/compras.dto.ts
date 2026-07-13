export interface DetalleCompraDTO {
    productoId: number;
    cantidad: number;
    precioCompra: number;
}

export interface CreateCompraDTO {
    proveedorId: number;
    productos: DetalleCompraDTO[];
}

export interface DetalleCompraCalculado {
    productoId: number;
    cantidad: number;
    precioCompra: number;
    subtotal: number;
}

export interface FiltrosCompraDTO {
    fechaInicio?: string;
    fechaFin?: string;
    proveedorId?: number;
    usuarioId?: number;
}
