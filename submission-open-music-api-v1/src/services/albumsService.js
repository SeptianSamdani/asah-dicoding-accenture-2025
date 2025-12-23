import pool from '../database/index.js';
import { generateId } from '../utils/generateId.js';
import NotFoundError from '../errors/NotFoundError.js';

class AlbumsService {
  async addAlbum({ name, year }) {
    const id = generateId('album');
    const { rows } = await pool.query(
      'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id',
      [id, name, year]
    );
    return rows[0].id;
  }

  async getAlbumById(id) {
    const result = await pool.query('SELECT id, name, year FROM albums WHERE id=$1', [id]);
    if (!result.rowCount) throw new NotFoundError('Album tidak ditemukan');

    const album = result.rows[0];
    const songsRes = await pool.query(
      'SELECT id, title, performer FROM songs WHERE album_id=$1',
      [id]
    );
    return { ...album, songs: songsRes.rows || [] };
  }

  async editAlbumById(id, { name, year }) {
    const result = await pool.query(
      'UPDATE albums SET name=$1, year=$2 WHERE id=$3 RETURNING id',
      [name, year, id]
    );
    if (!result.rowCount) throw new NotFoundError('Album tidak ditemukan');
  }

  async deleteAlbumById(id) {
    const result = await pool.query('DELETE FROM albums WHERE id=$1 RETURNING id', [id]);
    if (!result.rowCount) throw new NotFoundError('Album tidak ditemukan');
  }
}

export default AlbumsService;
