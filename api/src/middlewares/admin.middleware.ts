import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const usuarioToken = req.user!;

        const usuarioBD = await prisma.usuario.findUnique({
            where: {
                id: usuarioToken.id
            }
        });

        if (!usuarioBD) {
            return res.status(401).json({
                message: "Usuario no encontrado"
            });
        }

        if (!usuarioBD.activo) {
            return res.status(403).json({
                message: "Usuario inactivo"
            });
        }

        if (usuarioBD.rolId !== 1) {
            return res.status(403).json({
                message: "No tienes permiso para realizar esta acción"
            });
        }

        next();

    } catch {
        return res.status(500).json({
            message: "Error al verificar el rol del usuario"
        })
    }
}