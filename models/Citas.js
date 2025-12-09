const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mascota: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mascota",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    motivo: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    veterinario: {
      type: String,
      default: "",
    },

    // ✅ NUEVOS CAMPOS CLÍNICOS
    diagnostico: {
      type: String,
      default: "",
    },
    observaciones: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pendiente", "confirmada", "cancelada", "finalizada"],
      default: "pendiente",
    },

    recordatorioEnviado: {
      type: Boolean,
      default: false,
    },
    recordatorioHoraEnviado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
