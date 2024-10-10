import connection from '../../mysql-config.js';

export class DonationModel {
  static async new({ worker_id, green_point_id, donor_id, items }) {
    try {
      let [donor] = await connection.query('SELECT * FROM donor WHERE id = ?', [donor_id]);

      if (!donor.length) {
        await connection.query('INSERT INTO donor (id) VALUES (?)', [donor_id]);
      }

      await connection.query(
        'INSERT INTO donation (donor_id, worker_id, green_point_id) VALUES (?, UUID_TO_BIN(?), UUID_TO_BIN(?))',
        [donor_id, worker_id, green_point_id]
      );
      
      const [donation] = await connection.query(
        'SELECT BIN_TO_UUID(id) AS id FROM donation WHERE donor_id = ? AND worker_id = UUID_TO_BIN(?) AND green_point_id = UUID_TO_BIN(?) ORDER BY date DESC LIMIT 1',
        [donor_id, worker_id, green_point_id]
      );

      const donationId = donation[0].id;

      const itemQueries = items.map((item) => {
        return connection.query(
          'INSERT INTO donation_items (material_type, weight, donation_id) VALUES (?, ?, UUID_TO_BIN(?))',
          [item.material_type, item.weight, donationId]
        );
      });

      await Promise.all(itemQueries);

      return { ok: true };

    } catch (error) {
      console.log(error);
      throw new Error('Error al registrar la donación.');
    }
  }
}