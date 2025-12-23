import express from 'express';
import AlbumsService from '../services/albumsService.js';
import { albumSchema } from '../validators/albumsValidator.js';

const router = express.Router();
const service = new AlbumsService();

// Helper validasi sinkron (Joi)
function validateAlbum(req, res, next) {
  const { error } = albumSchema.validate(req.body);
  if (error) {
    error.isJoi = true;
    return next(error);
  }
  return next();
}

router.post('/', validateAlbum, async (req, res, next) => {
  try {
    const albumId = await service.addAlbum(req.body);
    return res.status(201).json({ status: 'success', data: { albumId } });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const album = await service.getAlbumById(req.params.id);
    return res.json({ status: 'success', data: { album } });
  } catch (e) { next(e); }
});

router.put('/:id', validateAlbum, async (req, res, next) => {
  try {
    await service.editAlbumById(req.params.id, req.body);
    return res.json({ status: 'success', message: 'Album berhasil diperbarui' });
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await service.deleteAlbumById(req.params.id);
    return res.json({ status: 'success', message: 'Album berhasil dihapus' });
  } catch (e) { next(e); }
});

export default router;
