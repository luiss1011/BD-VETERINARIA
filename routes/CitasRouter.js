const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const citasController = require("../controllers/citasController");
const { obtenerCitasUsuario } = require("../controllers/obtenerCitasUsuario");
const User = require('../models/User');
const Appointment = require("../models/Citas");
const transporter = require("../config/mailer");


router.post("/crear", protect, citasController.crearCita);

router.get("/mis-citas", protect, obtenerCitasUsuario);

// Obtener todas las citas (ADMIN)
// router.get('/admin', async (req, res) => {
//   try {
//     const citas = await Appointment.find()
//       .populate('client', 'fullName email')
//       .populate('mascota', 'nombreMascota tipoMascota raza');

//     res.json(citas);

//   } catch (error) {
//     console.error("Error al obtener citas:", error);
//     res.status(500).json({ message: "Error al obtener citas" });
//   }
// });

router.get('/admin', async (req, res) => {
  try {
    const citas = await Appointment.find({ status: "pendiente" })
      .populate('client', 'fullName email')
      .populate('mascota', 'nombreMascota tipoMascota raza');

    res.json(citas);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener citas" });
  }
});


router.put('/:id/accept', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "confirmada" },
      { new: true }
    )
    .populate("client", "fullName email")
    .populate("mascota", "nombreMascota");

    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    // ✅ ENVÍO DE EMAIL
    await transporter.sendMail({
      from: `"Veterinaria Patitas" <${process.env.EMAIL_USER}>`,
      to: appointment.client.email,
      subject: "✅ Tu cita ha sido confirmada",
      html: `
        <h2>Hola ${appointment.client.fullName}</h2>
        <p>Tu cita para <strong>${appointment.mascota.nombreMascota}</strong> ha sido <b>CONFIRMADA</b>.</p>
        <p><b>Fecha:</b> ${new Date(appointment.date).toLocaleString()}</p>
        <p><b>Servicio:</b> ${appointment.service}</p>
        <p><b>Motivo:</b> ${appointment.motivo}</p>
        <br>
        <p>Gracias por confiar en <b>Veterinaria Patitas</b> 🐾</p>
      `
    });

    res.json({ 
      message: "Cita aceptada y correo enviado",
      appointment 
    });

  } catch (error) {
    console.error("Error al aceptar cita:", error);
    res.status(500).json({ message: "Error al aceptar cita", error });
  }
});

router.put('/:id/reject', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelada" },
      { new: true }
    )
    .populate("client", "fullName email")
    .populate("mascota", "nombreMascota");

    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    // ✅ ENVÍO DE EMAIL
    await transporter.sendMail({
      from: `"Veterinaria Patitas" <${process.env.EMAIL_USER}>`,
      to: appointment.client.email,
      subject: "❌ Tu cita ha sido cancelada",
      html: `
        <h2>Hola ${appointment.client.fullName}</h2>
        <p>Lamentamos informarte que tu cita para 
        <strong>${appointment.mascota.nombreMascota}</strong> ha sido <b>CANCELADA</b>.</p>
        <p><b>Fecha:</b> ${new Date(appointment.date).toLocaleString()}</p>
        <p><b>Servicio:</b> ${appointment.service}</p>
        <br>
        <p>Puedes agendar una nueva cita cuando lo desees 🐾</p>
      `
    });

    res.json({ 
      message: "Cita cancelada y correo enviado",
      appointment 
    });

  } catch (error) {
    console.error("Error al rechazar cita:", error);
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


// ✅ HISTORIAL ADMIN
// router.get('/admin/historial', async (req, res) => {
//   try {
//     const citas = await Appointment.find({
//       status: { $in: ["finalizada", "cancelada"] }
//     })
//     .populate('client', 'fullName email')
//     .populate('mascota', 'nombreMascota tipoMascota');

//     res.json(citas);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al obtener historial" });
//   }
// });
router.get('/admin/historial', async (req, res) => {
  try {
    const citas = await Appointment.find({
      status: { $in: ["confirmada", "finalizada", "cancelada"] }
    })
    .populate('client', 'fullName email')
    .populate('mascota', 'nombreMascota tipoMascota');

    res.json(citas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener historial" });
  }
});



router.put('/:id/diagnostico', async (req, res) => {
  const { diagnostico, observaciones, veterinario } = req.body;

  try {
    const cita = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        diagnostico,
        observaciones,
        veterinario,
        status: "finalizada"
      },
      { new: true }
    )
    .populate("client", "fullName email")
    .populate("mascota", "nombreMascota");

    res.json({
      message: "Cita finalizada y diagnóstico guardado",
      cita
    });

  } catch (error) {
    res.status(500).json({ message: "Error al guardar diagnóstico" });
  }
});



module.exports = router;
