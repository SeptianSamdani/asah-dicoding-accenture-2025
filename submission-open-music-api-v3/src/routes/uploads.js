import express from 'express';
import StorageService from '../services/storage/StorageService.js';
import AlbumsService from '../services/albumsService.js';
import InvariantError from '../errors/InvariantError.js';

const router = express.Router();
const storageService = new StorageService('public/uploads/covers');
const albumsService = new AlbumsService();

router.post('/albums/:id/covers', async (req, res, next) => {
  try {
    const { id } = req.params;

    console.log('Upload request received');
    console.log('Files:', req.files);
    console.log('Body:', req.body);

    // Cek apakah ada file
    if (!req.files || !req.files.cover) {
      throw new InvariantError('File cover tidak ditemukan');
    }

    const { cover } = req.files;
    
    console.log('File details:', {
      name: cover.name,
      size: cover.size,
      mimetype: cover.mimetype
    });

    // Validasi mimetype
    const validMimeTypes = [
      'image/apng',
      'image/avif', 
      'image/gif',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];

    if (!validMimeTypes.includes(cover.mimetype)) {
      throw new InvariantError('File harus berupa gambar');
    }

    // Cek ukuran file
    if (cover.size > 512000) {
      return res.status(413).json({
        status: 'fail',
        message: 'Payload content length greater than maximum allowed: 512000',
      });
    }

    // Upload file
    const filename = await storageService.writeFile(cover, cover);
    const coverUrl = storageService.getFileUrl(filename);

    console.log('Cover URL:', coverUrl);

    // Update database
    await albumsService.updateAlbumCover(id, coverUrl);

    res.status(201).json({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
  } catch (e) {
    console.error('Upload error:', e);
    next(e);
  }
});

export default router;