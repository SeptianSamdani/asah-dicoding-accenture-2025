import express from 'express';
import SongsService from '../services/songsService.js';
import { songSchema } from '../validators/songsValidator.js';


const router = express.Router();
const service = new SongsService();


router.post('/', async (req, res, next) => {
try {
const { error } = songSchema.validate(req.body);
if (error) return res.status(400).json({ status: 'fail', message: error.message });


const songId = await service.addSong(req.body);
return res.status(201).json({ status: 'success', data: { songId } });
} catch (e) { next(e); }
});


router.get('/', async (req, res, next) => {
try {
const songs = await service.getSongs({ title: req.query.title, performer: req.query.performer });
return res.json({ status: 'success', data: { songs } });
} catch (e) { next(e); }
});


router.get('/:id', async (req, res, next) => {
try {
const song = await service.getSongById(req.params.id);
return res.json({ status: 'success', data: { song } });
} catch (e) { next(e); }
});


router.put('/:id', async (req, res, next) => {
try {
const { error } = songSchema.validate(req.body);
if (error) return res.status(400).json({ status: 'fail', message: error.message });


await service.editSongById(req.params.id, req.body);
return res.json({ status: 'success', message: 'Lagu berhasil diperbarui' });
} catch (e) { next(e); }
});


router.delete('/:id', async (req, res, next) => {
try {
await service.deleteSongById(req.params.id);
return res.json({ status: 'success', message: 'Lagu berhasil dihapus' });
} catch (e) { next(e); }
});


export default router;