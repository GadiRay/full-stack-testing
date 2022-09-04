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
class DBPool extends pg_1.Pool {
    constructor() {
        super();
        const pool = new pg_1.Pool(CONFIG);
        pool.connect((connectErr, client, release) => {
            if (connectErr)
                throw connectErr;
            release();
            const queryText = 'CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, firstName VARCHAR(100) not null, lastName VARCHAR(100) not null, email VARCHAR(100) not null, age int not null)';
            client.query(queryText, (err, res) => {
                if (err)
                    throw err;
                console.log('Created table!');
            });
        });
        return pool;
    }
}
exports.default = DBPool;
