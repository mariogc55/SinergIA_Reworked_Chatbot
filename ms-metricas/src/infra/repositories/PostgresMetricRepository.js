import { IMetricRepository } from "../../domain/ports/IMetricRepository.js";
import { pool } from "../db/connection.js"

export class PostgresMetricRepository extends IMetricRepository {
    constructor() {
        super();
        console.log("Adaptador PostgreSQL Metrics inicializado.");
    }

    /**
     * @param {Object} timeLog
     * @returns {Object}
     */
    async saveTimeLog(timeLog) {
        const query = `
            INSERT INTO timelogs (developer_id, project_key, phase, time_hours) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, developer_id, time_hours;
        `;
        const values = [
            timeLog.developerId,
            timeLog.projectKey,
            timeLog.phase,
            timeLog.timeHours
        ];

        try {
            const res = await pool.query(query, values);
            return res.rows[0];
        } catch (error) {
            console.error("Error en saveTimeLog (Postgres):", error.message);
            throw new Error("Fallo en la persistencia de TimeLog.");
        }
    }

    /**
     * @param {Object} defectLog
     * @returns {Object}
     */
    async saveDefectLog(defectLog) {
        const query = `
            INSERT INTO defectlogs (developer_id, defect_type, injection_phase, removal_phase, time_to_fix) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, developer_id, defect_type;
        `;
        const values = [
            defectLog.developerId,
            defectLog.defectType,
            defectLog.injectionPhase,
            defectLog.removalPhase,
            defectLog.timeToFix
        ];
        
        try {
            const res = await pool.query(query, values);
            return res.rows[0];
        } catch (error) {
             console.error("Error en saveDefectLog (Postgres):", error.message);
             throw new Error("Fallo en la persistencia de DefectLog.");
        }
    }

    /**
     * @param {string} developerId
     * @returns {Array}
     */
    async findTimeLogsByDeveloper(developerId) {
        const query = `SELECT * FROM timelogs WHERE developer_id = $1 ORDER BY created_at DESC;`;
        const values = [developerId];

        const res = await pool.query(query, values);
        return res.rows.map(row => ({
            developerId: row.developer_id,
            timeHours: parseFloat(row.time_hours),
            phase: row.phase
        }));
    }
    
}