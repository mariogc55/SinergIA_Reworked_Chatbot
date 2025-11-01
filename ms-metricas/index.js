

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const express = require('express');
const cors = require('cors');

import apiRoutes from './src/routes/api.routes.js'; 

const app = express();
const PORT = process.env.METRICS_PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/api/v1/metrics', apiRoutes); 

app.get('/', (req, res) => {
    res.status(200).json({
        service: 'MS-Métricas',
        message: 'Bienvenido al servicio de Métricas PSP/PMBOK.'
    });
});


const initializeApp = async () => {
    try {
        // al implementar usar:
        // await Database.connect(); 
        // console.log("Conexión a PostgreSQL establecida.");
        
        app.listen(PORT, () => {
            console.log(`MS-Métricas corriendo en http://localhost:${PORT}`);
            console.log("Rutas disponibles en /api/v1/metrics");
        });
    } catch (error) {
        console.error("CRÍTICO: El MS-Métricas no pudo inicializarse.");
        console.error(error.message);
        process.exit(1); 
    }
}

initializeApp();