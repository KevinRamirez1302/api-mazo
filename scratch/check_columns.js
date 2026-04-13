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
    const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'personas'");
    console.log('Columnas de la tabla personas:', res.rows.map(r => r.column_name));
  } catch (err) {
    console.error('Error al consultar DB:', err.message);
  } finally {
    await pool.end();
  }
}

check();
