const oracledb = require('oracledb');
const { getConnection } = require('./db');

(async () => {
  try {
    const conn = await getConnection();
    const pid = '64';
    const result = await conn.execute(
      `SELECT codigo_detalle_pedido, codigo_pedido, codigo_articulo, cantidad_solicitada, cantidad_despachada FROM detalle_pedido WHERE codigo_pedido = :1 ORDER BY codigo_detalle_pedido`,
      [pid],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    console.log('FILTER ROWS:', result.rows);
    await conn.close();
  } catch (err) {
    console.error('ERR', err);
  }
})();
