import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaEye, FaChevronRight } from 'react-icons/fa';
import FeaturedCategory from '../components/FeaturedCategory';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import API from '../service/api';
import { useEffect, useState } from 'react';
// import "../styles/Home.css"; // Import the CSS file

interface Product {
  _id: string;
  name: string;
  title: string;
  price: number;
  image: string;
  category: string;
  // Add other properties as needed
}

const selectedProductIds = ["67f3b9e4d2c6786b4cb96b63", "67f3b9e4d2c6786b4cb96b62", "67f3b9e4d2c6786b4cb96b61", "67f3b9e4d2c6786b4cb96b60", "67f3b9e4d2c6786b4cb96b5f"]; // Thay bằng các `_id` thực tế

// Sample categories
const featuredCategories = [
  {
    id: 'Laptop Dell',
    name: 'Laptop Dell',
    image: 'https://ext.same-assets.com/3001562581/1880956603.png',
  },
  {
    id: 'Laptop Lenovo',
    name: 'Laptop Lenovo',
    image: 'https://ext.same-assets.com/3001562581/3746283943.jpeg',
  },
  {
    id: 'Laptop HP',
    name: 'Laptop HP',
    image: 'https://ext.same-assets.com/3001562581/1445943869.jpeg',
  },
  {
    id: 'Laptop Asus',
    name: 'Laptop Asus',
    image: 'https://ext.same-assets.com/3001562581/609162964.jpeg',
  },
];

// Hero slider data
const heroSlides = [
  {
    id: 1,
    image: 'https://ext.same-assets.com/3001562581/445967830.webp',
    title: 'Lenovo ThinkBook',
    link: 'products/category/laptop lenovo',
  },
  {
    id: 2,
    image: 'https://pc79.vn/wp-content/uploads/2024/09/Build-PC-Like-New-Gia-Cuc-tot-chi-co-tai-PC79-Store.png',
    title: 'Build PC',
    link: 'products/category/máy tính chơi game',
  },
  {
    id: 3,
    image: 'https://img.freepik.com/free-vector/electronics-store-facebook-cover-template_23-2151173109.jpg?semt=ais_hybrid&w=740',
    title: 'All in One HP EliteOne',
    link: '/products/category/laptop gaming',
  },
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await API.get('/products');
        setFeaturedProducts(response.data); // Cập nhật state với dữ liệu từ API
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm nổi bật:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="pb-10">
      {/* Hero Section with Slider and Categories */}
      <section className="bg-[#f6f5f4] py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Hero Slider */}
            <div className="lg:col-span-12">
              <HeroSlider slides={heroSlides} />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#e5aa1d]">
              DANH MỤC NỔI BẬT
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((category) => (
            <Link
              key={category.id}
              to={`/products/category/${category.id.toLowerCase()}`}
              className="bg-white rounded shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#e5aa1d]">
              SẢN PHẨM NỔI BẬT
            </h2>
            <Link to="/products" className="text-[#e5aa1d] hover:underline flex items-center">
              Xem tất cả <FaChevronRight className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {featuredProducts
            .filter((product) => selectedProductIds.includes(product._id)) 
            .map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      

      {/* News & Reviews Section */}
      {/* <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#e5aa1d]">
              TIN CÔNG NGHỆ
            </h2>
            <Link to="/tin-cong-nghe" className="text-[#e5aa1d] hover:underline flex items-center">
              Xem tất cả <FaChevronRight className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src="https://ext.same-assets.com/3001562581/2789882441.webp"
                alt="News article"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold mb-2 hover:text-[#e5aa1d]">
                  <Link to="/tin-tuc/sample-news-1">
                    RTX 5000 sẽ ra mắt vào cuối năm nay, mạnh hơn tới 70% so với RTX 4000 Series
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm">
                  01/03/2024
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src="https://ext.same-assets.com/3001562581/1765238899.webp"
                alt="News article"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold mb-2 hover:text-[#e5aa1d]">
                  <Link to="/tin-tuc/sample-news-2">
                    Laptop RTX 4000 có đáng mua không? So sánh với RTX 3000 Series
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm">
                  28/02/2024
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src="https://ext.same-assets.com/3001562581/3630256942.jpeg"
                alt="News article"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold mb-2 hover:text-[#e5aa1d]">
                  <Link to="/tin-tuc/sample-news-3">
                    Hướng dẫn chọn laptop chơi game giá rẻ cho sinh viên năm 2024
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm">
                  15/02/2024
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src="https://ext.same-assets.com/3001562581/2153664605.webp"
                alt="News article"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold mb-2 hover:text-[#e5aa1d]">
                  <Link to="/tin-tuc/sample-news-4">
                    So sánh Dell G15 và G16 - Đâu là lựa chọn đáng tiền cho game thủ?
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm">
                  01/02/2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default HomePage;
