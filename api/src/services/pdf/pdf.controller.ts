import { Request, Response, NextFunction } from "express";
import { construirFacturaVentaDTO } from "./builders/factura.builder";
import { generarFacturaVenta } from "./pdf.service";

export const descargarFacturaController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const ventaId = Number(req.params.ventaId);

        if (isNaN(ventaId)) {
            throw new Error("Id de venta inválido");
        }

        const factura = await construirFacturaVentaDTO(ventaId);

        const pdf = await generarFacturaVenta(factura);

        res.setHeader("Content-Type", "application/pdf");

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=Factura-${factura.venta.numeroFactura}.pdf`
        );

        return res.send(pdf);

    } catch (error) {
        next(error);
    }
};