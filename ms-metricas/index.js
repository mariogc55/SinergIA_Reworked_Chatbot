// index.js
// Ubicación: /ms-metricas/index.js

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// 1. Interoperabilidad: Usamos require para dependencias externas
const express = require('express');
const cors = require('cors');

// 2. Importación Local: Usamos import con la extensión .js (¡Corrección del error!)
import apiRoutes from './src/routes/api.routes.js'; 
// import { Database } from './src/infra/db/PostgresClient.js'; // Necesario para la BD

const app = express();
const PORT = process.env.METRICS_PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// 3. Montar Rutas
// Todas las peticiones a este servicio irán a /api/v1/metrics
app.use('/api/v1/metrics', apiRoutes); 

// Ruta de estado simple (Root Check)
app.get('/', (req, res) => {
    res.status(200).json({
        service: 'MS-Métricas',
        message: 'Bienvenido al servicio de Métricas PSP/PMBOK.'
    });
});


// Inicialización del servidor y conexión a DB (simulada por ahora)
const initializeApp = async () => {
    try {
        // En una implementación real:
        // await Database.connect(); 
        // console.log("Conexión a PostgreSQL establecida.");
        
        app.listen(PORT, () => {
            console.log(`📊 MS-Métricas corriendo en http://localhost:${PORT}`);
            console.log("Rutas disponibles en /api/v1/metrics");
        });
    } catch (error) {
        console.error("CRÍTICO: El MS-Métricas no pudo inicializarse.");
        console.error(error.message);
        process.exit(1); 
    }
}

initializeApp();