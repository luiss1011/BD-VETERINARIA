const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateName, validatePhone, validatePassword, validateEmail } = require("../utils/validation");

// Generar token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.register = async (req, res) => {
  const { username, password, email, fullName, phone } = req.body;

  // Validaciones básicas
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, email y contraseña son obligatorios.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Email inválido" });
  }

  if (!validateName(fullName)) {
    return res.status(400).json({
      error: "Nombre inválido: solo letras y espacios, sin caracteres especiales."
    });
  }

  if (!validatePhone(phone)) {
    return res.status(400).json({
      error: "Número de teléfono inválido: debe tener 10 dígitos."
    });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      error: "Contraseña insegura: mínimo 8 caracteres, incluye mayúscula, minúscula, número y símbolo."
    });
  }

  try {
    // Validar usuario duplicado
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe.' });
    }

    let userEmail = await User.findOne({ email });
    if (userEmail) {
      return res.status(400).json({ message: 'El email ya está registrado.' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    user = await User.create({
      username,
      password,
      email,
      fullName,
      phone,
      role: 'user'
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
    res.status(500).json({ message: 'Error en el servidor al registrar usuario.' });
  }
};



// controllers/authController.js
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validaciones básicas
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
  }
  

  try {
    // Buscar por email (asegúrate de que el campo se llama `email` en tu modelo)
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' }); //  evitar "usuario no encontrado" por seguridad
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' }); // mismo mensaje para evitar enumeración de usuarios
    }

    // Asumiendo que tienes una función `generateToken` que ya funciona
    const token = generateToken(user._id, user.role);

    // Respuesta limpia y segura (sin exponer password, etc.)
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