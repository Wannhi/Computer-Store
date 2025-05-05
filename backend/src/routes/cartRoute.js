import express from "express";
import {getCart, addToCart, updateCartItemQuantity, removeCartItem } from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", addToCart); // Thêm sản phẩm vào giỏ hàng
router.put("/update", updateCartItemQuantity); // Cập nhật số lượng sản phẩm
router.delete("/remove", removeCartItem); // Xóa sản phẩm khỏi giỏ hàng
router.get("/:userId", getCart); // Lấy giỏ hàng của người dùng

export default router;