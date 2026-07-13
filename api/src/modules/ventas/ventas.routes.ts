import express from "express";
import * as VentasController from "./ventas.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/crear", authMiddleware, VentasController.crearVentaController);
router.get("/", authMiddleware, VentasController.listarVentasController);
router.get("/:id", authMiddleware, VentasController.obtenerVentaPorIdController);
router.get("/:id/pdf", authMiddleware, VentasController.descargarFacturaController);

export default router;
