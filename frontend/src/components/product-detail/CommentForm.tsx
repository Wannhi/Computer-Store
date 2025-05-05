import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface CommentFormProps {
  productId: string;
  onCommentSubmit?: (comment: {
    productId: string;
    rating: number;
    name: string;
    content: string;
  }) => void;
}

const CommentForm = ({ productId, onCommentSubmit }: CommentFormProps) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (rating === 0) {
      newErrors.rating = 'Vui lòng đánh giá sản phẩm';
    }

    if (!content.trim()) {
      newErrors.content = 'Vui lòng nhập nội dung bình luận';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const comment = {
        productId,
        rating,
        name,
        content,
      };

      console.log('Submitting comment:', comment);
      if (onCommentSubmit) {
        onCommentSubmit(comment);
      }

      // Reset form
      setRating(0);
      setName('');
      setContent('');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Viết bình luận của bạn</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Đánh giá của bạn <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <FaStar
                  className={`text-2xl ${
                    star <= (hover || rating) ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
          )}
        </div>


        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Nội dung bình luận <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`w-full px-3 py-2 border ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            } rounded-sm focus:outline-none focus:ring-1 focus:ring-khoavang-primary`}
            rows={5}
            placeholder="Nhập nội dung bình luận của bạn về sản phẩm này"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-sm font-medium"
          >
            Gửi bình luận
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
