import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface ProductRatingProps {
  product: {
    _id: string;
    name: string;
    commentCount: number;
  };
}

const ProductRating = ({ product }: ProductRatingProps) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit rating logic would go here
    console.log({ rating, comment });
    // Reset form
    setRating(0);
    setComment('');
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Đánh giá {product.name}</h2>

      {/* Rating Statistics */}
      <div className="flex items-center mb-6">
        <div className="text-center mr-6">
          <div className="text-3xl font-bold text-khoavang-primary">0</div>
          <div className="text-sm text-gray-500">Trung bình</div>
          <div className="flex mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar key={star} className="text-gray-300" />
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-1">{product.commentCount} đánh giá</div>
        </div>

        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((num) => (
            <div key={num} className="flex items-center mb-1">
              <div className="w-10 text-right mr-2">{num} ★</div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-0 h-full bg-khoavang-primary"></div>
              </div>
              <div className="w-10 text-left ml-2">0%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Viết đánh giá</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="text-sm mb-2">Bạn đánh giá sản phẩm này bao nhiêu sao?</div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className="cursor-pointer p-1"
                  onClick={() => handleRatingChange(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  <FaStar
                    className={`text-xl ${
                      star <= (hover || rating) ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Nội dung đánh giá
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-khoavang-primary"
              rows={5}
              placeholder="Mời bạn để lại bình luận..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              className="bg-khoavang-primary hover:bg-yellow-600 text-white px-5 py-2 rounded-sm font-medium"
            >
              Gửi bình luận
            </button>
          </div>
        </form>
      </div>

      {/* No comments message */}
      {product.commentCount === 0 && (
        <div className="mt-8 text-center text-gray-500">
          Chưa có đánh giá nào cho sản phẩm này.
        </div>
      )}
    </div>
  );
};

export default ProductRating;
