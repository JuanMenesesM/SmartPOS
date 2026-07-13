import { Request, Response, NextFunction } from "express";
import * as EmpresaService from "./empresa.service";

export const obtenerEmpresaController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const empresa = await EmpresaService.obtenerEmpresa();
        return res.json(empresa);
    } catch (error) {
        next(error);
    }
};

export const crearEmpresaController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const empresa = await EmpresaService.crearEmpresa(req.body);
        return res.status(201).json({
            message: "Empresa creada exitosamente",
            empresa
        });
    } catch (error) {
        next(error);
    }
};

export const actualizarEmpresaController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string);
        const empresa = await EmpresaService.actualizarEmpresa(id, req.body);
        return res.json({
            message: "Empresa actualizada exitosamente",
            empresa
        });
    } catch (error) {
        next(error);
    }
};
