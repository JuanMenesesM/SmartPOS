import { eventBus } from "./eventBus";
import { Events } from "./eventNames";
import type { VentaCreadaEvent } from "./eventTypes";

eventBus.on(Events.VENTA_CREADA, async (data: VentaCreadaEvent) => {
    console.log(data);
});