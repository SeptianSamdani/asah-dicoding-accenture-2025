import express from 'express';
import AlbumsService from '../services/albumsService.js';
import { albumSchema } from '../validators/albumsValidator.js';
import InvariantError from '../errors/InvariantError.js';

const router = express.Router();
const albumsService = new AlbumsService();

router.post('/', async (req, res, next) => {
  try {
    // TAMBAHKAN VALIDASI INI
    const { error } = albumSchema.validate(req.body);
    if (error) {
      throw new InvariantError(error.message);
    }

    const id = await albumsService.addAlbum(req.body);
    res.status(201).json({ status: 'success', data: { albumId: id } });
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const album = await albumsService.getAlbumById(req.params.id);
    res.json({ status: 'success', data: { album } });
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    // TAMBAHKAN VALIDASI INI
    const { error } = albumSchema.validate(req.body);
    if (error) {
      throw new InvariantError(error.message);
    }

    await albumsService.editAlbumById(req.params.id, req.body);
    res.json({ status: 'success', message: 'Album berhasil diperbarui' });
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await albumsService.deleteAlbumById(req.params.id);
    res.json({ status: 'success', message: 'Album berhasil dihapus' });
  } catch (e) {
    next(e);
  }
});

export default router;