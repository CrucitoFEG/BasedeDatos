import React, { useState } from 'react';
import axios from 'axios';

function PedidoForm() {
  const [form, setForm] = useState({
    codigo_cliente: '',
    fecha_pedido: '',
    fecha_requerida: '',
    estado: '',
    origen: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('https://musical-doodle-x5r9x5jwrxrq34jx-3001.app.github.dev/api/pedidos', form);
    alert('Pedido creado');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nuevo Pedido</h2>
      <input name="codigo_cliente" placeholder="Código Cliente" onChange={handleChange} />
      <input name="fecha_pedido" type="date" onChange={handleChange} />
      <input name="fecha_requerida" type="date" onChange={handleChange} />
      <input name="estado" placeholder="Código Estado" onChange={handleChange} />
      <input name="origen" placeholder="Origen" onChange={handleChange} />
      <button type="submit">Guardar</button>
    </form>
  );
}

export default PedidoForm;
