const express = require('express');
const router = express.Router();
const saleController = require('../controller/Sale');

router.get('/', saleController.getSales);
router.post('/', saleController.createSale);
router.put('/:id', saleController.updateSale);
router.delete('/:id', saleController.deleteSale);

module.exports = router;