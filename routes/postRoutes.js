const express = require('express');
const router = express.Router();
const {
  buscarTodo,
  agregarPost,
  buscarPost,
  mostrarPost,
  eliminarPost,
  modificarPost
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// Obtener todas las publicaciones
router.get('/', buscarTodo);

// Agregar una publicación
router.post('/', protect, agregarPost);

// Buscar publicación por campo dinámico
router.get('/:key/:value', buscarPost, mostrarPost);

// Eliminar publicación por campo dinámico
router.delete('/:key/:value', protect, buscarPost, eliminarPost);

// Modificar publicación por campo dinámico
router.put('/:key/:value', protect, buscarPost, modificarPost);

module.exports = router;