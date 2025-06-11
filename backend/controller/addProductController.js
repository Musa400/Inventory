const AddProduct = require('../models/addProduct.model');

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const { name, category } = req.body;

    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both name and category'
      });
    }

    // Create new product
    const newProduct = new AddProduct({
      name: name.trim(),
      category: category.trim()
    });

    // Save to database
    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: savedProduct
    });

  } catch (error) {
    console.error('Error adding product:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A product with this name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to add product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const { search = '' } = req.query;
    
    const query = {};
    
    // Search by name or category
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await AddProduct.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await AddProduct.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body, updatedAt: Date.now() };
    
    // Don't allow updating SKU
    if (updates.sku) {
      delete updates.sku;
    }
    
    const product = await AddProduct.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
    
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await AddProduct.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfZully'
    });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all unique categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await AddProduct.distinct('category');
    
    res.json({
      success: true,
      categories: categories.filter(Boolean).sort() // Remove any null/undefined and sort
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all product names for autocomplete
exports.getProductNames = async (req, res) => {
  try {
    const { search = '' } = req.query;
    
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const names = await AddProduct.find(query)
      .distinct('name')
      .sort()
      .limit(10); // Limit to 10 suggestions for performance
    
    res.json({
      success: true,
      names: names.filter(Boolean) // Remove any null/undefined
    });
    
  } catch (error) {
    console.error('Error fetching product names:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product names',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
