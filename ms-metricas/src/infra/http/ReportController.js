// ReportController.js (Expone los datos calculados al Frontend)
import { MetricService } from "../../application/MetricService";

export const ReportController = (metricRepository) => {
    const metricService = new MetricService(metricRepository);

    const getPSPSummary = async (req, res) => {
        const { developerId } = req.params;
        try {
            const summary = await metricService.getPSPSummaryData(developerId);

            res.status(200).json({
                developerId,
                productivity: summary.productivity,
                DDE: summary.dde,
                timeVariance: summary.timeVariance,
                reports: summary.reports
            });
        } catch (error) {
            res.status(500).json({ message: "Error al calcular métricas PSP." });
        }
    };
    
    const logTime = async (req, res) => {
        try {
            await metricRepository.saveTimeLog(req.body);
            res.status(201).json({ message: "Time log registrado con éxito (PSP0)." });
        } catch (error) {
            res.status(500).json({ message: "Fallo al registrar tiempo." });
        }
    };

    return { getPSPSummary, logTime };
};