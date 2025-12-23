import pool from '../database/index.js';
import InvariantError from '../errors/InvariantError.js';

class AuthenticationsService {
  async addRefreshToken(token) {
    const result = await pool.query(
      'INSERT INTO authentications VALUES ($1) RETURNING token',
      [token]
    );

    if (!result.rowCount) {
      throw new InvariantError('Refresh token gagal ditambahkan');
    }
  }

  async verifyRefreshToken(token) {
    const result = await pool.query(
      'SELECT token FROM authentications WHERE token = $1',
      [token]
    );

    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    const result = await pool.query(
      'DELETE FROM authentications WHERE token = $1 RETURNING token',
      [token]
    );

    if (!result.rowCount) {
      throw new InvariantError('Refresh token gagal dihapus');
    }
  }
}

export default AuthenticationsService;