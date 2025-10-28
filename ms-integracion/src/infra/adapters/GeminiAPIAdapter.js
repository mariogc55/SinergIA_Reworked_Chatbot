import { GoogleGenerativeAI } from '@google/generative-ai';
import { Secrets } from '../config/secrets.js';
import { GoogleGenAI } from '@google/genai';

/** @type {GoogleGenerativeAI | null} */
let aiInstance = null;

/**
 * @description
 * @returns {GoogleGenerativeAI}
 */
function initializeGeminiClient() {
    if (aiInstance === null) {
        let authMethod = "API Key";

        try {
            const saPath = Secrets.getGeminiServiceAccountPath();
            let apiKey = Secrets.getGeminiApiKey();

            if (!apiKey) {
                throw new Error('Gestion de ti es una mierda');
            }

            aiInstance = new GoogleGenerativeAI(apiKey);
            if (typeof aiInstance.getGenerativeModel !== 'function') {
                throw new Error(`El cliente de GoogleGenerativeAI no se pudo construir. Las credenciales de ${authMethod} son inválidas.`);
            }
            console.log(`[INT:G] Cliente Gemini inicializado con éxito usando: ${authMethod}.`);

        } catch (error) {
            const errorMsg = `Fallo de inicialización de Gemini con ${authMethod}. Detalle: ${error.message}`;
            console.error(errorMsg);

            aiInstance = { models: { generateContent: () => { throw new Error(errorMsg); } } };
            throw new Error(errorMsg);
        }
    }
    return aiInstance;
}


export const GeminiAPIAdapter = {
    /**
     * @description
     * @param {string} prompt
     * @returns {Promise<Object>}
     */
    async analyzeText(prompt) {
        if (!prompt) {
            throw new Error("El prompt no puede estar vacío.");
        }

        try {
            //const ai = initializeGeminiClient();

            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    { role: "user", parts: [{ text: prompt }] },
                ],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "object",
                        properties: {
                            summary: { type: "string", description: "Título breve y conciso de la tarea." },
                            description: { type: "string", description: "Descripción detallada de la solicitud del usuario." },
                            priority: { type: "string", enum: ["High", "Medium", "Low"], description: "Prioridad de la tarea." },
                            issueType: { type: "string", enum: ["Bug", "Story", "Task"], description: "Tipo de tarea a crear." },
                            projectKey: { type: "string", description: "Clave del proyecto (ej: 'SINERGIA' o 'KAN')." }
                        },
                        required: ["summary", "description", "priority", "issueType", "projectKey"]
                    }
                }
            });

            const text =  response.text;
            console.log(text);
            return JSON.parse(text);

        } catch (error) {
            console.error("Error en la llamada a Gemini:", error.message);
            throw new Error(`Error en el análisis de Gemini: ${error.message}.`);
        }
    }
};