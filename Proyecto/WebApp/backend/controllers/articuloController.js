const { getConnection } = require('../db');
const oracledb = require('oracledb');

exports.getArticulos = async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT codigo_articulo, nombre FROM articulo ORDER BY nombre`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows || []);
    await conn.close();
  } catch (err) {
    console.error('Error fetching articulos:', err);
    res.status(500).json({ error: err.message });
  }
};
