import pool from '../database/index.js';
import { generateId } from '../utils/generateId.js';
import NotFoundError from '../errors/NotFoundError.js';
import InvariantError from '../errors/InvariantError.js';

class AlbumsService {
  async addAlbum({ name, year }) {
    const id = generateId('album');

    console.log('Attempting to insert:', { id, name, year });

    const result = await pool.query(
      'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id',
      [id, name, year]
    );

    console.log('Insert result:', result.rows);

    if (!result.rowCount) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const album = await pool.query('SELECT * FROM albums WHERE id=$1', [id]);
    
    if (!album.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    // Get songs in album
    const songs = await pool.query(
      'SELECT id, title, performer FROM songs WHERE album_id=$1',
      [id]
    );

    return {
      ...album.rows[0],
      songs: songs.rows,
    };
  }

  async editAlbumById(id, { name, year }) {
    const result = await pool.query(
      'UPDATE albums SET name=$1, year=$2 WHERE id=$3 RETURNING id',
      [name, year, id]
    );

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const result = await pool.query('DELETE FROM albums WHERE id=$1 RETURNING id', [id]);
    
    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }
}

export default AlbumsService;