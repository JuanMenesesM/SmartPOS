import { Request, Response, NextFunction } from "express";
import * as proveedoresService from "./proveedores.service";
import { MESSAGES } from "../../utils/constants";

export const crearProveedorController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const proveedor = await proveedoresService.crearProveedor(req.body);
        return res.status(201).json({
            message: MESSAGES.SUCCESS.PROVEEDOR_CREADO,
            proveedor
        });
    } catch (error) {
        next(error);
    }
};

export const listarProveedoresController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const proveedores = await proveedoresService.listarProveedores();
        return res.json(proveedores);
    } catch (error) {
        next(error);
    }
};

export const obtenerProveedorPorIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const proveedor = await proveedoresService.obtenerProveedorPorId(id);
        return res.json(proveedor);
    } catch (error) {
        next(error);
    }
};

export const actualizarProveedorController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const proveedor = await proveedoresService.actualizarProveedor(id, req.body);
        return res.json({
            message: MESSAGES.SUCCESS.PROVEEDOR_ACTUALIZADO,
            proveedor
        });
    } catch (error) {
        next(error);
    }
};

export const desactivarProveedorController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const proveedor = await proveedoresService.desactivarProveedor(id);
        return res.json(proveedor);
    } catch (error) {
        next(error);
    }
};
