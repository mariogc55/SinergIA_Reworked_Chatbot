import { GoogleGenAI } from '@google/genai';

export const GeminiAPIAdapter = {

  async analyzeTask(prompt) {
    return await this.analyzeText(prompt);
  },

  async analyzeText(prompt) {
    if (!prompt) {
      throw new Error("El prompt no puede estar vacío.");
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: prompt }] }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              summary: { type: "string" },
              description: { type: "string" },
              priority: { type: "string", enum: ["High", "Medium", "Low"] },
              issueType: { type: "string", enum: ["Bug", "Story", "Task"] },
              projectKey: { type: "string" }
            },
            required: ["summary", "description", "priority", "issueType", "projectKey"]
          }
        }
      });

      const text = response.text;
      console.log(text);
      return JSON.parse(text);

    } catch (error) {
      console.error("Error en la llamada a Gemini:", error.message);
      throw new Error(`Error en el análisis de Gemini: ${error.message}.`);
    }
  }
};
