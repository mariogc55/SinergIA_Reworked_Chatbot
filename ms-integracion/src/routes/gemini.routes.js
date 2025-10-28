
import express from 'express';
import { GeminiAPIAdapter } from '../infra/adapters/GeminiAPIAdapter.js'; 
const router = express.Router();

router.post('/analyze', async (req, res) => {
    const { prompt } = req.body;
    
    try {
        const structuredTask = await GeminiAPIAdapter.analyzeText(prompt); 
        
        console.log('[INT:G] Prompt analizado y estructurado por la IA.');
        res.json(structuredTask);

    } catch (error) {
        console.error("Error en el análisis de Gemini:", error.message);
        
        res.status(500).json({ 
            message: "Fallo en el servicio Gemini.",
            details: error.message 
        });
    }
});

export default router;