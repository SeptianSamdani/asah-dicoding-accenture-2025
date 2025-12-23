export const up = (pgm) => {
  pgm.createTable('authentications', {
    token: { type: 'text', primaryKey: true },
  });
};

export const down = (pgm) => {
  pgm.dropTable('authentications');
};