import connection from '../../mysql-config.js'

import bcrypt from 'bcrypt';

export class AdminModel {
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


  // Workers
  static async getAllWorkers({ username, email, id_admin }) {
    if (username) {
      const [dataWorkers] = await connection.query(
        `SELECT * FROM worker WHERE username = ?`,
        [username]
      );

      if (dataWorkers.length === 0) {
        return null;
      }

      return dataWorkers;
    }

    if (email) {
      const [dataWorkers] = await connection.query(
        `SELECT * FROM worker WHERE email = ?`,
        [email]
      );

      if (dataWorkers.length === 0) {
        return null;
      }

      return dataWorkers;
    }

    if (id_admin) {
      const [dataWorkers] = await connection.query(
        `SELECT * FROM worker WHERE id_admin = UUID_TO_BIN(?)`,
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
}