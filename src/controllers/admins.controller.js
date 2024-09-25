import jwt from 'jsonwebtoken';

export class AdminController {
  constructor({ adminModel }) {
    this.adminModel = adminModel;
  }

  // Autentifiación
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


  // Administrar Workers
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

      res.json({ message: `Worker con el id: ${id} eliminado existosamente.` });

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }


  // Administrar processing centers
  newProcessCtr = async (req, res) => {
    const { name, address, town } = req.body;
    const id_admin = req.session.user.id;

    try {
      const result = await this.adminModel.newProcessCtr({ name, address, town, id_admin });

      if (!result) {
        return res.status(400).json({ message: "Error al registrar un centro de procesamiento." });
      }

      if (result.nameExists) {
        return res.status(400).json({ message: `Ya existe un centro de procesamiento con el name: ${name}` });
      }

      if (result.addressExists) {
        return res.status(400).json({ message: `Ya existe un centro de procesamiento con el address: ${address}` });
      }


      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  getAllProcessCtr = async (req, res) => {
    const { name, address, town, id_admin } = req.query;

    try {
      const result = await this.adminModel.getAllProcessCtr({ name, address, town, id_admin });

      if (!result) {
        return res.status(400).json({ message: "No se encontraron centros de procesamiento." });
      }

      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  getProcessCtrById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Ingrese la id." });
    }

    try {
      const result = await this.adminModel.getProcessCtrById({ id });

      if (!result) {
        return res.status(400).json({ message: `No se encontró el centro de procesamiento con el id: ${id}.` });
      }

      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  editProcessCtrById = async (req, res) => {
    const { id } = req.params;
    const { name, address, town } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Ingrese la id." });
    }

    try {
      const result = await this.adminModel.editProcessCtrById({ id, name, address, town });

      if (!result) {
        return res.status(400).json({ message: `No se encontró el centro de procesamiento con el id: ${id}.` });
      }

      if (result.nameExists) {
        return res.status(400).json({ message: `Ya existe un centro de procesamiento con el nombre: ${name}` });
      }

      if (result.addressExists) {
        return res.status(400).json({ message: `Ya existe un centro de procesamiento con la dirección: ${address}` });
      }

      if (result.notChanged) {
        return res.status(304).json({ message: `No se realizaron cambios.` });
      }

      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  deleteProcessCtrById = async (req, res) => {
    const { id } = req.params;


    if (!id) {
      return res.status(400).json({ message: "Ingrese la id." });
    }

    try {
      const result = await this.adminModel.deleteProcessCtrById({ id });

      if (!result) {
        return res.status(400).json({ message: "No se encontraron centros de procesamiento." });
      }

      res.json({ message: `Centro de procesamiento con el id: ${id} eliminado existosamente.` });

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }


  assignWorkerToCenter = async (req, res) => {
    const { id } = req.params;
    const { worker_id } = req.body;


    try {
      const result = await this.adminModel.assignWorkerToCenter({ id, worker_id });

      if (!result) {
        return res.status(400).json({ message: "Error al registrar un centro de procesamiento." });
      }

      if (result.processCtrNotExists) {
        return res.status(400).json({ message: `No existe un centro de procesamiento con el id: ${id}` });
      }

      if (result.workerNotExists) {
        return res.status(400).json({ message: `No existe un worker con el id: ${worker_id}` });
      }

      if (result.isWorkerAssigned) {
        return res.status(400).json({ message: `El worker con el id: ${worker_id} ya esta asignado a un centro de procesamiento.` });
      }


      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }


  }

  deleteWorkerToCenter = async (req, res) => {
    const { id, worker_id } = req.params;

    try {
      const result = await this.adminModel.deleteWorkerToCenter({ id, worker_id });


      if (!result) {
        return res.status(400).json({ message: "Error al registrar un centro de procesamiento." });
      }

      if (result.processCtrNotExists) {
        return res.status(400).json({ message: `No existe un centro de procesamiento con el id: ${id}` });
      }

      if (result.workerNotExists) {
        return res.status(400).json({ message: `No existe un worker con el id: ${worker_id}` });
      }

      if (result.workerNotAssigned) {
        return res.status(400).json({ message: `El worker con el id: ${worker_id} no esta asignado a un centro de procesamiento.` });
      }

      if (result.ok) {
        res.json({ message: `Worker con el id: ${id} des-asignado existosamente.` });
      }

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  getAllWorkersOnProcessCtr = async (req, res) => {
    const { id } = req.params;

    try {
      const result = await this.adminModel.getAllWorkersOnProcessCtr({ id });

      if (!result) {
        res.status(400).json({ message: "No se encontraron usuarios asignados al centro de procesamiento." });
      }

      if (result.processCtrNotExists) {
        return res.status(400).json({ message: `No existe un centro de procesamiento con el id: ${id}` });
      }

      res.json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  getAllWorkersAssignments = async (req, res) => {
    try {
      const result = await this.adminModel.getAllWorkersAssignments();

      if (!result) {
        res.status(400).json({ message: "No se encontraron usuarios asignados al centro de procesamiento." });
      }

      res.json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }
}
