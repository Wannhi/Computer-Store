import express from 'express';
import {
  getUserOrdersAdmin,
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';
import authCustomerMiddleware from '../middleware/authCustomerMiddleware.js';
import authAdminMiddleware from '../middleware/authAdminMiddleware.js';

const router = express.Router();

// Tạo đơn hàng (customer)
router.post('/', authCustomerMiddleware, createOrder);

// Lấy danh sách đơn hàng (admin)
router.get('/', authAdminMiddleware, getUserOrdersAdmin);


// Lấy danh sách đơn hàng của người dùng (customer)
router.get('/customer/:userId', authCustomerMiddleware, getUserOrders);

// Lấy chi tiết đơn hàng (customer hoặc admin)
router.get('/:id', authCustomerMiddleware, getOrderById);

// Cập nhật trạng thái đơn hàng (admin)
router.put('/:id', authAdminMiddleware, updateOrderStatus);

export default router;