import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Card, InputGroup, Form, Button, Spinner } from 'react-bootstrap';

function DetallePedidoList() {
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

  const BASE = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : '';
  const endpoint = (path) => (BASE ? `${BASE}/api${path}` : `/api${path}`);

  useEffect(() => { fetchDetalles(); }, []);

  useEffect(() => {
    if (!query) return setFiltered(detalles);
    const q = query.toLowerCase();
    setFiltered(detalles.filter(d => (
      String(d[0]).toLowerCase().includes(q) ||
      String(d[1]).toLowerCase().includes(q) ||
      String(d[2]).toLowerCase().includes(q)
    )));
  }, [query, detalles]);

  const fetchDetalles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(endpoint('/detalles'));
      setDetalles(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Detalles de Pedido</h5>
            <InputGroup style={{ maxWidth: 420 }}>
              <Form.Control placeholder="Buscar por id/pedido/artículo" value={query} onChange={e => setQuery(e.target.value)} />
              <Button variant="outline-secondary" onClick={() => setQuery('')}>Limpiar</Button>
            </InputGroup>
          </div>

          {loading ? (
            <div className="text-center py-4"><Spinner animation="border"/> Cargando...</div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr><th>ID</th><th>Pedido</th><th>Artículo</th><th>Solicitado</th><th>Despachado</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center">No hay detalles</td></tr>
                ) : (
                  filtered.map((d, i) => (
                    <tr key={i}><td>{d[0]}</td><td>{d[1]}</td><td>{d[2]}</td><td>{d[3]}</td><td>{d[4]}</td></tr>
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

export default DetallePedidoList;
