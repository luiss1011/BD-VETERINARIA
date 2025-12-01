require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const citaRoutes = require("./routes/CitasRouter");
const authRoutes = require('./routes/authRoutes');
// console.log('authRoutes:', typeof authRoutes); // Debería ser 'function' (router es una función)

const { protect, authorize } = require('./middleware/authMiddleware');
// console.log('protect:', typeof protect);   // Debería ser 'function'
// console.log('authorize:', typeof authorize); // Debería ser 'function'

const apiAuth = require('./middleware/apiAuthMiddleware'); // Para la autenticación de API Key
// console.log('apiAuth:', typeof apiAuth);   // Debería ser 'function'



const cors = require('cors'); // Importa cors

const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const profileRoutes = require('./routes/profileRoutes');


const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;




// Middleware para CORS
// En desarrollo, puedes permitir todo. En producción, especifica tus dominios.
app.use(cors({
  origin: '*', // Permite cualquier origen (para desarrollo) CAMBIAR CUANDO ESTE EN PRODUCCION AL CODIGO DE ABAJO
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

// Si quieres ser más específico en producción:
/*
app.use(cors({
  origin: 'http://localhost:8000', // Ejemplo para Cordova con `cordova serve`
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));
*/

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos
mongoose.connect(MONGODB_URI)
 .then(async () => {
    console.log('Conectado a MongoDB');
    console.log('Servidor ejecutándose en http://localhost:' + PORT);
   // await createDefaultAdmin(); // 🔹 crea el admin si no existe
  })
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas de autenticación (públicas)
app.use('/api/auth', authRoutes);

// Ejemplo de una ruta protegida con JWT (Bearer Token)
app.get('/api/protected', protect, (req, res) => {
  res.status(200).json({
    message: `¡Bienvenido ${req.user.username}! Has accedido a una ruta protegida con JWT. Tu rol es: ${req.userRole}`,
    user: req.user
  });
});

// Ejemplo de una ruta protegida con JWT y roles (solo para admins)
app.get('/api/admin-only', protect, authorize(['admin']), (req, res) => {
  res.status(200).json({
    message: `¡Hola admin ${req.user.username}! Tienes acceso a esta ruta de administrador.`,
    user: req.user
  });
});

app.use('/api/mascotas', require('./routes/mascotasRoutes'));


// Ejemplo de una ruta protegida con API Key
app.get('/api/data-by-apikey', apiAuth, (req, res) => {
  res.status(200).json({
    message: 'Has accedido a esta ruta utilizando una API Key válida.',
    data: { item1: 'dato_secreto', item2: 'otro_dato_confidencial' }
  });
});



// Manejo global de errores (500)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.statusCode || 500).json({
//     message: err.message || 'Algo salió mal en el servidor.',
//     error: process.env.NODE_ENV === 'development' ? err : {} // No mostrar errores detallados en producción
//   });
// });



// AÑADIR NUEVAS RUTAS DE PUBLICACIONES Y COMENTARIOS AQUÍ
// app.use('/api/posts', postRoutes);
// app.use('/api/comments', commentRoutes);
// app.use('/api/profile', profileRoutes);




// Rutas de autenticación

// Rutas de publicaciones (protegidas donde sea necesario)
app.use('/api/posts', postRoutes);

// Ruta de citas
app.use("/api/appointments", citaRoutes);

// Rutas de comentarios (protegidas donde sea necesario)
app.use('/api/comments', commentRoutes);

// Rutas de perfil (protegidas)
app.use('/api/profile', protect, profileRoutes); // Toda la ruta de perfil está protegida por JWT



// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ message: `No se encontró la ruta: ${req.originalUrl}` });
});


// Manejo global de errores (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Algo salió mal en el servidor.',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});


// // Iniciar el servidor
// app.listen(PORT, () => {
//   console.log(`Servidor ejecutándose en http://localhost:${PORT}`;

// });

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('API corriendo...');
});





// CODIGO PARA CREAR ADMIN POR DEFECTO SI NO EXISTE
// const User = require('./models/User');

// const createDefaultAdmin = async () => {
//   try {
//     const existingAdmin = await User.findOne({ role: 'admin' });
//     if (!existingAdmin) {
//       await User.create({
//         username: 'admin',
//         password: 'admin123',  // 🔹 SIN HASH (el modelo lo hará)
//         email: 'admin@admin.com',
//         fullName: 'Administrador',
//         role: 'admin'
//       });
//       console.log('✅ Admin por defecto creado: usuario="admin", contraseña="admin123"');
//     } else {
//       console.log('⚙️ Admin ya existe, no se crea otro.');
//     }
//   } catch (err) {
//     console.error('❌ Error al crear admin por defecto:', err);
//   }
// };


// una forma de subir a la nube el servicio de la api