import { useState } from 'react';
import { FaCartPlus, FaPhone, FaRegCommentDots, FaEye } from 'react-icons/fa';
import API from "../../service/api"; // Import API service
import { useNavigate } from 'react-router-dom';

interface ProductInfoProps {
  product: {
    _id: string;
    name: string;
    price: number;
    originalPrice: number;
    discount: number;
    status: string;
    viewCount: number;
    commentCount: number;
  };
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("id"); // Lấy userId từ localStorage
    console.log("userId", userId);
    if (!userId) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/login"); // Chuyển hướng đến trang đăng nhập
      // Hiển thị form đăng nhập (tùy thuộc vào cách bạn triển khai)
      return;
    }

    if (product.status === "Hết hàng") {
      alert("Sản phẩm đã hết hàng, không thể thêm vào giỏ hàng!");
      return;
    }

    try {
      const response = await API.post("/cart/add", {
        userId,
        productId: product._id,
        quantity: 1,
      });

      // Phát sự kiện tùy chỉnh để thông báo giỏ hàng đã thay đổi
      const responseGet = await API.get(`/cart/${localStorage.getItem("id")}`);
      const cartItems = responseGet.data.items;
      const totalQuantity = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { cartCount: totalQuantity } }));

      console.log("Thêm vào giỏ hàng thành công:", response.data);
      // Hiển thị thông báo thành công
      alert("Sản phẩm đã được thêm vào giỏ hàng thành công!");
      setCartCount((prev) => prev + 1); // Cập nhật số lượng trên icon giỏ hàng
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {/* <FaEye className="text-gray-500" /> */}
          <span className="text-sm text-gray-500">{product.viewCount}</span>
          {/* <FaRegCommentDots className="text-gray-500 ml-4" /> */}
          <span className="text-sm text-gray-500">{product.commentCount}</span>
        </div>
        <div className="text-sm">
          <span className="text-khoavang-primary font-semibold">
            {product.status === 'Còn hàng'
              ? 'Còn hàng'
              : product.status === 'Sắp hết'
                ? 'Sắp hết'
                : 'Hết hàng'
            }
          </span>
        </div>
      </div>

      <div className="mb-6 pt-2 pb-4 border-t border-b border-gray-200">
        <div className="flex items-baseline mb-2">
          <span className="text-2xl font-bold text-khoavang-red">
            {formatPrice(product.price)} đ
          </span>
          {product.discount > 0 && (
            <>
              <span className="ml-2 text-lg line-through text-gray-500">
                {formatPrice(product.originalPrice)} đ
              </span>
              <span className="ml-2 text-sm bg-khoavang-red text-white px-2 py-1 rounded">
                -{product.discount}%
              </span>
            </>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Liên hệ mua hàng - tư vấn</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="text-sm">
              <p className="font-medium">14A Nguyễn Đình Chiểu, Quận 1</p>
              <p className="text-khoavang-primary">0901 111 001 - Mr. Vàng</p>
              <p className="text-khoavang-primary">0901 111 002 - Mr. Huy</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">283/47 CMT8, Quận 10</p>
              <p className="text-khoavang-primary">0901 111 003 - Mr. Ngà</p>
              <p className="text-khoavang-primary">0901 111 004 - Mr. Duy</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm">
              <p className="font-medium">249 Bạch Đằng, Bình Thạnh</p>
              <p className="text-khoavang-primary">0901 111 005 - Mr. Vàng</p>
              <p className="text-khoavang-primary">0901 111 006 - Mr. Huy</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">338 Trường Chinh, Tân Bình</p>
              <p className="text-khoavang-primary">0901 111 007 - Mr. Ngà</p>
              <p className="text-khoavang-primary">0901 111 008 - Mr. Duy</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-sm font-medium flex items-center justify-center"
          onClick={handleAddToCart}
        >
          <FaCartPlus className="mr-2" />
          Thêm vào giỏ hàng
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-3">Yên tâm mua hàng tại Khóa Vàng</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <span className="w-2 h-2 rounded-full mr-2"></span>
            <span>Giao hàng miễn phí HCM</span>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 rounded-full mr-2"></span>
            <span>Ship COD toàn quốc</span>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 rounded-full mr-2"></span>
            <span>ProSupport 24h Workstation desktop</span>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 rounded-full mr-2"></span>
            <span>Bảo Hành 12 Tháng Cho Laptop</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductInfo;
