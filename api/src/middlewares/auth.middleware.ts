import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../utils/jwt";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("La variable de entorno JWT_SECRET no está configurada.");
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Token no proporcionado"
            });
        }

        const token = authHeader.split(" ")[1];

        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

        req.user = payload;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token inválido o expirado"
        });
    }
};
