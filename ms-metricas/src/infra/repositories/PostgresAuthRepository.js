import { pool } from '../db/connection.js'; 

export class PostgresAuthRepository {
    constructor() {
        this.pool = pool; 
    }

    async findUserByEmail(email) {
        const query = 'SELECT developer_id, name, email, password FROM users WHERE email = $1';
        const result = await this.pool.query(query, [email]);
        return result.rows[0];
    }

    async generateNextDeveloperId() {
        let maxIdResult;
        try {
            const maxIdQuery = "SELECT developer_id FROM users WHERE developer_id IS NOT NULL ORDER BY developer_id DESC LIMIT 1";
            maxIdResult = await this.pool.query(maxIdQuery);
        } catch (e) {
            maxIdResult = { rows: [] };
        }

        let nextNumber = 1;
        
        if (maxIdResult.rows.length > 0) {
            const lastId = maxIdResult.rows[0].developer_id;
            const lastNumber = parseInt(lastId.substring(3));
            nextNumber = lastNumber + 1;
        }

        return `DEV${String(nextNumber).padStart(3, '0')}`;
    }

    async registerUser(userData) {
        const { developer_id, name, email, password } = userData; 

        const insertQuery = 'INSERT INTO users (developer_id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING developer_id, name, email';
        const newUserResult = await this.pool.query(insertQuery, [developer_id, name, email, password]);

        return newUserResult.rows[0];
    }
}