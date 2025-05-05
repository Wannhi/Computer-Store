import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authCustomerMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      // Kiểm tra nếu người dùng tồn tại
      if (!req.user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
      }

      // Nếu cần, bạn có thể kiểm tra thêm quyền hạn của customer tại đây
      // Ví dụ: Chỉ cho phép role là "customer"
      if (req.user.role !== 'customer') {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Không được phép, token không hợp lệ' });
    }
  } else {
    res.status(401).json({ message: 'Không được phép, không có token' });
  }
};

export default authCustomerMiddleware;