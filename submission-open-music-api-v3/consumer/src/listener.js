import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

class Listener {
  constructor(mailSender) {
    this._mailSender = mailSender;
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());

      // Query playlist dengan songs
      const result = await pool.query(
        `SELECT 
          p.id, 
          p.name,
          json_agg(
            json_build_object(
              'id', s.id,
              'title', s.title,
              'performer', s.performer
            )
          ) FILTER (WHERE s.id IS NOT NULL) as songs
        FROM playlists p
        LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
        LEFT JOIN songs s ON ps.song_id = s.id
        WHERE p.id = $1
        GROUP BY p.id`,
        [playlistId]
      );

      const playlist = result.rows[0];

      const playlistData = {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          songs: playlist.songs || [],
        },
      };

      await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify(playlistData, null, 2)
      );

      console.log(`✓ Email terkirim ke: ${targetEmail}`);
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

export default Listener;