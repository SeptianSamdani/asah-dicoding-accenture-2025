// ==========================================
// File: src/routes/playlists.js
// ==========================================
import express from 'express';
import PlaylistsService from '../services/playlistsService.js';
import { playlistSchema, playlistSongSchema } from '../validators/playlistsValidator.js';
import { authenticateToken } from '../middleware/auth.js';
import InvariantError from '../errors/InvariantError.js';

const router = express.Router();
const playlistsService = new PlaylistsService();

// Semua endpoint playlists memerlukan authentication
router.use(authenticateToken);

// CREATE PLAYLIST
router.post('/', async (req, res, next) => {
  try {
    const { error } = playlistSchema.validate(req.body);
    if (error) {
      throw new InvariantError(error.message);
    }

    const { name } = req.body;
    const { userId } = req.auth;

    const playlistId = await playlistsService.addPlaylist({ name, owner: userId });

    res.status(201).json({
      status: 'success',
      data: { playlistId },
    });
  } catch (e) {
    next(e);
  }
});

// GET ALL PLAYLISTS (milik user yang login)
router.get('/', async (req, res, next) => {
  try {
    const { userId } = req.auth;
    const playlists = await playlistsService.getPlaylists(userId);

    res.json({
      status: 'success',
      data: { playlists },
    });
  } catch (e) {
    next(e);
  }
});

// DELETE PLAYLIST (hanya owner)
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth;

    await playlistsService.verifyPlaylistOwner(id, userId);
    await playlistsService.deletePlaylistById(id);

    res.json({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    });
  } catch (e) {
    next(e);
  }
});

// ADD SONG TO PLAYLIST (owner atau collaborator)
router.post('/:id/songs', async (req, res, next) => {
  try {
    const { error } = playlistSongSchema.validate(req.body);
    if (error) {
      throw new InvariantError(error.message);
    }

    const { id } = req.params;
    const { songId } = req.body;
    const { userId } = req.auth;

    await playlistsService.verifyPlaylistAccess(id, userId);
    await playlistsService.addSongToPlaylist(id, songId);

    res.status(201).json({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
  } catch (e) {
    next(e);
  }
});

// GET SONGS FROM PLAYLIST (owner atau collaborator)
router.get('/:id/songs', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth;

    await playlistsService.verifyPlaylistAccess(id, userId);
    const playlist = await playlistsService.getSongsFromPlaylist(id);

    res.json({
      status: 'success',
      data: { playlist },
    });
  } catch (e) {
    next(e);
  }
});

// DELETE SONG FROM PLAYLIST (owner atau collaborator)
router.delete('/:id/songs', async (req, res, next) => {
  try {
    const { error } = playlistSongSchema.validate(req.body);
    if (error) {
      throw new InvariantError(error.message);
    }

    const { id } = req.params;
    const { songId } = req.body;
    const { userId } = req.auth;

    await playlistsService.verifyPlaylistAccess(id, userId);
    await playlistsService.deleteSongFromPlaylist(id, songId);

    res.json({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
  } catch (e) {
    next(e);
  }
});

export default router;