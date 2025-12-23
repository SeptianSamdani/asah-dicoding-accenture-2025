import pool from '../database/index.js';
import { generateId } from '../utils/generateId.js';
import InvariantError from '../errors/InvariantError.js';
import NotFoundError from '../errors/NotFoundError.js';

class UserAlbumLikesService {
  async addLike(userId, albumId) {
    // Cek album ada
    const albumCheck = await pool.query(
      'SELECT id FROM albums WHERE id = $1',
      [albumId]
    );

    if (!albumCheck.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    // Cek sudah like
    const checkLike = await pool.query(
      'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      [userId, albumId]
    );

    if (checkLike.rowCount) {
      throw new InvariantError('Album sudah disukai');
    }

    const id = generateId('like');
    const result = await pool.query(
      'INSERT INTO user_album_likes (id, user_id, album_id) VALUES ($1, $2, $3) RETURNING id',
      [id, userId, albumId]
    );

    if (!result.rowCount) {
      throw new InvariantError('Gagal menyukai album');
    }

    return result.rows[0].id;
  }

  async deleteLike(userId, albumId) {
    const result = await pool.query(
      'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      [userId, albumId]
    );

    if (!result.rowCount) {
      throw new NotFoundError('Like tidak ditemukan');
    }
  }

  async getLikesCount(albumId) {
    const result = await pool.query(
      'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
      [albumId]
    );

    return parseInt(result.rows[0].count);
  }
}

export default UserAlbumLikesService;