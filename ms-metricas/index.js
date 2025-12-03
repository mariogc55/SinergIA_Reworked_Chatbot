import express from 'express';
import cors from 'cors';
import { initializeDatabase, pool } from './src/infra/db/connection.js';
import { apiRouter } from './src/routes/api.routes.js';

const app = express();
const PORT = process.env.PORT || process.env.METRICS_PORT || 3002;

app.disable('x-powered-by');

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || '*',
    })
);

app.use(express.json());

app.use('/api/v1/metrics', apiRouter);

app.get('/health', async (req, res) => {
    const startedAt = Date.now();

    try {
        await pool.query('SELECT 1');
        const responseTimeMs = Date.now() - startedAt;

        return res.json({
            service: 'ms-metricas',
            status: 'UP',
            message: 'Base de datos PSP accesible y servidor operativo.',
            responseTimeMs,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('[MS-Métricas] Healthcheck falló:', error.message);
        const responseTimeMs = Date.now() - startedAt;

        return res.status(500).json({
            service: 'ms-metricas',
            status: 'DOWN',
            message: 'Error al conectar con la base de datos PSP.',
            error: error.message,
            responseTimeMs,
            timestamp: new Date().toISOString(),
        });
    }
});

app.use((err, req, res, next) => {
    console.error('[MS-Métricas] Error no controlado:', err);
    res.status(500).json({
        service: 'ms-metricas',
        status: 'ERROR',
        message: 'Error interno del servidor en MS-Métricas.',
    });
});

async function startServer() {
    try {
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`MS-Métricas (PSP) corriendo en puerto ${PORT}`);
            console.log('Rutas disponibles en /api/v1/metrics');
            console.log('Healthcheck disponible en /health');
        });
    } catch (error) {
        console.error('Fallo al iniciar el servidor MS-Métricas:', error);
        process.exit(1);
    }
}

function setupGracefulShutdown() {
    const shutdown = async (signal) => {
        console.log(`\n[MS-Métricas] Recibida señal ${signal}. Cerrando pool de BD...`);
        try {
            await pool.end();
            console.log('[MS-Métricas] Pool de BD cerrado correctamente.');
        } catch (err) {
            console.error('[MS-Métricas] Error cerrando pool de BD:', err);
        } finally {
            process.exit(0);
        }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer();
setupGracefulShutdown();
