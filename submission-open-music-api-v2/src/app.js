import express from 'express';
import albumsRoutes from './routes/albums.js';
import songsRoutes from './routes/songs.js';
import usersRoutes from './routes/users.js';
import authenticationsRoutes from './routes/authentications.js';
import playlistsRoutes from './routes/playlists.js';
import ClientError from './errors/ClientError.js';

const app = express();
app.use(express.json());

// Routes
app.use('/albums', albumsRoutes);
app.use('/songs', songsRoutes);
app.use('/users', usersRoutes);
app.use('/authentications', authenticationsRoutes);
app.use('/playlists', playlistsRoutes);

// 404
app.use((req, res) => {
  return res.status(404).json({
    status: 'fail',
    message: 'Halaman tidak ditemukan',
  });
});

// Error handler
app.use((err, req, res, next) => {
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