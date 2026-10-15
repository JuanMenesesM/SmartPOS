export interface DashboardDTO {
    kpis: {
        ventas: number;
        compras: number;
        ganancias: number;
        transacciones: number;
        ventasCount: number;
        comprasCount: number;
        transaccionesHoy: number;
        ventasHoyCount: number;
        comprasHoyCount: number;
        stockBajo: number;
        ventasHoy: number;
        ventasMes: number;
        facturasHoy: number;
    };

    ventasPorDia: {
        fecha: string;
        total: number;
    }[];

    productosMasVendidos: {
        id: number;
        producto: string;
        cantidad: number;
    }[];

    stockCritico: {
        id: number;
        codigo: string;
        nombre: string;
        stock: number;
    }[];

    actividadReciente: {
        fecha: Date;
        usuario: string;
        descripcion: string;
    }[];

}