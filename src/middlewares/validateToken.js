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

      // Verificar el token
      const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY);
      const { userType } = decoded;

      // Verificar si el tipo de usuario tiene permitido el acceso a la ruta
      if (!allowedRoles.includes(userType)) {
        return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para acceder a esta ruta.' });
      }

      // Adjuntar el userType a la solicitud para usarlo en el controlador
      req.userType = userType;

      // Continuar con el siguiente middleware o controlador
      next();
    } catch (error) {
      console.error('Error en el middleware authRequire:', error);
      return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
  };
};
