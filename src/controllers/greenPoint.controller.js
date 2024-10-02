
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

  getProcessCtrById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Ingrese la id." });
    }

    try {
      const result = await this.processCtrModel.getProcessCtrById({ id });

      if (!result) {
        return res.status(400).json({ message: `No se encontró el centro de procesamiento con el id: ${id}.` });
      }

      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  };

  editProcessCtrById = async (req, res) => {
    const { id } = req.params;
    const { name, address, town } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Ingrese la id." });
    }

    try {
      const result = await this.processCtrModel.editProcessCtrById({ id, name, address, town });

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
  };

  deleteProcessCtrById = async (req, res) => {
    const { id } = req.params;


    if (!id) {
      return res.status(400).json({ message: "Ingrese la id." });
    }

    try {
      const result = await this.processCtrModel.deleteProcessCtrById({ id });

      if (!result) {
        return res.status(400).json({ message: "No se encontraron centros de procesamiento." });
      }

      res.json({ message: `Centro de procesamiento con el id: ${id} eliminado existosamente.` });

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  };

  assignWorkerToCenter = async (req, res) => {
    const { id } = req.params;
    const { worker_id } = req.body;


    try {
      const result = await this.processCtrModel.assignWorkerToCenter({ id, worker_id });

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


  };

  deleteWorkerToCenter = async (req, res) => {
    const { id, worker_id } = req.params;

    try {
      const result = await this.processCtrModel.deleteWorkerToCenter({ id, worker_id });


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
  };

  getAllWorkersOnProcessCtr = async (req, res) => {
    const { id } = req.params;

    try {
      const result = await this.processCtrModel.getAllWorkersOnProcessCtr({ id });

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
  };

  getAllWorkersAssignments = async (req, res) => {
    try {
      const result = await this.processCtrModel.getAllWorkersAssignments();

      if (!result) {
        res.status(400).json({ message: "No se encontraron usuarios asignados al centro de procesamiento." });
      }

      res.json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  };
}
