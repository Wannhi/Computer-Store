import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number,
    title: String,
  }],
  totalPrice: Number,
  status: { type: String, enum: ["Đang xử lý", "Đã giao", "Đang vận chuyển", "Đã hủy"], default: "Đang xử lý" },
  paymentMethod: { type: String, enum: ['cash', 'credit_card', 'paypal'], default: 'cash' },
  shippingAddress: {
    name: String,
    phone: String,
    email: String,
    address: String,
    note: String,
  },
  orderDate: { type: Date, default: Date.now },
  
});

const Order = mongoose.model('Order', OrderSchema);
export default Order; 