import connection from '../../mysql-config.js'


export class GreenPointModel {
  static async new({ name, address, town, id_admin }) {
    if (name) {
      const [dataGreenPoint] = await connection.query(
        `SELECT * FROM green_point WHERE LOWER(name) = LOWER(?)`,
        [name]
      );

      if (dataGreenPoint.length > 0) {
        return { nameExists: true };
      }
    }

    if (address) {
      const [dataGreenPoint] = await connection.query(
        `SELECT * FROM green_point WHERE LOWER(address) = LOWER(?)`,
        [address]
      );

      if (dataGreenPoint.length > 0) {
        return { addressExists: true };
      }
    }


    try {
      await connection.query(
        'INSERT INTO green_point (name, address, town, id_admin) VALUES (?, ?, ?, UUID_TO_BIN(?))',
        [name, address, town, id_admin]
      );
      const [greenPointFound] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id FROM green_point WHERE LOWER(name) = LOWER(?)`,
        [name]
      );
      return greenPointFound;

    } catch (error) {
      throw new Error('Error al registrar el punto verde.');
    }
  }

  static async getAll({ name, address, town, id_admin }) {
    if (name) {
      const [dataGreenPoint] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id, name, address, town, BIN_TO_UUID(id_admin) as id_admin, created_at FROM green_point WHERE LOWER(name) = LOWER(?)`,
        [name]
      );

      if (dataGreenPoint.length === 0) {
        return null;
      }

      return dataGreenPoint;
    }

    if (address) {
      const [dataGreenPoint] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id, name, address, town, BIN_TO_UUID(id_admin) as id_admin, created_at FROM green_point WHERE LOWER(address) = LOWER(?)`,
        [address]
      );

      if (dataGreenPoint.length === 0) {
        return null;
      }

      return dataGreenPoint;
    }

    if (town) {
      const [dataGreenPoint] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id, name, address, town, BIN_TO_UUID(id_admin) as id_admin, created_at FROM green_point WHERE LOWER(town) = LOWER(?)`,
        [town]
      );

      if (dataGreenPoint.length === 0) {
        return null;
      }

