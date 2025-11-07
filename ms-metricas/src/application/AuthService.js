import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'sinergia_secret_dev_key';

export class AuthService {
    constructor(authRepository) {
        this.repository = authRepository;
    }

    async registerUser(userData) {
        const passwordHash = await bcrypt.hash(userData.password, SALT_ROUNDS);
        
        const newUser = await this.repository.registerUser({
            ...userData,
            passwordHash 
        });

        const token = this.generateToken(newUser);
        
        return { user: newUser, token };
    }

    async loginUser(email, password) {
        const user = await this.repository.findUserByEmail(email);

        if (!user) {
            throw new Error("Credenciales inválidas: Usuario no encontrado.");
        }

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            throw new Error("Credenciales inválidas: Contraseña incorrecta.");
        }

        const token = this.generateToken(user);
        
        const { password_hash, ...safeUser } = user;
        return { user: safeUser, token };
    }

    generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email, developerId: user.developer_id }, 
            JWT_SECRET, 
            { expiresIn: '1h' } 
        );
    }
}