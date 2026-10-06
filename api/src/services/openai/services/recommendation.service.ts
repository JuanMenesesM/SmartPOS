import OpenAI from "openai";
import { AnalisisIA } from "../dto/analysis.dto";
import { ContextoIA } from "../dto/context.dto";
import { construirContextoIA } from "../builders/context.builder";
import { analizarNegocio } from "./openai.service";

export const generarReporteSemanalIA = async (): Promise<AnalisisIA> => {

    const contexto = await construirContextoIA();

    const analisis = await analizarNegocio(contexto);

    

    return analisis;
}

