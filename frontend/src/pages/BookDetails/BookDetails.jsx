import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router";
import PropTypes from "prop-types";
import { fetchBook, deleteBook } from "../../api/books.js";
import ReviewList from "../../components/ReviewList/ReviewList.jsx";
import ReviewForm from "../../components/ReviewForm/ReviewForm.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import "./BookDetails.css";

let fetchReviewsByBookIdFn;
let createReviewFn;
let updateReviewFn;
let deleteReviewFn;
let reviewsAvailable = false;

try {
  const reviewsApi = await import("../../api/reviews.js");
  fetchReviewsByBookIdFn = reviewsApi.fetchReviewsByBookId;
  createReviewFn = reviewsApi.createReview;
  updateReviewFn = reviewsApi.updateReview;
  deleteReviewFn = reviewsApi.deleteReview;
  reviewsAvailable = true;
} catch {
  reviewsAvailable = false;
}

export default function BookDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteReviewModal, setShowDeleteReviewModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewsError, setReviewsError] = useState(false);
  const location = useLocation();
  const [successMessage] = useState(location.state?.successMessage || "");
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [reviewError, setReviewError] = useState("");
  const headingRef = useRef(null);
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    async function loadBookDetails() {
      try {
        const bookData = await fetchBook(id);
        setBook(bookData);
      } catch {
        setError("Failed to load book details.");
      } finally {
        setLoading(false);
      }
    }

    async function loadReviews() {
      if (!reviewsAvailable) {
        return;
      }

      try {
        const reviewData = await fetchReviewsByBookIdFn(id);
        setReviews(reviewData);
      } catch {
        setReviewsError(true);
      }
    }

    loadBookDetails();
    loadReviews();
  }, [id]);

  async function handleDeleteBook() {
    try {
      await deleteBook(id);
      navigate("/", {
        state: { successMessage: "Listing deleted successfully." },
      });
    } catch (err) {
      setError(err.message || "Failed to delete book.");
    }
  }

  async function handleCreateReview(data) {
    try {
      setReviewError("");
      const result = await createReviewFn(data);

      setReviews((prev) => [
        {
          _id: result.insertedId,
          bookId: id,
          rating: data.rating,
          reviewText: data.reviewText,
          userId: user.id,
          userName: user.name,
        },
        ...prev,
      ]);

      setReviewFeedback("Review submitted successfully.");
    } catch (err) {
      setReviewError(err.message || "Failed to submit review.");
    }
  }

  async function handleUpdateReview(data) {
    try {
      setReviewError("");
      if (!editingReview) {
        return;
      }

      await updateReviewFn(editingReview._id, {
        rating: data.rating,
        reviewText: data.reviewText,
      });

      setReviews((prev) =>
        prev.map((review) =>
          review._id === editingReview._id
            ? {
                ...review,
                rating: data.rating,
                reviewText: data.reviewText,
              }
            : review,
        ),
      );
      setReviewFeedback("Review updated successfully.");
      setEditingReview(null);
    } catch (err) {
      setReviewError(err.message || "Failed to update review.");
    }
  }

  async function handleDeleteReview(reviewId) {
    try {
      setReviewError("");

      await deleteReviewFn(reviewId);
      setReviews((prev) => prev.filter((review) => review._id !== reviewId));

      if (editingReview && editingReview._id === reviewId) {
        setEditingReview(null);
      }

      setShowDeleteReviewModal(false);
      setReviewToDelete(null);
      setReviewFeedback("Review deleted successfully.");
    } catch (err) {
      setReviewError(err.message || "Failed to delete review.");
    }
  }

  function handleOpenDeleteReviewModal(reviewId) {
    setReviewToDelete(reviewId);
    setShowDeleteReviewModal(true);
  }

  function handleEditReview(review) {
    setEditingReview(review);
  }

  function handleCancelEdit() {
    setEditingReview(null);
  }

  if (loading) {
    return <p className="bookdetails__status">Loading...</p>;
  }

  if (error) {
    return (
      <p className="bookdetails__status bookdetails__status--error">{error}</p>
    );
  }

  if (!book) {
    return <p className="bookdetails__status">Book not found.</p>;
  }

  const isOwner = user && user.id === book.sellerId;

  const avgRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : null;

  return (
    <main className="bookdetails">
      <Link to="/" className="bookdetails__back">
        ← Back to listings
      </Link>

      {successMessage && (
        <p
          className="feedback-message feedback-message--success"
          role="status"
          aria-live="polite"
        >
          {successMessage}
        </p>
      )}

      <div className="bookdetails__card">
        <div className="bookdetails__main">
          {book.imageUrl ? (
            <img
              src={book.imageUrl}
              alt={`Cover of ${book.title}`}
              className="bookdetails__image"
            />
          ) : (
            <div className="bookdetails__image-placeholder" aria-hidden="true">
              No Image Available
            </div>
          )}
          <h1 className="bookdetails__title" tabIndex="-1" ref={headingRef}>
            {book.title}
          </h1>
          <p className="bookdetails__author">by {book.author}</p>

          <div className="bookdetails__meta">
            <span className="bookdetails__price">${book.price.toFixed(2)}</span>
            <span
              className={`bookdetails__condition bookdetails__condition--${book.condition
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {book.condition}
            </span>
            {avgRating ? (
              <span className="bookdetails__rating">
                ★ {avgRating} ({reviews.length})
              </span>
            ) : null}
          </div>

          {book.description ? (
            <p className="bookdetails__description">{book.description}</p>
          ) : null}

          {isOwner ? (
            <div className="bookdetails__actions">
              <Link
                to={`/edit/${id}`}
                className="bookdetails__btn bookdetails__btn--edit"
              >
                Edit Listing
              </Link>
              <button
                type="button"
                className="bookdetails__btn bookdetails__btn--delete"
                aria-label={`Delete listing for ${book.title}`}
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Listing
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {reviewsAvailable ? (
        <section className="bookdetails__reviews">
          <h2 className="bookdetails__reviews-heading">
            Community Reviews {reviews.length > 0 ? `(${reviews.length})` : ""}
          </h2>
          {reviewFeedback && (
            <p
              className="feedback-message feedback-message--success"
              role="status"
              aria-live="polite"
            >
              {reviewFeedback}
            </p>
          )}

          {reviewError && (
            <p
              className="feedback-message feedback-message--error"
              role="alert"
              aria-live="assertive"
            >
              {reviewError}
            </p>
          )}

          {reviewsError ? (
            <p className="bookdetails__status">
              Reviews unavailable right now.
            </p>
          ) : (
            <>
              <ReviewList
                reviews={reviews}
                currentUser={user}
                onEdit={handleEditReview}
                onDelete={handleOpenDeleteReviewModal}
              />

              {user ? (
                <ReviewForm
                  bookId={id}
                  onSubmit={
                    editingReview ? handleUpdateReview : handleCreateReview
                  }
                  initialData={editingReview}
                  isEditing={Boolean(editingReview)}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <div className="bookdetails__login-prompt">
                  <p>Log in to leave a review.</p>
                  <button
                    type="button"
                    className="bookdetails__login-link"
                    onClick={() => setShowLoginRequiredModal(true)}
                  >
                    Log in to continue
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      ) : null}
      <Modal
        isOpen={showDeleteModal}
        title="Delete Listing"
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          handleDeleteBook();
        }}
        confirmText="Yes, delete it"
        cancelText="No, keep it"
        confirmVariant="danger"
      >
        <p>Are you sure you want to delete this book listing?</p>
      </Modal>
      <Modal
        isOpen={showDeleteReviewModal}
        title="Delete Review"
        onClose={() => {
          setShowDeleteReviewModal(false);
          setReviewToDelete(null);
        }}
        onConfirm={() => handleDeleteReview(reviewToDelete)}
        confirmText="Yes, delete it"
        cancelText="No, keep it"
        confirmVariant="danger"
      >
        <p>Are you sure you want to delete this review?</p>
      </Modal>
      <Modal
        isOpen={showLoginRequiredModal}
        title="Login Required"
        onClose={() => setShowLoginRequiredModal(false)}
        onConfirm={() =>
          navigate("/login", {
            state: { from: `/books/${id}` },
          })
        }
        confirmText="Go to Login"
        cancelText="Cancel"
        confirmVariant="primary"
      >
        <p>You need to log in before you can leave a review.</p>
      </Modal>
    </main>
  );
}

BookDetails.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  }),
};

BookDetails.defaultProps = {
  user: null,
};
