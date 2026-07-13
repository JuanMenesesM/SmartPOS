import { CreateUsuarioDTO, UpdateUsuarioDTO } from "./usuarios.dto";
import { prisma } from "../../config/prisma";
import bcrypt from 'bcrypt';

export const crearUsuario = async (data: CreateUsuarioDTO) => {
    const { nombre, apellido, correo, contrasena, rolId } = data;

    if (!nombre || !apellido || !correo || !contrasena || !rolId) {
        throw new Error("Todos los campos son obligatorios");
    }

    const nombreLimpio = nombre.trim();
    const apellidoLimpio = apellido.trim();
    const contrasenaLimpia = contrasena.trim();
    const correoLimpio = correo.trim().toLowerCase();

    if (nombreLimpio.length < 3) {
        throw new Error("El nombre debe tener al menos 3 caracteres");
    }

    if (apellidoLimpio.length < 3) {
        throw new Error("El apellido debe tener al menos 3 caracteres");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correoLimpio)) {
        throw new Error("El formato del correo es inválido");
    }

    if (contrasenaLimpia.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    const usuario = await prisma.usuario.findUnique({
        where: { correo: correoLimpio },
    });
    if (usuario) {
        throw new Error("El correo ya existe");
    }

    const rol = await prisma.rol.findUnique({
        where: { id: rolId },
    });
    if (!rol?.activo) {
        throw new Error("El rol no existe o está inactivo");
    }
    
    const contrasenaHash = await bcrypt.hash(contrasenaLimpia, 10);

    const usuarioCreado = await prisma.usuario.create({
        data: {
            nombre: nombreLimpio,
            apellido: apellidoLimpio,
            correo: correoLimpio,
            contrasena: contrasenaHash,
            rolId
        }
    });

    return {
    id: usuarioCreado.id,
    nombre: usuarioCreado.nombre,
    apellido: usuarioCreado.apellido,
    correo: usuarioCreado.correo,
    rolId: usuarioCreado.rolId,
    activo: usuarioCreado.activo
    };
}

export const obtenerUsuarios = async () => {
    return await prisma.usuario.findMany({
        select: {
            id: true,
            nombre: true,
            apellido: true,
            correo: true,
            activo: true,
            rol: {
                select: {
                    id: true,
                    nombre: true,
                    activo: true
                }
            }
        }
    });
}

export const obtenerUsuarioPorId = async (id: number) => {
    const usuario = await prisma.usuario.findUnique({
        where: { id },
        select: {
            id: true,
            nombre: true,
            apellido: true,
            correo: true,
            activo: true,
            rol: {
                select: {
                    id: true,
                    nombre: true
                }
            }
        }
    });

    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    return usuario;
}

export const actualizarUsuario = async (id: number, data: UpdateUsuarioDTO) => {
    const usuario = await prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    if (data.correo) {
        const correoLimpio = data.correo.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correoLimpio)) {
            throw new Error("El formato del correo es inválido");
        }

        const existente = await prisma.usuario.findUnique({ where: { correo: correoLimpio } });
        if (existente && existente.id !== id) {
            throw new Error("El correo ya está en uso por otro usuario");
        }
        data.correo = correoLimpio;
    }

    if (data.rolId) {
        const rol = await prisma.rol.findUnique({ where: { id: data.rolId } });
        if (!rol?.activo) {
            throw new Error("El rol no existe o está inactivo");
        }
    }

    return await prisma.usuario.update({
        where: { id },
        data,
        select: {
            id: true,
            nombre: true,
            apellido: true,
            correo: true,
            activo: true,
            rolId: true
        }
    });
}

export const desactivarUsuario = async (id: number) => {
    const usuario = await prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    if (!usuario.activo) {
        throw new Error("El usuario ya se encuentra inactivo");
    }

    return await prisma.usuario.update({
        where: { id },
        data: { activo: false },
        select: {
            id: true,
            nombre: true,
            apellido: true,
            correo: true,
            activo: true
        }
    });
}