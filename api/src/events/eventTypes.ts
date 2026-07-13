export interface VentaCreadaEvent {
    ventaId: number;
    usuarioId: number;
    total: number;
    fecha: Date;
}

export interface CompraCreadaEvent {
    compraId: number;
    usuarioId: number;
    proveedorId: number;
    total: number;
    fecha: Date;
}