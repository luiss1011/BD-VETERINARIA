# BD-VETERINARIA
```
"dependencies": {
    "bcryptjs": "^3.0.2",
    "cors": "^2.8.5",
    "dotenv": "^17.2.0",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.16.4",
    "nodemailer": "^7.0.5"
  }
```
### Flujo de datos

* El usuario se registra → los datos se envían al backend.

* El backend valida y guarda la información cifrada (bcryptjs).

* Al iniciar sesión, se genera un token JWT con expiración.

* La app almacena el token y lo envía en el header Authorization: Bearer < token >.

* Las rutas protegidas verifican el token antes de acceder a los recursos.

### Medidas de seguridad aplicadas
* **Validación** **de** **entradas:** Se validan correos, contraseñas y campos requeridos antes de procesarlos.
* **Comunicación** **cifrada** **(HTTPS):** Se usa Cloudflared para exponer la API local de forma segura.
* **JWT** **seguro:** Se usa Cloudflared para exponer la API local de forma segura.
* **Variables** **de** **entorno** **(.env):** Se ocultan claves sensibles como DB_URI y JWT_SECRET.
* **Manejo** **de** **errores:** Respuestas con mensajes claros y códigos HTTP estándar (400, 401, 500).
