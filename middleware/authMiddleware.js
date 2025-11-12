const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener el token del encabezado
      token = req.headers.authorization.split(' ')[1];

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Adjuntar el usuario a la solicitud (sin la contraseña)
      req.user = await User.findById(decoded.id).select('-password');
      req.userRole = decoded.role; // También el rol

      next(); // Continuar con la siguiente función de middleware/ruta
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'No autorizado, token fallido o expirado.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no hay token.' });
  }
};

// Middleware de autorización basado en roles
const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles]; // Si es un string, conviértelo en un array
  }

  return (req, res, next) => {
    if (roles.length && !roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Acceso denegado, no tiene los permisos necesarios.' });
    }
    next();
  };
};

module.exports = { protect, authorize };