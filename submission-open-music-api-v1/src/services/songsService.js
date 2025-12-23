import pool from '../database/index.js';
import { generateId } from '../utils/generateId.js';
import NotFoundError from '../errors/NotFoundError.js';


class SongsService {
async addSong({ title, year, performer, genre, duration, albumId }) {
const id = generateId('song');
await pool.query(
`INSERT INTO songs (id, title, year, performer, genre, duration, album_id)
VALUES ($1, $2, $3, $4, $5, $6, $7)`,
[id, title, year, performer, genre, duration ?? null, albumId ?? null]
);
return id;
}


async getSongs({ title, performer }) {
// Optional criteria: query params filter
let query = 'SELECT id, title, performer FROM songs WHERE 1=1';
const params = [];


if (title) {
params.push(`%${title.toLowerCase()}%`);
query += ` AND LOWER(title) LIKE $${params.length}`;
}
if (performer) {
params.push(`%${performer.toLowerCase()}%`);
query += ` AND LOWER(performer) LIKE $${params.length}`;
}


const { rows } = await pool.query(query, params);
return rows;
}


async getSongById(id) {
const result = await pool.query(
`SELECT id, title, year, performer, genre, duration, album_id AS "albumId"
FROM songs WHERE id=$1`,
[id]
);
if (!result.rowCount) throw new NotFoundError('Lagu tidak ditemukan');
return result.rows[0];
}


async editSongById(id, { title, year, performer, genre, duration, albumId }) {
const result = await pool.query(
`UPDATE songs SET title=$1, year=$2, performer=$3, genre=$4, duration=$5, album_id=$6
WHERE id=$7 RETURNING id`,
[title, year, performer, genre, duration ?? null, albumId ?? null, id]
);
if (!result.rowCount) throw new NotFoundError('Lagu tidak ditemukan');
}


async deleteSongById(id) {
const result = await pool.query('DELETE FROM songs WHERE id=$1 RETURNING id', [id]);
if (!result.rowCount) throw new NotFoundError('Lagu tidak ditemukan');
}
}


export default SongsService;