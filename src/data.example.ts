const Pool = require('pg').Pool;
export const pool = new Pool({
    user: 'username',
    host: 'database.server.com',
    database: 'postgres',
    password: 'password',
    port: 5432});