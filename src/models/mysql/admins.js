import connection from '../../mysql-config.js'

import bcrypt from 'bcrypt';

export class AdminModel {
  // Autentificación
  static async register({ username, email, password }) {
    if (username) {
      const [dataadmins] = await connection.query(
        `SELECT * FROM admin WHERE username = ?`,
        [username]
      );

      if (dataadmins.length > 0) {
        return { usernameExists: true };
      }
    }

    if (email) {
      const [dataadmins] = await connection.query(
        `SELECT * FROM admin WHERE email = ?`,
        [email]
      );

      if (dataadmins.length > 0) {
        return { emailExists: true };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
      await connection.query(
        'INSERT INTO admin (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      const [adminFound] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id FROM admin WHERE (email) = (?)`,
        [email]
      );
      return adminFound;

    } catch (error) {
      throw new Error('Error al registrarse.');
    }
  }

  static async login({ username, password }) {
    const [admin] = await connection.query(
      `SELECT BIN_TO_UUID(id) as id, username, email, password, created_at FROM admin WHERE username = ?`,
      [username]
    );

    if (admin.length === 0) {
      return { notExists: true };
    }

    const isValid = await bcrypt.compare(password, admin[0].password);

    if (!isValid) {
      return { notValid: true };
    }

    const { password: _, ...publicUser } = admin[0];

    return publicUser;
  }


  // Administrar Workers
  static async newWorker({ username, email, password, id_admin }) {
    if (username) {
      const [dataWorkers] = await connection.query(
        `SELECT * FROM worker WHERE username = ?`,
        [username]
      );

      if (dataWorkers.length > 0) {
        return { usernameExists: true };
      }
    }

    if (email) {
      const [dataWorkers] = await connection.query(
        `SELECT * FROM worker WHERE email = ?`,
        [email]
      );

      if (dataWorkers.length > 0) {
        return { emailExists: true };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
      await connection.query(
        'INSERT INTO worker (username, email, password, id_admin) VALUES (?, ?, ?, UUID_TO_BIN(?))',
        [username, email, hashedPassword, id_admin]
      );
      const [workerFound] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id FROM worker WHERE (email) = (?)`,
        [email]
      );
      return workerFound;

    } catch (error) {
      throw new Error('Error al registrar el worker.');
    }
  }

  static async getAllWorkers({ username, email, id_admin }) {
    if (username) {
      const [dataWorkers] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id, username, email, password, BIN_TO_UUID(id_admin) as id_admin, created_at, passwordChanged FROM worker WHERE username = ?`,
        [username]
      );

      if (dataWorkers.length === 0) {
        return null;
      }

      return dataWorkers;
    }

    if (email) {
      const [dataWorkers] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id, username, email, password, BIN_TO_UUID(id_admin) as id_admin, created_at, passwordChanged FROM worker WHERE email = ?`,
        [email]
      );

      if (dataWorkers.length === 0) {
        return null;
      }

      return dataWorkers;
    }

    if (id_admin) {
      const [dataWorkers] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id, username, email, password, BIN_TO_UUID(id_admin) as id_admin, created_at, passwordChanged FROM worker WHERE id_admin = UUID_TO_BIN(?)`,
        [id_admin]
      );

      if (dataWorkers.length === 0) {
        return null;
      }

      return dataWorkers;
    }

    try {
      const [dataWorkers] = await connection.query(
        'SELECT BIN_TO_UUID(id) as id, username, email, password, BIN_TO_UUID(id_admin) as id_admin, created_at, passwordChanged FROM worker'
      )

      return dataWorkers;
    } catch (error) {
      console.log(error);
      throw new Error('Error al encontrar los usuarios.');
    }
  }

