
export class AutomationService {
    /**
     * @param {Object} strategyMap
     */
    constructor(strategyMap) {
        this.STRATEGY_MAP = strategyMap;
    }

    async automate(prompt, userId) {
        const selectedStrategyKey = 'create_issue'; 
        
        const strategy = this.STRATEGY_MAP[selectedStrategyKey];

        if (!strategy) {
            throw new Error(`Estrategia de automatización '${selectedStrategyKey}' no encontrada.`);
        }

        console.log(`MS-Orquestador: Ejecutando Estrategia: ${selectedStrategyKey}`);
        return strategy.execute(prompt, userId);
    }
}