import { prisma } from "../../config/prisma";

export const obtenerStockCritico = async () => {
    const productos = await prisma.producto.findMany({
        where: {
            activo: true,
            stock: { lte: 5 }
        },
        select: {
            id: true,
            nombre: true,
            stock: true
        }
    });

    return {
        cantidad: productos.length,
        productos
    };
};

export const obtenerProductosSinStock = async () => {
    return await prisma.producto.count({
        where: {
            activo: true,
            stock: { lte: 0 }
        }
    });
}

export const obtenerValorInventario = async () => {
    return [];
}

export const obtenerCantidadProductosActivos = async () => {
    return await prisma.producto.count({
        where: {
            activo: true
        }
    });
};

export const obtenerSinMovimiento = async () => {
    return [];
};

export const obtenerMasVendidos = async () => {
    return [];
};

export const obtenerMenosVendidos = async () => {
    return [];
};
