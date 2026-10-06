import { prisma } from "../../config/prisma";
import { UpdateEmpresaDTO } from "./empresa.dto";

export const obtenerEmpresa = async () => {
    const empresa = await prisma.empresa.findFirst();

    if (!empresa)
        throw new Error("No existe ninguna empresa registrada");

    return empresa;
};

export const listarEmpresas = async () => {
    return await prisma.empresa.findMany({
        select: {
            id: true,
            nombre: true,
            nit: true,
            correo: true,
            telefono: true,
            ciudad: true,
            activo: true,
            licenciaActiva: true,
            _count: {
                select: { usuarios: true }
            }
        },
        orderBy: { id: "asc" }
    });
};

export const toggleLicencia = async (id: number) => {
    const empresa = await prisma.empresa.findUnique({ where: { id } });
    if (!empresa) throw new Error("Empresa no encontrada");

    return await prisma.empresa.update({
        where: { id },
        data: { licenciaActiva: !empresa.licenciaActiva },
        select: { id: true, nombre: true, licenciaActiva: true }
    });
};

export const crearEmpresa = async (data: UpdateEmpresaDTO) => {
    const existente = await prisma.empresa.findFirst();

    if (existente)
        throw new Error("Ya existe una empresa registrada");

    return await prisma.empresa.create({
        data
    });
};

export const actualizarEmpresa = async (id: number, data: UpdateEmpresaDTO) => {
    return await prisma.empresa.update({
        where: { id },
        data
    });
};