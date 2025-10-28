import express from 'express';
import { AutomationController } from '../infra/http/AutomationController';
import { AutomationService } from '../application/AutomationService';
import { IssueCreationStrategy } from '../application/strategies/IssueCreationStrategy';

import { GeminiAdapter } from '../../ms-integracion/src/infra/adapters/GeminiAPIAdapter'; 
import { JiraRestAdapter } from '../../ms-integracion/src/infra/adapters/JiraRestAdapter';
import { ServiceNowAdapter } from '../../ms-integracion/src/infra/adapters/ServiceNowAdapter'; 

const router = express.Router();

const geminiAdapter = new GeminiAdapter();
const jiraAdapter = new JiraRestAdapter();
const serviceNowAdapter = new ServiceNowAdapter();

const issueCreationStrategy = new IssueCreationStrategy(
    geminiAdapter,
    jiraAdapter,
    serviceNowAdapter
);


const strategyMap = {
    'create_issue': issueCreationStrategy,
};

const automationService = new AutomationService(strategyMap);

const automationController = AutomationController(automationService);

/**
 * @route POST /api/v1/automate
 * @description
 */
router.post('/automate', automationController.triggerAutomation); 

export default router;