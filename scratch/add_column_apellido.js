const { Pool } = require('pg');

const pool = new Pool({
  host: "routersamuperez.ddns.net",
  port: 5432,
  user: "alumno",
  password: "superior",
  database: "mazosql",
  ssl: false,
});

async function addColumn() {
  try {
    await pool.query("ALTER TABLE personas ADD COLUMN apellido VARCHAR(255)");
    console.log('Columna "apellido" añadida exitosamente.');
  } catch (err) {
    if (err.message.includes('already exists')) {
        console.log('La columna "apellido" ya existe.');
    } else {
        console.error('Error al añadir columna:', err.message);
    }
  } finally {
    await pool.end();
  }
}

addColumn();
