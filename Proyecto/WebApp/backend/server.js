// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const pedidoRoutes = require('./routes/pedidoRoutes');
const detallePedidoRoutes = require('./routes/detallePedidoRoutes');
const paisRoutes = require('./routes/paisRoutes');
const vistaRoutes = require('./routes/vistaRoutes');
const authRoutes = require('./routes/authRoutes');
const aprobacionRoutes = require('./routes/aprobacionRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const articuloRoutes = require('./routes/articuloRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/vistas', vistaRoutes);
app.use('/api/paises', paisRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/detalles', detallePedidoRoutes);
app.use('/api/aprobaciones', aprobacionRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/articulos', articuloRoutes);

app.listen(3001, () => console.log('Servidor backend corriendo en puerto 3001'));
