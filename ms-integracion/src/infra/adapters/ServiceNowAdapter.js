import { IAuthService } from "../../domain/ports/IAuthService.js";
import { Secrets } from "../config/secrets.js";
import axios from 'axios';

export class ServiceNowAdapter extends IAuthService {
    constructor() {
        super();
        this.baseUrl = process.env.SN_URL || 'https://sinergia-demo.service-now.com/api/v1/user';
        this.headers = { 
            Authorization: `Bearer ${Secrets.getServiceNowToken()}`,
            'Content-Type': 'application/json'
        };
        console.log("Adaptador ServiceNow inicializado para autenticación/perfiles.");
    }


    async getUserProfile(userId) {
        const url = `${this.baseUrl}/profile?id=${userId}`;
        
        try {

            const profileData = {
                id: userId,
                name: "Gestor PMBOK",
                role: userId === 'user-pmbok-id' ? 'ProjectManager' : 'Developer',
                risk_access_level: userId === 'user-pmbok-id' ? 'HIGH' : 'LOW'
            };

            return profileData;
        } catch (error) {
            console.error(`Error al obtener perfil de usuario ${userId} desde ServiceNow:`, error.message);
            throw new Error(`Falla de autenticación/perfil de usuario.`);
        }
    }

    async checkUserRole(userId, requiredRole) {
        const profile = await this.getUserProfile(userId);
        return profile.role === requiredRole;
    }
}