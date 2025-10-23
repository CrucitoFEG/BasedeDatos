const { getConnection } = require('../db');
const oracledb = require('oracledb');

exports.getArticulos = async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT codigo_articulo, nombre, tipo_articulo, unidad_medida, precio_referencia FROM articulo ORDER BY nombre`,
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

exports.getArticuloById = async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT codigo_articulo, nombre, tipo_articulo, unidad_medida, precio_referencia FROM articulo WHERE codigo_articulo = :1`,
      [Number(id)],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const row = (result.rows || [])[0] || null;
    res.json(row);
    await conn.close();
  } catch (err) {
    console.error('Error fetching articulo by id:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createArticulo = async (req, res) => {
  const { nombre, tipo_articulo, unidad_medida, precio_referencia } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO articulo (nombre, tipo_articulo, unidad_medida, precio_referencia)
       VALUES (:1, :2, :3, :4)`,
      [nombre, tipo_articulo || null, unidad_medida || null, precio_referencia || null],
      { autoCommit: true }
    );
    res.status(201).json({ message: 'Articulo creado' });
    await conn.close();
  } catch (err) {
    console.error('Error creating articulo:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateArticulo = async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo_articulo, unidad_medida, precio_referencia } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `UPDATE articulo SET nombre = :1, tipo_articulo = :2, unidad_medida = :3, precio_referencia = :4 WHERE codigo_articulo = :5`,
      [nombre, tipo_articulo || null, unidad_medida || null, precio_referencia || null, Number(id)],
      { autoCommit: true }
    );
    res.json({ message: 'Articulo actualizado' });
    await conn.close();
  } catch (err) {
    console.error('Error updating articulo:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteArticulo = async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await getConnection();
    await conn.execute(
      `DELETE FROM articulo WHERE codigo_articulo = :1`,
      [Number(id)],
      { autoCommit: true }
    );
    res.json({ message: 'Articulo eliminado' });
    await conn.close();
  } catch (err) {
    console.error('Error deleting articulo:', err);
    res.status(500).json({ error: err.message });
  }
};
