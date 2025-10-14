import pool from '../database/index.js';
import { generateId } from '../utils/generateId.js';

class AlbumsService {
  async addAlbum({ name, year }) {
    const id = generateId('album');
    const result = await pool.query(
      'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id',
      [id, name, year]
    );
    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const album = await pool.query('SELECT * FROM albums WHERE id=$1', [id]);
    if (!album.rowCount) throw new Error('Album tidak ditemukan');
    return album.rows[0];
  }

  async editAlbumById(id, { name, year }) {
    const result = await pool.query(
      'UPDATE albums SET name=$1, year=$2 WHERE id=$3 RETURNING id',
      [name, year, id]
    );
    if (!result.rowCount) throw new Error('Gagal memperbarui album');
  }

  async deleteAlbumById(id) {
    const result = await pool.query('DELETE FROM albums WHERE id=$1 RETURNING id', [id]);
    if (!result.rowCount) throw new Error('Gagal menghapus album');
  }
}

export default AlbumsService;
