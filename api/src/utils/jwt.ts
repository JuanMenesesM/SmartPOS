import { Usuario } from "@prisma/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("La variable de entorno JWT_SECRET no está configurada.");
}

export interface JwtPayload {
    id: number;
    correo: string;
    rolId: number;
}

export const generarToken = (usuario: Usuario): string => {
    const payload: JwtPayload = {
        id: usuario.id,
        correo: usuario.correo,
        rolId: usuario.rolId
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1d"
    });
};