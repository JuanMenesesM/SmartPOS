import { Request, Response, NextFunction } from "express";
import * as ComprasService from "./compras.service";
import { CreateCompraDTO } from "./compras.dto";
import { MESSAGES } from "../../utils/constants";

export const crearCompraController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body as CreateCompraDTO;
        const usuarioId = req.user!.id;
        const compra = await ComprasService.crearCompra(data, usuarioId);
        return res.status(201).json({
            message: MESSAGES.SUCCESS.COMPRA_CREADA,
            compra
        });
    } catch (error) {
        next(error);
    }
};

export const listarComprasController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fechaInicio, fechaFin, proveedorId, usuarioId } = req.query;
        const compras = await ComprasService.listarCompras({
            fechaInicio: fechaInicio as string | undefined,
            fechaFin: fechaFin as string | undefined,
            proveedorId: proveedorId ? Number(proveedorId) : undefined,
            usuarioId: usuarioId ? Number(usuarioId) : undefined
        });
        return res.json(compras);
    } catch (error) {
        next(error);
    }
};

export const obtenerCompraPorIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const compra = await ComprasService.obtenerCompraPorId(id);
        return res.json(compra);
    } catch (error) {
        next(error);
    }
};
