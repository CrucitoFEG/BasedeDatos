const express = require('express');
const router = express.Router();
const aprobacionController = require('../controllers/aprobacionController');

router.post('/', aprobacionController.create);
router.get('/pedido/:pedidoId', aprobacionController.getByPedido);
router.get('/', aprobacionController.getAll);

module.exports = router;
