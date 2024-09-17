import jwt from 'jsonwebtoken';

export class AdminController {
  constructor({ adminModel }) {
    this.adminModel = adminModel;
  }

  register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const result = await this.adminModel.register({ username, email, password });

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
      const user = await this.adminModel.login({ username, password });

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


  getAllWorkers = async (req, res) => {
    const { username, email, id_admin } = req.query;

    try {
      const result = await this.adminModel.getAllWorkers({ username, email, id_admin });

      if (!result) {
        return res.status(400).json({ message: "No se encontraron usuarios." });
      }

      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  getWorkerById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Ingrese la id." });
    }

    try {
      const result = await this.adminModel.getWorkerById({ id });

      if (!result) {
        return res.status(400).json({ message: `No se encontró el worker con el id: ${id}.` });
      }

      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  newWorker = async (req, res) => {
    const { username, email, password } = req.body;
    const id_admin = req.session.user.id;

    try {
      const result = await this.adminModel.newWorker({ username, email, password, id_admin });

      if (!result) {
        return res.status(400).json({ message: "Error al registrar un nuevo operador." });
      }

      if (result.usernameExists) {
        return res.status(400).json({ message: `Ya existe un operador con el username: ${username}` });
      }

      if (result.emailExists) {
        return res.status(400).json({ message: `Ya existe un operador con el email: ${email}` });
      }


      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  editWorkerById = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Ingrese la id." });
    }

    try {
      const result = await this.adminModel.editWorkerById({ id, username, email, password });

      if (!result) {
        return res.status(400).json({ message: `No se encontró el worker con el id: ${id}.` });
      }

      if (result.usernameExists) {
        return res.status(400).json({ message: `Ya existe un operador con el username: ${username}` });
      }

      if (result.emailExists) {
        return res.status(400).json({ message: `Ya existe un operador con el email: ${email}` });
      }

      if (result.notChanged) {
        return res.status(304).json({ message: `No se realizaron cambios.` });
      }

      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  deleteWorkerById = async (req, res) => {
    const { id } = req.params;


    if (!id) {
      return res.status(400).json({ message: "Ingrese la id." });
    }

    try {
      const result = await this.adminModel.deleteWorkerById({ id });

      if (!result) {
        return res.status(400).json({ message: "No se encontraron usuarios." });
      }

      res.json({message: `Worker con el id: ${id} eliminado existosamente.`});

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }
}
