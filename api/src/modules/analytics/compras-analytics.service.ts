import { prisma } from "../../config/prisma";
import { obtenerRangoHoy, obtenerRangoMes } from "../../utils/date";

export const obtenerComprasHoy = async () => {
    const { inicioDia, finDia } = obtenerRangoHoy();
    
    const stats = await prisma.compra.aggregate({
        where: {
            fecha: { gte: inicioDia, lte: finDia },
            activo: true
        },
        _sum: { total: true },
        _count: { id: true }
    });

    return {
        cantidad: stats._count.id,
        gastos: stats._sum.total || 0
    };
};

export const obtenerComprasMes = async () => {
    const { inicioMes, finMes } = obtenerRangoMes();
    
    const stats = await prisma.compra.aggregate({
        where: {
            fecha: { gte: inicioMes, lte: finMes },
            activo: true
        },
        _sum: { total: true },
        _count: { id: true }
    });

    return {
        cantidad: stats._count.id,
        gastos: stats._sum.total || 0
    };
};

export const obtenerTopProveedores = async () => {
    return [];
};

export const obtenerCostoPromedio = async () => {
    return 0;
};
