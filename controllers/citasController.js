// const Citas = require('../models/Citas');
// REQUIRIMOS A LOS USUARIOS PARA ASOCIAR CADA CITA A UN USUARIO
// const User = require('../models/User');


// CREACION DEL CONTROLADOR
const Appointment = require('../models/Citas');
const User = require('../models/User');

// @desc    Crear una nueva cita
// @route   POST /api/appointments
// @access  Public
exports.createAppointment = async (req, res) => {
  try {
    const { clientId, date, service, notes } = req.body;

    // Verificar que el cliente exista
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Crear la cita
    const appointment = new Appointment({
      client: client._id,
      date,
      service,
      notes
    });

    await appointment.save();

    res.status(201).json({ message: 'Cita agendada correctamente', appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agendar la cita' });
  }
};
