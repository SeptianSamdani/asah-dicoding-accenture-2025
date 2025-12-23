import bcrypt from 'bcrypt';
import pool from '../database/index.js';
import { generateId } from '../utils/generateId.js';
import InvariantError from '../errors/InvariantError.js';
import AuthenticationError from '../errors/AuthenticationError.js';

class UsersService {
  async addUser({ username, password, fullname }) {
    // Cek apakah username sudah ada
    const checkUsername = await pool.query(
      'SELECT username FROM users WHERE username = $1',
      [username]
    );

    if (checkUsername.rowCount > 0) {
      throw new InvariantError('Username sudah digunakan');
    }

    const id = generateId('user');
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4) RETURNING id',
      [id, username, hashedPassword, fullname]
    );

    if (!result.rowCount) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async verifyUserCredential(username, password) {
    const result = await pool.query(
      'SELECT id, password FROM users WHERE username = $1',
      [username]
    );

    if (!result.rowCount) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return id;
  }

  async getUserById(userId) {
    const result = await pool.query(
      'SELECT id, username, fullname FROM users WHERE id = $1',
      [userId]
    );

    if (!result.rowCount) {
      throw new InvariantError('User tidak ditemukan');
    }

    return result.rows[0];
  }
}

export default UsersService;