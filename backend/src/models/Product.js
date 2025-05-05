

import { Schema, model } from 'mongoose';

const ProductSchema = new Schema(
  {
    title: { type: String, required: true }, // Tiêu đề sản phẩm
    specs: { type: [String], default: [] }, // Danh sách thông số kỹ thuật
    price: { type: Number, required: true }, // Giá sản phẩm
    oldPrice: { type: Number }, // Giá gốc (nếu có)
    discountPercentage: { type: Number }, // Phần trăm giảm giá (nếu có)
    image: { type: String, required: true }, // Ảnh sản phẩm
    stock: { type: Number, default: 0 }, // Số lượng trong kho
    category: { type: String, required: true }, // Danh mục sản phẩm
    description: { 
      type: Map, 
      of: String, 
      default: {} 
    }, // Mô tả sản phẩm dưới dạng key-value
    status: {
      type: String,
      enum: ["Còn hàng", "Sắp hết", "Hết hàng"]
    }
  },
  { timestamps: true }
);

export default model('Product', ProductSchema);

