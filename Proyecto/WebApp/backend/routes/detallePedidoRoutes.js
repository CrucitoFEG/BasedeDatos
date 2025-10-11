// backend/routes/detallePedidoRoutes.js
const express = require('express');
const router = express.Router();
const detalleController = require('../controllers/detallePedidoController');

router.get('/', detalleController.getAll);
router.post('/', detalleController.create);
router.put('/:id', detalleController.update);
router.delete('/:id', detalleController.remove);

module.exports = router;
