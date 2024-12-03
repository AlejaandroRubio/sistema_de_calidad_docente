const jwt = require('jsonwebtoken');

// Middleware para proteger rutas que requieren autenticación.
exports.protect = (req, res, next) => {
    const token = req.header('x-auth-token');
    
    if (!token) {
        // Si no se proporciona un token, responde con un error 401 (no autorizado).
        return res.status(401).json({msg: 'No hay token, permiso no válido'});
    }

    try {
        // Verifica y decodifica el token utilizando la clave secreta.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Almacena los datos del usuario en la solicitud para su uso posterior.
        next(); // Continúa con el siguiente middleware o controlador.
    } catch (error) {
        console.error(error);// Muestra cualquier error en la consola.
        // Responde con un error 401 si el token no es válido.
        res.status(401).json({msg: 'Token no válido'});
    }
}

// Verifica la validez de un token sin proteger una ruta.
exports.verifyToken = (req, res) => {
    const token = req.header('x-auth-token'); // Obtiene el token del encabezado.

    try {
        // Intenta verificar el token.
        jwt.verify(token, process.env.JWT_SECRET);
        res.json(true); // Responde con 'true' si el token es válido.
    } catch (error) {
        res.json(false); // Responde con 'false' si el token no es válido.
    }
}