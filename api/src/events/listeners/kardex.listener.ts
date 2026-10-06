import { eventBus } from "../eventBus";
import { Events } from "../eventNames";
import type { VentaCreadaEvent } from "../eventTypes";
import { registrarMovimiento } from "../../modules/movimientos-inventario/movimiento.service";

eventBus.on(Events.VENTA_CREADA, async (data: VentaCreadaEvent) => {
    try {
        for (const producto of data.productos) {
                await registrarMovimiento({
                    productoId: producto.productoId,
                    usuarioId: data.usuarioId,
                    tipo: "VENTA",
                    cantidad: -producto.cantidad, // negativo: sale del inventario
                    stockAnterior: producto.stockAnterior,
                    stockNuevo: producto.stockNuevo,
                    origenId: data.ventaId,
                    observacion: undefined
                });
        }
        console.log(
            `[KARDEX] Movimiento registrado para venta #${data.ventaId}`
        );
    } catch (error) {
        console.error(
            "[KARDEX] Error registrando movimiento:",
            error
        );
    }
});