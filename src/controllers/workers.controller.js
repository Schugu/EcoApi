export class WorkerController {
  constructor({ workerModel }) {
    this.workerModel = workerModel;
  }
  
  newWorker = async (req, res) => {
    const { username, email, password } = req.body;
    const id_admin = req.session.user.id;

    try {
      const result = await this.workerModel.newWorker({ username, email, password, id_admin });

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
  };

  getAllWorkers = async (req, res) => {
    const { username, email, id_admin } = req.query;

    try {
      const result = await this.workerModel.getAllWorkers({ username, email, id_admin });

      if (!result) {
        return res.status(400).json({ message: "No se encontraron usuarios." });
      }

      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  };

  getWorkerById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Ingrese la id." });
    }

    try {
      const result = await this.workerModel.getWorkerById({ id });

      if (!result) {
        return res.status(400).json({ message: `No se encontró el worker con el id: ${id}.` });
      }

      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  };

  editWorkerById = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Ingrese la id." });
    }

    try {
      const result = await this.workerModel.editWorkerById({ id, username, email, password });

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
  };

  deleteWorkerById = async (req, res) => {
    const { id } = req.params;


    if (!id) {
      return res.status(400).json({ message: "Ingrese la id." });
    }

    try {
      const result = await this.workerModel.deleteWorkerById({ id });

      if (!result) {
        return res.status(400).json({ message: "No se encontraron usuarios." });
      }

      res.json({ message: `Worker con el id: ${id} eliminado existosamente.` });

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  };
}