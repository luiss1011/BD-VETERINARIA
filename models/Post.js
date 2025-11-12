const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título de la publicación es obligatorio'],
    trim: true,
    maxlength: [100, 'El título no puede exceder los 100 caracteres']
  },
  content: {
    type: String,
    required: [true, 'El contenido de la publicación es obligatorio']
  },
  imageUrl: { // URL de la imagen (podrías integrar con un servicio de subida de imágenes como Cloudinary)
    type: String,
    default: 'https://via.placeholder.com/400x300.png?text=No+Image' // Imagen por defecto
  },
  user: { // Referencia al usuario que creó la publicación
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: { // Para mostrar el nombre del usuario sin necesidad de población extra
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);