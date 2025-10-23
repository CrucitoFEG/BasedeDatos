import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Card, Row, Col, Container, Spinner } from 'react-bootstrap';

function PedidoForm({ onSaved }) {
  const [form, setForm] = useState({
    codigo_cliente: '',
    fecha_pedido: '',
    fecha_requerida: '',
    estado: '',
    origen: ''
  });
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [estados, setEstados] = useState([]);

  const BASE = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : '';
  const endpoint = (path) => (BASE ? `${BASE}/api${path}` : `/api${path}`);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const BASE = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : '';
    const endpoint = (path) => (BASE ? `${BASE}/api${path}` : `/api${path}`);

    const fetchCatalogs = async () => {
      try {
        const [tercerosRes, locRes, estadosRes] = await Promise.all([
          axios.get(endpoint('/catalog/terceros')),
          axios.get(endpoint('/catalog/localidades')),
          axios.get(endpoint('/catalog/tipos?campo=ESTADO_PEDIDO'))
        ]);
        setClientes(tercerosRes.data || []);
        setLocalidades(locRes.data || []);
        setEstados(estadosRes.data || []);
      } catch (err) {
        console.error('Error cargando catálogos', err);
      }
    };

    fetchCatalogs();

    // Auto-fill codigo_cliente if logged in as cliente
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.isCliente && user?.codigo_tercero) {
        setForm(f => ({ ...f, codigo_cliente: user.codigo_tercero }));
      }
    } catch (err) {
      // ignore
    }
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const resp = await axios.post(endpoint('/pedidos'), form);
      const newId = resp?.data?.codigo_pedido || null;
      if (onSaved) onSaved(newId);
      setForm({ codigo_cliente: '', fecha_pedido: '', fecha_requerida: '', estado: '', origen: '' });
      alert('Pedido creado');
    } catch (err) {
      console.error(err);
      alert('Error creando pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Body>
          <h5>Nuevo Pedido</h5>
          <Form onSubmit={handleSubmit}>
            <Row className="g-2">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Cliente</Form.Label>
                  <Form.Select name="codigo_cliente" value={form.codigo_cliente} onChange={handleChange} disabled={(() => { try { const u=JSON.parse(localStorage.getItem('user')); return u?.isCliente } catch { return false } })()}>
                    <option value="">-- Seleccione cliente --</option>
                    {clientes.map((c, i) => {
                      const value = (c && (c.codigo_tercero || c.CODIGO_TERCERO)) || (Array.isArray(c) ? c[0] : '') ;
                      const label = (c && (c.nombre || c.NOMBRE)) || (Array.isArray(c) ? c[1] : '') ;
                      return <option key={i} value={value}>{label}</option>;
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Fecha del Pedido</Form.Label>
                  <Form.Control name="fecha_pedido" type="date" value={form.fecha_pedido} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-2 mt-2">
              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label>Fecha requerida</Form.Label>
                  <Form.Control name="fecha_requerida" type="date" value={form.fecha_requerida} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label>Estado</Form.Label>
                  <Form.Select name="estado" value={form.estado} onChange={handleChange}>
                    <option value="">-- Seleccione estado --</option>
                    {estados.map((t, i) => {
                      const value = (t && (t.codigo_tipo || t.CODIGO_TIPO)) || (Array.isArray(t) ? t[0] : '');
                      const label = (t && (t.descripcion1 || t.DESCRIPCION1)) || (Array.isArray(t) ? t[1] : '');
                      return <option key={i} value={value}>{label}</option>;
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label>Origen (localidad)</Form.Label>
                  <Form.Select name="origen" value={form.origen} onChange={handleChange}>
                    <option value="">-- Seleccione origen --</option>
                    {localidades.map((l, i) => {
                      const value = (l && (l.codigo_localidad || l.CODIGO_LOCALIDAD)) || (Array.isArray(l) ? l[0] : '');
                      const label = (l && (l.nombre || l.NOMBRE)) || (Array.isArray(l) ? l[1] : '');
                      return <option key={i} value={value}>{label}</option>;
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>
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

export default PedidoForm;
