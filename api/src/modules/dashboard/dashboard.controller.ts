import { Request, Response, NextFunction } from "express";
import * as DashboardService from "./dashboard.service";

export const  obtenerDashboardController = async (req: Request,res: Response,next: NextFunction) => {
    try {
        const dashboard = await DashboardService.obtenerDashboard();
        return res.json(dashboard);
    } catch (error) {
        next(error);
    }
}