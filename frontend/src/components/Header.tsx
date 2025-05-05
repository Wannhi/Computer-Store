import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUserAlt, FaBars, FaTimes, FaClipboardList, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import TopBanner from "./TopBanner";
import MainNavigation from "./MainNavigation";
import Logo from '../../Logo.png';
import { useState, useEffect } from "react";
import { useRef } from "react";
import API from "../service/api";


interface HeaderProps {
  onLoginClick: () => void; // Prop for toggling the login form
}


const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const navigate = useNavigate(); // Hook để điều hướng trang
  const [searchQuery, setSearchQuery] = useState(""); // Lưu từ khóa tìm kiếm
  const [suggestions, setSuggestions] = useState<{ category: string; title: string }[]>([]); // Lưu danh sách gợi ý
  const [categories, setCategories] = useState<{ category: string; title: string }[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [cartCount, setCartCount] = useState(0); // Trạng thái lưu số lượng sản phẩm trong giỏ hàng
  const [user, setUser] = useState<{ name: string; role: string | null } | null>(null); // Lưu thông tin người dùng

  const handleCartClick = () => {
    sessionStorage.setItem("cartReloaded", "false"); // Đặt lại trạng thái reload
    navigate("/cart"); // Điều hướng đến trang giỏ hàng
    window.location.reload(); // Reload trang
  };
    // Lấy thông tin người dùng từ localStorage
    useEffect(() => {
      const userData = localStorage.getItem("name");
      const userRole = localStorage.getItem("role");
      console.log("User data from localStorage:", userRole);
      if (userData) {
        setUser({name: userData, role: userRole}); // Lưu thông tin người dùng vào state
      }
    }, []);

    // Lấy danh sách danh mục từ MongoDB
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await API.get<{ category: string; title: string }[]>("/products"); // Thay URL bằng API thực tế
    
          // Lấy danh mục và loại bỏ giá trị trùng lặp dựa trên `category`
          const uniqueCategories = Array.from(
            new Map(
              response.data.map((item) => [`${item.category}-${item.title}`, item])
            ).values()
          );
    
          setCategories(uniqueCategories); // Lưu danh mục và tiêu đề đã loại bỏ trùng lặp
          console.log("Danh mục và tiêu đề:", uniqueCategories);
        } catch (error) {
          console.error("Lỗi khi lấy danh mục:", error);
        }
      };
    
      fetchCategories();
    }, []);

    // Xử lý khi người dùng nhấp ra ngoài dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest(".search-container")) {
          setIsDropdownVisible(false); // Ẩn dropdown nếu nhấp ra ngoài
        }
      };
    
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Cuộn đến gợi ý được đánh dấu
    useEffect(() => {
      if (
        highlightedIndex >= 0 &&
        suggestionRefs.current[highlightedIndex]
      ) {
        suggestionRefs.current[highlightedIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, [highlightedIndex]);
    
    // Xử lý khi người dùng nhập từ khóa
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      setSearchQuery(query);
      setHighlightedIndex(-1); // Reset khi người dùng nhập lại
  
      // Lọc danh sách gợi ý dựa trên từ khóa
      if (query.trim()) {
        const filteredSuggestions = categories.filter((item) =>
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          item.title.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
        setIsDropdownVisible(true); // Hiển thị dropdown
      } else {
        setSuggestions([]); // Xóa gợi ý nếu không có từ khóa
        setIsDropdownVisible(false); // Ẩn dropdown nếu không có từ khóa
      }
    };
  
    // Xử lý khi người dùng nhấn Enter hoặc chọn gợi ý
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
  
      if (searchQuery.trim()) {
        navigate(`/products/category/${encodeURIComponent(searchQuery.toLowerCase())}`);
        setSearchQuery(""); // Xóa nội dung trên thanh tìm kiếm
        setSuggestions([]); // Xóa gợi ý sau khi tìm kiếm
      }
    };
  
    // Xử lý khi người dùng chọn một gợi ý
    const handleSuggestionClick = (suggestion: { category: string; title: string }) => {
      setSearchQuery(""); // Xóa nội dung trên thanh tìm kiếm
      navigate(`/products/category/${encodeURIComponent(suggestion.category.toLowerCase())}`);
      setSuggestions([]); // Xóa gợi ý sau khi chọn
      setHighlightedIndex(-1); // Reset chỉ số được đánh dấu
    };

  // Hàm lấy số lượng sản phẩm trong giỏ hàng từ API
  const fetchCartCount = async () => {
    try {
      const response = await API.get(`/cart/${localStorage.getItem("id")}`);
      const cartItems = response.data.items;
      const totalQuantity = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
      setCartCount(totalQuantity); // Cập nhật số lượng sản phẩm
    } catch (error) {
      console.error("Lỗi khi lấy số lượng giỏ hàng:", error);
    }
  };

  useEffect(() => {
    fetchCartCount(); // Lấy số lượng sản phẩm khi component được render
  }, []);

  useEffect(() => {
    // Lắng nghe sự kiện "cartUpdated"
    const handleCartUpdated = (event: CustomEvent) => {
      setCartCount(event.detail.cartCount); // Cập nhật số lượng giỏ hàng
    };

    window.addEventListener("cartUpdated", handleCartUpdated as EventListener);

    // Cleanup listener khi component bị unmount
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated as EventListener);
    };
  }, []);

  // Đăng xuất
  const handleLogout = () => {
    localStorage.clear(); // Xóa toàn bộ dữ liệu trong localStorage
    setUser(null); // Xóa thông tin người dùng trong state
    navigate("/"); // Điều hướng về trang đăng nhập
  };

  return (
    <header className="flex flex-col w-full">
      <TopBanner />
      <div className="bg-[#f6f5f4] py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              // src="https://ext.same-assets.com/3001562581/864712427.webp"
              src={Logo}
              alt="Cậu Vàng Logo"
              className="h-16"  
            />
          </Link>

          {/* Header actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center relative max-w-lg search-container" style={{ width: "32rem" }}>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                name="no-autofill" // Đặt tên không phổ biến để hạn chế gợi ý tự động của trình duyệt (đặc biệt là Chrome)
                autoComplete="off" // Tắt autocomplete mặc định (trình duyệt vẫn có thể lờ đi thuộc tính này)
                value={
                  highlightedIndex >= 0 && highlightedIndex < suggestions.length
                    ? suggestions[highlightedIndex].title
                    : searchQuery
                }
                onChange={handleInputChange}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setHighlightedIndex((prev) =>
                      prev < suggestions.length - 1 ? prev + 1 : 0
                    );
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setHighlightedIndex((prev) =>
                      prev > 0 ? prev - 1 : suggestions.length - 1
                    );
                  } else if (event.key === "Enter") {
                    if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                      event.preventDefault();
                      handleSuggestionClick(suggestions[highlightedIndex]);
                    }
                  }
                }}
                className="text-white bg-transparent px-6 py-3 w-full outline-none placeholder-black"
              />
              <button
                type="submit"
                className="absolute right-2 w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300
                          bg-orange-300 text-white hover:bg-black hover:shadow-lg active:translate-y-0.5"
              >
                <FaSearch size={18} />
              </button>

              {/* Suggestions Dropdown */}
              {isDropdownVisible && suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 bg-white border rounded-md shadow-lg z-10"
                style={{
                  top: "50px",
                  width: "32rem", // Giới hạn chiều rộng
                  maxHeight: "12rem", // Giới hạn chiều cao
                  overflowY: "auto", // Thêm thanh cuộn nếu danh sách quá dài
                  zIndex: 1000, // Đảm bảo danh sách gợi ý nằm trên các phần tử khác
                }}
                >
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      ref={(el) => (suggestionRefs.current[index] = el)}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`px-4 py-2 cursor-pointer ${
                        index === highlightedIndex ? "bg-gray-500" : "hover:bg-gray-500"
                      }`}
                    >
                      {suggestion.title}
                    </li>
                  ))}
                </ul>
              )}
            </form>
            

            {/* User Section */}
            {user ? (
              <div className="relative group cursor-pointer" onMouseEnter={() => setIsDropdownVisible(true)} onMouseLeave={() => setIsDropdownVisible(false)}>
                <div className="flex items-center space-x-2 cursor-pointer">
                  <FaUserAlt className="text-gray-700" />
                  <span className="text-gray-700">{user.name}</span>
                </div>
                {/* Dropdown Menu */}
                <div
                  className="absolute left-0 mt-2 w-48 bg-white border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50"
                  onMouseEnter={() => setIsDropdownVisible(true)}
                  onMouseLeave={() => setIsDropdownVisible(false)}
                >
                  <ul className="py-2">
                    {user.role === "admin" && (
                        <li>
                          <button
                            onClick={() => navigate("/admin")}
                            className="flex w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            <FaUserAlt className="mr-1" />
                            <span className="hidden lg:inline ml-4">Trang Admin</span>
                          </button>
                        </li>
                      )}
                    <li>
                      <button
                        onClick={() => navigate("/customer/orders")}
                        className="flex w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <FaClipboardList className="mr-1" />
                        <span className="hidden lg:inline ml-4">Đơn mua</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="mr-1" />
                        <span className="hidden lg:inline ml-4">Đăng xuất</span>
                      </button>
                    </li>
                      
                  </ul>
                </div>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="text-gray-700 hover:text-yellow-600 flex items-center"
              >
                <FaSignInAlt className="mr-1" />
                <span className="hidden lg:inline">Đăng nhập</span>
              </button>
            )}
            {/* Cart Link */}
            <button
              onClick={handleCartClick}
              className="text-gray-700 hover:text-yellow-600 flex items-center"
            >
              <FaShoppingCart className="mr-1" />
              <span className="hidden lg:inline">Giỏ hàng</span>
              <span className="ml-1 text-xs bg-orange-100 text-orange-600 rounded-full px-1.5 py-0.5">
                {cartCount}
              </span>
            </button>
          
          </div>
        </div>
      </div>

      <MainNavigation isMenuOpen={false} />
    </header>
  );
};

export default Header;