import jwt from 'jsonwebtoken';

export class WorkerController {
  constructor({ workerModel }) {
    this.workerModel = workerModel;
  }
  
  register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const result = await this.workerModel.register({ username, email, password });

      if (!result) {
        return res.status(400).json({ message: "Error al registrarse." });
      }

      if (result.usernameExists) {
        return res.status(400).json({ message: `Ya existe un usuario con el username: ${username}` });
      }

      if (result.emailExists) {
        return res.status(400).json({ message: `Ya existe un usuario con el email: ${email}` });
      }


      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  login = async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await this.workerModel.login({ username, password });

      if (!user) {
        return res.status(400).json({ message: "Error al iniciar sesión." });
      }

      if (user.notExists) {
        return res.status(400).json({ message: `No existe ningún usuario con el username: ${username}` });
      }

      if (user.notValid) {
        return res.status(400).json({ message: `Datos incorrectos.` });
      }

      const token = jwt.sign({ id: user.id, username: user.username, email: user.email },
        process.env.SECRET_JWT_KEY,
        {
          expiresIn: "1h"
        });


      res
        .cookie('access_token', token, {
          httpOnly: true, // la cookie solo se puede acceder en el servidor
          secure: process.env.NODE_ENV === 'production', // la cookie solo se puede acceder en https
          sameSite: 'strict', // la cookie solo se puede acceder del mismo dominio
          maxAge: 1000 * 60 * 60 // La cookie solo tiene validez de 1 hora
        })
        .json(user);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  protected = async (req, res) => {
    const { user } = req.session;

    if (!user) {
      return res.status(403).send('Acceso no autorizado.')
    }

    res.json(user);
  }

  logout = async (req, res) => {
    res
      .clearCookie('access_token')
      .json({ message: 'Sesión cerrada.' });
  }
}