const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  //  1. Validar existencia y formato del header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado, token no válido.' });
  }

  const token = authHeader.split(' ')[1];

  //  2. Validar que el token no venga vacío
  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ message: 'No autorizado, token vacío.' });
  }

  try {
    // 3. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Adjuntar usuario (sin password)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Usuario no existe.' });
    }

    req.user = user;
    req.userRole = decoded.role;

    next();

  } catch (error) {
    console.error('Error JWT:', error.message);
    return res.status(401).json({ message: 'Token inválido o expirado.' });
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