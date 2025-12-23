export const up = (pgm) => {
  pgm.createTable('users', {
    id: { type: 'varchar(50)', primaryKey: true },
    username: { type: 'varchar(50)', unique: true, notNull: true },
    password: { type: 'text', notNull: true },
    fullname: { type: 'varchar(100)', notNull: true },
  });
};

export const down = (pgm) => {
  pgm.dropTable('users');
};