import { prisma } from "../../config/prisma";
import { CreateProductoDTO } from "./productos.dto";

export const generarSiguienteCodigo = async (): Promise<string> => {
    const ultimo = await prisma.producto.findFirst({
        where: { codigo: { startsWith: "P" } },
        orderBy: { id: "desc" },
        select: { codigo: true }
    });

    if (!ultimo) return "P0001";

    const num = parseInt(ultimo.codigo.replace(/\D/g, ""), 10);
    if (isNaN(num)) return "P0001";
    return `P${String(num + 1).padStart(4, "0")}`;
};

export const crearProducto = async (data: CreateProductoDTO) => {
    const { codigo, nombre, precioVenta, stock } = data;

    if (precioVenta <= 0) {
        throw new Error("El precio debe ser mayor a 0");
    }

    if (stock < 0) {
        throw new Error("El stock no puede ser negativo");
    }

    return await prisma.producto.create({
        data: {
            codigo,
            nombre,
            precioVenta,
            stock,
            activo: true
        },
    });
};

export const getProductos = async () => {
    return await prisma.producto.findMany({
        orderBy: {
            id: "desc"
        }
    });
};

export const listarProductoPorId = async (id: number) => {
    const producto = await prisma.producto.findUnique({
        where: {
            id,
        }
    });

    if (!producto) {
        throw new Error("Producto no encontrado");
    }

    return producto;
};

export const actualizarProducto = async (id: number, data: Partial<CreateProductoDTO & { activo: boolean }>) => {
    const producto = await prisma.producto.findUnique({
        where: {
            id
        }
    });

    if (!producto) {
        throw new Error("Producto no encontrado");
    }

    if (data.precioVenta !== undefined && data.precioVenta <= 0) {
        throw new Error("El precio debe ser mayor a 0");
    }

    if (data.stock !== undefined && data.stock < 0) {
        throw new Error("El stock no puede ser negativo");
    }

    const stockAnterior = producto.stock;

    const actualizado = await prisma.producto.update({
        where: {
            id
        },
        data
    });

    // Si el stock cambió, registrar un movimiento AJUSTE en Kardex
    if (data.stock !== undefined && data.stock !== stockAnterior) {
        const usuario = await prisma.usuario.findFirst({ select: { id: true } });
        await prisma.movimientoInventario.create({
            data: {
                productoId: id,
                usuarioId: usuario?.id ?? 1,
                empresaId: producto.empresaId ?? null,
                tipo: "AJUSTE",
                cantidad: data.stock - stockAnterior,
                stockAnterior,
                stockNuevo: data.stock,
                observacion: "Ajuste manual desde gestión de productos",
            }
        });
    }

    return actualizado;
};

export const toggleEstadoProducto = async (id: number) => {
    const producto = await prisma.producto.findUnique({
        where: {
            id
        }
    });

    if (!producto) {
        throw new Error("Producto no encontrado");
    }

    return await prisma.producto.update({
        where: {
            id
        },
        data: {
            activo: !producto.activo
        }
    });
};

export const desactivarProducto = async (id: number) => {
    return toggleEstadoProducto(id);
};

export const getKardexPorProducto = async (productoId: number) => {
    const producto = await prisma.producto.findUnique({
        where: { id: productoId },
        select: { id: true, codigo: true, nombre: true, stock: true }
    });

    if (!producto) {
        throw new Error("Producto no encontrado");
    }

    const movimientos = await prisma.movimientoInventario.findMany({
        where: { productoId },
        orderBy: { fecha: "desc" },
        take: 15,
        include: {
            usuario: {
                select: { nombre: true, apellido: true }
            }
        }
    });

    return {
        producto,
        movimientos: movimientos.map(m => ({
            id: m.id,
            fecha: m.fecha,
            tipo: m.tipo,
            cantidad: m.cantidad,
            stockAnterior: m.stockAnterior,
            stockNuevo: m.stockNuevo,
            observacion: m.observacion,
            usuario: `${m.usuario.nombre} ${m.usuario.apellido}`
        }))
    };
};