import { PSPCalculator } from "./calculators/PSPCalculator";
import { EVMCalculator } from "./calculators/EVMCalculator";

export class MetricService {
    constructor(metricRepository) {
        this.repository = metricRepository;
        this.pspCalculator = new PSPCalculator();
        this.evmCalculator = new EVMCalculator();
    }

    async getPSPSummaryData(developerId) {
        const timeLogs = await this.repository.findTimeLogsByDeveloper(developerId);

        const totalLOC = 1500; 
        const estimatedTime = 50;
        const plannedValue = 4000;
        const earnedValue = 3500;
        const actualCost = 4500;
        const budgetAtCompletion = 10000;

        if (timeLogs.length === 0) {
            return { message: "No se encontraron registros de tiempo." };
        }

        const { productivity, totalTimeHours } = this.pspCalculator.calculateProductivity(timeLogs, totalLOC);
        const { variance, scheduleStatus } = this.pspCalculator.calculateTimeVariance(estimatedTime, totalTimeHours);

        const cpi = this.evmCalculator.calculateCPI(earnedValue, actualCost);
        const spi = this.evmCalculator.calculateSPI(earnedValue, plannedValue);
        const eac = this.evmCalculator.calculateEAC(budgetAtCompletion, cpi);

        return {
            developerId,
            productivity,
            timeVariance: variance,
            scheduleStatus: scheduleStatus,
            
            cpi,
            spi,
            eac,
            ev: earnedValue,
            ac: actualCost,
            pv: plannedValue
        };
    }
}