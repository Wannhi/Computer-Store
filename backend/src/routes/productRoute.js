import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, reduceStock } from '../controllers/productController.js';
import authAdmin from '../middleware/authAdminMiddleware.js';
import authCustomer from '../middleware/authCustomerMiddleware.js';
const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authAdmin, createProduct);
// API dành cho customer để giảm stock khi đặt hàng
router.post('/reduce-stock', authCustomer, reduceStock);
router.put('/:id', authAdmin, updateProduct);
router.delete('/:id', authAdmin, deleteProduct);

export default router;