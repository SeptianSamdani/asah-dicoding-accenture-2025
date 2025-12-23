import express from 'express';
import AlbumsService from '../services/albumsService.js';
import { albumSchema } from '../validators/albumsValidator.js';
import InvariantError from '../errors/InvariantError.js';
import { authenticateToken } from '../middleware/auth.js';
import CacheService from '../services/redis/CacheService.js';
import UserAlbumLikesService from '../services/userAlbumLikesService.js';

const router = express.Router();
const albumsService = new AlbumsService();

const cacheService = new CacheService();
const likesService = new UserAlbumLikesService();

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

// POST Like
router.post('/:id/likes', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth;

    await likesService.addLike(userId, id);
    await cacheService.delete(`album:${id}:likes`);

    res.status(201).json({
      status: 'success',
      message: 'Album berhasil disukai',
    });
  } catch (e) {
    next(e);
  }
});

// DELETE Unlike
router.delete('/:id/likes', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth;

    await likesService.deleteLike(userId, id);
    await cacheService.delete(`album:${id}:likes`);

    res.status(200).json({
      status: 'success',
      message: 'Like berhasil dihapus',
    });
  } catch (e) {
    next(e);
  }
});

// GET Likes Count
router.get('/:id/likes', async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `album:${id}:likes`;

    try {
      // Coba dari cache
      const likes = await cacheService.get(cacheKey);
      res.set('X-Data-Source', 'cache');
      return res.status(200).json({
        status: 'success',
        data: {
          likes: parseInt(likes),
        },
      });
    } catch {
      // Dari database
      const likes = await likesService.getLikesCount(id);
      await cacheService.set(cacheKey, likes, 1800);

      res.status(200).json({
        status: 'success',
        data: { likes },
      });
    }
  } catch (e) {
    next(e);
  }
});

export default router;