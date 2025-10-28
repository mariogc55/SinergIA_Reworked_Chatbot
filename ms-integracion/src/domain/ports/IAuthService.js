export class IAuthService {
    constructor() {
        if (new.target === IAuthService) {
            throw new TypeError("Cannot instantiate abstract class IAuthService directly.");
        }
    }

    /**
     * @param {string} userId
     * @returns {Promise<Object>}
     */
    async getUserProfile(userId) {
        throw new Error("El método 'getUserProfile' debe ser implementado por un Adaptador.");
    }
    
    async checkUserRole(userId, requiredRole) {
        throw new Error("El método 'checkUserRole' debe ser implementado por un Adaptador.");
    }
}