  static async getWorkerById({ id }) {
    try {
      const [dataWorker] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id, username, email, password, BIN_TO_UUID(id_admin) as id_admin, created_at, passwordChanged FROM worker WHERE id = UUID_TO_BIN(?)`,
        [id]
      );

      if (dataWorker.length === 0) {
        return null;
      }

      return dataWorker;
    } catch (error) {
      throw new Error('Error al encontrar el worker.');
    }
  }

  static async editWorkerById({ id, username, email, password }) {
    try {
      const [dataWorker] = await connection.query(
        `SELECT * FROM worker WHERE id = UUID_TO_BIN(?)`,
        [id]
      );

      if (dataWorker.length === 0) {
        return null;
      }

      if (username) {
        const [dataWorkers] = await connection.query(
          `SELECT * FROM worker WHERE username = ? AND id != UUID_TO_BIN(?)`,
          [username, id]
        );

        if (dataWorkers.length > 0) {
          return { usernameExists: true };
        }
      }

      if (email) {
        const [dataWorkers] = await connection.query(
          `SELECT * FROM worker WHERE email = ? AND id != UUID_TO_BIN(?)`,
          [email, id]
        );

        if (dataWorkers.length > 0) {
          return { emailExists: true };
        }
      }

      // Construir dinámicamente la consulta UPDATE
      const fieldsToUpdate = [];
      const valuesToUpdate = [];

      if (username) {
        fieldsToUpdate.push('username = ?');
        valuesToUpdate.push(username);
      }

      if (email) {
        fieldsToUpdate.push('email = ?');
        valuesToUpdate.push(email);
      }

      if (password) {
        fieldsToUpdate.push('password = ?');
        valuesToUpdate.push(password);
        fieldsToUpdate.push('passwordChanged = ?');
        valuesToUpdate.push(false);
      }

      // Si no hay campos para actualizar, devolver notChanged: true
      if (fieldsToUpdate.length === 0) {
        return { notChanged: true };
      }

      // Ejecutar la consulta UPDATE si hay campos que actualizar
      const query = `UPDATE worker SET ${fieldsToUpdate.join(', ')} WHERE id = UUID_TO_BIN(?)`;
      valuesToUpdate.push(id);  // El id siempre debe estar presente en la condición WHERE

      await connection.query(query, valuesToUpdate);

      // Obtener el worker actualizado
      const [updatedWorker] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id, username, email, password, BIN_TO_UUID(id_admin) as id_admin, created_at, passwordChanged FROM worker WHERE id = UUID_TO_BIN(?)`,
        [id]
      );

      return updatedWorker;
    } catch (error) {
      console.log(error);
      throw new Error('Error al editar el worker.');
    }
  }

  static async deleteWorkerById({ id }) {
    try {
      const [dataWorker] = await connection.query(
        `SELECT * FROM worker WHERE id = UUID_TO_BIN(?)`,
        [id]
      );

      if (dataWorker.length === 0) {
        return null;
      }

      await connection.query(
        'DELETE FROM worker WHERE id = UUID_TO_BIN(?)',
        [id]
      );

      return dataWorker;
    } catch (error) {
      throw new Error('Error al eliminar el worker.');
    }
  }


  // Administrar processing centers
  static async newProcessCtr({ name, address, town, id_admin }) {
    if (name) {
      const [dataProcessCtr] = await connection.query(
        `SELECT * FROM processing_centers WHERE LOWER(name) = LOWER(?)`,
        [name]
      );

      if (dataProcessCtr.length > 0) {
        return { nameExists: true };
      }
    }

    if (address) {
      const [dataProcessCtr] = await connection.query(
        `SELECT * FROM processing_centers WHERE LOWER(address) = LOWER(?)`,
        [address]
      );

      if (dataProcessCtr.length > 0) {
        return { addressExists: true };
      }
    }


    try {
      await connection.query(
        'INSERT INTO processing_centers (name, address, town, id_admin) VALUES (?, ?, ?, UUID_TO_BIN(?))',
        [name, address, town, id_admin]
      );
      const [processCtrFound] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id FROM processing_centers WHERE LOWER(name) = LOWER(?)`,
        [name]
      );
      return processCtrFound;

    } catch (error) {
      throw new Error('Error al registrar el centro de procesamiento.');
    }
  }

  static async getAllProcessCtr({ name, address, town, id_admin }) {
    if (name) {
      const [dataProcessCtr] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id, name, address, town, BIN_TO_UUID(id_admin) as id_admin, created_at FROM processing_centers WHERE LOWER(name) = LOWER(?)`,
        [name]
      );

      if (dataProcessCtr.length === 0) {
        return null;
      }

      return dataProcessCtr;
    }

    if (address) {
      const [dataProcessCtr] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id, name, address, town, BIN_TO_UUID(id_admin) as id_admin, created_at FROM processing_centers WHERE LOWER(address) = LOWER(?)`,
        [address]
      );

      if (dataProcessCtr.length === 0) {
        return null;
      }

      return dataProcessCtr;
    }

    if (town) {
      const [dataProcessCtr] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id, name, address, town, BIN_TO_UUID(id_admin) as id_admin, created_at FROM processing_centers WHERE LOWER(town) = LOWER(?)`,
        [town]
      );

      if (dataProcessCtr.length === 0) {
        return null;
      }

      return dataProcessCtr;
    }

    if (id_admin) {
      const [dataProcessCtr] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id, name, address, town, BIN_TO_UUID(id_admin) as id_admin, created_at FROM processing_centers WHERE id_admin = UUID_TO_BIN(?)`,
        [id_admin]
      );

      if (dataProcessCtr.length === 0) {
        return null;
      }

      return dataProcessCtr;
    }

    try {
      const [dataProcessCtr] = await connection.query(
        'SELECT BIN_TO_UUID(id) as id, name, address, town, BIN_TO_UUID(id_admin) as id_admin, created_at FROM processing_centers'
      )

      return dataProcessCtr;
    } catch (error) {
      console.log(error);
      throw new Error('Error al encontrar los centros de procesamiento.');
    }
  }

  static async getProcessCtrById({ id }) {
    try {
      const [dataProcessCtr] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id, name, address, town, BIN_TO_UUID(id_admin) as id_admin, created_at FROM processing_centers WHERE id = UUID_TO_BIN(?)`,
        [id]
      );

      if (dataProcessCtr.length === 0) {
        return null;
      }

      return dataProcessCtr;
    } catch (error) {
      console.log(error);
      throw new Error('Error al encontrar el centro de procesamiento.');
    }
  }

  static async editProcessCtrById({ id, name, address, town }) {
    try {
      const [dataProcessCtr] = await connection.query(
        `SELECT * FROM processing_centers WHERE id = UUID_TO_BIN(?)`,
        [id]
      );

      if (dataProcessCtr.length === 0) {
        return null;
      }


      if (name) {
        const [existingProcessCtr] = await connection.query(
          `SELECT * FROM processing_centers WHERE LOWER(name) = LOWER(?) AND id != UUID_TO_BIN(?)`,
          [name, id]
        );

        if (existingProcessCtr.length > 0) {
          return { nameExists: true };
        }
      }

      if (address) {
        const [existingProcessCtr] = await connection.query(
          `SELECT * FROM processing_centers WHERE LOWER(address) = LOWER(?) AND id != UUID_TO_BIN(?)`,
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

      const query = `UPDATE processing_centers SET ${fieldsToUpdate.join(', ')} WHERE id = UUID_TO_BIN(?)`;
      valuesToUpdate.push(id);

      await connection.query(query, valuesToUpdate);

      const [updatedProcessCtr] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id, name, address, town, BIN_TO_UUID(id_admin) as id_admin, created_at FROM processing_centers WHERE id = UUID_TO_BIN(?)`,
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
      const [dataProcessCtr] = await connection.query(
        `SELECT * FROM processing_centers WHERE id = UUID_TO_BIN(?)`,
        [id]
      );

      if (dataProcessCtr.length === 0) {
        return null;
      }

      await connection.query(
        'DELETE FROM processing_centers WHERE id = UUID_TO_BIN(?)',
        [id]
      );

      return dataProcessCtr;
    } catch (error) {
      throw new Error('Error al eliminar el centro de procesamiento.');
    }
  }

  static async assignWorkerToCenter({ id, worker_id }) {
    try {
      const [dataProcessCtr] = await connection.query(
        `SELECT * FROM processing_centers WHERE id = UUID_TO_BIN(?)`,
        [id]
      );

      if (dataProcessCtr.length === 0) {
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
      const [dataProcessCtr] = await connection.query(
        `SELECT * FROM processing_centers WHERE id = UUID_TO_BIN(?)`,
        [id]
      );

      if (dataProcessCtr.length === 0) {
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
      const [dataProcessCtr] = await connection.query(
        `SELECT * FROM processing_centers WHERE id = UUID_TO_BIN(?)`,
        [id]
      );

      if (dataProcessCtr.length === 0) {
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
        JOIN processing_centers pc ON pcw.process_center_id = pc.id
        WHERE pc.id = UUID_TO_BIN(?)`,[id]
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
        JOIN processing_centers pc ON pcw.process_center_id = pc.id`
      )

      return dataWorkersOnProccesCtr;


    } catch (error) {
      throw new Error('Error al encotnrar workers asignados en centros de procesamiento.');
    }
  }
}
