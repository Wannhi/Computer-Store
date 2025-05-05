import { Router } from "express";
import {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
  addReplyToReview,
} from "../controllers/reviewController.js";
import authCustomer from "../middleware/authCustomerMiddleware.js";

const router = Router();

// Tạo đánh giá mới (chỉ khách hàng được phép)
router.post("/", authCustomer, createReview);

// Lấy tất cả đánh giá của một sản phẩm
router.get("/:productId", getReviewsByProduct);

// Cập nhật đánh giá (chỉ khách hàng được phép)
router.put("/:id", authCustomer, updateReview);

// Xóa đánh giá (chỉ khách hàng được phép)
router.delete("/:id", authCustomer, deleteReview);

// Thêm phản hồi vào đánh giá (chỉ khách hàng được phép)
router.post("/:id/reply", authCustomer, addReplyToReview);

export default router;