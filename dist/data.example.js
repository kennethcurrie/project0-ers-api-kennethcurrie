"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pool = require('pg').Pool;
exports.pool = new Pool({
    user: 'username',
    host: 'database.server.com',
    database: 'postgres',
    password: 'password',
    port: 5432
});
//# sourceMappingURL=data.example.js.map