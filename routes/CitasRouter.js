const express = require('express');
const router = express.Router();
const { createAppointment, getAllAppointments, updateAppointmentStatus } = require('../controllers/citasController');

const { protect, authorize } = require('../middleware/authMiddleware');
// Ruta POST para crear una cita
router.post('/', createAppointment);

// Obtener citas (solo admin)
router.get('/', protect, authorize(['admin']), getAllAppointments);

// Actualizar estado de cita (admin)
router.patch('/:id/status', protect, authorize(['admin']), updateAppointmentStatus);
module.exports = router;
