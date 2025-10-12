import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';

function PaisCrud() {
  const [paises, setPaises] = useState([]);
  const [form, setForm] = useState({ nombre: '', moneda: '' });
  const [editId, setEditId] = useState(null);

  // Cargar países al iniciar
  useEffect(() => {
    fetchPaises();
  }, []);

  const fetchPaises = async () => {
    const res = await axios.get('https://musical-doodle-x5r9x5jwrxrq34jx-3001.app.github.dev/api/paises');
    setPaises(res.data);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editId) {
      await axios.put(`https://musical-doodle-x5r9x5jwrxrq34jx-3001.app.github.dev/api/paises/${editId}`, form);
    } else {
      await axios.post('https://musical-doodle-x5r9x5jwrxrq34jx-3001.app.github.dev/api/paises', form);
    }
    setForm({ nombre: '', moneda: '' });
    setEditId(null);
    fetchPaises();
  };

  const handleEdit = pais => {
    setForm({ nombre: pais[1], moneda: pais[2] });
    setEditId(pais[0]);
  };

  const handleDelete = async id => {
    await axios.delete(`https://musical-doodle-x5r9x5jwrxrq34jx-3001.app.github.dev/api/paises/${id}`);
    fetchPaises();
  };

  return (
    <div>
      <h2>Gestión de Países</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col><Form.Control name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} /></Col>
          <Col><Form.Control name="moneda" placeholder="Moneda" value={form.moneda} onChange={handleChange} /></Col>
          <Col><Button type="submit">{editId ? 'Actualizar' : 'Crear'}</Button></Col>
        </Row>
      </Form>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Moneda</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {paises.map((p, i) => (
            <tr key={i}>
              <td>{p[0]}</td>
              <td>{p[1]}</td>
              <td>{p[2]}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(p)}>Editar</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(p[0])}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default PaisCrud;
