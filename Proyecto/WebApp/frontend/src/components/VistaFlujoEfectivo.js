import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Card, InputGroup, Form, Button, Spinner } from 'react-bootstrap';

function VistaFlujoEfectivo() {
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
      String(d[1]).toLowerCase().includes(q) ||
      String(d[2]).toLowerCase().includes(q)
    )));
  }, [query, datos]);

  const fetchDatos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(endpoint('/vistas/flujo-efectivo'));
      setDatos(res.data || []);
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
            <h5 className="mb-0">Flujo de Efectivo</h5>
            <InputGroup style={{ maxWidth: 420 }}>
              <Form.Control placeholder="Buscar por tipo/artículo/origen" value={query} onChange={e => setQuery(e.target.value)} />
              <Button variant="outline-secondary" onClick={() => setQuery('')}>Limpiar</Button>
            </InputGroup>
          </div>

          {loading ? (
            <div className="text-center py-4"><Spinner animation="border"/> Cargando...</div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr><th>ID</th><th>Tipo</th><th>Artículo</th><th>Fecha</th><th>Monto</th><th>Cantidad</th><th>Origen</th><th>Destino</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center">No hay datos</td></tr>
                ) : (
                  filtered.map((d, i) => (
                    <tr key={i}><td>{d[0]}</td><td>{d[1]}</td><td>{d[2]}</td><td>{d[3]}</td><td>{d[4]}</td><td>{d[5]}</td><td>{d[6]}</td><td>{d[7]}</td></tr>
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

export default VistaFlujoEfectivo;
