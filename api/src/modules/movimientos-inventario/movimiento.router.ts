import { Router } from "express";
import { registrarMovimientoController, obtenerMovimientosController, obtenerEstadisticasController } from "./movimiento.controller";

export const movimientoRouter = Router();

movimientoRouter.post("/", registrarMovimientoController);
movimientoRouter.get("/", obtenerMovimientosController);
movimientoRouter.get("/stats", obtenerEstadisticasController);