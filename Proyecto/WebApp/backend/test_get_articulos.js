const { getConnection } = require('./db');

async function test() {
  try {
    const conn = await getConnection();
    const result = await conn.execute(`SELECT codigo_articulo, nombre FROM articulo ORDER BY nombre`);
    console.log('ROWS:', result.rows && result.rows.length ? result.rows.slice(0,20) : 'NO ROWS');
    await conn.close();
  } catch (err) {
    console.error('ERROR', err && err.message ? err.message : err);
    process.exit(1);
  }
}

test();
