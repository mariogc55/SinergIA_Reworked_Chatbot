import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.DB_USER || 'sinergia_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'sinergia_metrics',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
});

const initializeDatabase = async () => {
    try {
        console.log("PostgreSQL: Verificando conexión...");
        const client = await pool.connect();
        
        const createTablesQuery = `
            -- Tabla para registrar el tiempo por fases (PSP0)
            CREATE TABLE IF NOT EXISTS timelogs (
                id SERIAL PRIMARY KEY,
                developer_id VARCHAR(50) NOT NULL,
                project_key VARCHAR(10) NOT NULL,
                phase VARCHAR(50) NOT NULL, -- Planificación, Diseño, Codificación, Prueba
                time_hours NUMERIC(5, 2) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            -- Tabla para registrar defectos (PSP2)
            CREATE TABLE IF NOT EXISTS defectlogs (
                id SERIAL PRIMARY KEY,
                developer_id VARCHAR(50) NOT NULL,
                defect_type VARCHAR(50) NOT NULL, -- Ej: Design, Code Review, Compile
                injection_phase VARCHAR(50) NOT NULL, -- Fase donde se introdujo el defecto
                removal_phase VARCHAR(50) NOT NULL, -- Fase donde se eliminó el defecto
                time_to_fix NUMERIC(5, 2) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            -- Se podrían añadir índices para optimizar las consultas de ReportController.js
            CREATE INDEX IF NOT EXISTS idx_timelogs_dev ON timelogs(developer_id);
        `;
        
        await client.query(createTablesQuery);
        client.release();
        console.log("PostgreSQL: Tablas DDL verificadas y listas para el MS-Métricas.");
    } catch (err) {
        console.error("Error al inicializar PostgreSQL:", err.message);
        throw new Error("No se pudo conectar o inicializar PostgreSQL. Verifique credenciales.");
    }
};

export { pool, initializeDatabase };