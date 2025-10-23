import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Table, Spinner } from 'react-bootstrap';
import DetallePedidoForm from './DetallePedidoForm';

function PedidoDetalleModal({ show, onHide, pedidoId }) {
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [articulos, setArticulos] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : 'http://localhost:3001';
  const endpoint = (path) => `${API_URL}/api${path}`;

  const fetchDetalles = async () => {
    if (!pedidoId) return setDetalles([]);
    try {
      setLoading(true);
      const res = await axios.get(endpoint(`/detalles?codigo_pedido=${pedidoId}`));
      setDetalles(res.data || []);
    } catch (err) {
      console.error('Error fetching detalles for pedido', err);
      setDetalles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticulos = async () => {
    try {
      const res = await axios.get(endpoint('/catalog/articulos'));
      setArticulos(res.data || []);
    } catch (err) {
      console.error('Error fetching articulos in modal', err);
      setArticulos([]);
    }
  };

  useEffect(() => { if (show) { fetchArticulos(); fetchDetalles(); } }, [show, pedidoId]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalle del pedido #{pedidoId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Artículos</h6>
        {loading ? (
          <div className="text-center py-3"><Spinner animation="border"/></div>
        ) : (
          <Table striped bordered hover responsive>
            <thead><tr><th>ID</th><th>Pedido</th><th>Artículo</th><th>Solicitado</th></tr></thead>
            <tbody>
                {detalles.length === 0 ? (
                <tr><td colSpan={4} className="text-center">No hay artículos</td></tr>
              ) : (
                detalles.map((d, i) => {
                  const codigoArticulo = d[2] ?? d.CODIGO_ARTICULO;
                  const articuloObj = articulos.find(a => String(a.CODIGO_ARTICULO || a.codigo_articulo) === String(codigoArticulo));
                  const nombreArticulo = articuloObj ? (articuloObj.NOMBRE || articuloObj.nombre) : codigoArticulo;
                  return (
                    <tr key={i}>
                      <td>{d[0] ?? d.CODIGO_DETALLE_PEDIDO}</td>
                      <td>{d[1] ?? d.CODIGO_PEDIDO}</td>
                      <td>{nombreArticulo}</td>
                      <td>{d[3] ?? d.CANTIDAD_SOLICITADA}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        )}

        <hr />
        <h6>Agregar artículo</h6>
        <DetallePedidoForm prefillCodigoPedido={pedidoId} onSaved={fetchDetalles} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PedidoDetalleModal;
