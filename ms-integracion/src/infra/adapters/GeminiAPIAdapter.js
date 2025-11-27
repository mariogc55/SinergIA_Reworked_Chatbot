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

          Estructura del JSON:
          {
            "summary": "",
            "description": "",
            "priority": "High | Medium | Low",
            "issueType": "Task | Bug | Story",
            "projectKey": ""
          }

          Prompt del usuario:
          ${prompt}
          `
        }
      ]);

      const text = response.response.text();
      console.log("[Gemini RAW RESPONSE]:", text);

      return JSON.parse(text);

    } catch (error) {
      console.error("Error en Gemini:", error);
      throw new Error(`Error en el análisis de Gemini: ${error.message}`);
    }
  }
};
