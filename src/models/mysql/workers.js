import connection from '../../mysql-config.js'

import bcrypt from 'bcrypt';

export class WorkerModel {
  static async register({ username, email, password }) {
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
        'INSERT INTO worker (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      const [workerFound] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id FROM worker WHERE (email) = (?)`,
        [email]
      );
      return workerFound;

    } catch (error) {
      throw new Error('Error al registrarse.');
    }
  }

  static async login({ username, password }) {
    const [worker] = await connection.query(
      `SELECT BIN_TO_UUID(id) as id, username, email, password, created_at FROM worker WHERE username = ?`,
      [username]
    );

    if (worker.length === 0) {
      return { notExists: true };
    }

    const isValid = await bcrypt.compare(password, worker[0].password);

    if (!isValid) {
      return { notValid: true };
    }

    const { password: _, ...publicUser } = worker[0];

    return publicUser;
  }

}