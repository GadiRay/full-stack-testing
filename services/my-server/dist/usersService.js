"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
class UsersService {
    constructor(pool) {
        pool.connect((connectErr, client, release) => {
            if (connectErr)
                throw connectErr;
            release();
            const queryText = 'CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, firstName VARCHAR(100) not null, lastName VARCHAR(100) not null, email VARCHAR(100) not null, bitcoins int not null)';
            client.query(queryText, (err, res) => {
                if (err)
                    throw err;
                console.log('Created table!');
            });
        });
        this.poolClient = pool;
    }
    addUser({ firstName, lastName, email, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const bitcoins = Math.round(10 * Math.random());
            const insertQuery = {
                text: 'INSERT INTO users (firstName, lastName, email, bitcoins) VALUES($1, $2, $3, $4) RETURNING id',
                values: [firstName, lastName, email, bitcoins],
            };
            const queryRes = yield this.poolClient.query(insertQuery);
            const { id } = queryRes.rows[0];
            return {
                id,
                firstName,
                lastName,
                email,
                bitcoins,
            };
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectQuery = {
                text: 'SELECT * from users WHERE id=$1',
                values: [userId],
            };
            const user = yield this.poolClient.query(selectQuery);
            if (user.rowCount === 0)
                return undefined;
            return {
                id: user.rows[0].id,
                firstName: user.rows[0].firstname,
                lastName: user.rows[0].lastname,
                email: user.rows[0].email,
                bitcoins: user.rows[0].bitcoins,
            };
        });
    }
}
exports.UsersService = UsersService;
