import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './src/infra/db/connection.js';
import { apiRouter } from './src/routes/api.routes.js';

const app = express();
const PORT = 3002;

app.use(cors());

app.use(express.json());

app.use('/api/v1/metrics', apiRouter);

async function startServer() {
    try {
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`MS-Métricas (PSP) corriendo en http://localhost:${PORT}`);
            console.log("Rutas disponibles en /api/v1/metrics");
        });
    } catch (error) {
        console.error("Fallo al iniciar el servidor MS-Métricas:", error);
        process.exit(1);
    }
}

startServer();