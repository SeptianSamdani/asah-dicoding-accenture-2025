// node-pg-migrate.config.js
import dotenv from 'dotenv';
dotenv.config();


export default {
    migrationFileExtension: '.js',
    dir: 'migrations',
    direction: 'up',
    count: Infinity,
    databaseUrl: {
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
    },
};