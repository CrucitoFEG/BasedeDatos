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
                  // support both array and object shapes for backward compatibility
                  const id = d.CODIGO_DETALLE_PEDIDO ?? d[0];
                  const pid = d.CODIGO_PEDIDO ?? d[1];
                  const codigoArticulo = d.CODIGO_ARTICULO ?? d[2];
                  const nombreArticulo = (d.NOMBRE_ARTICULO || d.nombre_articulo) ??
                    (articulos.find(a => String(a.CODIGO_ARTICULO || a.codigo_articulo) === String(codigoArticulo))?.NOMBRE)
                    ?? codigoArticulo;
                  const solicitado = d.CANTIDAD_SOLICITADA ?? d[3];
                  return (
                    <tr key={i}>
                      <td>{id}</td>
                      <td>{pid}</td>
                      <td>{nombreArticulo}</td>
                      <td>{solicitado}</td>
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
