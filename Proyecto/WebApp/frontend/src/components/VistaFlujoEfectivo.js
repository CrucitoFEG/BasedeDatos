import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

function VistaFlujoEfectivo() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    axios.get('https://musical-doodle-x5r9x5jwrxrq34jx-3001.app.github.dev/api/vistas/flujo-efectivo')
      .then(res => setDatos(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h3>Flujo de Efectivo</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th><th>Tipo</th><th>Artículo</th><th>Fecha</th><th>Monto</th><th>Cantidad</th><th>Origen</th><th>Destino</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((d, i) => (
            <tr key={i}>
              <td>{d[0]}</td><td>{d[1]}</td><td>{d[2]}</td><td>{d[3]}</td><td>{d[4]}</td><td>{d[5]}</td><td>{d[6]}</td><td>{d[7]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default VistaFlujoEfectivo;
