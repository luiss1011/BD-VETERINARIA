const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  crearRecordatorio,
  obtenerRecordatorios,
  marcarComoCompletado,
  eliminarRecordatorio
} = require("../controllers/recordatorioController");

router.post("/", protect, crearRecordatorio);
router.get("/", protect, obtenerRecordatorios);
router.put("/:id/completar", protect, marcarComoCompletado);
router.delete("/:id", protect, eliminarRecordatorio);


module.exports = router;
