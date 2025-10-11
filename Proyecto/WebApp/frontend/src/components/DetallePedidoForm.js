import React, { useState } from 'react';
import axios from 'axios';

function DetallePedidoForm() {
  const [form, setForm] = useState({
    codigo_pedido: '',
    codigo_articulo: '',
    cantidad_solicitada: '',
    cantidad_despachada: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:3001/api/detalles', form);
    alert('Detalle creado');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nuevo Detalle de Pedido</h2>
      <input name="codigo_pedido" placeholder="Código Pedido" onChange={handleChange} />
      <input name="codigo_articulo" placeholder="Código Artículo" onChange={handleChange} />
      <input name="cantidad_solicitada" placeholder="Cantidad Solicitada" onChange={handleChange} />
      <input name="cantidad_despachada" placeholder="Cantidad Despachada" onChange={handleChange} />
      <button type="submit">Guardar</button>
    </form>
  );
}

export default DetallePedidoForm;
