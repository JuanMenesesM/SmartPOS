import express from "express";
import * as ComprasController from "./compras.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const router = express.Router();

router.post("/crear", authMiddleware, adminMiddleware, ComprasController.crearCompraController);
router.get("/", authMiddleware, ComprasController.listarComprasController);
router.get("/:id", authMiddleware, ComprasController.obtenerCompraPorIdController);

export default router;
