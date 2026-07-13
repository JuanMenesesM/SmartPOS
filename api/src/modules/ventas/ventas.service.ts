import { CreateVentaDTO, DetalleCalculado, FiltrosVentaDTO } from "./ventas.dto";
import { prisma } from "../../config/prisma";
import { eventBus } from "../../events/eventBus";
import { Events } from "../../events/eventNames";
import type { VentaCreadaEvent } from "../../events/eventTypes";

export const crearVenta = async (data: CreateVentaDTO, usuarioId: number) => {
    const { productos } = data;

    if (!productos || productos.length === 0) {
        throw new Error("Debe incluir al menos un producto");
    }

    let total = 0;
    const detallesVenta: DetalleCalculado[] = [];

    productos.forEach(prod => {
        if (prod.cantidad <= 0) {
            throw new Error("La cantidad de cada producto debe ser mayor a 0");
        }
    });

    const ids = [...new Set(productos.map(p => p.productoId))];

    const productosBD = await prisma.producto.findMany({
        where: {
            id: {
                in: ids
            }
        }
    });

    if (productosBD.length !== ids.length) {
        throw new Error("Uno o más productos enviados no existen en la base de datos");
    }

    const cantidadesSolicitadas = new Map(productos.map(p => [p.productoId, p.cantidad]));

    productosBD.forEach(producto => {
        if (!producto.activo) {
            throw new Error(`El producto ${producto.nombre} se encuentra inactivo y no puede ser vendido`);
        }

        const cantidadSolicitada = cantidadesSolicitadas.get(producto.id)!;

        if (cantidadSolicitada > producto.stock) {
            throw new Error(`Stock insuficiente para ${producto.nombre}. Solicitado: ${cantidadSolicitada}, Disponible: ${producto.stock}`);
        }

        const subtotal = cantidadSolicitada * producto.precioVenta;
        total += subtotal;

        detallesVenta.push({
            productoId: producto.id,
            cantidad: cantidadSolicitada,
            precioUnitario: producto.precioVenta,
            subtotal: subtotal
        });
    });

    const ventaCreada = await prisma.$transaction(async (tx) => {

        const venta = await tx.venta.create({
            data: {
                usuarioId,
                total
            }
        });

        const detalles = detallesVenta.map(detalle => ({
            ventaId: venta.id,
            ...detalle
        }));

        await tx.detalleVenta.createMany({
            data: detalles
        });

        for (const { productoId, cantidad } of detalles) {
            await tx.producto.update({
                where: { id: productoId },
                data: { stock: { decrement: cantidad } }
            });
        }

        return venta;
    });

    const evento: VentaCreadaEvent = {
        ventaId: ventaCreada.id,
        usuarioId,
        total: ventaCreada.total,
        fecha: ventaCreada.fecha
    };

    eventBus.emit(Events.VENTA_CREADA, evento);

    return ventaCreada;
};

export const listarVentas = async (filtros: FiltrosVentaDTO = {}) => {
    const { fechaInicio, fechaFin, usuarioId } = filtros;

    return await prisma.venta.findMany({
        where: {
            ...(usuarioId && { usuarioId }),
            ...(fechaInicio || fechaFin ? {
                fecha: {
                    ...(fechaInicio && { gte: new Date(fechaInicio) }),
                    ...(fechaFin && { lte: new Date(fechaFin) })
                }
            } : {})
        },
        include: {
            usuario: {
                select: {
                    nombre: true,
                    correo: true
                }
            },
            detalles: {
                include: {
                    producto: {
                        select: {
                            nombre: true
                        }
                    }
                }
            }
        },
        orderBy: {
            fecha: 'desc'
        }
    });
};

export const obtenerVentaPorId = async (id: number) => {
    const venta = await prisma.venta.findUnique({
        where: { id },
        include: {
            usuario: {
                select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                    correo: true
                }
            },
            detalles: {
                include: {
                    producto: {
                        select: {
                            id: true,
                            nombre: true,
                            codigo: true
                        }
                    }
                }
            }
        }
    });

    if (!venta) {
        throw new Error("Venta no encontrada");
    }

    return venta;
};
