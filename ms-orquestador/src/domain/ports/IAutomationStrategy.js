// IAutomationStrategy.js (Patrón STRATEGY - Puerto)
export class IAutomationStrategy {
    constructor() {
        if (new.target === IAutomationStrategy) {
            throw new TypeError("Cannot instantiate abstract class IAutomationStrategy directly.");
        }
    }

    /**
     * @param {string} prompt
     * @param {string} userId
     * @returns {Object}
     */
    async execute(prompt, userId) {
        throw new Error("El método 'execute' debe ser implementado por una estrategia concreta.");
    }
}