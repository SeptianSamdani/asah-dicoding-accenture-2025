import pool from '../database/index.js';
import { generateId } from '../utils/generateId.js';
import NotFoundError from '../errors/NotFoundError.js';
import AuthorizationError from '../errors/AuthorizationError.js';
import InvariantError from '../errors/InvariantError.js';

class PlaylistsService {
  async addPlaylist({ name, owner }) {
    const id = generateId('playlist');
    const result = await pool.query(
      'INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3) RETURNING id',
      [id, name, owner]
    );

    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(userId) {
    const result = await pool.query(
      `SELECT p.id, p.name, u.username 
      FROM playlists p
      INNER JOIN users u ON p.owner = u.id
      WHERE p.owner = $1`,
      [userId]
    );

    return result.rows;
  }

  async deletePlaylistById(playlistId) {
    const result = await pool.query(
      'DELETE FROM playlists WHERE id = $1 RETURNING id',
      [playlistId]
    );

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const result = await pool.query(
      'SELECT owner FROM playlists WHERE id = $1',
      [playlistId]
    );

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const { owner } = result.rows[0];
    
    if (owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    const result = await pool.query(
      'SELECT owner FROM playlists WHERE id = $1',
      [playlistId]
    );

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const { owner } = result.rows[0];
    
    if (owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const songCheck = await pool.query(
      'SELECT id FROM songs WHERE id = $1',
      [songId]
    );

    if (!songCheck.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    const id = generateId('playlist-song');
    const result = await pool.query(
      'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3) RETURNING id',
      [id, playlistId, songId]
    );

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  async getSongsFromPlaylist(playlistId) {
    const playlistCheck = await pool.query(
      `SELECT p.id, p.name, u.username 
       FROM playlists p
       INNER JOIN users u ON p.owner = u.id
       WHERE p.id = $1`,
      [playlistId]
    );

    if (!playlistCheck.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = playlistCheck.rows[0];

    const songsResult = await pool.query(
      `SELECT s.id, s.title, s.performer
       FROM songs s
       INNER JOIN playlist_songs ps ON s.id = ps.song_id
       WHERE ps.playlist_id = $1`,
      [playlistId]
    );

    return {
      ...playlist,
      songs: songsResult.rows,
    };
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const result = await pool.query(
      'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      [playlistId, songId]
    );

    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan di playlist');
    }
  }
}

export default PlaylistsService;