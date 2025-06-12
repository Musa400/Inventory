const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  salePrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Sale', saleSchema);
