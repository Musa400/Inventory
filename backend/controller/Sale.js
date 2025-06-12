const Sale = require('../models/sale');
const Product = require('../models/product.models');
const EventEmitter = require('events');

const saleEvents = new EventEmitter();

// Export the event emitter for SSE
exports.saleEvents = saleEvents;

exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find();
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSale = async (req, res) => {
  try {
    const { productName, salePrice, quantity, date, customerName } = req.body;
    const totalPrice = salePrice * quantity;

    // Find the product and update its quantity
    const product = await Product.findById(productName);
    if (!product) {
      return res.status(404).json({ message: 'توکی پیدا نشد!' });
    }

    // Check if there's enough stock
    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'مقدار زیاته ده!' });
    }

    // Create the sale
    const newSale = new Sale({
      productName,
      salePrice,
      quantity,
      totalPrice,
      date,
      customerName,
    });

    // Update product quantity
    product.quantity -= quantity;
    if (product.quantity === 0) {
      product.status = 'ختم شوی';
    }
    await product.save();

    // Save the sale
    const savedSale = await newSale.save();

    // Emit event for real-time updates
    saleEvents.emit('saleCreated', { type: 'saleCreated', sale: savedSale });

    res.status(201).json(savedSale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, salePrice, quantity, date, customerName } = req.body;
    const totalPrice = salePrice * quantity;

    const updatedSale = await Sale.findByIdAndUpdate(
      id,
      {
        productName,
        salePrice,
        quantity,
        totalPrice,
        date,
        customerName,
      },
      { new: true }
    );

    res.json(updatedSale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteSale = async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sale deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add SSE endpoint
exports.streamSales = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial data
  res.write('data: {"type": "connected"}\n\n');

  // Listen for events
  saleEvents.on('saleCreated', (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });

  // Handle client disconnection
  req.on('close', () => {
    console.log('Client disconnected from sales stream');
  });
};