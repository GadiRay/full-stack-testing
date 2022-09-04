import { Pool } from 'pg';

// create new pool for psql
const CONFIG = {
  password: 'postgres',
  user: 'postgres',
  database: 'postgres',
  host: 'localhost',
  port: 5432,
};

const pool = new Pool(CONFIG);

export default pool;
