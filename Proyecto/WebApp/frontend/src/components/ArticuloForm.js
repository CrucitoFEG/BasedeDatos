import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';

function ArticuloForm({ show, onHide, articuloId, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [tipos, setTipos] = useState([]);
  const [form, setForm] = useState({ nombre: '', unidad_medida: '', precio_referencia: '' });

  const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : 'http://localhost:3001';
  const endpoint = (path) => `${API_URL}/api${path}`;

  const fetchArticulo = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await axios.get(endpoint(`/articulos/${id}`));
      const a = res.data || {};
      setForm({ nombre: a.NOMBRE || a.nombre || '', unidad_medida: a.UNIDAD_MEDIDA || a.unidad_medida || '', precio_referencia: a.PRECIO_REFERENCIA ?? a.precio_referencia ?? '', tipo_articulo: a.TIPO_ARTICULO ?? a.tipo_articulo ?? '' });
    } catch (err) {
      console.error('Error fetching articulo', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTipos = async () => {
    try {
      const res = await axios.get(endpoint('/catalog/tipos?campo=TIPO_ARTICULO'));
      setTipos(res.data || []);
    } catch (err) {
      console.error('Error fetching tipos', err);
      setTipos([]);
    }
  };

  useEffect(() => {
    if (show) {
      fetchTipos();
      if (articuloId) fetchArticulo(articuloId);
    }
    if (!show) setForm({ nombre: '', unidad_medida: '', precio_referencia: '' });
  }, [show, articuloId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { nombre: form.nombre, unidad_medida: form.unidad_medida, precio_referencia: form.precio_referencia ? Number(form.precio_referencia) : null };
      if (articuloId) {
        await axios.put(endpoint(`/articulos/${articuloId}`), payload);
      } else {
        await axios.post(endpoint('/articulos'), payload);
      }
      if (onSaved) onSaved();
      onHide();
    } catch (err) {
      console.error('Error saving articulo', err);
      alert('Error al guardar articulo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{articuloId ? 'Editar artículo' : 'Nuevo artículo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? <div className="text-center py-3"><Spinner animation="border"/></div> : (
            <>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de artículo</Form.Label>
                    <Form.Select name="tipo_articulo" value={form.tipo_articulo || ''} onChange={handleChange} required>
                      <option value="">-- seleccione --</option>
                      {tipos.map(t => (
                        <option key={t.CODIGO_TIPO ?? t.codigo_tipo} value={t.CODIGO_TIPO ?? t.codigo_tipo}>{t.DESCRIPCION1 ?? t.descripcion1}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control name="nombre" value={form.nombre} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Unidad de medida</Form.Label>
                <Form.Control name="unidad_medida" value={form.unidad_medida} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Precio referencia</Form.Label>
                <Form.Control name="precio_referencia" type="number" step="0.01" value={form.precio_referencia} onChange={handleChange} />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ArticuloForm;
