import { prisma } from "../../../config/prisma";
import { FacturaVentaDTO } from "../factura.dto";

export const construirFacturaVentaDTO = async (ventaId: number): Promise<FacturaVentaDTO> => {
    
    const [venta, empresa] = await Promise.all([
        prisma.venta.findUnique({
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
        }),
        prisma.empresa.findFirst()
    ]);

    if (!venta) {
        throw new Error("Venta no encontrada");
    }

    if (!empresa) {
        throw new Error("Empresa no encontrada");
    }

    const config = (empresa.configuracion as any) || {};
    const prefijo = config.prefijoFacturas || "FAC-";
    const numeroFactura = `${prefijo}${venta.id.toString().padStart(5, "0")}`;
    const pieFactura = config.mensajePieFactura || "¡Gracias por su compra! Vuelva pronto.";

    return {
        empresa: {
            nombre: empresa.nombre || "SmartPOS Comercio",
            nit: empresa.nit || "",
            direccion: empresa.direccion || "",
            telefono: empresa.telefono || "",
            correo: empresa.correo || "",
            ciudad: empresa.ciudad || "",
            logo: empresa.logo || null,
            mensajePieFactura: pieFactura,
            mostrarDireccionFactura: config.mostrarDireccionFactura !== false,
            mostrarTelefonoFactura: config.mostrarTelefonoFactura !== false,
        },
        venta: {
            id: venta.id,
            fecha: venta.fecha,
            cliente: "Consumidor Final",
            vendedor: `${venta.usuario?.nombre || "Cajero"} ${venta.usuario?.apellido || ""}`.trim(),
            numeroFactura,
            metodoPago: (venta as any).metodoPago || "EFECTIVO"
        },
        detalles: venta.detalles.map(detalle => ({
            producto: detalle.producto?.nombre || "Producto",
            cantidad: detalle.cantidad,
            precioUnitario: detalle.precioUnitario,
            subtotal: detalle.subtotal
        })),
        totales: {
            moneda: "COP",
            subtotal: venta.detalles.reduce((acc, d) => acc + d.subtotal, 0),
            descuentos: 0,
            impuestos: 0,
            total: venta.total
        }
    };
};