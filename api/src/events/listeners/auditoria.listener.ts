import { eventBus, Events } from "../eventBus";
import { prisma } from "../../config/prisma";

// Registrar auditoría cuando se crea una venta
eventBus.on(Events.VENTA_CREADA, async (data: { ventaId: number, usuarioId: number, total: number }) => {
    await prisma.auditoria.create({
        data: {
            usuarioId: data.usuarioId,
            modulo: "Ventas",
            accion: "Crear",
            descripcion: `Se registró la venta VNT-${String(data.ventaId).padStart(4, "0")} por un total de $${data.total.toLocaleString("es-CO")}`
        }
    });
});

// Registrar auditoría cuando se crea una compra
eventBus.on(Events.COMPRA_CREADA, async (data: { compraId: number, usuarioId: number, total: number }) => {
    await prisma.auditoria.create({
        data: {
            usuarioId: data.usuarioId,
            modulo: "Compras",
            accion: "Crear",
            descripcion: `Se registró la compra FC-${String(data.compraId).padStart(4, "0")} por un total de $${data.total.toLocaleString("es-CO")}`
        }
    });
});

// Registrar auditoría cuando se anula una compra
eventBus.on(Events.COMPRA_ANULADA, async (data: { compraId: number, usuarioId: number, total: number }) => {
    await prisma.auditoria.create({
        data: {
            usuarioId: data.usuarioId,
            modulo: "Compras",
            accion: "Anular",
            descripcion: `Se anuló la compra FC-${String(data.compraId).padStart(4, "0")} por un total de $${data.total.toLocaleString("es-CO")}`
        }
    });
});