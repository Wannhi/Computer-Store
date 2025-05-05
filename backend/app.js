import express, { json } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authAdminRoutes from "./src/routes/authAdminRoute.js";
import authCustomerRoutes from "./src/routes/authCustomerRoute.js";
import userManageRoutes from "./src/routes/userManageRoute.js";

// import userManageRoutes from "./routes/userManageRoute.js";
import productRoutes from "./src/routes/productRoute.js";
// import productManageRoutes from "./routes/productManageRoute.js";
import orderRoutes from "./src/routes/orderRoute.js";
import cartRoutes from "./src/routes/cartRoute.js";
import reviewRoutes from "./src/routes/reviewRoute.js";
// import customerAccountRoutes from "./routes/customerAccountRoute.js";
// import homeRoutes from "./routes/homeRoute.js";

const app = express();
app.use(cors());
// app.use(json());

// Tăng giới hạn kích thước payload
app.use(express.json({ limit: "1mb" })); // Giới hạn 10MB
app.use(express.urlencoded({ limit: "1mb", extended: true }));

// Routes
app.use("/api/auth/admin", authAdminRoutes);      // login, register   // có thể xóa authAdminRoutes
app.use("/api/auth/customer", authCustomerRoutes); // user CRUD
app.use("/api/users", userManageRoutes);  // user CRUD

app.use("/api/products", productRoutes);  // products
app.use("/api/cart", cartRoutes);      // cart
app.use("/api/orders", orderRoutes);      // orders
app.use("/api/reviews", reviewRoutes);  // reviews

export default app;
