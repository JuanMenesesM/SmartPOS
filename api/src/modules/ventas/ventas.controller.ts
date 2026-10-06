import { Request, Response, NextFunction } from "express";
import * as VentasService from "./ventas.service";
import { generarFacturaVenta } from "../../services/pdf/pdf.service";
import { construirFacturaVentaDTO } from "../../services/pdf/builders/factura.builder";
import { CreateVentaDTO } from "./ventas.dto";
import { MESSAGES } from "../../utils/constants";

export const crearVentaController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body as CreateVentaDTO;
        const usuarioId = req.user!.id;
        const user = (req as any).user;
        const venta = await VentasService.crearVenta(data, usuarioId, user.empresaId);
        return res.status(201).json({
            message: MESSAGES.SUCCESS.VENTA_CREADA,
            venta
        });
    } catch (error) {
        next(error);
    }
}

export const listarVentasController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fechaInicio, fechaFin, usuarioId, empresaId } = req.query;
        const user = (req as any).user;

        let filterEmpresaId = user.rolId === 1 ? (empresaId ? Number(empresaId) : undefined) : user.empresaId;

        const ventas = await VentasService.listarVentas({
            fechaInicio: fechaInicio as string | undefined,
            fechaFin: fechaFin as string | undefined,
            usuarioId: usuarioId ? Number(usuarioId) : undefined,
            empresaId: filterEmpresaId ? Number(filterEmpresaId) : undefined
        });
        return res.json(ventas);
    } catch (error) {
        next(error);
    }
}

export const obtenerVentaPorIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const venta = await VentasService.obtenerVentaPorId(id);
        return res.json(venta);
    } catch (error) {
        next(error);
    }
}

export const descargarFacturaController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const facturaDTO = await construirFacturaVentaDTO(id);
        const pdfBuffer = await generarFacturaVenta(facturaDTO);
        
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=factura-${id}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        next(error);
    }
}