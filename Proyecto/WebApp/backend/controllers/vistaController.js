const { getConnection } = require('../db');

exports.pedidosPendientes = async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(`SELECT * FROM v_pedidos_pendientes`);
    res.json(result.rows);
    await conn.close();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.flujoEfectivo = async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(`SELECT * FROM v_flujo_efectivo`);
    res.json(result.rows);
    await conn.close();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.inventarioValorizado = async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(`SELECT * FROM v_inventario_valorizado`);
    res.json(result.rows);
    await conn.close();
  } catch (err) {
    res.status(500).send(err.message);
  }
};
