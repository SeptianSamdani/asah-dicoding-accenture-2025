import express from 'express';
import albumsRoutes from './routes/albums.js';
import songsRoutes from './routes/songs.js';
import ClientError from './errors/ClientError.js';

const app = express();
app.use(express.json());

app.use('/albums', albumsRoutes);
app.use('/songs', songsRoutes);

// 404 — route not found
app.use((req, res) => {
return res.status(404).json({ status: 'fail', message: 'Halaman tidak ditemukan' });
});


// Centralized error handler
app.use((err, req, res, next) => {
if (err instanceof ClientError) {
return res.status(err.statusCode).json({ status: 'fail', message: err.message });
}
console.error(err);
return res.status(500).json({ status: 'error', message: 'Maaf, terjadi kegagalan pada server kami.' });
});


export default app;