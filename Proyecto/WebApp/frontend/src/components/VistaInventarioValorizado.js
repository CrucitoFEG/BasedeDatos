import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

function VistaInventarioValorizado() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    axios.get('https://musical-doodle-x5r9x5jwrxrq34jx-3001.app.github.dev/api/vistas/inventario-valorizado')
      .then(res => setDatos(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h3>Inventario Valorizado</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th><th>Localidad</th><th>Artículo</th><th>Cantidad</th><th>Precio</th><th>Valor Total</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((d, i) => (
            <tr key={i}>
              <td>{d[0]}</td><td>{d[1]}</td><td>{d[2]}</td><td>{d[3]}</td><td>{d[4]}</td><td>{d[5]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default VistaInventarioValorizado;
