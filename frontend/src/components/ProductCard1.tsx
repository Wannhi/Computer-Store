import { Link } from 'react-router-dom';

export interface ProductProps {
  _id: string;
  title: string;
  specs: string[];
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  image: string;
  stock: number;
  category: string;
  status: string; 
}

const ProductCard: React.FC<ProductProps> = ({
  _id,
  title,
  specs,
  price,
  oldPrice,
  discountPercentage,
  image,
  stock,
  category,
  status,
}) => {
  const formattedPrice = new Intl.NumberFormat('vi-VN').format(price);
  const formattedOldPrice = oldPrice ? new Intl.NumberFormat('vi-VN').format(oldPrice) : null;

  return (
    <div className="group bg-white rounded shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <Link to={`/products/${_id}`} className="block">
        {/* Product image */}
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product info */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-800 line-clamp-2 h-12 text-sm md:text-base">
            {title}
          </h3>

          {/* Specifications */}
          <div className="mt-2 space-y-1">
            {specs.slice(0, 5).map((spec) => (
              <p key={`${_id}-${spec.substring(0, 10)}`} className="text-xs text-gray-600 line-clamp-1">
                {spec}
              </p>
            ))}
          </div>

          {/* Price section */}
          <div className="mt-4 flex items-end justify-between">
            <div>
              {oldPrice && (
                <span className="text-sm text-gray-500 line-through block">
                  {formattedOldPrice}
                </span>
              )}
              <span className="text-primary font-bold text-lg">{formattedPrice}</span>
            </div>

            {discountPercentage !== 0 && discountPercentage && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                -{discountPercentage}%
              </span>
            )}

          </div>

          {/* Stock and Status */}
          <div className="mt-2 text-sm text-gray-500">
            {status === 'Hết hàng' ? (
              <span className="text-red-500">Hết hàng</span>
            ) : status === 'Sắp hết' ? (
              <span className="text-yellow-500">Sắp hết</span>
            ) : (
              <span className="text-green-500">Còn hàng: {stock}</span>
            )}
          </div>

          {/* Category */}
          <div className="mt-2 text-xs text-gray-600">
            <span className="font-medium">Danh mục: </span>{category}
          </div>

          {/* Buy button */}
          <button
            className="mt-3 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded font-medium transition-colors"
          >
            Xem chi tiết
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
