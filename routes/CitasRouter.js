const express = require('express');
const router = express.Router();
const { createAppointment } = require('../controllers/citasController');

// Ruta POST para crear una cita
router.post('/', createAppointment);

module.exports = router;
