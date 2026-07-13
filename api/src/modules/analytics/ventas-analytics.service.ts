import { prisma } from "../../config/prisma";
import { obtenerRangoHoy, obtenerRangoMes } from "../../utils/date";

export const obtenerVentasHoy = async () => {
    const { inicioDia, finDia } = obtenerRangoHoy();
    
    const stats = await prisma.venta.aggregate({
        where: {
            fecha: { gte: inicioDia, lte: finDia },
            activo: true
        },
        _sum: { total: true },
        _count: { id: true }
    });

    return {
        cantidad: stats._count.id,
        ingresos: stats._sum.total || 0
    };
};

export const obtenerVentasMes = async () => {
    const { inicioMes, finMes } = obtenerRangoMes();
    
    const stats = await prisma.venta.aggregate({
        where: {
            fecha: { gte: inicioMes, lte: finMes },
            activo: true
        },
        _sum: { total: true },
        _count: { id: true }
    });

    return {
        cantidad: stats._count.id,
        ingresos: stats._sum.total || 0
    };
};

export const obtenerTopProductos = async (limite: number = 5) => {
    // Paso 1: Agrupar por productoId y sumar cantidad en DetalleVenta
    const agrupado = await prisma.detalleVenta.groupBy({
        by: ['productoId'],
        _sum: {
            cantidad: true
        },
        orderBy: {
            _sum: {
                cantidad: 'desc'
            }
        },
        take: limite
    });

    if (agrupado.length === 0) {
        return [];
    }

    // Paso 2: Obtener nombres e instanciar el Mapa inmediatamente
    const productoIds = agrupado.map(item => item.productoId);
    const productosMap = new Map(
        (
            await prisma.producto.findMany({
                where: { id: { in: productoIds } },
                select: { id: true, nombre: true }
            })
        ).map(p => [p.id, p.nombre])
    );

    // Paso 3: Unir ambas listas en memoria y retornar el formato requerido
    return agrupado.map(item => ({
        productoId: item.productoId,
        producto: productosMap.get(item.productoId) || "Producto Desconocido",
        cantidadVendida: item._sum.cantidad || 0
    }));
};

export const obtenerTicketPromedio = async () => {
    const {inicioDia, finDia} = obtenerRangoHoy();
    const ticketPromedio = await prisma.venta.aggregate({
        where: {
            fecha: { gte: inicioDia, lte: finDia },
            activo: true
        },
        _avg: {
            total: true
        }
    });
    return ticketPromedio._avg.total || 0;
};

export const obtenerVentasPorHora = async () => {
    const {inicioDia, finDia} = obtenerRangoHoy();
    const ventasPorHora = await prisma.venta.groupBy({
        by: ['fecha'],
        where: {
            fecha: { gte: inicioDia, lte: finDia },
            activo: true
        },
        _sum: {
            total: true
        }
    });
    return ventasPorHora.map(item => ({
        fecha: item.fecha,
        total: item._sum.total || 0
    }));
};
