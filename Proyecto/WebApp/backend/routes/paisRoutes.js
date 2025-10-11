// backend/routes/paisRoutes.js
const express = require('express');
const router = express.Router();
const paisController = require('../controllers/paisController');

router.get('/', paisController.getAll);
router.post('/', paisController.create);
router.put('/:id', paisController.update);
router.delete('/:id', paisController.remove);

module.exports = router;
