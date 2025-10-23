const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');
const articuloController = require('../controllers/articuloController');

router.get('/terceros', catalogController.getTerceros);
router.get('/localidades', catalogController.getLocalidades);
router.get('/tipos', catalogController.getTiposByCampo);
router.get('/articulos', articuloController.getArticulos);

module.exports = router;
