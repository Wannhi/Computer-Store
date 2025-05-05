import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  phone: String,
  address: String,
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
});

const User = mongoose.model("User", UserSchema);
export default User; 



