
export class GreenPointController {
  constructor({ greenPointModel }) {
    this.greenPointModel = greenPointModel;
  };

  new = async (req, res) => {
    const { name, address, town } = req.body;
    const id_admin = req.session.user.id;

    try {
      const result = await this.greenPointModel.new({ name, address, town, id_admin });

      if (!result) {
        return res.status(400).json({ message: "Error al registrar un punto verde." });
      }

      if (result.nameExists) {
        return res.status(400).json({ message: `Ya existe un punto verde con el name: ${name}` });
      }

      if (result.addressExists) {
        return res.status(400).json({ message: `Ya existe un punto verde con el address: ${address}` });
      }


      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  };

  getAll = async (req, res) => {
    const { name, address, town, id_admin } = req.query;

    try {
      const result = await this.greenPointModel.getAll({ name, address, town, id_admin });

      if (!result) {
        return res.status(400).json({ message: "No se encontraron puntos verdes." });
      }

      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  };

  getById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Ingrese la id." });
    }

    try {
      const result = await this.greenPointModel.getById({ id });

      if (!result) {
        return res.status(400).json({ message: `No se encontró el punto verde con el id: ${id}.` });
      }

      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  };

  edit = async (req, res) => {
    const { id } = req.params;
    const { name, address, town } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Ingrese la id." });
    }

    try {
      const result = await this.greenPointModel.edit({ id, name, address, town });

      if (!result) {
        return res.status(400).json({ message: `No se encontró el punto verde con el id: ${id}.` });
      }

      if (result.nameExists) {
        return res.status(400).json({ message: `Ya existe un punto verde con el nombre: ${name}` });
      }

      if (result.addressExists) {
        return res.status(400).json({ message: `Ya existe un punto verde con la dirección: ${address}` });
      }

      if (result.notChanged) {
        return res.status(304).json({ message: `No se realizaron cambios.` });
      }

      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  };

  delete = async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Ingrese la id." });
    }

    try {
      const result = await this.greenPointModel.delete({ id });

      if (!result) {
        return res.status(400).json({ message: "No se encontraron puntos verdes." });
      }

      res.json({ message: `Punto verde con el id: ${id} eliminado existosamente.` });

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  };

  assignWorker = async (req, res) => {
    const { id } = req.params;
    const { worker_id } = req.body;

    try {
      const result = await this.greenPointModel.assignWorker({ id, worker_id });

      if (!result) {
        return res.status(400).json({ message: "Error al registrar un punto verde." });
      }

      if (result.greenPointNotExists) {
        return res.status(400).json({ message: `No existe un punto verde con el id: ${id}` });
      }

      if (result.workerNotExists) {
        return res.status(400).json({ message: `No existe un worker con el id: ${worker_id}` });
      }

      if (result.isWorkerAssigned) {
        return res.status(400).json({ message: `El worker con el id: ${worker_id} ya esta asignado a un punto verde.` });
      }

      res.json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }


  };

  getWorkers = async (req, res) => {
    const { id } = req.params;

    try {
      const result = await this.greenPointModel.getWorkers({ id });

      if (!result) {
        res.status(400).json({ message: "No se encontraron usuarios asignados al punto verde." });
      }

      if (result.greenPointNotExists) {
        return res.status(400).json({ message: `No existe un punto verde con el id: ${id}` });
      }

      res.json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  };

  unassignWorker = async (req, res) => {
    const { id, worker_id } = req.params;

    try {
      const result = await this.greenPointModel.unassignWorker({ id, worker_id });


      if (!result) {
        return res.status(400).json({ message: "Error al des-asignar el worker del punto verde." });
      }

      if (result.greenPointNotExists) {
        return res.status(400).json({ message: `No existe un punto verde con el id: ${id}` });
      }

      if (result.workerNotExists) {
        return res.status(400).json({ message: `No existe un worker con el id: ${worker_id}` });
      }

      if (result.workerNotAssigned) {
        return res.status(400).json({ message: `El worker con el id: ${worker_id} no esta asignado a un punto verde.` });
      }

      if (result.ok) {
        res.json({ message: `Worker con el id: ${id} des-asignado existosamente.` });
      }

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  };

  getAllWorkersAssignments = async (req, res) => {
    try {
      const result = await this.greenPointModel.getAllWorkersAssignments();

      if (!result) {
        res.status(400).json({ message: "No se encontraron usuarios asignados al punto verde." });
      }

      res.json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  };
}
