
export class PSPCalculator {
    /**
     * @param {Array<Object>} timeLogs
     * @param {number} totalLOC
     * @returns {{productivity: number, totalTimeHours: number}}
     */
    calculateProductivity(timeLogs, totalLOC) {
        const totalTimeHours = timeLogs.reduce((sum, log) => sum + log.timeHours, 0);

        if (totalTimeHours === 0) {
            return { productivity: 0, totalTimeHours: 0 };
        }

        const productivity = totalLOC / totalTimeHours;
        
        return { 
            productivity: parseFloat(productivity.toFixed(2)),
            totalTimeHours: parseFloat(totalTimeHours.toFixed(2))
        };
    }

    /**
     * @param {number} totalDefects
     * @param {number} earlyDefects
     * @returns {number}
     */
    calculateDDE(totalDefects, earlyDefects) {
        if (totalDefects === 0) return 100;
        const dde = (earlyDefects / totalDefects) * 100;
        return parseFloat(dde.toFixed(2));
    }

    /**
     * @param {number} estimatedTime
     * @param {number} actualTime
     * @returns {{variance: number, status: string}}
     */
    calculateTimeVariance(estimatedTime, actualTime) {
        const variance = estimatedTime - actualTime;
        
        let status;
        if (variance > 0.1) {
            status = 'Ahead of Schedule (SV > 0)';
        } else if (variance < -0.1) {
            status = 'Behind Schedule (SV < 0)';
        } else {
            status = 'On Schedule (SV ≈ 0)';
        }
        
        return { 
            variance: parseFloat(variance.toFixed(2)), 
            status 
        };
    }
}