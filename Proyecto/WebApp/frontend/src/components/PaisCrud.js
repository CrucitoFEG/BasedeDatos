import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Form, Button, Row, Col, Card, Container, InputGroup, Spinner } from 'react-bootstrap';

function PaisCrud() {
  const [paises, setPaises] = useState([]);
  const [form, setForm] = useState({ nombre: '', moneda: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

  // base API from env (fallback to empty -> use relative paths)
  const BASE = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : '';
  const endpoint = (path) => (BASE ? `${BASE}/api${path}` : `/api${path}`);

  // Cargar países al iniciar
  useEffect(() => {
    fetchPaises();
  }, []);

  useEffect(() => {
    if (!query) return setFiltered(paises);
    const q = query.toLowerCase();
    setFiltered(paises.filter(p => (
      String(p[0]).toLowerCase().includes(q) ||
      String(p[1]).toLowerCase().includes(q) ||
      String(p[2] || '').toLowerCase().includes(q)
    )));
  }, [query, paises]);

  const fetchPaises = async () => {
    try {
      setLoading(true);
      const res = await axios.get(endpoint('/paises'));
      setPaises(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.error('Error cargando países', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editId) {
        await axios.put(endpoint(`/paises/${editId}`), form);
      } else {
        await axios.post(endpoint('/paises'), form);
      }
      setForm({ nombre: '', moneda: '' });
      setEditId(null);
      await fetchPaises();
    } catch (err) {
      console.error('Error guardando país', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = pais => {
    setForm({ nombre: pais[1], moneda: pais[2] });
    setEditId(pais[0]);
  };

  const handleDelete = async id => {
    const ok = window.confirm('Eliminar país? Esta acción no se puede deshacer.');
    if (!ok) return;
    try {
      setLoading(true);
      await axios.delete(endpoint(`/paises/${id}`));
      await fetchPaises();
    } catch (err) {
      console.error('Error eliminando país', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Gestión de Países</h5>
            <InputGroup style={{ maxWidth: 420 }}>
              <Form.Control placeholder="Buscar por id, nombre o moneda" value={query} onChange={e => setQuery(e.target.value)} />
              <Button variant="outline-secondary" onClick={() => setQuery('')}>Limpiar</Button>
            </InputGroup>
          </div>

          <Form onSubmit={handleSubmit} className="mb-3">
            <Row className="g-2">
              <Col xs={5}><Form.Control name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} /></Col>
              <Col xs={4}><Form.Control name="moneda" placeholder="Moneda" value={form.moneda} onChange={handleChange} /></Col>
              <Col xs={3} className="d-flex">
                <Button type="submit" className="me-2">{editId ? 'Actualizar' : 'Crear'}</Button>
                {editId && <Button variant="secondary" onClick={() => { setEditId(null); setForm({ nombre: '', moneda: '' }); }}>Cancelar</Button>}
              </Col>
            </Row>
          </Form>

          {loading ? (
            <div className="text-center py-4"><Spinner animation="border" /> Cargando...</div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr><th>ID</th><th>Nombre</th><th>Moneda</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} className="text-center">No hay países</td></tr>
                ) : (
                  filtered.map((p, i) => (
                    <tr key={i}>
                      <td>{p[0]}</td>
                      <td>{p[1]}</td>
                      <td>{p[2]}</td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => handleEdit(p)}>Editar</Button>{' '}
                        <Button variant="danger" size="sm" onClick={() => handleDelete(p[0])}>Eliminar</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default PaisCrud;
