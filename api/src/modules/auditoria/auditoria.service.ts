import { prisma } from "../../config/prisma";
import { CrearAuditoriaDto } from "./auditoria.dto";

export const registrarAuditoria = async (payload: CrearAuditoriaDto) => {
    return await prisma.auditoria.create({
        data: payload
    });
};

export const listarAuditoria = async () => {
    return await prisma.auditoria.findMany({
        include: {
            usuario: {
                select: {
                    nombre: true,
                    apellido: true
                }
            }
        },
        orderBy: {
            fecha: "desc"
        }
    });
};