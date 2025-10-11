import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PedidoList() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/pedidos')
      .then(res => setPedidos(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Pedidos registrados</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Cliente</th><th>Fecha Pedido</th><th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p, i) => (
            <tr key={i}>
              <td>{p[0]}</td>
              <td>{p[1]}</td>
              <td>{p[2]}</td>
              <td>{p[4]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PedidoList;
