import pool from '../database/index.js';
import { generateId } from '../utils/generateId.js';
import NotFoundError from '../errors/NotFoundError.js';
import InvariantError from '../errors/InvariantError.js';

class AlbumsService {
  async addAlbum({ name, year }) {
    const id = generateId('album');

    const result = await pool.query(
      'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id',
      [id, name, year]
    );

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

    const songs = await pool.query(
      'SELECT id, title, performer FROM songs WHERE album_id=$1',
      [id]
    );

    return {
      id: album.rows[0].id,
      name: album.rows[0].name,
      year: album.rows[0].year,
      coverUrl: album.rows[0].cover, // Include coverUrl
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

  async updateAlbumCover(id, coverUrl) {
    const result = await pool.query(
      'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      [coverUrl, id]
    );

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }
}

export default AlbumsService;