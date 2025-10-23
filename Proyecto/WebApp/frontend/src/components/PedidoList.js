import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Card, InputGroup, Form, Button, Spinner } from 'react-bootstrap';

function PedidoList() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

  const BASE = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : '';
  const endpoint = (path) => (BASE ? `${BASE}/api${path}` : `/api${path}`);

  useEffect(() => { fetchPedidos(); }, []);

  useEffect(() => {
    if (!query) return setFiltered(pedidos);
    const q = query.toLowerCase();
    setFiltered(pedidos.filter(p => (
      String(p[0]).toLowerCase().includes(q) ||
      String(p[1]).toLowerCase().includes(q)
    )));
  }, [query, pedidos]);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(endpoint('/pedidos'));
      setPedidos(res.data || []);
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
            <h5 className="mb-0">Pedidos registrados</h5>
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
                <tr><th>ID</th><th>Cliente</th><th>Fecha Pedido</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} className="text-center">No hay pedidos</td></tr>
                ) : (
                  filtered.map((p, i) => (
                    <tr key={i}><td>{p[0]}</td><td>{p[1]}</td><td>{p[2]}</td><td>{p[4]}</td></tr>
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

export default PedidoList;
