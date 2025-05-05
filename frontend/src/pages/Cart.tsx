import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";
import API from "../service/api"; // Import API service
import { Item } from "@radix-ui/react-dropdown-menu";
import { text } from "stream/consumers";
import { title } from "process";

const Cart = () => {
  interface CartItem {
    _id: string; // MongoDB ObjectId là chuỗi
    name: string;
    price: number;
    quantity: number;
    image: string;
  }

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // Danh sách sản phẩm được chọn
  
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "cash",
  });

  const fetchCart = async () => {
    try {
      const response = await API.get(`/cart/${localStorage.getItem("id")}`);
      const cartItems = response.data.items;
  
      // Nếu thông tin sản phẩm đã đầy đủ, không cần gọi thêm API
      const productDetails = cartItems.map((item: any) => ({
        _id: item.productId._id || item.productId, // Kiểm tra nếu `productId` là object
        name: item.productId.title || item.title,
        price: item.productId.price || item.price,
        quantity: item.quantity,
        image: item.productId.image || item.image,
      }));
  
      setCartItems(productDetails);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    }
  };
  useEffect(() => {
    // Kiểm tra nếu trang chưa được reload
    if (!sessionStorage.getItem("cartReloaded")) {
      sessionStorage.setItem("cartReloaded", "true"); // Đánh dấu đã reload
      window.location.reload(); // Reload trang
      console.log("Reloading page...");
    } else {
      fetchCart(); // Lấy dữ liệu giỏ hàng sau khi reload
    }
  }, []);

  const handleQuantityChange = async (_id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      alert("Số lượng sản phẩm không được nhỏ hơn 1.");
      return;
    }
  
    try {
      const productResponse = await API.get(`/products/${_id}`);
      const stock = productResponse.data.stock;
  
      if (newQuantity > stock) {
        alert(`Số lượng sản phẩm không được vượt quá ${stock}`);
        return;
      }
  
      await API.put("/cart/update", {
        userId: localStorage.getItem("id"),
        productId: _id,
        quantity: newQuantity,
      });

      // Phát sự kiện tùy chỉnh để thông báo giỏ hàng đã thay đổi
      const response = await API.get(`/cart/${localStorage.getItem("id")}`);
      const cartItems = response.data.items;
      const totalQuantity = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { cartCount: totalQuantity } }));
  
      // Cập nhật chỉ sản phẩm bị thay đổi
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === _id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
    }
  };

  const handleRemoveItem = async (_id: string) => {
    try {
      
  
      // Xóa sản phẩm khỏi giỏ hàng
      await API.delete("/cart/remove", {
        data: {
          userId: localStorage.getItem("id"),
          productId: _id,
        },
      });

      // Phát sự kiện tùy chỉnh để thông báo giỏ hàng đã thay đổi
      const response = await API.get(`/cart/${localStorage.getItem("id")}`);
      const cartItems = response.data.items;
      const totalQuantity = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { cartCount: totalQuantity } }));

      setCartItems((prevItems) => prevItems.filter((item) => item._id !== _id));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  // Xử lý thay đổi thông tin khách hàng
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    const itemsToCheckout = cartItems.filter((item) =>
      selectedItems.includes(item._id)
    );
  
    if (itemsToCheckout.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }
  
    if (!customerInfo.paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán.");
      return;
    }
    
    const orderDate = new Date().toISOString(); // ISO format: YYYY-MM-DDTHH:mm:ss.sssZ
    console.log("Dữ liệu gửi đến API:", {
      userId: localStorage.getItem("id"),
      items: itemsToCheckout.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        title: item.name,
        price: item.price,
      })),
      totalPrice: selectedTotalAmount,
      paymentMethod: customerInfo.paymentMethod,
      shippingAddress: {
        name: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email,
        address: customerInfo.address,
        note: customerInfo.note,
      },
      orderDate, // Thêm ngày đặt hàng vào log
    });
    try {
      const response = await API.post("/orders", {
        userId: localStorage.getItem("id"),
        items: itemsToCheckout.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          title: item.name, // Thêm title
          price: item.price, // Thêm price
        })),
        totalPrice: selectedTotalAmount,
        paymentMethod: customerInfo.paymentMethod,
        shippingAddress: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          email: customerInfo.email,
          address: customerInfo.address,
          note: customerInfo.note,
        },
        orderDate,
      });
  
      alert("Đặt hàng thành công!");
      console.log("Đơn hàng:", response.data);
      await fetchCart(); // Cập nhật giỏ hàng sau khi đặt hàng thành công
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert("Đặt hàng thất bại. Vui lòng thử lại!");
    }
  };

  // Định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  // Tính tổng tiền
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const selectedTotalAmount = cartItems
    .filter((item) => selectedItems.includes(item._id))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-1">
        <div className="mx-auto py-8" style={{ maxWidth: "1400px" }}>
          <h1 className="mb-8 text-center text-2xl font-bold">GIỎ HÀNG CỦA BẠN</h1>

          {cartItems.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow-md">
              <p className="mb-4 text-lg">Không có sản phẩm nào trong giỏ hàng của bạn.</p>
              <Link
                to="/"
                className="inline-block rounded-md bg-yellow-500 px-6 py-2 font-medium text-white transition-colors hover:bg-yellow-600"
              >
                Về trang chủ
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-4">
              <div className="md:col-span-2">
                <div className="rounded-lg bg-white p-6 shadow-md">
                  <h2 className="mb-4 text-xl font-semibold">Sản phẩm</h2>
                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <div key={item._id} className="grid grid-cols-12 gap-4 py-4 items-center">
                        {/* Checkbox */}
                        <div className="col-span-1 flex justify-center">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems((prev) => [...prev, item._id]);
                              } else {
                                setSelectedItems((prev) =>
                                  prev.filter((productId) => productId !== item._id)
                                );
                              }
                            }}
                            className="h-5 w-5 text-yellow-500 focus:ring-yellow-500"
                          />
                        </div>

                        {/* Hình ảnh sản phẩm */}
                        <div className="col-span-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-auto w-full rounded-md object-cover"
                          />
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="col-span-4">
                          <h3 className="text-sm font-medium sm:text-base">{item.name}</h3>
                        </div>

                        {/* Số lượng */}
                        <div className="col-span-2 flex items-center">
                          <div className="flex w-24 items-center">
                            <button
                              className="flex h-8 w-8 items-center justify-center rounded-l-md border border-gray-300 bg-gray-100"
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(item._id, parseInt(e.target.value) || 1)
                              }
                              className="h-8 w-8 border-b border-t border-gray-300 text-center"
                            />
                            <button
                              className="flex h-8 w-8 items-center justify-center rounded-r-md border border-gray-300 bg-gray-100"
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Giá tiền */}
                        <div className="col-span-2 text-right">
                          <div className="font-semibold text-yellow-600">
                            {formatCurrency(item.price)}
                          </div>
                        </div>

                        {/* Thùng rác */}
                        <div className="col-span-1 text-right">
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="rounded-lg bg-white p-6 shadow-md">
                  <h2 className="mb-4 text-xl font-semibold">Thông tin khách hàng</h2>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Họ tên *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Địa chỉ *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                        Ghi chú
                      </label>
                      <textarea
                        id="note"
                        name="note"
                        value={customerInfo.note}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                      ></textarea>
                    </div>
                  </form>
                </div>
                

              </div>
              <div className="md:col-span-1">
                {/* Phương thức thanh toán */}
                <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
                  <select
                    value={customerInfo.paymentMethod}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({ ...prev, paymentMethod: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                  >
                    <option value="cash">Thanh toán khi nhận hàng (COD)</option>
                    {/* <option value="credit_card">Thẻ tín dụng</option>
                    <option value="paypal">PayPal</option> */}
                  </select>
                </div>
                <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
                    <h2 className="mb-4 text-xl font-semibold">Tổng giỏ hàng</h2>
                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span>Tạm tính</span>
                        <span>{formatCurrency(totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Tổng cộng</span>
                        <span className="font-semibold text-yellow-600">
                          {formatCurrency(selectedTotalAmount)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="mt-4 w-full rounded-md bg-yellow-500 py-2 font-medium text-white transition-colors hover:bg-yellow-600"
                    >
                      Mua Hàng
                    </button>
                  </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;