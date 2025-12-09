const cron = require("node-cron");
const Recordatorio = require("../models/Recordatorio");
const User = require("../models/User");
const transporter = require("../config/mailer");

cron.schedule("* * * * *", async () => {
  const ahora = new Date();

  const pendientes = await Recordatorio.find({
    enviado: false,
    fechaHora: { $lte: ahora }
  }).populate("user", "email fullName");

  for (const recordatorio of pendientes) {
    await transporter.sendMail({
      from: '"Veterinaria" <oficialveterinaria5@gmail.com>',
      to: recordatorio.user.email,
      subject: "⏰ Recordatorio",
      html: `
        <h3>Hola ${recordatorio.user.fullName}</h3>
        <p>Este es tu recordatorio:</p>
        <b>${recordatorio.titulo}</b>
        <p>${recordatorio.descripcion || ""}</p>
      `
    });

    recordatorio.enviado = true;
    await recordatorio.save();
  }
});
