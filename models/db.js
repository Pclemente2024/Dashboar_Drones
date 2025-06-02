import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'drones',
  password: '123789',
  port: 5432
});

export default pool;