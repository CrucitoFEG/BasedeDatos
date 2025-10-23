const { getConnection } = require('../db');
const oracledb = require('oracledb');

exports.getTerceros = async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT codigo_tercero, nombre FROM terceros ORDER BY nombre`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows || []);
    await conn.close();
  } catch (err) {
    console.error('Error fetching terceros:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getLocalidades = async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT codigo_localidad, nombre FROM localidad ORDER BY nombre`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows || []);
    await conn.close();
  } catch (err) {
    console.error('Error fetching localidades:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getTiposByCampo = async (req, res) => {
  const { campo } = req.query;
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT codigo_tipo, descripcion1 FROM tipo WHERE campo = :1 ORDER BY descripcion1`,
      [campo],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows || []);
    await conn.close();
  } catch (err) {
    console.error('Error fetching tipos:', err);
    res.status(500).json({ error: err.message });
  }
};
