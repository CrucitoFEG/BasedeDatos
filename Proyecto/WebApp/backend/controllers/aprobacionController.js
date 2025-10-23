const { getConnection } = require('../db');

exports.create = async (req, res) => {
  const { codigo_pedido, codigo_empleado, resultado, comentarios } = req.body;
  try {
    const conn = await getConnection();
    // Insertar aprobación
    await conn.execute(
      `INSERT INTO aprobacion (codigo_pedido, codigo_empleado, fecha, resultado, comentarios)
       VALUES (:1, :2, SYSDATE, :3, :4)`,
      [codigo_pedido, codigo_empleado, resultado, comentarios],
      { autoCommit: true }
    );

    // Actualizar estado del pedido al resultado (se asume que 'resultado' es un código en tipo)
    await conn.execute(
      `UPDATE pedido SET estado = :1 WHERE codigo_pedido = :2`,
      [resultado, codigo_pedido],
      { autoCommit: true }
    );

    res.json({ success: true, message: 'Aprobación registrada' });
    await conn.close();
  } catch (err) {
    console.error('Error en create aprobacion:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getByPedido = async (req, res) => {
  const { pedidoId } = req.params;
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT * FROM aprobacion WHERE codigo_pedido = :1 ORDER BY fecha DESC`,
      [pedidoId]
    );
    res.json(result.rows || []);
    await conn.close();
  } catch (err) {
    console.error('Error en getByPedido aprobacion:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(`SELECT * FROM aprobacion ORDER BY fecha DESC`);
    res.json(result.rows || []);
    await conn.close();
  } catch (err) {
    console.error('Error en getAll aprobacion:', err);
    res.status(500).json({ error: err.message });
  }
};
