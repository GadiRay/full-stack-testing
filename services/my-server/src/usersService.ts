import { Pool, PoolClient } from 'pg';
import DBPool from './db';

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  bitcoins: number;
};
export class UsersService {
  poolClient: Pool;

  constructor(pool: Pool) {
    pool.connect((connectErr, client, release) => {
      if (connectErr) throw connectErr;
      release();
      const queryText =
        'CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, firstName VARCHAR(100) not null, lastName VARCHAR(100) not null, email VARCHAR(100) not null, bitcoins int not null)';
      client.query(queryText, (err, res) => {
        if (err) throw err;
        console.log('Created table!');
      });
    });
    this.poolClient = pool;
  }
  async addUser({
    firstName,
    lastName,
    email,
  }: {
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<User> {
    const bitcoins = SuperComplexBitcoinCalculation();
    const insertQuery = {
      text: 'INSERT INTO users (firstName, lastName, email, bitcoins) VALUES($1, $2, $3, $4) RETURNING id',
      values: [firstName, lastName, email, bitcoins],
    };
    const queryRes = await this.poolClient.query(insertQuery);
    const { id } = queryRes.rows[0];

    return {
      id,
      firstName,
      lastName,
      email,
      bitcoins,
    };
  }
  async getUser(userId: string): Promise<User | undefined> {
    const selectQuery = {
      text: 'SELECT * from users WHERE id=$1',
      values: [userId],
    };

    const user = await this.poolClient.query(selectQuery);

    if (user.rowCount === 0) return undefined;
    return {
      id: user.rows[0].id,
      firstName: user.rows[0].firstname,
      lastName: user.rows[0].lastname,
      email: user.rows[0].email,
      bitcoins: user.rows[0].bitcoins,
    };
  }
}
function SuperComplexBitcoinCalculation() {
  return Math.round(10 * Math.random());
}

