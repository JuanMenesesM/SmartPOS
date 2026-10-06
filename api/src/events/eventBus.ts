import { EventEmitter } from "events";

export enum Events {
    // Compras
    COMPRA_CREADA = "COMPRA_CREADA",
    COMPRA_ANULADA = "COMPRA_ANULADA",
}

export const eventBus = new EventEmitter();
