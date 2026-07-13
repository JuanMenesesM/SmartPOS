import { prisma } from "../../config/prisma";
import { UpdateEmpresaDTO } from "./empresa.dto";

export const obtenerEmpresa = async () => {
    const empresa = await prisma.empresa.findFirst();

    if (!empresa)
        throw new Error("No existe ninguna empresa registrada");

    return empresa;
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