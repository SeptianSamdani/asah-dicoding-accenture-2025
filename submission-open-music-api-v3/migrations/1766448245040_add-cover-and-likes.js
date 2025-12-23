export const up = (pgm) => {
  // Tambah kolom cover di albums
  pgm.addColumn('albums', {
    cover: { type: 'varchar(255)', notNull: false },
  });

  // Buat tabel user_album_likes
  pgm.createTable('user_album_likes', {
    id: { type: 'varchar(50)', primaryKey: true },
    user_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    album_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'albums(id)',
      onDelete: 'CASCADE',
    },
  });

  // Constraint unique untuk mencegah user like album yang sama 2x
  pgm.addConstraint('user_album_likes', 'unique_user_album', {
    unique: ['user_id', 'album_id'],
  });

  // Index untuk performa
  pgm.createIndex('user_album_likes', 'user_id');
  pgm.createIndex('user_album_likes', 'album_id');
};

export const down = (pgm) => {
  pgm.dropTable('user_album_likes');
  pgm.dropColumn('albums', 'cover');
};