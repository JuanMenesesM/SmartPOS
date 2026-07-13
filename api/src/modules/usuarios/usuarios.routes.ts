import express from "express";
import { crearUsuario, obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, desactivarUsuario } from "./usuarios.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const router = express.Router();

router.post("/crear", adminMiddleware, authMiddleware, crearUsuario);
router.get("/", authMiddleware, obtenerUsuarios);
router.get("/:id", authMiddleware, obtenerUsuarioPorId);
router.put("/:id", authMiddleware, actualizarUsuario);
router.put("/desactivar/:id", authMiddleware, adminMiddleware, desactivarUsuario);

export default router;