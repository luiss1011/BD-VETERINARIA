const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'El contenido del comentario es obligatorio'],
    trim: true,
    maxlength: [500, 'El comentario no puede exceder los 500 caracteres']
  },
  user: { // Referencia al usuario que hizo el comentario
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: { // Para mostrar el nombre del usuario
    type: String,
    required: true
  },
  post: { // Referencia a la publicación a la que pertenece el comentario
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comment', CommentSchema);