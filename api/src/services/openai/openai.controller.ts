import { Request, Response, NextFunction } from "express";
import { construirContextoIA } from "./builders/context.builder";
import { analizarNegocio } from "./services/openai.service";

export const testOpenAIController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const contexto = await construirContextoIA();

        const respuesta = await analizarNegocio(contexto);

        return res.json(respuesta);

    } catch (error) {
        next(error);
    }
};