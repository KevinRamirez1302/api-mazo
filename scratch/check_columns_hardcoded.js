const { Pool } = require('pg');

const pool = new Pool({
  host: "routersamuperez.ddns.net",
  port: 5432,
  user: "alumno",
  password: "superior",
  database: "mazosql",
  ssl: false,
});

async function check() {
  try {
    const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'personas'");
    console.log('Columnas de la tabla personas:', res.rows.map(r => r.column_name));
  } catch (err) {
    console.error('Error al consultar DB:', err.message);
  } finally {
    const end = pool.end();
  }
}

check();
