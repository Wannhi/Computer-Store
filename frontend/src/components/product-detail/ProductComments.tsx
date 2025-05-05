import { useEffect, useState } from 'react';
import { FaStar, FaUser, FaReply, FaThumbsUp } from 'react-icons/fa';
import CommentForm from './CommentForm';
import API from '../../service/api';

interface Comment {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  createdAt?: string;  // nếu bạn muốn hiển thị ngày
  replies?: Comment[];
}


interface ProductCommentsProps {
  productId: string;
  comments: {
    userId: string;
    comment: string;
    date: string;
    rating: number;
  }[];
}

const nameUser = localStorage.getItem('name');
// Giả sử bạn có userId lấy từ localStorage hoặc context
const userId = localStorage.getItem('id'); // ví dụ bạn đã lưu userId sau khi đăng nhập

const ProductComments = ({ productId }: ProductCommentsProps) => {
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [visibleReplies, setVisibleReplies] = useState<Record<string, boolean>>({});


  // 
  const toggleRepliesVisibility = (commentId: string) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };
  
  // Fetch comments when component mounts
  const fetchComments = async () => {
    try {
      const response = await API.get(`/reviews/${productId}`);
      console.log(response.data);
      setAllComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [productId]);

  const handleReplySubmit = async () => {
    if (!replyContent.trim() || !replyTo) return;
  
    try {
      const replyData = {
        userId,
        name: nameUser,
        comment: replyContent,
        parentId: replyTo, // 👈 Đây chính là comment/reply mà bạn đang trả lời
      };
  
      await API.post(`/reviews/${replyTo}/reply`, replyData);
  
      setReplyTo(null);
      setReplyContent('');
      fetchComments();
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };
  
  


  const handleNewComment = async (comment: {
    rating: number;
    name: string; // Có thể không cần nếu bạn chỉ dùng userId
    content: string;
  }) => {
    const newComment = {
      userId: userId, // Gửi đúng theo yêu cầu
      productId,
      name: nameUser,
      rating: comment.rating,
      comment: comment.content,
    };

    try {
      const response = await API.post(`reviews`, newComment);
      console.log('Comment submitted:', newComment);
      setAllComments([...allComments, response.data]);
      fetchComments(); // Cập nhật lại danh sách bình luận sau khi gửi
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };


  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`text-sm ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const renderComment = (comment: Comment, isReply = false) => {
    return (
      <div key={comment._id} className={`border-b border-gray-200 py-4 ${isReply ? 'ml-10 mt-3 bg-gray-50 p-3 rounded-md' : ''}`}>
        <div className="flex items-start">
          <div className="rounded-full bg-gray-200 p-2 mr-3">
            <FaUser className="text-gray-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-2">
            <h4 className="font-semibold mr-2">
              {typeof comment.userId === 'object' ? comment.userId?.name : "Người dùng ẩn danh"}
            </h4>
              <span className="text-xs text-gray-500">{comment.createdAt}</span>
            </div>
            {!isReply && renderStars(comment.rating)}
            <p className="mt-2 text-gray-700">{comment.comment}</p>
            {!isReply && (
              <div className="flex items-center mt-2 text-sm">
                <button
                  className="flex items-center text-gray-500"
                  onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                >
                  <FaReply className="mr-1" />
                  Trả lời
                </button>
                
              </div>
            )}

            {replyTo === comment._id && (
              <div className="mt-3">
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-khoavang-primary"
                  rows={3}
                  placeholder="Nhập nội dung trả lời..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button
                    className="px-3 py-1 bg-gray-200 rounded-sm mr-2"
                    onClick={() => setReplyTo(null)}
                  >
                    Hủy
                  </button>
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded-sm"
                    onClick={handleReplySubmit}
                  >
                    Gửi
                  </button>
                </div>
              </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3">
                <button
                  className="text-sm text-black mb-2"
                  onClick={() => toggleRepliesVisibility(comment._id)}
                >
                  {visibleReplies[comment._id] ? 'Ẩn trả lời' : `Hiện ${comment.replies.length} trả lời`}
                </button>

                {visibleReplies[comment._id] &&
                  comment.replies.map((reply) => renderComment(reply, true))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Bình luận về sản phẩm</h2>

      {/* Form thêm bình luận mới */}
      <div className="mb-8 border-b border-gray-200 pb-8">
        <CommentForm productId={productId} onCommentSubmit={handleNewComment} />
      </div>

      {/* Hiển thị các bình luận đã có */}
      {allComments.length > 0 ? (
        <div>
          {allComments.map((comment) => renderComment(comment))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          <p>Chưa có bình luận nào về sản phẩm này.</p>
          <p className="mt-2">Hãy là người đầu tiên bình luận!</p>
        </div>
      )}
    </div>
  );
};

export default ProductComments;
