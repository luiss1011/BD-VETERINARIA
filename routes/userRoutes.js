const express = require("express");
const router = express.Router();
const { obtenerPerfil, actualizarPerfil } = require("../controllers/perfilController");
const {protect} = require("../middleware/authMiddleware");

router.get("/perfil", protect, obtenerPerfil);
router.put("/perfil", protect, actualizarPerfil);

module.exports = router;
