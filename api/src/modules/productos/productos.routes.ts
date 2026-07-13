import express from "express";
import { listarProductos, crearProducto, actualizarProducto, desactivarProducto, listarProductoPorId } from "./productos.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, listarProductos);
router.get("/:id", listarProductoPorId);
router.post("/crear", crearProducto);
router.put("/actualizar/:id", actualizarProducto);
router.put("/desactivar/:id", desactivarProducto);

export default router;