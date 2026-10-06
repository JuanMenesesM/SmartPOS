import { Router } from "express";
import { listarAuditoriaController } from "./auditoria.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { registrarAuditoriaController } from "./auditoria.controller";

const router = Router();

router.get("/", authMiddleware, listarAuditoriaController);
router.post("/registrar", authMiddleware, registrarAuditoriaController);

export default router;