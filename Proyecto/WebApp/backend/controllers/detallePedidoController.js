// backend/controllers/detallePedidoController.js
const { getConnection } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(`SELECT * FROM detalle_pedido`);
    res.json(result.rows);
    await conn.close();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.create = async (req, res) => {
  const { codigo_pedido, codigo_articulo, cantidad_solicitada, cantidad_despachada } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO detalle_pedido (codigo_pedido, codigo_articulo, cantidad_solicitada, cantidad_despachada)
       VALUES (:1, :2, :3, :4)`,
      [codigo_pedido, codigo_articulo, cantidad_solicitada, cantidad_despachada || 0],
      { autoCommit: true }
    );
    res.send('Detalle de pedido creado');
    await conn.close();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { cantidad_solicitada, cantidad_despachada } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `UPDATE detalle_pedido SET cantidad_solicitada = :1, cantidad_despachada = :2 WHERE codigo_detalle_pedido = :3`,
      [cantidad_solicitada, cantidad_despachada, id],
      { autoCommit: true }
    );
    res.send('Detalle de pedido actualizado');
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
      `DELETE FROM detalle_pedido WHERE codigo_detalle_pedido = :1`,
      [id],
      { autoCommit: true }
    );
    res.send('Detalle de pedido eliminado');
    await conn.close();
  } catch (err) {
    res.status(500).send(err.message);
  }
};
