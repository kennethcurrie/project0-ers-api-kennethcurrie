"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pool = require('pg').Pool;
exports.pool = new Pool({ user: 'username',
    host: 'revdb.cmckew9xm4d6.us-east-2.rds.amazonaws.com',
    database: 'revdb',
    password: 'password',
    port: 5432 });
//# sourceMappingURL=data.js.map