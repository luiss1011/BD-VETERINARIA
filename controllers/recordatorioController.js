const Recordatorio = require("../models/Recordatorio");
const User = require("../models/User");

exports.crearRecordatorio = async (req, res) => {
  try {
    const userId = req.user.id;
    const { titulo, descripcion, fecha, hora, mascota } = req.body;

    // ✅ Validación de campos obligatorios
    if (!titulo || !fecha || !hora || !mascota) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios"
      });
    }

    // ✅ Construcción segura de fecha y hora
    const fechaHora = new Date(`${fecha}T${hora}:00`);
    const ahora = new Date();

    // ✅ Validación REAL de seguridad
    if (isNaN(fechaHora.getTime())) {
      return res.status(400).json({
        message: "Fecha u hora inválidas"
      });
    }

    if (fechaHora <= ahora) {
      return res.status(400).json({
        message: "La fecha y hora deben ser mayores a la fecha y hora actuales"
      });
    }

    // ✅ Crear recordatorio
    const nuevo = await Recordatorio.create({
      user: userId,
      mascota,
      titulo,
      descripcion,
      fechaHora
    });

    res.status(201).json({
      message: "Recordatorio creado correctamente",
      recordatorio: nuevo
    });

  } catch (error) {
    console.error("Error al crear recordatorio:", error);
    res.status(500).json({
      message: "Error interno al crear recordatorio"
    });
  }
};

exports.obtenerRecordatorios = async (req, res) => {
  try {
    const recordatorios = await Recordatorio.find({
      user: req.user.id
    })
    .populate("mascota")  // ✅ trae los datos de la mascota
    .sort({ fechaHora: 1 });

    res.json(recordatorios);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener recordatorios" });
  }
};


exports.marcarComoCompletado = async (req, res) => {
  try {
    const recordatorio = await Recordatorio.findByIdAndUpdate(
      req.params.id,
      { completado: true },
      { new: true }
    );

    res.json({ message: "Recordatorio completado", recordatorio });

  } catch (error) {
    res.status(500).json({ message: "Error al completar recordatorio" });
  }
};


exports.eliminarRecordatorio = async (req, res) => {
  try {
    await Recordatorio.findByIdAndDelete(req.params.id);
    res.json({ message: "Recordatorio eliminado" });

  } catch (error) {
    res.status(500).json({ message: "Error al eliminar recordatorio" });
  }
};

