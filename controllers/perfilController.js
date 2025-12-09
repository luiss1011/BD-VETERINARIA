const User = require("../models/User");

exports.obtenerPerfil = async (req, res) => {
  try {
    const userId = req.user.id;

    const usuario = await User.findById(userId)
      .select("-password"); 

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuario);

  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
};

exports.actualizarPerfil = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, fullName, email, phone } = req.body;

    const usuarioActualizado = await User.findByIdAndUpdate(
      userId,
      { username, fullName, email, phone },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Perfil actualizado correctamente",
      usuario: usuarioActualizado
    });

  } catch (error) {
    console.error("Error al actualizar perfil:", error);

    // ✅ Manejo de error por email o username duplicado
    if (error.code === 11000) {
      return res.status(400).json({
        message: "El usuario o correo ya están registrados"
      });
    }

    res.status(500).json({ message: "Error al actualizar perfil" });
  }
};
