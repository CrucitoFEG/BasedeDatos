// backend/controllers/paisController.js
const { getConnection } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(`SELECT * FROM pais ORDER BY codigo_pais`);
    res.json(result.rows);
    await conn.close();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.create = async (req, res) => {
  const { nombre, moneda } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO pais (nombre, moneda) VALUES (:1, :2)`,
      [nombre, moneda],
      { autoCommit: true }
    );
    res.send('País creado');
    await conn.close();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nombre, moneda } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `UPDATE pais SET nombre = :1, moneda = :2 WHERE codigo_pais = :3`,
      [nombre, moneda, id],
      { autoCommit: true }
    );
    res.send('País actualizado');
    await conn.close();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await getConnection();
    await conn.execute(
      `DELETE FROM pais WHERE codigo_pais = :1`,
      [id],
      { autoCommit: true }
    );
    res.send('País eliminado');
    await conn.close();
  } catch (err) {
    res.status(500).send(err.message);
  }
};
