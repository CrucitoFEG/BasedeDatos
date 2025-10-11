// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const pedidoRoutes = require('./routes/pedidoRoutes');
const detallePedidoRoutes = require('./routes/detallePedidoRoutes');

app.use('/api/pedidos', pedidoRoutes);
app.use('/api/detalles', detallePedidoRoutes);

app.listen(3001, () => console.log('Servidor backend corriendo en puerto 3001'));
