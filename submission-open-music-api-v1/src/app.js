import express from 'express';
import albumsRoutes from './routes/albums.js';
import songsRoutes from './routes/songs.js';
import ClientError from './errors/ClientError.js';

const app = express();

// JSON parser + tangkap syntax error JSON agar jadi 400 (bukan 500)
app.use(express.json());

// Routes
app.use('/albums', albumsRoutes);
app.use('/songs', songsRoutes);

// 404 (route tidak ditemukan) 
app.use((req, res) => {
  return res.status(404).json({
    status: 'fail',
    message: 'Resource tidak ditemukan',
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && 'body' in err)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Payload JSON tidak valid',
    });
  }

  // Joi error
  if (err && (err.isJoi || err.name === 'ValidationError')) {
    return res.status(400).json({
      status: 'fail',
      message: err.message || 'Payload tidak valid',
    });
  }

  // Error kustom 
  if (err instanceof ClientError || err?.isClientError) {
    return res.status(err.statusCode || 400).json({
      status: 'fail',
      message: err.message || 'Permintaan tidak dapat diproses',
    });
  }

  // Fallback: 500
  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Maaf, terjadi kegagalan pada server kami.',
  });
});

export default app;
