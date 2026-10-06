import { Request, Response, NextFunction } from "express";
import { listarAuditoria, registrarAuditoria } from "./auditoria.service";

export const listarAuditoriaController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auditoria = await listarAuditoria();
        return res.json(auditoria);
    } catch (error) {
        next(error);
    }
};

export const registrarAuditoriaController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auditoria = await registrarAuditoria(req.body);
        return res.json(auditoria);
    } catch (error) {
        next(error);
    }
};