import jwt from 'jsonwebtoken';

// Middleware authRequire para verificar tipo de usuario permitido (admin o worker)
export const authRequire = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      // Obtener el token del cookie o del header Authorization
      const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
      }

      // Inicializar req.session si no existe
      req.session = { user: null };

      // Verificar el token de JWT
      jwt.verify(token, process.env.SECRET_JWT_KEY, (err, user) => {
        if (err) {
          return res.status(401).json({ message: 'Token inválido o expirado.' });
        }

        // Asignar el usuario verificado a req.session
        req.session.user = user;

        // Verificar si el tipo de usuario tiene permitido el acceso a la ruta
        if (!allowedRoles.includes(req.session.user.userType)) {
          return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para acceder a esta ruta.' });
        }

        // Continuar con la siguiente función de middleware
        next();
      });
    } catch (error) {
      console.error('Error en el middleware authRequire:', error);
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
  };
};
