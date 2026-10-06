export interface FacturaVentaDTO {
    empresa: {
        nombre: string | null;
        nit?: string | null;
        direccion?: string | null;
        telefono?: string | null;
        correo?: string | null;
        ciudad?: string | null;
        logo?: string | null;
    };

    venta: {
        id: number;
        numeroFactura: string;
        fecha: Date;
        cliente: string | "Consumidor Final";
        vendedor: string
    };

    detalles: {
        producto: string;
        cantidad: number;
        precioUnitario: number;
        subtotal: number;
    }[];

    totales: {
        moneda: "COP",
        subtotal: number;
        descuentos: number;
        impuestos: number;
        total: number;
    };
}