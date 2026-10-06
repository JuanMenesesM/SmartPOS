export interface ContextoIA {
    empresa: {
        nombre: string;
        ciudad: string;
    };

    ventasHoy: {
        cantidad: number;
        ingresos: number;
    };

    ventasMes: {
        cantidad: number;
        ingresos: number;
    };

    comprasMes: {
        cantidad: number;
        gastos: number;
    };

    ticketPromedio: number;

    topProductos: {
        producto: string;
        cantidadVendida: number;
    }[];

    stockCritico: {
        nombre: string;
        stock: number;
    }[];
}