import jwt from 'jsonwebtoken';
const JWT_SECRET = 'TU_SECRETO_DE_JWT';

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, JWT_SECRET);

            req.user = decoded; 

            next();
        } catch (error) {
            console.error('Error de token JWT:', error);
            res.status(401).json({ error: 'No autorizado, token fallido o expirado.' });
        }
    }

    if (!token) {
        res.status(401).json({ error: 'No autorizado, no hay token.' });
    }
};

export { protect };