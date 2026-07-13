import express from "express";
import * as DashboardController from "./dashboard.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const router = express.Router();

router.get("/dashboard", authMiddleware, adminMiddleware, DashboardController.obtenerDashboardController);

export default router;
