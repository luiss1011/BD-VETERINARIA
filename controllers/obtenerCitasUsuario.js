const Appointment = require('../models/Citas');
const Mascota = require('../models/Mascota');

exports.obtenerCitasUsuario = async (req, res) => {
  try {
    const userId = req.user.id;

    const citas = await Appointment.find({ client: userId })
      .populate("mascota", "nombreMascota tipoMascota raza")
      .sort({ date: 1 });

    const ahora = new Date();

    // ✅ FUTURAS: solo confirmadas y con fecha futura
    const futuras = citas.filter(c =>
      c.status === "confirmada" && c.date >= ahora
    );

    // ✅ HISTORIAL: canceladas + confirmadas pasadas
    const pasadas = citas.filter(c =>
      c.status === "cancelada" ||
      (c.status === "confirmada" && c.date < ahora)
    );

    res.json({
      futuras,
      pasadas
    });

  } catch (error) {
    console.error("Error al obtener citas:", error);
    res.status(500).json({ message: "Error al obtener citas" });
  }
};
