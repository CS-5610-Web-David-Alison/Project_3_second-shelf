import PropTypes from "prop-types";
import "./ReviewList.css";

function ReviewList({ reviews, currentUser, onEdit, onDelete }) {
  if (!reviews || reviews.length === 0) {
    return (
      <section className="review-list">
        <h2>Reviews</h2>
        <p>No reviews yet. Be the first to review this book.</p>
      </section>
    );
  }

  return (
    <section className="review-list">
      <h2>Reviews</h2>

      <ul className="review-items">
        {reviews.map((review) => {
          const isOwner = currentUser && review.userId === currentUser.id;

          return (
            <li key={review._id} className="review-card">
              <div className="review-header">
                <span className="review-user">
                  {review.userName || "Anonymous"}
                </span>
                <span className="review-rating">⭐ {review.rating}/5</span>
              </div>

              <p className="review-text">{review.reviewText}</p>

              {isOwner ? (
                <div className="review-actions">
                  <button type="button" onClick={() => onEdit(review)}>
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    aria-label="Delete review"
                    onClick={() => onDelete(review._id)}
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

ReviewList.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      userId: PropTypes.string,
      userName: PropTypes.string,
      rating: PropTypes.number.isRequired,
      reviewText: PropTypes.string,
    }),
  ),
  currentUser: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

ReviewList.defaultProps = {
  reviews: [],
  currentUser: null,
};

export default ReviewList;
