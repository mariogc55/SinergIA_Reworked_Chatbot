import { MetricService } from "../../application/MetricService.js";

export const ReportController = (metricRepository) => {
    const metricService = new MetricService(metricRepository);

    const getPSPSummary = async (req, res) => {
        const { developerId } = req.params;

        if (req.user.developerId !== developerId) {
            return res.status(403).json({ message: "Acceso prohibido: Solo puede ver sus propias métricas." });
        }

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
            const logData = {
                developerId: req.user.developerId,
                projectKey: req.body.projectKey,
                phase: req.body.phase,
                timeHours: req.body.timeHours
            };

            await metricRepository.saveTimeLog(logData);
            res.status(201).json({ message: "Time log registrado con éxito (PSP0).", log: logData });
        } catch (error) {
            console.error("Fallo al registrar tiempo:", error.message);
            res.status(500).json({ message: "Fallo al registrar tiempo." });
        }
    };

    return { getPSPSummary, logTime };
};