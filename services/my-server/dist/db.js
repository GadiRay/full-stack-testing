"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// create new pool for psql
const CONFIG = {
    password: 'postgres',
    user: 'postgres',
    database: 'postgres',
    host: 'localhost',
    port: 5432,
};
const pool = new pg_1.Pool(CONFIG);
exports.default = pool;
