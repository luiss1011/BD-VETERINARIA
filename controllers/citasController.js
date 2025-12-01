// const Citas = require('../models/Citas');
// REQUIRIMOS A LOS USUARIOS PARA ASOCIAR CADA CITA A UN USUARIO
// const User = require('../models/User');


// CREACION DEL CONTROLADOR
const Appointment = require('../models/Citas');
const User = require('../models/User');

// @desc    Crear una nueva cita
// @route   POST /api/appointments
// @access  Public
// exports.createAppointment = async (req, res) => {
//   try {
//     const { clientId, date, service, notes } = req.body;

//     // Verificar que el cliente exista
//     const client = await User.findById(clientId);
//     if (!client) {
//       return res.status(404).json({ message: 'Cliente no encontrado' });
//     }

//     // Crear la cita
//     const appointment = new Appointment({
//       client: client._id,
//       date,
//       service,
//       notes
//     });

//     await appointment.save();

//     res.status(201).json({ message: 'Cita agendada correctamente', appointment });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error al agendar la cita' });
//   }
// };
// TERMINA FUNCION FUNCIONAL ANTES


// INICIA NUEVO CONTROLADOR
exports.createAppointment = async (req, res) => {
  // ✅ Si usas JWT, el userId debería venir del token (mejor que del body)
  // Pero como estás pasando clientId en el body, lo dejamos por ahora (¡pero cuidado con spoofing!)

  try {
    const { date, service, notes } = req.body;

    // ✅ Obtener userId del token (recomendado) — ver más abajo cómo hacerlo
    // const userId = req.user.id;  ← ideal

    // ⚠️ Si insistes en recibir clientId del frontend, al menos:
    const clientId = req.body.clientId || req.user?.id; // fallback

    if (!clientId) {
      return res.status(400).json({ message: 'Usuario no autenticado' });
    }

    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const appointment = new Appointment({
      client: client._id,
      date: new Date(date), // asegurar que sea Date
      service,
      notes: notes || '',
      // status: 'pendiente' ← por defecto en el schema
    });

    await appointment.save();

    res.status(201).json({
      message: 'Cita agendada correctamente',
      appointment: {
        id: appointment._id,
        date: appointment.date,
        service: appointment.service,
        status: appointment.status
      }
    });

  } catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({ message: 'Error al agendar la cita' });
  }
};



// ENDPOIN PARA TRAER LAS CITAS
// @desc    Obtener todas las citas (solo admin)
// @route   GET /api/appointments
// @access  Admin
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('client', 'fullName email role') // ajusta campos según tu modelo User
      .sort({ createdAt: -1 }); // más recientes primero

    res.status(200).json({
      total: appointments.length,
      appointments
    });

  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ message: 'Error al obtener la lista de citas' });
  }
};


// CONTROLADOR PARA APROBAR/CANCELAR LAS CITAS
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pendiente', 'confirmada', 'cancelada'].includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('client', 'fullName email phone');

    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.status(200).json({
      message: "Estado actualizado",
      appointment
    });

  } catch (error) {
    console.error("Error al actualizar cita:", error);
    res.status(500).json({ message: "Error al actualizar estado" });
  }
};
