import { prisma } from "../../config/prisma";
import { FacturaVentaDTO } from "./factura.dto";

export const construirFacturaVentaDTO = async (ventaId: number): Promise<FacturaVentaDTO> => {
    
    const venta = await prisma.venta.findUnique({
        where: { id: ventaId },
        include: {
            usuario: {
                select: {
                    nombre: true,
                    apellido: true,
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
        }
    });

    if (!venta) {
        throw new Error("Venta no encontrada");
    }

    const empresa = await prisma.empresa.findFirst();

    if (!empresa) {
        throw new Error("Empresa no encontrada");
    }

    return {
        empresa: {
            nombre: empresa.nombre,
            nit: empresa.nit || "",
            direccion: empresa.direccion || "",
            telefono: empresa.telefono || "",
            correo: empresa.correo || "",
            ciudad: empresa.ciudad || "",
            logo: empresa.logo || null
        },
        venta: {
            id: venta.id,
            fecha: venta.fecha,
            cliente: "Consumidor Final",
            vendedor: `${venta.usuario?.nombre} ${venta.usuario?.apellido}`,
            numeroFactura: `FAC-${venta.id.toString().padStart(6, "0")}`},
            detalles: venta.detalles.map(detalle => ({
            producto: detalle.producto.nombre,
            cantidad: detalle.cantidad,
            precioUnitario: detalle.precioUnitario,
            subtotal: detalle.subtotal
        })),
        totales: {
            subtotal: venta.total,
            descuentos: 0,
            impuestos: 0,
            total: venta.total
        }
    };
}