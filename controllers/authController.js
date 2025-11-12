const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función para generar JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { username, password, email, fullName, phone } = req.body;

  // Validaciones básicas
  if (!username || !password) {
    return res.status(400).json({ message: 'Por favor, ingrese un nombre de usuario y una contraseña.' });
  }

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe.' });
    }

    user = await User.create({
      username,
      password,
      email,
      fullName,
      phone,
      role: 'user' // Todos los usuarios registrados son 'user' por defecto
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
    }
    res.status(500).json({ message: 'Error en el servidor al registrar usuario.' });
  }
};

// @desc    Iniciar sesión de usuario
// @route   POST /api/auth/login
// // @access  Public
// exports.login = async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ username });
//   if (!user) {
//     return res.status(401).json({ message: 'Usuario no encontrado' });
//   }
//   const isMatch = await user.comparePassword(password);
//   if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

//   const token = generateToken(user._id, user.role);

//   res.status(200).json({
//     message: 'Login exitoso',
//     token,
//     user: { id: user._id, username: user.username, role: user.role }
//   });
// };


// controllers/authController.js
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validaciones básicas
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
  }
  

  try {
    // ✅ Buscar por email (asegúrate de que el campo se llama `email` en tu modelo 👍)
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' }); // 👈 evitar "usuario no encontrado" por seguridad
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' }); // 👈 mismo mensaje para evitar enumeración de usuarios
    }

    // 👇 Asumiendo que tienes una función `generateToken` que ya funciona
    const token = generateToken(user._id, user.role);

    // ✅ Respuesta limpia y segura (sin exponer password, etc.)
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};