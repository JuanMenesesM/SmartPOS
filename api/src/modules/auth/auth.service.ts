import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";
import { LoginDTO } from "./auth.dto";
import { generarToken } from "../../utils/jwt";

export const login = async (data: LoginDTO) => {
  const { correo, contrasena } = data;

  const usuario = await prisma.usuario.findUnique({
    where: { correo }
  });

  if (!usuario) {
    throw new Error("Credenciales inválidas");
  }

  if (!usuario.activo) {
    throw new Error("Usuario inactivo");
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
    rolId: usuario.rolId
  },
  token};
};