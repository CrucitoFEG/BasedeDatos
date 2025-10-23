import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Card, Row, Col, Container, Spinner } from 'react-bootstrap';

function DetallePedidoForm({ onSaved, prefillCodigoPedido }) {
  const [form, setForm] = useState({
    codigo_pedido: '',
    codigo_articulo: '',
    cantidad_solicitada: ''
  });
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Use the same API_URL fallback as Inicio.js so requests work when REACT_APP_API_URL is not set
  const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : 'http://localhost:3001';
  const endpoint = (path) => `${API_URL}/api${path}`;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchArticulos = async () => {
    try {
      const res = await axios.get(endpoint('/catalog/articulos'));
      setArticulos(res.data || []);
    } catch (err) {
      console.error('Error fetching articulos', err);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // validation
    const newErrors = {};
    if (!form.codigo_pedido) newErrors.codigo_pedido = 'Código de pedido requerido';
  if (!form.codigo_articulo) newErrors.codigo_articulo = 'Código de artículo requerido';
  if (!form.cantidad_solicitada) newErrors.cantidad_solicitada = 'Cantidad solicitada requerida';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      setLoading(true);
      const payload = {
        codigo_pedido: Number(form.codigo_pedido),
        codigo_articulo: Number(form.codigo_articulo),
        cantidad_solicitada: form.cantidad_solicitada ? Number(form.cantidad_solicitada) : 0
      };
      console.log('Enviando detalle ->', payload);
      await axios.post(endpoint('/detalles'), payload);
  setForm({ codigo_pedido: prefillCodigoPedido ? String(prefillCodigoPedido) : '', codigo_articulo: '', cantidad_solicitada: '' });
      if (onSaved) onSaved();
      alert('Detalle creado');
    } catch (err) {
      console.error('Error creando detalle', err);
      if (err.response) {
        console.error('Respuesta servidor detalle:', err.response);
        const serverMsg = typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data);
        alert(`Error creando detalle: ${serverMsg}`);
      } else {
        alert('Error creando detalle');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (prefillCodigoPedido) setForm(f => ({ ...f, codigo_pedido: String(prefillCodigoPedido) }));
    fetchArticulos();
  }, [prefillCodigoPedido]);

  return (
    <Container className="mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Nuevo Detalle de Pedido</h5>
          <small className="text-muted">Agrega las líneas de artículo para el pedido</small>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-2">
              <Col xs={12} md={6}>
                <Form.Group controlId="codigoPedido">
                  <Form.Label className="small">Código Pedido</Form.Label>
                  <Form.Control name="codigo_pedido" placeholder="Código Pedido" value={form.codigo_pedido} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="codigoArticulo">
                  <Form.Label className="small">Artículo</Form.Label>
                  <Form.Select name="codigo_articulo" value={form.codigo_articulo} onChange={handleChange}>
                    <option value="">-- Seleccione artículo --</option>
                    {articulos.map(a => (
                      <option key={a.CODIGO_ARTICULO || a.codigo_articulo} value={a.CODIGO_ARTICULO || a.codigo_articulo}>{a.NOMBRE || a.nombre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-2 mt-3">
              <Col xs={12} md={6}>
                <Form.Group controlId="cantidadSolicitada">
                  <Form.Label className="small">Cantidad Solicitada</Form.Label>
                  <Form.Control name="cantidad_solicitada" type="number" min="0" placeholder="0" value={form.cantidad_solicitada} onChange={handleChange} />
                </Form.Group>
              </Col>
              {/* cantidad_despachada removed: pedidos usan solo cantidad_solicitada */}
            </Row>

            <div className="mt-4 d-flex justify-content-end">
              <Button type="submit" variant="primary" disabled={loading}>{loading ? (<><Spinner animation="border" size="sm"/> Guardando...</>) : 'Guardar'}</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default DetallePedidoForm;
