const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

router.get('/terceros', catalogController.getTerceros);
router.get('/localidades', catalogController.getLocalidades);
router.get('/tipos', catalogController.getTiposByCampo);

module.exports = router;
