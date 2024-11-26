const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    const token = req.header('x-auth-token');
    
    if (!token) {
        return res.status(401).json({msg: 'No hay token, permiso no válido'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({msg: 'Token no válido'});
    }
}