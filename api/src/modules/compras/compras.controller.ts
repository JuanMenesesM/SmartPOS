import { Request, Response, NextFunction } from "express";
import * as ComprasService from "./compras.service";
import { CreateCompraDTO } from "./compras.dto";
import { MESSAGES } from "../../utils/constants";
import { eventBus } from "../../events/eventBus";
import { Events } from "../../events/eventNames";

export const crearCompraController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body as CreateCompraDTO;
        const usuarioId = req.user!.id;
        const compra = await ComprasService.crearCompra(data, usuarioId);

        // Emitir evento para auditoria
        eventBus.emit(Events.COMPRA_CREADA, {
            compraId: compra!.id,
            usuarioId,
            proveedorId: compra!.proveedorId,
            total: compra!.total,
            fecha: compra!.fecha,
        });

        return res.status(201).json({
            message: MESSAGES.SUCCESS.COMPRA_CREADA,
            compra
        });
    } catch (error) {
        next(error);
    }
};

export const getProductosPorProveedorController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const proveedorId = Number(req.params.proveedorId);
        if (isNaN(proveedorId)) return res.status(400).json({ message: "proveedorId inválido" });
        const productos = await ComprasService.getProductosPorProveedor(proveedorId);
        return res.json(productos);
    } catch (error) {
        next(error);
    }
};

export const anularCompraController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: "ID de compra inválido" });

        const usuarioId = req.user!.id;
        const compra = await ComprasService.anularCompra(id, usuarioId);

        eventBus.emit(Events.COMPRA_ANULADA, {
            compraId: compra.id,
            usuarioId,
            total: compra.total
        });

        return res.json({ message: "Compra anulada exitosamente", compra });
    } catch (error: any) {
        if (error.message.includes("stock negativo")) {
            return res.status(400).json({ message: error.message });
        }
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
