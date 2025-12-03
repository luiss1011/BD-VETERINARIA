const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',   // 🟢 tu modelo es "Usuario"
    required: true
  },
  mascota: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mascota',   // 🟢 referencia a mascota
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  service: {
    type: String,
    required: true
  },
  motivo: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  veterinario: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ['pendiente', 'confirmada', 'cancelada'],
    default: 'pendiente'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);
