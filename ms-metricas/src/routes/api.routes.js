import { Router } from 'express';
import { AuthController } from '../infra/http/AuthController.js'; 
import { ReportController } from '../infra/http/ReportController.js'; 
import { PostgresAuthRepository } from '../infra/repositories/PostgresAuthRepository.js';
import { PostgresMetricRepository } from '../infra/repositories/PostgresMetricRepository.js';
import { authMiddleware } from '../infra/middleware/authMiddleware.js';

const apiRouter = Router();

const authRepository = new PostgresAuthRepository();
const authController = AuthController(authRepository);

const metricRepository = new PostgresMetricRepository();
const reportController = ReportController(metricRepository);

apiRouter.post('/auth/register', authController.register);
apiRouter.post('/auth/login', authController.login);

apiRouter.post('/log-time', authMiddleware, reportController.logTime); 
apiRouter.get('/psp-summary/:developerId', authMiddleware, reportController.getPSPSummary); 

apiRouter.get('/db-health', async (req, res) => {
    try {
        const result = await authRepository.checkConnection();
        res.status(200).json({ 
            status: 'OK', 
            database: 'Conexión PostgreSQL activa y funcionando.' 
        });
    } catch (error) {
        console.error("Error al verificar DB health:", error);
        res.status(500).json({ 
            status: 'ERROR', 
            database: 'Fallo al conectar o consultar la base de datos.' 
        });
    }
});

apiRouter.post('/auth/register', authController.register);

apiRouter.get('/status', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        service: 'MS-Métricas',
        message: "Métricas API Router activo. Rutas protegidas con JWT."
    });
});

export { apiRouter };