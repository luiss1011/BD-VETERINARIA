const express = require('express');
const router = express.Router();
const Mascota = require('../models/Mascota');
const { protect } = require('../middleware/authMiddleware');
const  mascotasController = require('../controllers/mascotasController')

router.post('/crear', protect, async (req, res) => {
  try {
    const mascota = await Mascota.create({
      ...req.body,
      usuarioId: req.user.id
    });

    res.json({
      message: "Mascota registrada correctamente",
      mascota
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al registrar la mascota" });
  }
});

// GET mascotas por usuario autenticado
router.get('/mis-mascotas', protect, async (req, res) => {
  try {
    const mascotas = await Mascota.find({ usuarioId: req.user.id });
    res.json(mascotas);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener mascotas" });
  }
});

router.delete("/eliminar/:id", protect, mascotasController.eliminarMascota);


module.exports = router;
