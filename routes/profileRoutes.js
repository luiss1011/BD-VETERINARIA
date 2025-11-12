const express = require('express');
const router = express.Router();
const {
  buscarTodo,
  agregarPerfil,
  buscarPerfil,
  mostrarPerfil,
  eliminarPerfil,
  modificarPerfil
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// @desc    Obtener información del perfil del usuario autenticado
// @route   GET /api/profile
// @access  Private (Necesita JWT)
router.get('/', protect, buscarTodo);

// @desc    Agregar un perfil
// @route   POST /api/profile
// @access  Private (Necesita JWT)
router.post('/', protect, agregarPerfil);

// @desc    Buscar perfil por campo dinámico
// @route   GET /api/profile/:key/:value
// @access  Private (Necesita JWT)
router.get('/:key/:value', protect, buscarPerfil, mostrarPerfil);

// @desc    Eliminar perfil por campo dinámico
// @route   DELETE /api/profile/:key/:value
// @access  Private (Necesita JWT)
router.delete('/:key/:value', protect, buscarPerfil, eliminarPerfil);

// @desc    Modificar perfil por campo dinámico
// @route   PUT /api/profile/:key/:value
// @access  Private (Necesita JWT)
router.put('/:key/:value', protect, buscarPerfil, modificarPerfil);

module.exports = router;