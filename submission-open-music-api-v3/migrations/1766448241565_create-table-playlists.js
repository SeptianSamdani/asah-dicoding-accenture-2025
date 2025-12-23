export const up = (pgm) => {
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
};

export const down = (pgm) => {
  pgm.dropTable('playlists');
};