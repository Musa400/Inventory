const express = require('express');
const router = express.Router();
const { 
  addProduct, 
  getProducts, 
  getProductById,
  updateProduct,
  deleteProduct,
  getCategories,
  getProductNames
} = require('../controller/addProductController');

// Create a new product
router.post('/', addProduct);

// Get all products with filtering and pagination
router.get('/', getProducts);

// Get all unique categories
router.get('/categories', getCategories);

// Get product names for autocomplete
router.get('/names', getProductNames);

// Get single product by ID
router.get('/:id', getProductById);

// Update a product
router.put('/:id', updateProduct);

// Delete a product
router.delete('/:id', deleteProduct);

module.exports = router;
