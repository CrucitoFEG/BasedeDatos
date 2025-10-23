const express = require('express');
const router = express.Router();
const articuloController = require('../controllers/articuloController');

router.get('/', articuloController.getArticulos);
router.get('/:id', articuloController.getArticuloById);
router.post('/', articuloController.createArticulo);
router.put('/:id', articuloController.updateArticulo);
router.delete('/:id', articuloController.deleteArticulo);

module.exports = router;
