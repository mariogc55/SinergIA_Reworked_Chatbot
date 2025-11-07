import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sinergia_secret_dev_key';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            message: "Acceso denegado: No se proporcionó token (formato esperado: Bearer <token>)." 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded; 
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expirado. Vuelva a iniciar sesión." });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Token inválido." });
        }
        return res.status(500).json({ message: "Error de autenticación interna." });
    }
};