import express from 'express';
import StorageService from '../services/storage/StorageService.js';
import AlbumsService from '../services/albumsService.js';
import { validateImageHeaders } from '../validators/uploads/index.js';
import InvariantError from '../errors/InvariantError.js';

const router = express.Router();
const storageService = new StorageService('public/uploads/covers');
const albumsService = new AlbumsService();

router.post('/albums/:id/covers', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.files || !req.files.cover) {
      throw new InvariantError('File cover tidak ditemukan');
    }

    const { cover } = req.files;

    // Validasi header
    validateImageHeaders({ 'content-type': cover.mimetype });

    // Validasi size sudah di-handle oleh middleware fileUpload

    // Upload file
    const filename = await storageService.writeFile(cover, cover);
    const coverUrl = storageService.getFileUrl(filename);

    // Update database
    await albumsService.updateAlbumCover(id, coverUrl);

    res.status(201).json({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
  } catch (e) {
    next(e);
  }
});

export default router;