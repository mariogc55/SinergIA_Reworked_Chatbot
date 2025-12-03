import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'sinergia_secret_dev_key';
const SALT_ROUNDS = 10;

const generateToken = (developerId, email, name) => {
    return jwt.sign({ developerId, email, name }, JWT_SECRET, {
        expiresIn: '1d',
    });
};

export const AuthController = (authRepository) => ({
    async register(req, res) {
        if (!req.body) {
            return res.status(400).json({ error: 'Cuerpo de la solicitud vacío.' });
        }

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ error: 'Faltan campos requeridos: name, email, password.' });
        }

        try {
            const existingUser = await authRepository.findUserByEmail(email);
            if (existingUser) {
                return res
                    .status(409)
                    .json({ error: 'El correo electrónico ya está en uso.' });
            }

            const developer_id = await authRepository.generateNextDeveloperId();
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            const user = await authRepository.registerUser({
                developer_id,
                name,
                email,
                password: hashedPassword,
            });

            const token = generateToken(user.developer_id, user.email, user.name);

            res.status(201).json({
                token,
                user: {
                    developer_id: user.developer_id,
                    name: user.name,
                    email: user.email,
                },
            });
        } catch (error) {
            console.error('Error en register:', error);
            res
                .status(500)
                .json({ error: 'Error interno del servidor al registrar el usuario.' });
        }
    },

    async login(req, res) {
        if (!req.body) {
            return res.status(400).json({ error: 'Cuerpo de la solicitud vacío.' });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: 'Faltan campos requeridos: email, password.' });
        }

        try {
            const user = await authRepository.findUserByEmail(email);

            if (!user) {
                return res.status(401).json({ error: 'Credenciales inválidas.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ error: 'Credenciales inválidas.' });
            }

            const token = generateToken(user.developer_id, user.email, user.name);

            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({
                token,
                user: {
                    developer_id: userWithoutPassword.developer_id,
                    name: userWithoutPassword.name,
                    email: userWithoutPassword.email,
                },
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ error: 'Error del servidor al iniciar sesión.' });
        }
    },
});
