const Appointment = require('../models/Citas');
const Mascota = require('../models/Mascota');
const User = require('../models/User');

exports.crearCita = async (req, res) => {
  try {
    const userId = req.user.id; // 🟢 viene del token
    const {
      mascotaId,
      fecha,
      hora,
      tipoServicio,
      motivo,
      notas,
      veterinario
    } = req.body;

    // ❌ Validaciones básicas
    if (!mascotaId) return res.status(400).json({ message: "Debe seleccionar una mascota" });
    if (!fecha || !hora) return res.status(400).json({ message: "Debe seleccionar fecha y hora" });
    if (!tipoServicio) return res.status(400).json({ message: "Debe seleccionar un servicio" });
    if (!motivo) return res.status(400).json({ message: "Debe escribir un motivo" });

    // 🔎 Verificar mascota pertenece al usuario
    const mascota = await Mascota.findOne({ _id: mascotaId, usuarioId: userId });

    if (!mascota) {
      return res.status(404).json({ message: "Mascota no encontrada o no pertenece al usuario" });
    }

    // 📆 Unir fecha y hora en un solo Date
    const fechaCompleta = new Date(`${fecha}T${hora}:00`);

    const nuevaCita = await Appointment.create({
      client: userId,
      mascota: mascotaId,
      date: fechaCompleta,
      service: tipoServicio,
      motivo,
      notes: notas || "",
      veterinario: veterinario || "",
    });

    res.status(201).json({
      message: "Cita creada correctamente",
      cita: nuevaCita
    });

  } catch (error) {
    console.error("Error al crear cita:", error);
    res.status(500).json({ message: "Error al crear la cita" });
  }
};
