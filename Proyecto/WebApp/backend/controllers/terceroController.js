// backend/controllers/terceroController.js
const { getConnection } = require('../db');

// Nota: la tabla se llama "terceros" en el modelo

exports.getAll = async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(`SELECT codigo_tercero, nombre, telefono, direccion, cuenta_bancaria FROM terceros ORDER BY codigo_tercero`);
    res.json(result.rows);
    await conn.close();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.create = async (req, res) => {
  const { nombre, telefono, direccion, cuenta_bancaria, codigo_pais, tipo_tercero, codigo_cliente_aprobador } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO terceros (codigo_pais, nombre, tipo_tercero, telefono, direccion, cuenta_bancaria, codigo_cliente_aprobador)
       VALUES (:1, :2, :3, :4, :5, :6, :7)`,
      [codigo_pais || null, nombre, tipo_tercero || null, telefono || null, direccion || null, cuenta_bancaria || null, codigo_cliente_aprobador || null],
      { autoCommit: true }
    );
    res.send('Tercero creado');
    await conn.close();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, direccion, cuenta_bancaria } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `UPDATE terceros SET nombre = :1, telefono = :2, direccion = :3, cuenta_bancaria = :4 WHERE codigo_tercero = :5`,
      [nombre, telefono, direccion, cuenta_bancaria, id],
      { autoCommit: true }
    );
    res.send('Tercero actualizado');
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
      `DELETE FROM terceros WHERE codigo_tercero = :1`,
      [id],
      { autoCommit: true }
    );
    res.send('Tercero eliminado');
    await conn.close();
  } catch (err) {
    res.status(500).send(err.message);
  }
};
