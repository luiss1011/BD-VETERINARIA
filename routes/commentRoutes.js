const express = require('express');
const router = express.Router();
const {
  buscarTodo,
  agregarComment,
  buscarComment,
  mostrarComment,
  eliminarComment,
  modificarComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Obtener todos los comentarios
router.get('/', buscarTodo);

// Agregar un comentario
router.post('/', protect, agregarComment);

// Buscar comentario por campo dinámico
router.get('/:key/:value', buscarComment, mostrarComment);

// Eliminar comentario por campo dinámico
router.delete('/:key/:value', buscarComment, eliminarComment);

// Modificar comentario por campo dinámico
router.put('/:key/:value', buscarComment, modificarComment);

// Obtener comentarios por ID de publicación
router.get('/post/:value', buscarComment, mostrarComment);

module.exports = router;