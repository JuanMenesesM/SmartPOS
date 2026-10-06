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

export const listarEmpresasController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const empresas = await EmpresaService.listarEmpresas();
        return res.json(empresas);
    } catch (error) {
        next(error);
    }
};

export const toggleLicenciaController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string);
        const empresa = await EmpresaService.toggleLicencia(id);
        return res.json({
            message: `Licencia ${empresa.licenciaActiva ? "activada" : "desactivada"} para ${empresa.nombre}`,
            empresa
        });
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
