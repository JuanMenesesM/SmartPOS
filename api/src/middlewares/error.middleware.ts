import { Request, Response, NextFunction } from "express";
import { MESSAGES } from "../utils/constants";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 400;
    const message = err.message || MESSAGES.ERROR.ERROR_SERVIDOR;

    // Errores controlados de autenticación o validación: log puntual y limpio
    if (statusCode === 401 || statusCode === 403 || statusCode === 400) {
        console.warn(`[Aviso ${statusCode}] ${message} (${req.method} ${req.originalUrl})`);
    } else {
        console.error(`[Error ${statusCode}] ${message}`, err.stack || err);
    }

    return res.status(statusCode).json({
        message
    });
};
