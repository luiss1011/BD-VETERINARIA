const mongoose = require("mongoose");

const recordatorioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mascota: {   // 👈 ESTO FALTABA
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mascota",
      required: true,
    },

    titulo: {
      type: String,
      required: true,
    },

    descripcion: {
      type: String,
    },

    fechaHora: {
      type: Date,
      required: true,
    },

    enviado: {
      type: Boolean,
      default: false,
    },

    completado: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recordatorio", recordatorioSchema);
