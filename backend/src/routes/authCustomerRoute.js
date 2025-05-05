import express from 'express';
import { registerCustomer, loginCustomer } from '../controllers/authCustomerController.js';

const router = express.Router();

router.post('/register', registerCustomer); // Endpoint đăng ký không yêu cầu xác thực
router.post('/login', loginCustomer); // Endpoint đăng nhập không yêu cầu xác thực

export default router;