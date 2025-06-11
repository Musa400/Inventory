const mongoose = require('mongoose');
const { Schema } = mongoose;

const saleSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['نقد', 'کارت', 'کاشی', 'دیگر'],
    required: true
  },
  status: {
    type: String,
    enum: ['پرېداخت شوی', 'پرېداخت نشته', 'لغو شوی'],
    default: 'پرېداخت نشته'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

saleSchema.pre('save', async function(next) {
  try {
    // Calculate total amount
    this.totalAmount = this.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    next();
  } catch (err) {
    next(err);
  }
});

const Sale = mongoose.model('Sale', saleSchema);
module.exports = Sale;
