import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Card, Row, Col, Container, Spinner, Modal } from 'react-bootstrap';
import DetallePedidoForm from './DetallePedidoForm';

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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [createdPedidoId, setCreatedPedidoId] = useState(null);
  const [errors, setErrors] = useState({});
  const [catalogsLoading, setCatalogsLoading] = useState(true);
  const [catalogsError, setCatalogsError] = useState('');

  // Use the same API_URL fallback as Inicio.js so requests work when REACT_APP_API_URL is not set
  const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : 'http://localhost:3001';
  const endpoint = (path) => `${API_URL}/api${path}`;

  // Determine user type (cliente vs empleado) robustly from localStorage
  const parseUser = () => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return null;
      const u = JSON.parse(raw);
      return u;
    } catch (err) {
      return null;
    }
  };

  const user = parseUser();
  // normalize isCliente to boolean even if it is "true"/"1" or number
  const isClientUser = !!(user && (user.isCliente === true || user.isCliente === 'true' || user.isCliente === 1 || user.isCliente === '1'));

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        setCatalogsLoading(true);
        setCatalogsError('');
        const [tercerosRes, locRes, estadosRes] = await Promise.all([
          axios.get(endpoint('/catalog/terceros')),
          axios.get(endpoint('/catalog/localidades')),
          axios.get(endpoint('/catalog/tipos?campo=ESTADO_DESPACHO'))
        ]);
        console.log('catalog/terceros ->', tercerosRes);
        console.log('catalog/localidades ->', locRes);
        console.log('catalog/tipos ->', estadosRes);
        setClientes(tercerosRes.data || []);
        setLocalidades(locRes.data || []);
        setEstados(estadosRes.data || []);
      } catch (err) {
        console.error('Error cargando catálogos', err);
        setCatalogsError(err.message || 'Error cargando catálogos');
      } finally {
        setCatalogsLoading(false);
      }
    };

    fetchCatalogs();

    // Auto-fill codigo_cliente if logged in as cliente
    try {
      const u = user;
      if (isClientUser && u?.codigo_tercero) {
        setForm(f => ({ ...f, codigo_cliente: String(u.codigo_tercero) }));
      }
    } catch (err) {
      // ignore
    }
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    // Basic client-side validation to prevent sending empty required fields to the DB
    const newErrors = {};
    if (!form.codigo_cliente) newErrors.codigo_cliente = 'Seleccione un cliente';
    if (!form.estado) newErrors.estado = 'Seleccione un estado';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      // don't submit if validation failed
      return;
    }
    try {
      setLoading(true);
      // Convert numeric fields to numbers to match DB expectations
      const payload = {
        codigo_cliente: form.codigo_cliente ? Number(form.codigo_cliente) : null,
        fecha_pedido: form.fecha_pedido || null,
        fecha_requerida: form.fecha_requerida || null,
        estado: form.estado ? Number(form.estado) : null,
        origen: form.origen || null
      };
      console.log('Enviando payload a /pedidos ->', payload);
      const resp = await axios.post(endpoint('/pedidos'), payload);
      const newId = resp?.data?.codigo_pedido || null;
  if (onSaved) onSaved(newId);
  setForm({ codigo_cliente: '', fecha_pedido: '', fecha_requerida: '', estado: '', origen: '' });
  setErrors({});
  alert('Pedido creado');
  // open modal to add detalle lines
  setCreatedPedidoId(newId);
  if (newId) setShowDetailsModal(true);
    } catch (err) {
      console.error('Error en POST /pedidos', err);
      // Show server response body if available (helps see ORA- errors)
      if (err.response) {
        console.error('Respuesta del servidor:', err.response);
        const serverMsg = err.response.data && typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data);
        alert(`Error creando pedido: ${serverMsg}`);
      } else {
        alert(`Error creando pedido: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Container>
      <Card className="shadow-sm">
        <Card.Body>
          <h5>Nuevo Pedido</h5>
          <Form onSubmit={handleSubmit}>
            <Row className="g-2">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Cliente</Form.Label>
                  <Form.Select name="codigo_cliente" value={form.codigo_cliente} onChange={handleChange} disabled={isClientUser}>
                    <option value="">-- Seleccione cliente --</option>
                    {clientes.map((c, i) => {
                      const value = (c && (c.codigo_tercero || c.CODIGO_TERCERO)) || (Array.isArray(c) ? c[0] : '') ;
                      const label = (c && (c.nombre || c.NOMBRE)) || (Array.isArray(c) ? c[1] : '') ;
                      return <option key={i} value={value}>{label}</option>;
                    })}
                  </Form.Select>
                  {isClientUser ? <div className="small text-muted mt-1">Realizando pedido a nombre del cliente conectado</div> : null}
                      {catalogsLoading ? <div className="small text-muted mt-1">Cargando clientes...</div> : null}
                      {!catalogsLoading && clientes.length === 0 ? (
                        <div className="small text-danger mt-1">No se encontraron clientes. URL usada: <code>{API_URL}/api/catalog/terceros</code>{catalogsError ? ` — error: ${catalogsError}` : ''}</div>
                      ) : null}
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
                {createdPedidoId ? (
                  <Button variant="primary" size="sm" className="ms-2" onClick={() => setShowDetailsModal(true)}>Ver detalle</Button>
                ) : null}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  
    {/* Modal para agregar detalles al pedido creado */}
    <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Agregar artículos al pedido #{createdPedidoId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DetallePedidoForm prefillCodigoPedido={createdPedidoId} onSaved={() => { /* opcional: refrescar lista */ }} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default PedidoForm;
