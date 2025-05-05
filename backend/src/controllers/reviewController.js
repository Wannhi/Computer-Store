import Review from "../models/Review.js";

// Create a new review
export const createReview = async (req, res) => {
    try {
        const { userId, name, productId, rating, comment } = req.body;

        const newReview = new Review({
            userId,
            productId,
            name,
            rating,
            comment,
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({ message: "Error creating review", error });
    }
};

// Get all reviews for a product
export const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ productId })
        .populate("userId", "name")
        .populate("replies.userId", "name");
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error });
    }
};

// Update a review
export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { rating, comment },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: "Error updating review", error });
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedReview = await Review.findByIdAndDelete(id);

        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting review", error });
    }
};

// Hàm đệ quy tìm và thêm reply vào đúng chỗ
function addReplyRecursive(replies, targetId, newReply) {
  for (let reply of replies) {
    if (reply._id.toString() === targetId.toString()) {
      reply.replies = reply.replies || [];
      reply.replies.push(newReply);
      return true;
    }

    if (reply.replies && addReplyRecursive(reply.replies, targetId, newReply)) {
      return true;
    }
  }
  return false;
}

// Add a reply to a review or to a reply
export const addReplyToReview = async (req, res) => {
  try {
    const { id } = req.params; // id có thể là id của review hoặc reply
    const { userId, name, comment } = req.body;

    const review = await Review.findById(id);

    // Nếu là review gốc
    if (review) {
      const newReply = {
        userId,
        name,
        comment,
        createdAt: new Date(),
        replies: []
      };
      review.replies.push(newReply);
      await review.save();
      return res.status(200).json(review);
    }

    // Nếu không phải review, tìm xem là reply trong mảng replies nào
    const reviews = await Review.find();
    let found = false;
    let updatedReview = null;

    for (let r of reviews) {
      const newReply = {
        userId,
        name,
        comment,
        createdAt: new Date(),
        replies: []
      };

      if (addReplyRecursive(r.replies, id, newReply)) {
        await r.save();
        updatedReview = r;
        found = true;
        break;
      }
    }

    if (!found) {
      return res.status(404).json({ message: "Comment or reply not found" });
    }

    return res.status(200).json(updatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding reply", error });
  }
};
