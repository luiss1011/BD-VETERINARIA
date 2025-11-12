const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Registro de usuario (con validación y hash de contraseña)
exports.register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
    try {
        // Verifica si el usuario o email ya existen
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(409).json({ mensaje: 'El usuario o correo ya existe' });
        }
        // Hashea la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        return res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
    } catch (e) {
        return res.status(500).json({ mensaje: 'Error al registrar usuario', error: e });
    }
};

// Obtener todos los perfiles
exports.buscarTodo = async (req, res) => {
  try {
    const profiles = await User.find({});
    if (profiles.length) {
      return res.status(200).json({ profiles });
    }
    return res.status(204).json({ mensaje: 'No hay perfiles registrados' });
  } catch (e) {
    return res.status(404).json({ mensaje: `Error al consultar la información: ${e}` });
  }
};

// Agregar un perfil (solo para admin normalmente)
exports.agregarPerfil = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const info = await newUser.save();
    return res.status(200).json({
      mensaje: 'Perfil creado correctamente',
      info
    });
  } catch (e) {
    return res.status(404).json({ mensaje: `Error al crear el perfil: ${e}` });
  }
};

// Buscar perfil por campo dinámico
exports.buscarPerfil = async (req, res, next) => {
  req.body = req.body || {}; // <-- Agrega esto
  let consulta = {};
  consulta[req.params.key || '_id'] = req.params.value;
  try {
    const profiles = await User.find(consulta);
    req.body.profiles = profiles;
    return next();
  } catch (e) {
    req.body.e = e;
    return next();
  }
};

// Mostrar perfil encontrado
exports.mostrarPerfil = (req, res) => {
  if (req.body.e) return res.status(404).json({ mensaje: 'Error al consultar la información' });
  if (!req.body.profiles) return res.status(204).json({ mensaje: 'No hay nada que mostrar' });
  return res.status(200).json({ profiles: req.body.profiles });
};

// Eliminar perfil por campo dinámico (solo admin)
exports.eliminarPerfil = async (req, res) => {
  const profiles = req.body.profiles;
  try {
    await User.deleteOne(profiles[0]);
    return res.status(200).json({ mensaje: 'Perfil eliminado' });
  } catch (e) {
    return res.status(404).json({ mensaje: 'Error al eliminar el perfil', e });
  }
};

// Modificar perfil por campo dinámico
exports.modificarPerfil = async (req, res) => {
  const profiles = req.body.profiles;
  if (!profiles || !profiles.length) {
    return res.status(404).json({ mensaje: 'No se encontró el perfil' });
  }
  try {
    // Solo actualiza los campos permitidos
    const updateFields = {};
    if (req.body.username) updateFields.username = req.body.username;
    if (req.body.bio !== undefined) updateFields.bio = req.body.bio;
    if (req.body.avatarUrl !== undefined) updateFields.avatarUrl = req.body.avatarUrl;

    const updated = await require('../models/User').findByIdAndUpdate(
      profiles[0]._id,
      { $set: updateFields },
      { new: true }
    );
    return res.status(200).json({ mensaje: 'Perfil actualizado correctamente', profile: updated });
  } catch (e) {
    return res.status(404).json({ mensaje: 'Error al modificar el perfil', e });
  }
};