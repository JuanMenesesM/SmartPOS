import { ContextoIA } from "../dto/context.dto";
import { AnalisisIA } from "../dto/analysis.dto";
import { PROMPT_ANALISIS_NEGOCIO } from "../prompts/prompt.js";
import { openai } from "../../../config/openai";

export const analizarNegocio = async (
    contexto: ContextoIA
): Promise<AnalisisIA> => {

    const mensaje = `${PROMPT_ANALISIS_NEGOCIO}
    Información del negocio:
    ${JSON.stringify(contexto, null, 2)}
    `;

    try {

        console.log(
            `[OpenAI] Analizando empresa: ${contexto.empresa.nombre}`
        );

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "user", content: mensaje }
            ],
            response_format: { type: "json_object" },
            temperature: 0.4,
        });

        const contenido = response.choices[0]?.message?.content ?? "{}";

        console.log("[OpenAI] Respuesta recibida correctamente.");

        const parsed = JSON.parse(contenido) as AnalisisIA;

        return {
            resumen: parsed.resumen ?? "Sin resumen disponible.",
            alertas: Array.isArray(parsed.alertas) ? parsed.alertas : [],
            recomendaciones: Array.isArray(parsed.recomendaciones) ? parsed.recomendaciones : [],
        };

    } catch (error: any) {

        console.error("[OpenAI] Error:", error.message);

        // Sin créditos o límite de cuota
        if (error.status === 429) {
            return {
                resumen: "La inteligencia artificial aún no se encuentra habilitada.",
                alertas: [
                    "La API de OpenAI no tiene créditos disponibles."
                ],
                recomendaciones: []
            };
        }

        // API Key inválida
        if (error.status === 401) {
            return {
                resumen: "No fue posible autenticar la conexión con OpenAI.",
                alertas: [
                    "Verifique la API Key configurada."
                ],
                recomendaciones: []
            };
        }

        // Cualquier otro error
        return {
            resumen: "No fue posible generar el análisis inteligente.",
            alertas: [
                "Ocurrió un error inesperado al consultar OpenAI."
            ],
            recomendaciones: []
        };
    }
};
