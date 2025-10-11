// backend/controllers/pedidoController.js
const { getConnection } = require('../db');

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
    await conn.execute(
      `INSERT INTO pedido (codigo_cliente, fecha_pedido, fecha_requerida, estado, origen)
       VALUES (:1, :2, :3, :4, :5)`,
      [codigo_cliente, fecha_pedido, fecha_requerida, estado, origen],
      { autoCommit: true }
    );
    res.send('Pedido creado');
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
      [estado, fecha_requerida, id],
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

