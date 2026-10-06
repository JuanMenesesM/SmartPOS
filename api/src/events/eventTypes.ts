export interface VentaCreadaEvent {
    ventaId: number;
    usuarioId: number;
    total: number;
    fecha: Date;

    productos: {
        productoId: number;
        cantidad: number;
        precioUnitario: number;
        subtotal: number;
        stockAnterior: number;
        stockNuevo: number;
    }[];
}

export interface CompraCreadaEvent {
    compraId: number;
    usuarioId: number;
    proveedorId: number;
    total: number;
    fecha: Date;
}
