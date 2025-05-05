import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import AdminLayout from "./layouts/AdminLayout";
import Products from "./pages/Products";
import ProductsPage from "./pages/ProductsPage";
import Customer from "./pages/Customer";
import Orders from "./pages/Orders";
import OrdersCustomer from "./pages/OrdersCustomer";
import Cart from "./pages/Cart";
import { Toaster } from "sonner";
import ScrollToTop from "./components/ScrollToTop";  // Import component cuộn lên đầu trang

function App() {
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  const toggleLoginForm = () => setIsLoginVisible(!isLoginVisible);
  const closeLoginForm = () => setIsLoginVisible(false);

  

  return (
    <Router>
      <ScrollToTop /> {/* Đặt ScrollToTop để cuộn lên đầu trang khi chuyển trang */}
      <div className="flex min-h-screen flex-col select-none">
        <Header onLoginClick={toggleLoginForm} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/category/:category" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/customer/orders" element={<OrdersCustomer />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Products />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customer />} />
            </Route>
          </Routes>

          {/* Conditionally render the login form */}
          {isLoginVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-gray p-6 rounded relative">
                <button
                  className="absolute top-2 right-2 font-extrabold text-white/50 hover:text-red-800"
                  onClick={toggleLoginForm}
                >
                  ✕
                </button>
                <Login closeModal={closeLoginForm} />
              </div>
            </div>
          )}
        </main>
        <Footer />
        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}

export default App;
