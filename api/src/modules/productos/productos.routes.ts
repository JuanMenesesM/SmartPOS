import express from "express";
import {
    listarProductos,
    crearProducto,
    actualizarProducto,
    toggleEstadoProducto,
    listarProductoPorId,
    obtenerKardexProducto
} from "./productos.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, listarProductos);
router.get("/:id", authMiddleware, listarProductoPorId);
router.get("/:id/kardex", authMiddleware, obtenerKardexProducto);
router.post("/crear", authMiddleware, crearProducto);
router.put("/actualizar/:id", authMiddleware, actualizarProducto);
router.patch("/toggle/:id", authMiddleware, toggleEstadoProducto);
router.put("/desactivar/:id", authMiddleware, toggleEstadoProducto);

export default router;