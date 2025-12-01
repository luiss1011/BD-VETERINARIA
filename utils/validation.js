// Solo letras, espacios y acentos. De 2 a 40 caracteres.
const validateName = (name) => {
  return /^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(name);
};

// Teléfono: exactamente 10 dígitos
const validatePhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

// Email válido básico
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Contraseña con mínimo 8 caracteres
const validatePassword = (password) => {
  return /^.{8,}$/.test(password);
};

module.exports = {
  validateName,
  validatePhone,
  validateEmail,
  validatePassword
};
