export interface FacturaVentaDTO {
    empresa: {
        nombre: string;
        nit: string;
        direccion: string;
        telefono: string;
        correo: string;
        ciudad: string;
        logo: string | null;
    };

    venta: {
        id: number;
        numeroFactura: string;
        fecha: Date;
        cliente?: string;
        vendedor: string
    };

    detalles: {
        producto: string;
        cantidad: number;
        precioUnitario: number;
        subtotal: number;
    }[];

    totales: {
        subtotal: number;
        descuentos: number;
        impuestos: number;
        total: number;
    };
}