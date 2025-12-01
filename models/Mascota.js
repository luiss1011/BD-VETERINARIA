const mongoose = require('mongoose');

const MascotaSchema = new mongoose.Schema({
  nombreMascota: { type: String, required: true },
  tipoMascota: { type: String, required: true },
  raza: { type: String, required: false },
  edad: { type: Number, required: false },
  sexo: { type: String, required: false },
  peso: { type: Number, required: false },
  color: { type: String, required: false },
  fechaNacimiento: { type: Date, required: false },
  notas: { type: String, required: false },
  vacunas: { type: Date, required: false },

  // 🔗 Relación con usuario (usando JWT)
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Mascota', MascotaSchema);
