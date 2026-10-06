import { Router } from "express";
import { descargarFacturaController } from "./pdf.controller";

const router = Router();

router.get("/factura/:ventaId", descargarFacturaController);

export default router;