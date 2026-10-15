import { eventBus } from "../eventBus";
import { Events } from "../eventNames";
import type { VentaCreadaEvent } from "../eventTypes";
import { prisma } from "../../config/prisma";

eventBus.on(Events.VENTA_CREADA, async (data: VentaCreadaEvent) => {
    try {
        const webhookUrl = process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/ca8c8596-4b50-46df-9656-15b449d0d1a4";

        if (!webhookUrl) return;

        // Cargar detalles completos de la venta con nombres de productos y cajero
        const venta = await prisma.venta.findUnique({
            where: { id: data.ventaId },
            include: {
                usuario: {
                    select: { nombre: true, apellido: true }
                },
                detalles: {
                    include: {
                        producto: { select: { nombre: true } }
                    }
                }
            }
        });

        if (!venta) return;

        const cajeroNombre = venta.usuario 
            ? `${venta.usuario.nombre} ${venta.usuario.apellido || ""}`.trim()
            : "Cajero";

        const payload = {
            evento: "VENTA_REGISTRADA",
            timestamp: new Date().toISOString(),
            datos: {
                ventaId: venta.id,
                numeroFactura: `FAC-${venta.id.toString().padStart(6, "0")}`,
                cliente: {
                    nombre: "Cliente Final"
                },
                cajero: cajeroNombre,
                total: venta.total,
                metodoPago: venta.metodoPago || "EFECTIVO",
                items: venta.detalles.map(d => ({
                    producto: d.producto?.nombre || "Producto",
                    cantidad: d.cantidad,
                    precioUnitario: d.precioUnitario,
                    total: d.subtotal
                }))
            }
        };

        // Disparo asíncrono no bloqueante a n8n
        fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).then(res => {
            if (res.ok) {
                console.log(`[WHATSAPP/n8n] Notificación de venta #${venta.id} enviada exitosamente.`);
            } else {
                console.warn(`[WHATSAPP/n8n] Error status ${res.status} al enviar a n8n.`);
            }
        }).catch(err => {
            console.warn(`[WHATSAPP/n8n] No se pudo conectar con n8n:`, err.message);
        });

    } catch (error) {
        console.error("[WHATSAPP/n8n] Error preparando notificación de venta:", error);
    }
});
