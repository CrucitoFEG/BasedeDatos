const express = require('express');
const router = express.Router();
const vistaController = require('../controllers/vistaController');

router.get('/pedidos-pendientes', vistaController.pedidosPendientes);
router.get('/flujo-efectivo', vistaController.flujoEfectivo);
router.get('/inventario-valorizado', vistaController.inventarioValorizado);

module.exports = router;
