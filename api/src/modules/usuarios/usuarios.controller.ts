import { Request, Response, NextFunction } from "express";
import * as usuariosService from "./usuarios.service";
import { MESSAGES } from "../../utils/constants";

export const crearUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const usuario = await usuariosService.crearUsuario(req.body, user.rolId, user.empresaId);
    return res.status(201).json({
      message: MESSAGES.SUCCESS.USUARIO_CREADO,
      usuario
    });
  } catch (error) {
    next(error);
  }
}

export const obtenerUsuarios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const usuarios = await usuariosService.obtenerUsuarios(user.rolId, user.empresaId);
    return res.json(usuarios);
  } catch (error) {
    next(error);
  }
}

export const obtenerUsuarioPorId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const usuario = await usuariosService.obtenerUsuarioPorId(id);
    return res.json(usuario);
  } catch (error) {
    next(error);
  }
}

export const actualizarUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const usuario = await usuariosService.actualizarUsuario(id, req.body);
    return res.json({
      message: "Usuario actualizado exitosamente",
      usuario
    });
  } catch (error) {
    next(error);
  }
}

export const desactivarUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const usuario = await usuariosService.desactivarUsuario(id);
    return res.json({
      message: "Usuario desactivado exitosamente",
      usuario
    });
  } catch (error) {
    next(error);
  }
}
