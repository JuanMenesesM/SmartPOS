import express from "express";
import * as EmpresaController from "./empresa.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const router = express.Router();

router.get("/", authMiddleware, EmpresaController.obtenerEmpresaController);
router.post("/", authMiddleware, adminMiddleware, EmpresaController.crearEmpresaController);
router.put("/:id", authMiddleware, adminMiddleware, EmpresaController.actualizarEmpresaController);

export default router;
