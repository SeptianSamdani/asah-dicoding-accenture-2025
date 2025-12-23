exports.up = (pgm) => {
  // Tabel playlists
  pgm.createTable('playlists', {
    id: { type: 'varchar(50)', primaryKey: true },
    name: { type: 'varchar(100)', notNull: true },
    owner: { 
      type: 'varchar(50)', 
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE'
    },
  });

  // Tabel playlist_songs
  pgm.createTable('playlist_songs', {
    id: { type: 'varchar(50)', primaryKey: true },
    playlist_id: { 
      type: 'varchar(50)', 
      notNull: true,
      references: 'playlists(id)',
      onDelete: 'CASCADE'
    },
    song_id: { 
      type: 'varchar(50)', 
      notNull: true,
      references: 'songs(id)',
      onDelete: 'CASCADE'
    },
  });

  // Index untuk performa
  pgm.createIndex('playlist_songs', 'playlist_id');
  pgm.createIndex('playlist_songs', 'song_id');
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
  pgm.dropTable('playlists');
};