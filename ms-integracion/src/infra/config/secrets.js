import * as dotenv from 'dotenv';
dotenv.config();

import path from 'path'; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function getGeminiApiKey() {
    return process.env.GEMINI_API_KEY;
}

function getGeminiServiceAccountPath() {
    const filename = 'gemini-service-account.json';
    
    const absolutePath = path.resolve(__dirname, '..', '..', '..', filename);
    return absolutePath;
}

function getJiraEmail() {
    return process.env.JIRA_USER_EMAIL;
}

function getJiraToken() {
    return process.env.JIRA_API_TOKEN;
}

function getJiraCloudUrl() {
    const url = process.env.JIRA_CLOUD_URL;
    if (!url) throw new Error("CRITICO: JIRA_CLOUD_URL no definida.");
    return url;
}

function getServiceNowToken() {
    return process.env.SNOW_API_TOKEN;
}

function getIntegrationPort() {
    return process.env.INTEGRATION_PORT ? parseInt(process.env.INTEGRATION_PORT) : 3001;
}


export const Secrets = {
    getGeminiApiKey,
    getGeminiServiceAccountPath,
    getJiraEmail,
    getJiraToken,
    getJiraCloudUrl,
    getServiceNowToken,
    getIntegrationPort
};