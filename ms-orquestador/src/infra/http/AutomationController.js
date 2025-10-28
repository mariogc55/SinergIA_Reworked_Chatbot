// AutomationController.js (Controlador que recibe la petición del Frontend)
import { AutomationService } from "../../application/AutomationService";

export const AutomationController = () => {
    const automationService = new AutomationService();

    const triggerAutomation = async (req, res) => {
        const { prompt, userId } = req.body;

        if (!prompt || !userId) {
            return res.status(400).json({ message: "Se requieren 'prompt' y 'userId'." });
        }

        try {
            const result = await automationService.automate(prompt, userId);
            
            res.status(200).json(result);
        } catch (error) {
            console.error("Error en el Orquestador:", error);
            res.status(500).json({ 
                message: "Error de Orquestación. Falla al integrar APIs.",
                details: error.message 
            });
        }
    };

    return { triggerAutomation };
};