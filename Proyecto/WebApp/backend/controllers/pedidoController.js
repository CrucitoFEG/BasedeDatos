// backend/controllers/pedidoController.js
const { getConnection } = require('../db');
const oracledb = require('oracledb');

exports.getAll = async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(`SELECT * FROM pedido`);
    res.json(result.rows);
    await conn.close();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.create = async (req, res) => {
  const { codigo_cliente, fecha_pedido, fecha_requerida, estado, origen } = req.body;
  try {
    const conn = await getConnection();
    // Use RETURNING to get the generated codigo_pedido
    const result = await conn.execute(
      `INSERT INTO pedido (codigo_cliente, fecha_pedido, fecha_requerida, estado, origen)
       VALUES (:1, :2, :3, :4, :5) RETURNING codigo_pedido INTO :outId`,
      // Convert incoming date strings to JS Date objects so Oracle driver binds as DATE
      {
        1: codigo_cliente !== undefined && codigo_cliente !== null ? Number(codigo_cliente) : null,
        2: fecha_pedido ? new Date(fecha_pedido) : null,
        3: fecha_requerida ? new Date(fecha_requerida) : null,
        4: estado !== undefined && estado !== null ? Number(estado) : null,
        5: origen || null,
        outId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );
    const insertedId = result.outBinds && result.outBinds.outId ? result.outBinds.outId[0] : null;
    res.json({ message: 'Pedido creado', codigo_pedido: insertedId });
    await conn.close();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { estado, fecha_requerida } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `UPDATE pedido SET estado = :1, fecha_requerida = :2 WHERE codigo_pedido = :3`,
      [estado !== undefined && estado !== null ? Number(estado) : null, fecha_requerida ? new Date(fecha_requerida) : null, id],
      { autoCommit: true }
    );
    res.send('Pedido actualizado');
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
      `DELETE FROM pedido WHERE codigo_pedido = :1`,
      [id],
      { autoCommit: true }
    );
    res.send('Pedido eliminado');
    await conn.close();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

