import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Card, InputGroup, Form, Button, Spinner } from 'react-bootstrap';

function VistaPedidosPendientes() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

  const BASE = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : '';
  const endpoint = (path) => (BASE ? `${BASE}/api${path}` : `/api${path}`);

  useEffect(() => { fetchDatos(); }, []);

  useEffect(() => {
    if (!query) return setFiltered(datos);
    const q = query.toLowerCase();
    setFiltered(datos.filter(d => (
      String(d[0]).toLowerCase().includes(q) ||
      String(d[1]).toLowerCase().includes(q)
    )));
  }, [query, datos]);

  const fetchDatos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(endpoint('/vistas/pedidos-pendientes'));
      setDatos(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();

  const handleDecision = async (pedidoId, resultado) => {
    // resultado: 1 = aprobado, 2 = rechazado (ajustar según catálogo 'tipo')
    if (!currentUser || !currentUser.id) return alert('Usuario no identificado');
    try {
      setLoading(true);
      await axios.post(endpoint('/aprobaciones'), {
        codigo_pedido: pedidoId,
        codigo_empleado: currentUser.isEmpleado ? currentUser.id : null,
        resultado,
        comentarios: resultado === 1 ? 'Aprobado desde UI' : 'Rechazado desde UI'
      });
      await fetchDatos();
      alert(resultado === 1 ? 'Pedido aprobado' : 'Pedido rechazado');
    } catch (err) {
      console.error(err);
      alert('Error registrando decisión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Pedidos Pendientes</h5>
            <InputGroup style={{ maxWidth: 420 }}>
              <Form.Control placeholder="Buscar por id o cliente" value={query} onChange={e => setQuery(e.target.value)} />
              <Button variant="outline-secondary" onClick={() => setQuery('')}>Limpiar</Button>
            </InputGroup>
          </div>

          {loading ? (
            <div className="text-center py-4"><Spinner animation="border"/> Cargando...</div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr><th>ID</th><th>Cliente</th><th>Fecha Pedido</th><th>Fecha Requerida</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center">No hay pedidos</td></tr>
                ) : (
                  filtered.map((d, i) => (
                    <tr key={i}>
                      <td>{d[0]}</td>
                      <td>{d[1]}</td>
                      <td>{d[2]}</td>
                      <td>{d[3]}</td>
                      <td>
                        {d[4]}
                        {currentUser?.isEmpleado && (
                          <div className="mt-2">
                            <Button size="sm" variant="success" className="me-2" onClick={() => handleDecision(d[0], 1)}>Aprobar</Button>
                            <Button size="sm" variant="danger" onClick={() => handleDecision(d[0], 2)}>Rechazar</Button>
                          </div>
                        )}
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

export default VistaPedidosPendientes;
