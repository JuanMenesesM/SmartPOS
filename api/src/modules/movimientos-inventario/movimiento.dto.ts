export interface RegistrarMovimientoDTO {
    productoId: number;
    usuarioId: number;
    tipo: "COMPRA" | "VENTA" | "AJUSTE" | "MERMA" | "DEVOLUCION" | "ELIMINACION";
    cantidad: number;
    stockAnterior: number;
    stockNuevo: number;
    origenId?: number;
    observacion?: string;
}