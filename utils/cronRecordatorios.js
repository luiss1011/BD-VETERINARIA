const cron = require("node-cron");
const Appointment = require("../models/Citas");
const transporter = require("../config/mailer");

// ✅ Revisar cada minuto
cron.schedule("* * * * *", async () => {
  try {
    const ahora = new Date();

    // ⏰ 1 HORA DESPUÉS
    const unaHoraDespues = new Date(ahora.getTime() + 60 * 60 * 1000);

    // 📆 1 DÍA DESPUÉS
    const unDiaDespues = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);

    const citas = await Appointment.find({
      status: "confirmada",
      date: {
        $gte: ahora,
        $lte: unDiaDespues
      },
      recordatorioEnviado: { $ne: true },
      recordatorioHoraEnviado: { $ne: true }
    })
    .populate("client", "fullName email")
    .populate("mascota", "nombreMascota");

    for (const cita of citas) {
      const diferencia = cita.date - ahora;

      // ✅ 1 DÍA ANTES
      if (diferencia <= 24 * 60 * 60 * 1000 && !cita.recordatorioEnviado) {

        await transporter.sendMail({
          from: `"Veterinaria Patitas" <${process.env.EMAIL_USER}>`,
          to: cita.client.email,
          subject: "📅 Recordatorio de cita (Mañana)",
          html: `
            <h2>Hola ${cita.client.fullName}</h2>
            <p>Te recordamos que mañana tienes una cita para 
            <b>${cita.mascota.nombreMascota}</b>.</p>

            <p><b>Fecha:</b> ${new Date(cita.date).toLocaleString()}</p>
            <p><b>Servicio:</b> ${cita.service}</p>

            <p>Veterinaria Patitas 🐾</p>
          `
        });

        cita.recordatorioEnviado = true;
        await cita.save();
      }

      // ✅ 1 HORA ANTES
      if (diferencia <= 60 * 60 * 1000 && !cita.recordatorioHoraEnviado) {

        await transporter.sendMail({
          from: `"Veterinaria Patitas" <${process.env.EMAIL_USER}>`,
          to: cita.client.email,
          subject: "⏰ Tu cita es en 1 hora",
          html: `
            <h2>Hola ${cita.client.fullName}</h2>
            <p>Tu cita para <b>${cita.mascota.nombreMascota}</b> es en 1 hora.</p>

            <p><b>Fecha:</b> ${new Date(cita.date).toLocaleString()}</p>

            <p>Veterinaria Patitas 🐾</p>
          `
        });

        cita.recordatorioHoraEnviado = true;
        await cita.save();
      }
    }

  } catch (error) {
    console.error("❌ Error en recordatorios:", error);
  }
});
