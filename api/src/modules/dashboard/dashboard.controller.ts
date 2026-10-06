import { Request, Response, NextFunction } from "express";
import { obtenerDashboard } from "./dashboard.service";

export const dashboardController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { inicio, fin } = req.query;

        const filtro =
            inicio && fin
                ? {
                      inicio: new Date(inicio as string),
                      fin:    new Date(fin as string),
                  }
                : undefined;

        const dashboard = await obtenerDashboard(filtro);
        return res.json(dashboard);
    } catch (error) {
        next(error);
    }
};