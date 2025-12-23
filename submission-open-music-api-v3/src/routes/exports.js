import express from 'express';
import ProducerService from '../services/rabbitmq/ProducerService.js';
import PlaylistsService from '../services/playlistsService.js';
import { validateExportPlaylistPayload } from '../validators/exports/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const playlistsService = new PlaylistsService();

router.post('/playlists/:playlistId', authenticateToken, async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const { userId } = req.auth;

    validateExportPlaylistPayload(req.body);
    const { targetEmail } = req.body;

    // Verifikasi owner
    await playlistsService.verifyPlaylistOwner(playlistId, userId);

    const message = {
      playlistId,
      targetEmail,
    };

    await ProducerService.sendMessage(
      'export:playlist',
      JSON.stringify(message)
    );

    res.status(201).json({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
  } catch (e) {
    next(e);
  }
});

export default router;