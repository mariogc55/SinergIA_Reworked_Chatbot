import { IAutomationStrategy } from "../../domain/ports/IAutomationStrategy";
import { GeminiAdapter } from "../../../../ms-integracion/src/infra/adapters/GeminiAPIAdapter"; 
import { JiraRestAdapter } from "../../../ms-integracion/src/infra/adapters/JiraRestAdapter";
import { ServiceNowAdapter } from "../../../ms-integracion/src/infra/adapters/ServiceNowAdapter";

export class IssueCreationStrategy extends IAutomationStrategy {
    constructor(geminiAdapter, jiraAdapter, authService) {
        super();
        this.geminiAdapter = geminiAdapter || new GeminiAdapter();
        this.jiraAdapter = jiraAdapter || new JiraRestAdapter();
        this.authService = authService || new ServiceNowAdapter();
    }

    async execute(prompt, userId) {
        const userProfile = await this.authService.getUserProfile(userId);
        
        if (userProfile.risk_access_level !== 'HIGH' && prompt.toLowerCase().includes('urgente')) {
            return { message: `Acción denegada. Su nivel de acceso de riesgo (${userProfile.risk_access_level}) no permite crear tareas críticas.` };
        }

        const functionCallResult = await this.geminiAdapter.analyzePromptForJiraCreation(prompt);
        
        if (!functionCallResult || functionCallResult.name !== 'create_jira_issue') {
            return { message: "Gemini no detectó una intención clara de creación de tareas." };
        }

        const args = functionCallResult.args;

        const issueData = {
            projectKey: args.projectKey || 'KAN',
            title: args.title || 'Tarea automatizada sin título',
            description: `${args.description} (Solicitado por: ${userProfile.name})`,
            riskLevel: args.riskLevel || 'Medio',
            issueType: args.issueType || 'Task'
        };

        const jiraResult = await this.jiraAdapter.createIssueWithRisk(issueData);

        console.log('jira', jiraResult)
        return {
            message: `Tarea automatizada creada por ${userProfile.name}: ${jiraResult.key}.`,
            jiraUrl: jiraResult.url,
            jiraKey: jiraResult.key
        };
    }
}