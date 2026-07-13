import { prisma } from "../../config/prisma";
import * as ventasAnalytics from "../analytics/ventas-analytics.service";
import * as comprasAnalytics from "../analytics/compras-analytics.service";
import * as productosAnalytics from "../analytics/productos-analytics.service";

export const obtenerDashboard = async () => {

    const [
        ventasHoy,
        ventasMes,
        comprasHoy,
        comprasMes,
        ticketPromedio,
        topProductos,
        productosActivos,
        stockCritico,
        productosSinStock,
        usuariosActivos
    ] = await Promise.all([
        ventasAnalytics.obtenerVentasHoy(),
        ventasAnalytics.obtenerVentasMes(),
        comprasAnalytics.obtenerComprasHoy(),
        comprasAnalytics.obtenerComprasMes(),
        ventasAnalytics.obtenerTicketPromedio(),
        ventasAnalytics.obtenerTopProductos(),
        productosAnalytics.obtenerCantidadProductosActivos(),
        productosAnalytics.obtenerStockCritico(),
        productosAnalytics.obtenerProductosSinStock(),
        prisma.usuario.count({
            where: {
                activo: true
            }
        })
    ]);

    return {
        ventasHoy,
        ventasMes,
        comprasHoy,
        comprasMes,
        ticketPromedio,
        topProductos,
        inventario: {
            productosActivos,
            stockCritico,
            productosSinStock
        },
        usuariosActivos
    };
};
