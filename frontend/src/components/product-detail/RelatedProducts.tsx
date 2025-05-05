import { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface RelatedProductsProps {
  products: {
    id: number;
    name: string;
    price: number;
    image: string;
  }[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  const sliderRef = useRef<Slider | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Sản phẩm tương tự</h2>
        <div className="flex space-x-2">
          <button
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-khoavang-primary hover:text-white"
            onClick={() => sliderRef.current?.slickPrev()}
          >
            <FaChevronLeft className="text-sm" />
          </button>
          <button
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-khoavang-primary hover:text-white"
            onClick={() => sliderRef.current?.slickNext()}
          >
            <FaChevronRight className="text-sm" />
          </button>
        </div>
      </div>

      <div className="relative">
        <Slider ref={sliderRef} {...settings}>
          {products.map((product) => (
            <div key={product.id} className="px-2">
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium mb-2 h-10 overflow-hidden" title={product.name}>
                    {product.name.length > 60 ? product.name.substring(0, 60) + '...' : product.name}
                  </h3>
                  <div className="text-khoavang-red font-bold">
                    {formatPrice(product.price)} đ
                  </div>
                  <button className="mt-2 bg-khoavang-primary text-white text-xs font-medium py-1 px-2 rounded-sm w-full">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default RelatedProducts;
