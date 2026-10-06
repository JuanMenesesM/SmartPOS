export interface DashboardDTO {
    kpis: {
        ventasHoy: number;
        ventasMes: number;
        facturasHoy: number;
        stockBajo: number;
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