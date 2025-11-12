const express = require('express');
const router = express.Router();
const { createAppointment } = require('../controllers/CitasController');

// Ruta POST para crear una cita
router.post('/appointments', createAppointment);

module.exports = router;
