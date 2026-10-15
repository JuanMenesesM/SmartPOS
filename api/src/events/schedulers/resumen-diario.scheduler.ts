import { prisma } from "../../config/prisma";

const HORA_RESUMEN = 20; // 8:00 PM
const MINUTO_RESUMEN = 0;

function getMsHastaProximoResumen(): number {
    const ahora = new Date();
    const objetivo = new Date(ahora);
    objetivo.setHours(HORA_RESUMEN, MINUTO_RESUMEN, 0, 0);

    // Si ya pasaron las 8 PM de hoy, programar para mañana
    if (objetivo.getTime() <= ahora.getTime()) {
        objetivo.setDate(objetivo.getDate() + 1);
    }

    return objetivo.getTime() - ahora.getTime();
}

async function enviarResumenDiario() {
    const webhookUrl = process.env.N8N_RESUMEN_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn("[RESUMEN/n8n] N8N_RESUMEN_WEBHOOK_URL no configurado. Saltando resumen.");
        return;
    }

    try {
        const hoy = new Date();
        const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0);
        const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);

        const ventas = await prisma.venta.findMany({
            where: {
                fecha: {
                    gte: inicioDia,
                    lte: finDia
                }
            },
            include: {
                usuario: {
                    select: { nombre: true, apellido: true }
                },
                detalles: {
                    include: {
                        producto: { select: { nombre: true } }
                    }
                }
            },
            orderBy: { fecha: "asc" }
        });

        const totalGeneral = ventas.reduce((sum, v) => sum + Number(v.total), 0);
        const totalEfectivo = ventas.filter(v => v.metodoPago === "EFECTIVO").reduce((sum, v) => sum + Number(v.total), 0);
        const totalTransferencia = ventas.filter(v => v.metodoPago === "TRANSFERENCIA").reduce((sum, v) => sum + Number(v.total), 0);

        // Agrupar productos más vendidos
        const productosMap = new Map<string, { cantidad: number; total: number }>();
        ventas.forEach(v => {
            v.detalles.forEach(d => {
                const nombre = d.producto?.nombre || "Producto";
                const prev = productosMap.get(nombre) || { cantidad: 0, total: 0 };
                productosMap.set(nombre, {
                    cantidad: prev.cantidad + d.cantidad,
                    total: prev.total + Number(d.subtotal)
                });
            });
        });

        const topProductos = Array.from(productosMap.entries())
            .map(([nombre, datos]) => ({ nombre, ...datos }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 5);

        const payload = {
            evento: "RESUMEN_DIARIO",
            timestamp: new Date().toISOString(),
            fecha: hoy.toLocaleDateString("es-HN", { dateStyle: "full" }),
            resumen: {
                totalVentas: ventas.length,
                totalGeneral,
                desglosePago: {
                    efectivo: totalEfectivo,
                    transferencia: totalTransferencia
                },
                topProductos
            },
            ventas: ventas.map(v => ({
                ventaId: v.id,
                hora: v.fecha.toLocaleTimeString("es-HN", { timeStyle: "short" }),
                cajero: v.usuario ? `${v.usuario.nombre} ${v.usuario.apellido || ""}`.trim() : "Cajero",
                total: Number(v.total),
                metodoPago: v.metodoPago
            }))
        };

        fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).then(res => {
            if (res.ok) {
                console.log(`[RESUMEN/n8n] Resumen diario enviado exitosamente (${ventas.length} ventas, total: ${totalGeneral}).`);
            } else {
                console.warn(`[RESUMEN/n8n] Error status ${res.status} al enviar resumen a n8n.`);
            }
        }).catch(err => {
            console.warn("[RESUMEN/n8n] No se pudo conectar con n8n:", err.message);
        });

    } catch (error) {
        console.error("[RESUMEN/n8n] Error generando resumen diario:", error);
    }
}

function iniciarSchedulerResumenDiario() {
    const msHasta = getMsHastaProximoResumen();
    const horasHasta = (msHasta / 1000 / 60 / 60).toFixed(1);

    console.log(`[RESUMEN/n8n] Próximo resumen diario programado en ${horasHasta}h (20:00).`);

    setTimeout(() => {
        enviarResumenDiario();

        // Repetir cada 24 horas
        setInterval(enviarResumenDiario, 24 * 60 * 60 * 1000);
    }, msHasta);
}

iniciarSchedulerResumenDiario();
