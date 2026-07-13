import express from "express";
import { listarRoles } from "./roles.controller";

const router = express.Router();

router.get("/listar", listarRoles);

export default router;