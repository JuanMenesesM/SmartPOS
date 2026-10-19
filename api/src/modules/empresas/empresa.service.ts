import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";
import { UpdateEmpresaDTO } from "./empresa.dto";

export const CLAVE_GENERICA_DEFAULT = "SmartPOS2026+";

export const obtenerEmpresa = async (empresaId?: number) => {
    let empresa;
    if (empresaId) {
        empresa = await prisma.empresa.findUnique({ where: { id: empresaId } });
    }
    if (!empresa) {
        empresa = await prisma.empresa.findFirst();
    }

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
            configuracion: true,
            _count: {
                select: { usuarios: true, ventas: true, productos: true }
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

export const actualizarModulos = async (id: number, modulos: any) => {
    const empresa = await prisma.empresa.findUnique({ where: { id } });
    if (!empresa) throw new Error("Empresa no encontrada");

    const configActual = (empresa.configuracion as any) || {};
    const nuevaConfig = {
        ...configActual,
        modulos: {
            ...(configActual.modulos || {}),
            ...modulos
        }
    };

    return await prisma.empresa.update({
        where: { id },
        data: { configuracion: nuevaConfig }
    });
};

export const crearEmpresa = async (data: UpdateEmpresaDTO) => {
    if (data.nit) {
        const existente = await prisma.empresa.findUnique({ where: { nit: data.nit } });
        if (existente) throw new Error("Ya existe una empresa con ese NIT");
    }

    if (data.correo) {
        const usuarioExistente = await prisma.usuario.findUnique({ where: { correo: data.correo } });
        if (usuarioExistente) throw new Error(`Ya existe un usuario registrado con el correo: ${data.correo}`);
    }

    const configuracionDefault = {
        ...(data.configuracion || {}),
        modulos: {
            pos: true,
            inventario: true,
            compras: true,
            kardex: true,
            auditoria: true,
            whatsapp: false,
            ia: false,
            ...(data.configuracion?.modulos || {})
        }
    };

    const nuevaEmpresa = await prisma.empresa.create({
        data: {
            ...data,
            configuracion: configuracionDefault
        }
    });

    let credenciales = null;

    if (data.correo) {
        const hash = await bcrypt.hash(CLAVE_GENERICA_DEFAULT, 10);
        await prisma.usuario.create({
            data: {
                nombre: data.nombre,
                apellido: "Admin",
                correo: data.correo,
                contrasena: hash,
                rolId: 1, // Administrador
                empresaId: nuevaEmpresa.id,
                activo: true
            }
        });

        credenciales = {
            correo: data.correo,
            clave: CLAVE_GENERICA_DEFAULT
        };
    }

    return {
        empresa: nuevaEmpresa,
        credenciales
    };
};

export const actualizarEmpresa = async (id: number, data: UpdateEmpresaDTO) => {
    return await prisma.empresa.update({
        where: { id },
        data
    });
};