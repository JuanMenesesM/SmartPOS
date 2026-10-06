import { Request, Response, NextFunction } from "express";
import * as productosService from "./productos.service";

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
        const id = Number(req.params.id);
        const producto = await productosService.listarProductoPorId(id);
        return res.json(producto);
    } catch (error) {
        next(error);
    }
};

export const crearProducto = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const nuevo = await productosService.crearProducto(req.body);
        return res.status(201).json(nuevo);
    } catch (error) {
        next(error);
    }
};

export const actualizarProducto = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const actualizado = await productosService.actualizarProducto(id, req.body);
        return res.json(actualizado);
    } catch (error) {
        next(error);
    }
};

export const toggleEstadoProducto = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const actualizado = await productosService.toggleEstadoProducto(id);
        return res.json(actualizado);
    } catch (error) {
        next(error);
    }
};

export const desactivarProducto = async (req: Request, res: Response, next: NextFunction) => {
    return toggleEstadoProducto(req, res, next);
};

export const obtenerKardexProducto = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const kardex = await productosService.getKardexPorProducto(id);
        return res.json(kardex);
    } catch (error) {
        next(error);
    }
};