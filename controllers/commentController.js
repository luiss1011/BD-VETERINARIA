const Comment = require('../models/Comment');
const Post = require('../models/Post'); // Para verificar si la publicación existe

// @desc    Obtener comentarios de una publicación
// @route   GET /api/posts/:postId/comments
// @access  Public
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId }).sort({ createdAt: 1 }); // Comentarios en orden cronológico
    res.status(200).json({ message: 'Comentarios obtenidos exitosamente', comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al obtener comentarios.' });
  }
};

// @desc    Agregar un comentario a una publicación
// @route   POST /api/posts/:postId/comments
// @access  Private
exports.addComment = async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  if (!content) {
    return res.status(400).json({ message: 'El contenido del comentario es obligatorio.' });
  }

  try {
    // Opcional: Verificar que la publicación exista
    const postExists = await Post.findById(postId);
    if (!postExists) {
      return res.status(404).json({ message: 'Publicación no encontrada para añadir el comentario.' });
    }

    const newComment = await Comment.create({
      content,
      user: req.user._id, // Viene del middleware 'protect'
      username: req.user.username, // Viene del middleware 'protect'
      post: postId
    });
    res.status(201).json({ message: 'Comentario agregado exitosamente', comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al agregar el comentario.' });
  }
};

// @desc    Actualizar un comentario
// @route   PUT /api/comments/:id
// @access  Private (Solo el propietario o un admin)
exports.updateComment = async (req, res) => {
  const { content } = req.body;

  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado.' });
    }

    // Verificar si el usuario es el propietario o un admin
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado para actualizar este comentario.' });
    }

    comment.content = content || comment.content;
    const updatedComment = await comment.save();
    res.status(200).json({ message: 'Comentario actualizado exitosamente', comment: updatedComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al actualizar el comentario.' });
  }
};

// @desc    Eliminar un comentario
// @route   DELETE /api/comments/:id
// @access  Private (Solo el propietario o un admin)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado.' });
    }

    // Verificar si el usuario es el propietario, el admin o el dueño de la publicación
    const post = await Post.findById(comment.post);
    if (comment.user.toString() !== req.user._id.toString() &&
        (post && post.user.toString() !== req.user._id.toString()) && // Si eres dueño del post, también puedes borrar el comentario
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado para eliminar este comentario.' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comentario eliminado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al eliminar el comentario.' });
  }
};

// Buscar todos los comentarios
exports.buscarTodo = async (req, res) => {
  try {
    const comments = await Comment.find({});
    if (comments.length) {
      return res.status(200).json({ comments });
    }
    return res.status(204).json({ mensaje: 'No hay comentarios registrados' });
  } catch (e) {
    return res.status(404).json({ mensaje: `Error al consultar la información: ${e}` });
  }
};

// Agregar un comentario
exports.agregarComment = async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const info = await newComment.save();
    return res.status(200).json({
      mensaje: 'La información se guardó correctamente',
      info
    });
  } catch (e) {
    return res.status(404).json({ mensaje: `Error al guardar la información: ${e}` });
  }
};

// Buscar comentario por campo dinámico
exports.buscarComment = async (req, res, next) => {
  if (!req.body) req.body = {}; // <-- Esta línea previene el error
  let consulta = {};
  consulta[req.params.key || 'post'] = req.params.value;
  try {
    const comments = await Comment.find(consulta);
    req.body.comments = comments;
    return next();
  } catch (e) {
    req.body.e = e;
    return next();
  }
};

// Mostrar comentario encontrado
exports.mostrarComment = (req, res) => {
  if (req.body.e) return res.status(404).json({ mensaje: 'Error al consultar la información' });
  if (!req.body.comments) return res.status(204).json({ mensaje: 'No hay nada que mostrar' });
  return res.status(200).json({ comments: req.body.comments });
};

// Eliminar comentario por campo dinámico
exports.eliminarComment = async (req, res) => {
  const comments = req.body.comments;
  try {
    await Comment.deleteOne(comments[0]);
    return res.status(200).json({ mensaje: 'Registro eliminado' });
  } catch (e) {
    return res.status(404).json({ mensaje: 'Error al eliminar la información', e });
  }
};

// Modificar comentario por campo dinámico
exports.modificarComment = async (req, res) => {
  const comments = req.body.comments;
  if (!comments || !comments.length) {
    return res.status(404).json({ mensaje: 'No se encontró el comentario' });
  }
  try {
    await Comment.updateOne(comments[0], req.body);
    return res.status(200).json({ mensaje: 'Se registró correctamente :)' });
  } catch (e) {
    return res.status(404).json({ mensaje: 'Error al modificar la información', e });
  }
};

function checkAuthStatus() {
    if (currentToken) {
        showMainAppScreen();
        fetchPosts();
        document.getElementById('userWelcome').textContent = `¡Hola, ${currentUsername}!`;
    } else {
        // Limpiar campos al mostrar login
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('registerUsername').value = '';
        document.getElementById('registerPassword').value = '';
        showScreen('authScreen');
        showAuthTab('loginTab');
    }
}

function showAuthTab(tabId) {
    document.querySelectorAll('#authScreen .tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (tabId === 'loginTab') {
        document.getElementById('loginTabButton').classList.add('active');
        // Limpiar campos de login cada vez que se abre el tab
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
    } else {
        document.getElementById('registerTabButton').classList.add('active');
        // Limpiar campos de registro cada vez que se abre el tab
        document.getElementById('registerUsername').value = '';
        document.getElementById('registerPassword').value = '';
    }
}