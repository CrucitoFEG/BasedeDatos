import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Card, InputGroup, Form, Button, Spinner } from 'react-bootstrap';
import PedidoDetalleModal from './PedidoDetalleModal';

function PedidoList() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

  // Use same API_URL fallback as other components
  const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : 'http://localhost:3001';
  const endpoint = (path) => `${API_URL}/api${path}`;

  const [clientes, setClientes] = useState([]);
  const [tiposEstado, setTiposEstado] = useState([]);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);

  useEffect(() => {
    // load catalogs first, then pedidos to ensure mapping works
    (async () => {
      const catalogs = await fetchCatalogs();
      await fetchPedidos(catalogs);
    })();
  }, []);

  const fetchCatalogs = async () => {
    try {
      const [tercerosRes, tiposRes] = await Promise.all([
        axios.get(endpoint('/catalog/terceros')),
        axios.get(endpoint('/catalog/tipos?campo=ESTADO_DESPACHO'))
      ]);
      const clientesData = tercerosRes.data || [];
      const tiposData = tiposRes.data || [];
      // update state but also return data for immediate use
      setClientes(clientesData);
      setTiposEstado(tiposData);
      return { clientes: clientesData, tipos: tiposData };
    } catch (err) {
      console.error('Error cargando catálogos en PedidoList', err);
      return { clientes: [], tipos: [] };
    }
  };

  useEffect(() => {
    if (!query) return setFiltered(pedidos);
    const q = query.toLowerCase();
    setFiltered(pedidos.filter(p => (
      String(p.id).toLowerCase().includes(q) ||
      String(p.clienteNombre || '').toLowerCase().includes(q)
    )));
  }, [query, pedidos]);

  const fetchPedidos = async (catalogs = {}) => {
    try {
      setLoading(true);
      const res = await axios.get(endpoint('/pedidos'));
      const raw = res.data || [];

      // Normalize rows: backend may return arrays (Oracle) or objects
      const rows = raw.map(r => {
        if (Array.isArray(r)) {
          return {
            id: r[0],
            clienteId: r[1],
            fecha: r[2],
            estadoId: r[4],
            raw: r
          };
        }
        return {
          id: r.codigo_pedido || r.ID || r[0],
          clienteId: r.codigo_cliente || r.ID_CLIENTE || r[1],
          fecha: r.fecha_pedido || r.FECHA_PEDIDO || r[2],
          estadoId: r.estado || r.ESTADO || r[4],
          raw: r
        };
      });

      // Use catalogs passed in first (fallback to state)
      const clienteList = catalogs.clientes || clientes;
      const tiposList = catalogs.tipos || tiposEstado;

      // Map clienteId and estadoId to labels using catalogs
      const withLabels = rows.map(row => {
        const cliente = clienteList.find(c => {
          if (Array.isArray(c)) return String(c[0]) === String(row.clienteId);
          return String(c.codigo_tercero || c.CODIGO_TERCERO) === String(row.clienteId);
        });
        const estado = tiposList.find(t => {
          if (Array.isArray(t)) return String(t[0]) === String(row.estadoId);
          return String(t.codigo_tipo || t.CODIGO_TIPO) === String(row.estadoId);
        });
        return {
          ...row,
          clienteNombre: cliente ? (cliente.nombre || cliente.NOMBRE || (Array.isArray(cliente) ? cliente[1] : '')) : row.clienteId,
          estadoDesc: estado ? (estado.descripcion1 || estado.DESCRIPCION1 || (Array.isArray(estado) ? estado[1] : '')) : row.estadoId
        };
      });

      setPedidos(withLabels);
      setFiltered(withLabels);
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
                    <tr key={i}>
                      <td>{p.id}</td>
                      <td>{p.clienteNombre}</td>
                      <td>{p.fecha}</td>
                      <td>{p.estadoDesc}</td>
                      <td><Button size="sm" variant="primary" onClick={() => { setSelectedPedidoId(p.id); setShowDetalleModal(true); }}>Ver detalles</Button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      <PedidoDetalleModal show={showDetalleModal} onHide={() => setShowDetalleModal(false)} pedidoId={selectedPedidoId} />
    </Container>
  );
}

export default PedidoList;
