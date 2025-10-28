
export class EVMCalculator {
    /**
     * @param {number} earnedValue
     * @param {number} actualCost
     * @returns {number}
     */
    calculateCPI(earnedValue, actualCost) {
        if (actualCost <= 0) return 0;
        const cpi = earnedValue / actualCost;
        return parseFloat(cpi.toFixed(2));
    }

    /**
     * @param {number} earnedValue
     * @param {number} plannedValue
     * @returns {number}
     */
    calculateSPI(earnedValue, plannedValue) {
        if (plannedValue <= 0) return 0;
        const spi = earnedValue / plannedValue;
        return parseFloat(spi.toFixed(2));
    }

    /**
     * @param {number} budgetAtCompletion
     * @param {number} cpi
     * @returns {number}
     */
    calculateEAC(budgetAtCompletion, cpi) {
        if (cpi <= 0) return budgetAtCompletion;
        const eac = budgetAtCompletion / cpi;
        return parseFloat(eac.toFixed(2));
    }
}