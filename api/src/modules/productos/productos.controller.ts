import { Request, Response, NextFunction } from "express";
import * as productosService from "./productos.service";
import { MESSAGES } from "../../utils/constants";

export const listarProductos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productos = await productosService.getProductos();
    return res.json(productos);
  } catch (error) {
    next(error);
  }
};

export const listarProductoPorId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id)
    const producto = await productosService.listarProductoPorId(id)
    return res.json(producto);
  } catch (error) {
    next(error);
  }
}

export const crearProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const producto = await productosService.crearProducto(req.body);
    return res.status(201).json({
      message: MESSAGES.SUCCESS.PRODUCTO_CREADO,
      producto
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const producto = await productosService.actualizarProducto(id, req.body);
    return res.json({
      message: MESSAGES.SUCCESS.PRODUCTO_ACTUALIZADO,
      producto
    });
  } catch (error) {
    next(error);
  }
};

export const desactivarProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const producto = await productosService.desactivarProducto(id);
    return res.json(producto);
  } catch (error) {
    next(error);
  }
}