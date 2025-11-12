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