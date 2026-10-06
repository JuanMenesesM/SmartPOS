import { Request, Response } from "express";
import { registrarMovimiento, obtenerMovimientos, obtenerEstadisticasKardex } from "./movimiento.service";

export const registrarMovimientoController = async (req: Request, res: Response) => {
    try {
        const movimiento = await registrarMovimiento(req.body);
        return res.status(201).json(movimiento);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const obtenerMovimientosController = async (_req: Request, res: Response) => {
    try {
        const movimientos = await obtenerMovimientos();
        return res.json(movimientos);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const obtenerEstadisticasController = async (_req: Request, res: Response) => {
    try {
        const stats = await obtenerEstadisticasKardex();
        return res.json(stats);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};