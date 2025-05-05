import { useLocation } from "react-router-dom";
import { useEffect } from "react";

// Component cuộn lên đầu trang
const ScrollToTop = () => {
  const location = useLocation(); // Lấy thông tin về vị trí hiện tại

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang mỗi khi URL thay đổi
  }, [location]); // Hook sẽ chạy mỗi khi `location` thay đổi (tức là khi chuyển trang)

  return null;
};

export default ScrollToTop;
  