import { prisma } from "../../config/prisma";
import { RegistrarMovimientoDTO } from "./movimiento.dto";

export const registrarMovimiento = async (payload: RegistrarMovimientoDTO) => {
    return await prisma.movimientoInventario.create({ data: payload });
};

export const obtenerMovimientos = async () => {
    const movimientos = await prisma.movimientoInventario.findMany({
        include: {
            producto: true,
            usuario: true,
        },
        orderBy: {
            fecha: "desc",
        },
    });

    return movimientos.map((m) => ({
        id: m.id,
        fecha: m.fecha.toISOString(),
        productoNombre: m.producto.nombre,
        tipo: m.tipo,
        documento: m.origenId ? `DOC-${m.origenId}` : `MOV-${m.id}`,
        cantidad: m.cantidad,
        stockAnterior: m.stockAnterior,
        stockNuevo: m.stockNuevo,
        usuario: `${m.usuario.nombre} ${m.usuario.apellido}`.trim(),
        observacion: m.observacion || undefined,
    }));
};

export const obtenerEstadisticasKardex = async () => {
    const total = await prisma.movimientoInventario.count();
    const entradas = await prisma.movimientoInventario.count({
        where: { tipo: "COMPRA" },
    });
    const salidas = await prisma.movimientoInventario.count({
        where: { tipo: "VENTA" },
    });
    const ajustes = await prisma.movimientoInventario.count({
        where: { tipo: "AJUSTE" },
    });

    return { total, entradas, salidas, ajustes };
};