import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DetallePedidoList() {
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/detalles')
      .then(res => setDetalles(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Detalles de Pedido</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Pedido</th><th>Artículo</th><th>Solicitado</th><th>Despachado</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((d, i) => (
            <tr key={i}>
              <td>{d[0]}</td>
              <td>{d[1]}</td>
              <td>{d[2]}</td>
              <td>{d[3]}</td>
              <td>{d[4]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DetallePedidoList;
