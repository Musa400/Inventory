const express = require('express');
const router = express.Router();
const saleController = require('../controller/Sale');

// Regular routes
router.get('/', saleController.getSales);
router.post('/', saleController.createSale);
router.put('/:id', saleController.updateSale);
router.delete('/:id', saleController.deleteSale);

// SSE route for real-time updates
router.get('/stream', saleController.streamSales);

module.exports = router;