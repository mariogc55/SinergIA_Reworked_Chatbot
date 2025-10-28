
import express from 'express';
// import { MetricsController } from '../infra/http/MetricsController'; 
// import { MetricsService } from '../application/MetricsService'; 

const router = express.Router();

/**
 * @route
 * @description
 */
router.get('/status', (req, res) => {

    res.status(200).json({ 
        status: 'OK', 
        service: 'MS-Métricas',
        message: "Métricas API Router activo. Listo para lógica de PSP/PMBOK."
    });
});

// Aquí irán las rutas para:
// router.post('/log-entry', ...); // Registrar una métrica
// router.get('/psp-report', ...); // Obtener un reporte PSP
// router.get('/pmbok-progress', ...); // Obtener avance PMBOK

export default router;