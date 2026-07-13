import { prisma } from "../../config/prisma";
import { CreateProveedorDTO, UpdateProveedorDTO } from "./proveedores.dto";

export const crearProveedor = async (data: CreateProveedorDTO) => {
    if (!data.nombre) {
        throw new Error("El nombre es obligatorio");
    }

    if (data.nit) {
        const existente = await prisma.proveedor.findUnique({
            where: { nit: data.nit }
        });
        if (existente) {
            throw new Error("Ya existe un proveedor con este NIT");
        }
    }

    return await prisma.proveedor.create({
        data
    });
};

export const listarProveedores = async () => {
    return await prisma.proveedor.findMany({
        where: { activo: true },
        orderBy: { nombre: 'asc' }
    });
};

export const obtenerProveedorPorId = async (id: number) => {
    const proveedor = await prisma.proveedor.findUnique({
        where: { id }
    });

    if (!proveedor) {
        throw new Error("Proveedor no encontrado o inactivo");
    }

    return proveedor;
};

export const actualizarProveedor = async (id: number, data: UpdateProveedorDTO) => {
    const proveedor = await prisma.proveedor.findUnique({
        where: { id }
    });

    if (!proveedor) {
        throw new Error("Proveedor no encontrado o inactivo");
    }

    if (data.nit && data.nit !== proveedor.nit) {
        const existente = await prisma.proveedor.findUnique({
            where: { nit: data.nit }
        });
        if (existente) {
            throw new Error("Ya existe un proveedor con este NIT");
        }
    }

    return await prisma.proveedor.update({
        where: { id },
        data
    });
};

export const desactivarProveedor = async (id: number) => {
    const proveedor = await prisma.proveedor.findUnique({
        where: { id }
    });

    if (!proveedor) {
        throw new Error("Proveedor no encontrado o inactivo");
    }

    return await prisma.proveedor.update({
        where: { id },
        data: { activo: false }
    });
};
