import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";
import { LoginDTO } from "./auth.dto";
import { generarToken } from "../../utils/jwt";

export const login = async (data: LoginDTO) => {
  const { correo, contrasena } = data;

  const usuario = await prisma.usuario.findUnique({
    where: { correo },
    include: {
      empresa: {
        select: { id: true, nombre: true, licenciaActiva: true }
      }
    }
  });

  if (!usuario) {
    throw new Error("Credenciales inválidas");
  }

  if (!usuario.activo) {
    throw new Error("Usuario inactivo");
  }

  // Check company license — Super Admin (rolId=1) bypasses this check
  if (usuario.rolId !== 1 && usuario.empresa && !usuario.empresa.licenciaActiva) {
    const err: any = new Error("Licencia inactiva. Contacte al administrador de SmartPOS.");
    err.statusCode = 403;
    throw err;
  }

  const contrasenaValida = await bcrypt.compare(
    contrasena, usuario.contrasena
  );

  if (!contrasenaValida) {
    throw new Error("Credenciales inválidas");
  }

  const token = generarToken(usuario);

  return {
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      rolId: usuario.rolId,
      empresaId: usuario.empresaId,
      licenciaActiva: usuario.empresa?.licenciaActiva ?? true,
    },
    token
  };
};