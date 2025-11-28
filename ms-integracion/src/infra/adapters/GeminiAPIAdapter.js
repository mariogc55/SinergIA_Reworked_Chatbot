import { GoogleGenerativeAI } from "@google/generative-ai";
import { Secrets } from "../config/secrets.js";

export const GeminiAPIAdapter = {
  async analyzeTask(prompt) {
    return await this.analyzeText(prompt);
  },

  async analyzeText(prompt) {
    if (!prompt) {
      throw new Error("El prompt no puede estar vacío.");
    }

    try {
      const genAI = new GoogleGenerativeAI(Secrets.getGeminiApiKey());
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const response = await model.generateContent([
        {
          text: `
            Analiza este requerimiento y devuelve SOLO un JSON válido sin texto adicional.

            Estructura esperada:
            {
              "summary": "",
              "description": "",
              "priority": "High | Medium | Low",
              "issueType": "Task | Bug | Story",
              "projectKey": ""
            }

            Requerimiento del usuario:
            ${prompt}
          `
        }
      ]);

      const raw = response.response.text();
      console.log("[Gemini RAW RESPONSE]:", raw);

      let clean = raw.trim();

      clean = clean.replace(/```json/gi, "").replace(/```/g, "").trim();

      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No se encontró un JSON válido en la respuesta.");
      }

      clean = jsonMatch[0];

      return JSON.parse(clean);

    } catch (error) {
      console.error("Error en Gemini:", error);
      throw new Error(`Error en el análisis de Gemini: ${error.message}`);
    }
  }
};