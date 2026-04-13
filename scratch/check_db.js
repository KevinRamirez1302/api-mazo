const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432', 10),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: false,
});

async function check() {
  try {
    const res = await pool.query('SELECT username FROM usuarios LIMIT 5');
    console.log('Usuarios en la DB:', res.rows);
  } catch (err) {
    console.error('Error al consultar DB:', err.message);
  } finally {
    await pool.end();
  }
}

check();
