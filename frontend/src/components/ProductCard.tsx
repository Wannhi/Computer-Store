import { Link } from 'react-router-dom';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { formatCurrency } from '../utils/formatters';

interface ProductProps {
  product: {
    _id: string;
    title: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    image: string;
    category: string;
    isHot?: boolean;
    isNew?: boolean;
  };
}

const ProductCard: React.FC<ProductProps> = ({ product }) => {
  return (
    <div className="bg-white rounded shadow-sm group overflow-h_den transition-transform hover:-translate-y-1 hover:shadow-md">
      <div className="relative">
        {/* Product Image */}
        <Link to={`/products/${product._id}`} className="block overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-52 object-contain p-2"
          />
        </Link>

        {/* Product Labels */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">NEW</span>
          )}
          {product.discount && product.discount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">-{product.discount}%</span>
          )}
          {product.isHot && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">HOT</span>
          )}
        </div>

        {/* Quick action buttons - visible on hover */}
        {/* <div className="absolute bottom-5 left-0 right-0 bg-black bg-opacity-70 py-2 flex justify-center space-x-3 translate-y-full group-hover:translate-y-0 transition-transform">
          <button className="text-white hover:text-yellow-500">
            <FaShoppingCart />
          </button>
          <button className="text-white hover:text-yellow-500">
            <FaEye />
          </button>
        </div> */}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link
          to={`/product/${product._id}`}
          className="block font-medium text-sm mb-2 hover:text-[#e5aa1d] line-clamp-2"
          title={product.title}
        >
          {product.title}
        </Link>

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{product.category}</span>
        </div>

        <div className="flex items-center">
          <span className="font-bold text-red-600">{formatCurrency(product.price)}</span>

          {product.oldPrice && product.oldPrice > product.price && (
            <span className="ml-2 text-gray-500 text-sm line-through">
              {formatCurrency(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
