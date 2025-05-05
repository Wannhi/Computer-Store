import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log('✅ MongoDB connected successfully');

    // Gọi hàm tạo admin mặc định sau khi kết nối DB thành công
    await createDefaultAdmin();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Tạo admin mặc định nếu chưa có
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'abc@123', 10);
      const newAdmin = new User({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@123.com',
        password: hashedPassword,
        role: 'admin',
      });

      await newAdmin.save();
      console.log('✅ Default admin created:', newAdmin.email);
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
  }
};

export default connectDB; 
