import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'drones',
  password: process.env.PGPASSWORD || '123789',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432
});

export default pool;
//se puede hacer una clase y un archivo de configuracion que será llamado por un método desde esa misma clase y un archivo .hatcess para proteger los datos privados de la bd