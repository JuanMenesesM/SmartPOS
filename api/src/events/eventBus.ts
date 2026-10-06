import { EventEmitter } from "events";
import { Events } from "./eventNames";

export { Events };
export const eventBus = new EventEmitter();
