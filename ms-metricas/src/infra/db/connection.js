import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({

    user: process.env.PGUSER || 'sinergia_user',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'sinergia_metrics',
    password: process.env.PGPASSWORD || 'password',
    port: process.env.PGPORT || 5432,
});

const DDL_TABLES = `
    CREATE TABLE IF NOT EXISTS users (
        developer_id VARCHAR(10) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS timelogs (
        id SERIAL PRIMARY KEY,
        developer_id VARCHAR(10) REFERENCES users(developer_id),
        project_key VARCHAR(50),
        phase VARCHAR(50),
        time_hours NUMERIC(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS log_times (
        log_id SERIAL PRIMARY KEY,
        developer_id VARCHAR(10) REFERENCES users(developer_id),
        date DATE NOT NULL,
        project_name VARCHAR(100) NOT NULL,
        phase VARCHAR(50) NOT NULL,
        start_time TIME WITHOUT TIME ZONE NOT NULL,
        end_time TIME WITHOUT TIME ZONE NOT NULL,
        interrupt_time INTERVAL,
        comment TEXT,
        time_spent INTERVAL GENERATED ALWAYS AS (end_time - start_time - COALESCE(interrupt_time, '0 seconds'::interval)) STORED
    );
`;

export async function initializeDatabase() {
    try {
        const client = await pool.connect();
        client.release(); 
        await pool.query(DDL_TABLES);
        console.log("Tablas DDL verificadas/creadas con éxito.");
    } catch (err) {
        console.error("Error al inicializar la base de datos:", err.message);
        throw new Error("Fallo en la conexión o creación de tablas de la base de datos.");
    }
}