const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const citasController = require("../controllers/citasController");
const { obtenerCitasUsuario } = require("../controllers/obtenerCitasUsuario");
const Usuario = require('../models/User');
const Appointment = require("../models/Citas");


router.post("/crear", protect, citasController.crearCita);

router.get("/mis-citas", protect, obtenerCitasUsuario);

// Obtener todas las citas (ADMIN)
router.get('/admin', async (req, res) => {
  try {
    const citas = await Appointment.find()
      .populate('client', 'fullName email')
      .populate('mascota', 'nombreMascota tipoMascota raza');

    res.json(citas);

  } catch (error) {
    console.error("Error al obtener citas:", error);
    res.status(500).json({ message: "Error al obtener citas" });
  }
});


// Aceptar cita
router.put('/:id/accept', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "confirmada" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.json({ message: "Cita aceptada", appointment });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al aceptar cita", error });
  }
});

// Rechazar cita
router.put('/:id/reject', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelada" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.json({ message: "Cita rechazada", appointment });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al rechazar cita", error });
  }
});


router.get('/admin/status/:status', async (req, res) => {
  try {
    const citas = await Appointment.find({ status: req.params.status })
      .populate('client', 'fullName email')
      .populate('mascota', 'nombreMascota tipoMascota raza');

    res.json(citas);

  } catch (error) {
    res.status(500).json({ message: "Error al filtrar citas", error });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const citas = await Appointment.find({ client: req.params.id })
      .populate('mascota', 'nombreMascota');

    res.json(citas);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener citas del usuario", error });
  }
});


module.exports = router;
