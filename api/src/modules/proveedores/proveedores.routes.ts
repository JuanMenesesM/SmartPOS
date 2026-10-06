import express from "express";
import * as ProveedoresController from "./proveedores.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const router = express.Router();

router.post("/crear", authMiddleware, ProveedoresController.crearProveedorController);
router.post("/", authMiddleware, ProveedoresController.crearProveedorController);
router.get("/", authMiddleware, ProveedoresController.listarProveedoresController);
router.get("/:id", authMiddleware, ProveedoresController.obtenerProveedorPorIdController);
router.put("/:id", authMiddleware, adminMiddleware, ProveedoresController.actualizarProveedorController);
router.put("/desactivar/:id", authMiddleware, adminMiddleware, ProveedoresController.desactivarProveedorController);

export default router;
