
export class DonationController {
  constructor({ donationModel }) {
    this.donationModel = donationModel;
  };

  new = async (req, res) => {
    const worker_id = req.session.user.id;
    const { green_point_id } = req.session.user;
    const { donor_id, items } = req.body;
    
    try {
      const result = await this.donationModel.new({ worker_id, green_point_id, donor_id, items });

      if (!result) {
        return res.status(400).json({ message: "Error al registrar la donación." });
      }
      if (result.ok){
        res.json("Hecho");
      }

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
}
