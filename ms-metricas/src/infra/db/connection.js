import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

// export const pool = new Pool({
//     user: 'neondb_owner',
//     host: 'ep-small-mountain-ah4a0slf-pooler.c-3.us-east-1.aws.neon.tech',
//     database: 'neondb',
//     password: 'npg_FzZSg4X7weuL',
//     port: 5432,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
}
export const pool = new Pool({
    connectionString: connectionString
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
        await client.query(DDL_TABLES);
        client.release();
    } catch (err) {
        throw new Error("Fallo en la conexión a la base de datos o en la creación de tablas.");
    }
}
