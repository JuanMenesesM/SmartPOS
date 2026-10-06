import { prisma } from "../../config/prisma";
import { DashboardDTO } from "./dashboard.dto";
import { obtenerInicioDelDia } from "../../utils/date.utils";

export interface DashboardFiltro {
    inicio: Date;
    fin: Date;
}

export const obtenerDashboard = async (filtro?: DashboardFiltro): Promise<DashboardDTO> => {

    const inicio = filtro?.inicio ?? obtenerInicioDelDia();
    const fin    = filtro?.fin    ?? new Date();

    // Para el KPI de "ventasHoy" siempre usamos el inicio real del día
    const inicioHoy = obtenerInicioDelDia();

    const [
        ventasRango,
        ventasHoy,
        facturasRango,
        stockBajo,
        actividad,
        ventasDetalle,
        detalleVentas,
        stockCritico
    ] = await Promise.all([

        // Ventas totales en el rango seleccionado
        prisma.venta.aggregate({
            _sum: { total: true },
            where: { fecha: { gte: inicio, lte: fin } }
        }),

        // Ventas del día de hoy (siempre fijo, independiente del filtro)
        prisma.venta.aggregate({
            _sum: { total: true },
            where: { fecha: { gte: inicioHoy } }
        }),

        // Número de facturas en el rango
        prisma.venta.count({
            where: { fecha: { gte: inicio, lte: fin } }
        }),

        // Stock bajo — no depende del rango de fechas
        prisma.producto.count({
            where: { stock: { lte: 5 } }
        }),

        // Actividad reciente — últimas 5 entradas (no depende del rango)
        prisma.auditoria.findMany({
            take: 5,
            orderBy: { fecha: "desc" },
            include: { usuario: true }
        }),

        // Ventas por día en el rango seleccionado
        prisma.venta.findMany({
            where: { fecha: { gte: inicio, lte: fin } },
            select: { fecha: true, total: true },
            orderBy: { fecha: "asc" }
        }),

        // Detalle de ventas para top productos en el rango
        prisma.detalleVenta.findMany({
            where: {
                venta: { fecha: { gte: inicio, lte: fin } }
            },
            include: {
                producto: {
                    select: { id: true, nombre: true }
                }
            }
        }),

        // Stock crítico — no depende del rango
        prisma.producto.findMany({
            where: { stock: { lte: 5 } },
            select: { id: true, codigo: true, nombre: true, stock: true },
            orderBy: { stock: "asc" },
            take: 5
        })
    ]);

    // ── Agrupar ventas por día ─────────────────────────────────────────────────
    const ventasAgrupadas = new Map<string, number>();

    ventasDetalle.forEach(v => {
        const fecha = v.fecha.toISOString().split("T")[0];
        ventasAgrupadas.set(fecha, (ventasAgrupadas.get(fecha) ?? 0) + v.total);
    });

    const ventasPorDia = Array.from(ventasAgrupadas.entries()).map(
        ([fecha, total]) => ({ fecha, total })
    );

    // ── Agrupar productos más vendidos ────────────────────────────────────────
    const productosMap = new Map<number, { id: number; producto: string; cantidad: number }>();

    detalleVentas.forEach(detalle => {
        const id = detalle.producto.id;
        const actual = productosMap.get(id);

        if (actual) {
            actual.cantidad += detalle.cantidad;
        } else {
            productosMap.set(id, {
                id,
                producto: detalle.producto.nombre,
                cantidad: detalle.cantidad
            });
        }
    });

    const productosMasVendidos = Array.from(productosMap.values())
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5);

    return {
        kpis: {
            ventasHoy: ventasHoy._sum.total ?? 0,
            ventasMes: ventasRango._sum.total ?? 0,   // ahora es "ventas en el rango"
            facturasHoy: facturasRango,
            stockBajo
        },
        ventasPorDia,
        productosMasVendidos,
        stockCritico,
        actividadReciente: actividad.map(a => ({
            fecha: a.fecha,
            usuario: `${a.usuario.nombre} ${a.usuario.apellido}`,
            descripcion: a.descripcion
        }))
    };

};