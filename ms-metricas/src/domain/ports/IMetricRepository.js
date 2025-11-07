export class IMetricRepository {
    async saveTimeLog(timeLog) {
        throw new Error("El método saveTimeLog debe ser implementado.");
    }

    async findTimeLogsByDeveloperAndPhase(developerId, phase) {
        throw new Error("El método findTimeLogsByDeveloperAndPhase debe ser implementado.");
    }

}