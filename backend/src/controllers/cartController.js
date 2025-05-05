import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
    const { userId } = req.params; // Lấy userId từ URL
    try {
      // Tìm giỏ hàng của user và populate thông tin sản phẩm
      const cart = await Cart.findOne({ userId }).populate({
        path: "items.productId",
        select: "title price image stock", // Chỉ lấy các trường cần thiết
      });
  
      if (!cart) {
        return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
      }
  
      res.status(200).json(cart);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  };

export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Tìm giỏ hàng của user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Nếu giỏ hàng chưa tồn tại, tạo mới
      cart = new Cart({ userId, items: [] });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItem = cart.items.find((item) => item.productId.toString() === productId);

    if (existingItem) {
      // Nếu sản phẩm đã có, tăng số lượng
      existingItem.quantity += quantity;
    } else {
      // Nếu sản phẩm chưa có, thêm mới
      cart.items.push({ productId, quantity });
    }

    // Lưu giỏ hàng
    await cart.save();

    res.status(200).json({ message: "Thêm vào giỏ hàng thành công", cart });
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateCartItemQuantity = async (req, res) => {
    const { userId, productId, quantity } = req.body;
  
    try {
      // Tìm giỏ hàng của user
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
      }
  
      // Tìm sản phẩm trong giỏ hàng
      const item = cart.items.find((item) => item.productId.toString() === productId);
  
      if (!item) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
      }
  
      // Cập nhật số lượng
      item.quantity = quantity;
  
      // Lưu giỏ hàng
      await cart.save();
  
      res.status(200).json({ message: "Cập nhật số lượng thành công", cart });
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  };

  export const removeCartItem = async (req, res) => {
    const { userId, productId } = req.body;
  
    try {
      // Tìm giỏ hàng của user
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
      }
  
      // Lọc bỏ sản phẩm khỏi giỏ hàng
      cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
  
      // Lưu giỏ hàng
      await cart.save();
  
      res.status(200).json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công", cart });
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  };