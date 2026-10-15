import { Request, Response } from "express";
import * as authService from "./auth.service";
import { MESSAGES } from "../../utils/constants";

export const login = async (req: Request, res: Response) => {
    try {
        const result = await authService.login(req.body);
        return res.json({
            message: MESSAGES.SUCCESS.AUTH_EXITOSA,
            ...result
        });
    } catch(error: any) {
        const statusCode = error.statusCode || 401;
        const message = error.message || "Credenciales inválidas";
        const email = req.body?.correo ? `[${req.body.correo}]` : "";

        // Log puntual y limpio sin stack traces ni statuses excesivos
        console.warn(`[Login fallido] ${message} ${email}`.trim());

        return res.status(statusCode).json({
            message
        });
    }
};