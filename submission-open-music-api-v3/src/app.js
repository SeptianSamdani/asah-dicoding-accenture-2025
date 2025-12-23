import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';

import albumsRoutes from './routes/albums.js';
import songsRoutes from './routes/songs.js';
import usersRoutes from './routes/users.js';
import authenticationsRoutes from './routes/authentications.js';
import playlistsRoutes from './routes/playlists.js';
import exportsRoutes from './routes/exports.js';
import uploadsRoutes from './routes/uploads.js';  // ← Import ini
import ClientError from './errors/ClientError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// File upload middleware - PENTING!
app.use(
  fileUpload({
    limits: { fileSize: 512000 },
    abortOnLimit: true,
    createParentPath: true,
  })
);

// Static files untuk serve gambar
app.use(
  '/uploads/covers',
  express.static(path.join(__dirname, '../public/uploads/covers'))
);

// Routes
app.use('/albums', albumsRoutes);
app.use('/songs', songsRoutes);
app.use('/users', usersRoutes);
app.use('/authentications', authenticationsRoutes);
app.use('/playlists', playlistsRoutes);
app.use('/export', exportsRoutes);
app.use(uploadsRoutes);  // ← PASTIKAN INI ADA

// 404
app.use((req, res) => {
  return res.status(404).json({
    status: 'fail',
    message: 'Halaman tidak ditemukan',
  });
});

// Error handler - UPDATE INI
app.use((err, req, res, next) => {
  // Handle file too large
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      status: 'fail',
      message: 'Payload content length greater than maximum allowed: 512000',
    });
  }

  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Maaf, terjadi kegagalan pada server kami.',
  });
});

export default app;