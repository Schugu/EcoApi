import connection from '../../mysql-config.js'

export class AdminModel {
  static async findOne({ email }) {
    try {
      const [dataAdmin] = await connection.query(
        `SELECT BIN_TO_UUID(id) as id, username, email, password, created_at 
         FROM admin WHERE email = ?`,
        [email]
      );

      if (dataAdmin.length === 0) {
        return null;
      }

      return dataAdmin[0]; 
    } catch (error) {
      throw new Error('Error al encontrar el usuario en la base de datos.');
    }
  }
}
