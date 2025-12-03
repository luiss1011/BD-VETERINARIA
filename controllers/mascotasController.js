const Mascota = require('../models/Mascota');

exports.eliminarMascota = async (req, res) => {
  try {
    const mascota = await Mascota.findOne({
      _id: req.params.id,
      usuarioId: req.user.id   // se asegura que solo elimine sus propias mascotas
    });

    if (!mascota) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }

    await mascota.deleteOne();

    res.json({ message: "Mascota eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar mascota" });
  }
};
