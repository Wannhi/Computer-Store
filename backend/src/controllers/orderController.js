import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// Tạo đơn hàng
export const createOrder = async (req, res) => {
  try {
    const { userId, items, totalPrice, paymentMethod, shippingAddress } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Thông tin đơn hàng không hợp lệ' });
    }

    // Kiểm tra và giảm stock cho từng sản phẩm
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Không tìm thấy sản phẩm với ID: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Sản phẩm ${product.name} không đủ số lượng trong kho` });
      }

      // Giảm stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Tạo đơn hàng mới
    const newOrder = new Order({
      userId,
      items,
      totalPrice,
      paymentMethod,
      shippingAddress,
      status: 'Đang xử lý', // Trạng thái mặc định là "processing"
    });

    // Xóa các sản phẩm đã đặt khỏi giỏ hàng
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = cart.items.filter(
        (cartItem) => !items.some((orderItem) => orderItem.productId === cartItem.productId.toString())
      );
      await cart.save();
    }

    await newOrder.save();

    res.status(201).json({ message: 'Đơn hàng đã được tạo thành công', order: newOrder });
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
};

// Lấy danh sách đơn hàng (admin)
export const getUserOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email') // Lấy thông tin người dùng
      .populate('items.productId', 'title price') // Lấy thông tin sản phẩm
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
};

// Lấy danh sách đơn hàng của người dùng
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId })
    .populate("items.productId", "title price")
    .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
};

// Lấy chi tiết đơn hàng
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('items.productId', 'name price');
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
};

// Cập nhật trạng thái đơn hàng (chỉ dành cho admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['processing', 'shipped', 'delivered', 'canceled'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái đơn hàng không hợp lệ' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Trạng thái đơn hàng đã được cập nhật', order });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
};