      return dataGreenPoint;
    }

    if (id_admin) {
      const [dataGreenPoint] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id, name, address, town, BIN_TO_UUID(id_admin) as id_admin, created_at FROM green_point WHERE id_admin = UUID_TO_BIN(?)`,
        [id_admin]
      );

      if (dataGreenPoint.length === 0) {
        return null;
      }

      return dataGreenPoint;
    }

    try {
      const [dataGreenPoint] = await connection.query(
        'SELECT BIN_TO_UUID(id) as id, name, address, town, BIN_TO_UUID(id_admin) as id_admin, created_at FROM green_point'
      )

      return dataGreenPoint;
    } catch (error) {
      console.log(error);
      throw new Error('Error al encontrar los puntos verdes.');
    }
  }

  static async getProcessCtrById({ id }) {
    try {
      const [dataGreenPoint] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id, name, address, town, BIN_TO_UUID(id_admin) as id_admin, created_at FROM green_point WHERE id = UUID_TO_BIN(?)`,
        [id]
      );

      if (dataGreenPoint.length === 0) {
        return null;
      }

      return dataGreenPoint;
    } catch (error) {
      console.log(error);
      throw new Error('Error al encontrar el centro de procesamiento.');
    }
  }

  static async editProcessCtrById({ id, name, address, town }) {
    try {
      const [dataGreenPoint] = await connection.query(
        `SELECT * FROM green_point WHERE id = UUID_TO_BIN(?)`,
        [id]
      );

      if (dataGreenPoint.length === 0) {
        return null;
      }


      if (name) {
        const [existingProcessCtr] = await connection.query(
          `SELECT * FROM green_point WHERE LOWER(name) = LOWER(?) AND id != UUID_TO_BIN(?)`,
          [name, id]
        );

        if (existingProcessCtr.length > 0) {
          return { nameExists: true };
        }
      }

      if (address) {
        const [existingProcessCtr] = await connection.query(
          `SELECT * FROM green_point WHERE LOWER(address) = LOWER(?) AND id != UUID_TO_BIN(?)`,
          [address, id]
        );

        if (existingProcessCtr.length > 0) {
          return { addressExists: true };
        }
      }

      const fieldsToUpdate = [];
      const valuesToUpdate = [];

      if (name) {
        fieldsToUpdate.push('name = ?');
        valuesToUpdate.push(name);
      }

      if (address) {
        fieldsToUpdate.push('address = ?');
        valuesToUpdate.push(address);
      }

      if (town) {
        fieldsToUpdate.push('town = ?');
        valuesToUpdate.push(town);
      }

      if (fieldsToUpdate.length === 0) {
        return { notChanged: true };
      }

      const query = `UPDATE green_point SET ${fieldsToUpdate.join(', ')} WHERE id = UUID_TO_BIN(?)`;
      valuesToUpdate.push(id);

      await connection.query(query, valuesToUpdate);

      const [updatedProcessCtr] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id, name, address, town, BIN_TO_UUID(id_admin) as id_admin, created_at FROM green_point WHERE id = UUID_TO_BIN(?)`,
        [id]
      );

      return updatedProcessCtr;
    } catch (error) {
      console.log(error);
      throw new Error('Error al editar el centro de procesamiento.');
    }
  }

  static async deleteProcessCtrById({ id }) {
    try {
      const [dataGreenPoint] = await connection.query(
        `SELECT * FROM green_point WHERE id = UUID_TO_BIN(?)`,
        [id]
      );

      if (dataGreenPoint.length === 0) {
        return null;
      }

      await connection.query(
        'DELETE FROM green_point WHERE id = UUID_TO_BIN(?)',
        [id]
      );

      return dataGreenPoint;
    } catch (error) {
      throw new Error('Error al eliminar el centro de procesamiento.');
    }
  }

  static async assignWorkerToCenter({ id, worker_id }) {
    try {
      const [dataGreenPoint] = await connection.query(
        `SELECT * FROM green_point WHERE id = UUID_TO_BIN(?)`,
        [id]
      );

      if (dataGreenPoint.length === 0) {
        return { processCtrNotExists: true };
      }

      const [dataWorker] = await connection.query(
        `SELECT * FROM worker WHERE id = UUID_TO_BIN(?)`,
        [worker_id]
      );

      if (dataWorker.length === 0) {
        return { workerNotExists: true };
      }

      const [foundWorkerOnProcessCtr] = await connection.query(
        `SELECT * FROM processing_center_workers WHERE worker_id = UUID_TO_BIN(?)`, [worker_id]
      );

      if (foundWorkerOnProcessCtr.length > 0) {
        return { isWorkerAssigned: true }
      }


      await connection.query(
        `INSERT INTO processing_center_workers (worker_id, process_center_id)
         VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?))`,
        [worker_id, id]
      );

      const [assignedWorker] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id,
                BIN_TO_UUID(worker_id) as worker_id, 
                BIN_TO_UUID(process_center_id) as process_center_id,
                assigned_at
         FROM processing_center_workers 
         WHERE worker_id = UUID_TO_BIN(?)`,
        [worker_id]
      );

      return assignedWorker;
    } catch (error) {
      console.log(error);
      throw new Error('Error al asignar un worker en el centro de procesamiento.');
    }
  }

  static async deleteWorkerToCenter({ id, worker_id }) {
    try {
      const [dataGreenPoint] = await connection.query(
        `SELECT * FROM green_point WHERE id = UUID_TO_BIN(?)`,
        [id]
      );

      if (dataGreenPoint.length === 0) {
        return { processCtrNotExists: true };
      }

      const [dataWorker] = await connection.query(
        `SELECT * FROM worker WHERE id = UUID_TO_BIN(?)`,
        [worker_id]
      );

      if (dataWorker.length === 0) {
        return { workerNotExists: true };
      }

      const [foundWorkerOnProcessCtr] = await connection.query(
        `SELECT * FROM processing_center_workers WHERE worker_id = UUID_TO_BIN(?)`, [worker_id]
      );

      if (foundWorkerOnProcessCtr.length === 0) {
        return { workerNotAssigned: true };
      }

      await connection.query(
        `DELETE FROM processing_center_workers WHERE worker_id = UUID_TO_BIN(?)`,
        [worker_id]
      );

      return { ok: true };
    } catch (error) {
      throw new Error('Error al asignar un worker en el centro de procesamiento.');
    }
  }

  static async getAllWorkersOnProcessCtr({ id }) {
    try {
      const [dataGreenPoint] = await connection.query(
        `SELECT * FROM green_point WHERE id = UUID_TO_BIN(?)`,
        [id]
      );

      if (dataGreenPoint.length === 0) {
        return { processCtrNotExists: true };
      }

      const [dataWorkersOnProccesCtr] = await connection.query(
        `SELECT BIN_TO_UUID(w.id) AS worker_id,            
          w.username AS worker_username, 
          BIN_TO_UUID(pc.id) AS process_center_id,    
          pc.name AS process_center_name, 
          pcw.assigned_at
        FROM processing_center_workers pcw
        JOIN worker w ON pcw.worker_id = w.id
        JOIN green_point pc ON pcw.process_center_id = pc.id
        WHERE pc.id = UUID_TO_BIN(?)`, [id]
      )

      return dataWorkersOnProccesCtr;


    } catch (error) {
      throw new Error('Error al encotnrar workers en el centro de procesamiento.');
    }
  }

  static async getAllWorkersAssignments() {
    try {
      const [dataWorkersOnProccesCtr] = await connection.query(
        `SELECT BIN_TO_UUID(w.id) AS worker_id,    
          w.username AS worker_username,       
          BIN_TO_UUID(pc.id) AS process_center_id,   
          pc.name AS process_center_name, 
          pcw.assigned_at                           
        FROM processing_center_workers pcw
        JOIN worker w ON pcw.worker_id = w.id          
        JOIN green_point pc ON pcw.process_center_id = pc.id`
      )

      return dataWorkersOnProccesCtr;


    } catch (error) {
      throw new Error('Error al encotnrar workers asignados en centros de procesamiento.');
    }
  }
}
