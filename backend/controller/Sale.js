const Sale = require('../models/sale');

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

    const newSale = new Sale({
      productName,
      salePrice,
      quantity,
      totalPrice,
      date,
      customerName,
    });

    const savedSale = await newSale.save();
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