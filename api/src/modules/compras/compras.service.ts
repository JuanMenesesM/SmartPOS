import { CreateCompraDTO, DetalleCompraCalculado, FiltrosCompraDTO } from "./compras.dto";
import { prisma } from "../../config/prisma";

export const crearCompra = async (data: CreateCompraDTO, usuarioId: number) => {
    const { proveedorId, productos } = data;

    if (!productos || productos.length === 0) {
        throw new Error("Debe incluir al menos un producto en la compra");
    }

    const proveedor = await prisma.proveedor.findUnique({
        where: { id: proveedorId }
    });

    if (!proveedor || !proveedor.activo) {
        throw new Error("Proveedor no encontrado o inactivo");
    }

    let total = 0;
    const detallesCompra: DetalleCompraCalculado[] = [];

    productos.forEach(prod => {
        if (prod.cantidad <= 0) {
            throw new Error("La cantidad de cada producto debe ser mayor a 0");
        }
        if (prod.precioCompra < 0) {
            throw new Error("El precio de compra no puede ser negativo");
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

    // Usamos un Map para acceder rapido por ID
    const detallesRecibidos = new Map(productos.map(p => [p.productoId, p]));

    productosBD.forEach(producto => {
        const detalleRecibido = detallesRecibidos.get(producto.id)!;
        
        const subtotal = detalleRecibido.cantidad * detalleRecibido.precioCompra;
        total += subtotal;

        detallesCompra.push({
            productoId: producto.id,
            cantidad: detalleRecibido.cantidad,
            precioCompra: detalleRecibido.precioCompra,
            subtotal: subtotal
        });
    });

    return await prisma.$transaction(async (tx) => {

        const compra = await tx.compra.create({
            data: {
                usuarioId,
                proveedorId,
                total
            }
        });

        const detalles = detallesCompra.map(detalle => ({
            compraId: compra.id,
            ...detalle
        }));

        await tx.detalleCompra.createMany({
            data: detalles
        });

        // INCREMENTAR EL STOCK
        for (const { productoId, cantidad } of detalles) {
            await tx.producto.update({
                where: { id: productoId },
                data: { stock: { increment: cantidad } }
            });
        }

        const compraCreada = await tx.compra.findUnique({
            where: {
                id: compra.id
            },
            include: {
                proveedor: true,
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
                        producto: true
                    }
                }
            }
        });

        return compraCreada;
    });
};

export const listarCompras = async (filtros: FiltrosCompraDTO = {}) => {
    const { fechaInicio, fechaFin, proveedorId, usuarioId } = filtros;

    return await prisma.compra.findMany({
        where: {
            ...(proveedorId && { proveedorId }),
            ...(usuarioId && { usuarioId }),
            ...(fechaInicio || fechaFin ? {
                fecha: {
                    ...(fechaInicio && { gte: new Date(fechaInicio) }),
                    ...(fechaFin && { lte: new Date(fechaFin) })
                }
            } : {})
        },
        include: {
            proveedor: {
                select: {
                    nombre: true,
                    nit: true
                }
            },
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

export const obtenerCompraPorId = async (id: number) => {
    const compra = await prisma.compra.findUnique({
        where: { id },
        include: {
            proveedor: {
                select: {
                    id: true,
                    nombre: true,
                    nit: true,
                    telefono: true
                }
            },
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

    if (!compra) {
        throw new Error("Compra no encontrada");
    }

    return compra;
};
