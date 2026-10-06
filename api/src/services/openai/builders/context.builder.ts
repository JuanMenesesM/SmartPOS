import * as ventasAnalytics from "../../../modules/analytics/ventas-analytics.service";
import * as comprasAnalytics from "../../../modules/analytics/compras-analytics.service";
import * as productosAnalytics from "../../../modules/analytics/productos-analytics.service";
import { prisma } from "../../../config/prisma";
import { ContextoIA } from "../dto/context.dto";

export const construirContextoIA = async (): Promise<ContextoIA> => {

    const [
        empresa,
        ventasHoy,
        ventasMes,
        comprasMes,
        ticketPromedio,
        topProductos,
        stockCritico
    ] = await Promise.all([
        prisma.empresa.findFirst(),
        ventasAnalytics.obtenerVentasHoy(),
        ventasAnalytics.obtenerVentasMes(),
        comprasAnalytics.obtenerComprasMes(),
        ventasAnalytics.obtenerTicketPromedio(),
        ventasAnalytics.obtenerTopProductos(5),
        productosAnalytics.obtenerStockCritico()
    ]);

    return {
        empresa: {
            nombre: empresa?.nombre ?? "Sin configurar",
            ciudad: empresa?.ciudad ?? "Sin configurar"
        },
        ventasHoy,
        ventasMes,
        comprasMes,
        ticketPromedio,
        topProductos,
        stockCritico: stockCritico.productos.map(p => ({
            nombre: p.nombre,
            stock: p.stock
        }))
    };
};
