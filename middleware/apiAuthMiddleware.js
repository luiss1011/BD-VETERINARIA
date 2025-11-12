const apiAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key']; // Convención común para claves API

  if (!apiKey) {
    return res.status(401).json({ message: 'No se proporcionó una clave API.' });
  }

  if (apiKey !== process.env.API_KEY_SECRET) {
    return res.status(403).json({ message: 'Clave API inválida.' });
  }

  next(); // La clave API es válida, continuar
};
    
module.exports = apiAuth;