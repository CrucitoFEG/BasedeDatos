import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import ArticuloForm from './ArticuloForm';

function ArticuloList() {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : 'http://localhost:3001';
  const endpoint = (path) => `${API_URL}/api${path}`;

  const fetchArticulos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(endpoint('/articulos'));
      setArticulos(res.data || []);
    } catch (err) {
      console.error('Error fetching articulos', err);
      setArticulos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArticulos(); }, []);

  const handleNew = () => { setEditId(null); setShowForm(true); };
  const handleEdit = (id) => { setEditId(id); setShowForm(true); };
  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar artículo?')) return;
    try {
      await axios.delete(endpoint(`/articulos/${id}`));
      fetchArticulos();
    } catch (err) {
      console.error('Error deleting articulo', err);
      alert('Error al eliminar artículo');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Artículos</h4>
        <Button variant="primary" onClick={handleNew}>Nuevo artículo</Button>
      </div>

      {loading ? (
        <div className="text-center py-4"><Spinner animation="border"/></div>
      ) : (
        <Table striped bordered hover responsive>
          <thead><tr><th>ID</th><th>Nombre</th><th>Unidad</th><th>Precio</th><th>Acciones</th></tr></thead>
          <tbody>
            {articulos.length === 0 ? (
              <tr><td colSpan={5} className="text-center">No hay artículos</td></tr>
            ) : (
              articulos.map((a) => (
                <tr key={a.CODIGO_ARTICULO || a.codigo_articulo}>
                  <td>{a.CODIGO_ARTICULO ?? a.codigo_articulo}</td>
                  <td>{a.NOMBRE ?? a.nombre}</td>
                  <td>{a.UNIDAD_MEDIDA ?? a.unidad_medida}</td>
                  <td>{a.PRECIO_REFERENCIA ?? a.precio_referencia}</td>
                  <td>
                    <Button size="sm" variant="secondary" className="me-2" onClick={() => handleEdit(a.CODIGO_ARTICULO ?? a.codigo_articulo)}>Editar</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(a.CODIGO_ARTICULO ?? a.codigo_articulo)}>Eliminar</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      <ArticuloForm show={showForm} onHide={() => setShowForm(false)} articuloId={editId} onSaved={fetchArticulos} />
    </div>
  );
}

export default ArticuloList;
