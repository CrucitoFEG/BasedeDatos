import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Row, Col, Container, Spinner } from 'react-bootstrap';

function DetallePedidoForm({ onSaved }) {
  const [form, setForm] = useState({
    codigo_pedido: '',
    codigo_articulo: '',
    cantidad_solicitada: '',
    cantidad_despachada: ''
  });
  const [loading, setLoading] = useState(false);

  const BASE = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : '';
  const endpoint = (path) => (BASE ? `${BASE}/api${path}` : `/api${path}`);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(endpoint('/detalles'), form);
      setForm({ codigo_pedido: '', codigo_articulo: '', cantidad_solicitada: '', cantidad_despachada: '' });
      if (onSaved) onSaved();
      alert('Detalle creado');
    } catch (err) {
      console.error(err);
      alert('Error creando detalle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Body>
          <h5>Nuevo Detalle de Pedido</h5>
          <Form onSubmit={handleSubmit}>
            <Row className="g-2">
              <Col><Form.Control name="codigo_pedido" placeholder="Código Pedido" value={form.codigo_pedido} onChange={handleChange} /></Col>
              <Col><Form.Control name="codigo_articulo" placeholder="Código Artículo" value={form.codigo_articulo} onChange={handleChange} /></Col>
            </Row>
            <Row className="g-2 mt-2">
              <Col><Form.Control name="cantidad_solicitada" placeholder="Cantidad Solicitada" value={form.cantidad_solicitada} onChange={handleChange} /></Col>
              <Col><Form.Control name="cantidad_despachada" placeholder="Cantidad Despachada" value={form.cantidad_despachada} onChange={handleChange} /></Col>
            </Row>
            <div className="mt-3">
              <Button type="submit" disabled={loading}>{loading ? (<><Spinner animation="border" size="sm"/> Guardando...</>) : 'Guardar'}</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default DetallePedidoForm;
