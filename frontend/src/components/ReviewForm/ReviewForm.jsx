import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./ReviewForm.css";

function ReviewForm({ bookId, onSubmit, initialData, isEditing, onCancel }) {
  const [formData, setFormData] = useState({
    rating: 5,
    reviewText: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        rating: initialData.rating ?? 5,
        reviewText: initialData.reviewText ?? "",
      });
    } else {
      setFormData({
        rating: 5,
        reviewText: "",
      });
    }
  }, [initialData]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.reviewText.trim()) {
      setError("Review text is required");
      return;
    }

    try {
      await onSubmit({
        bookId,
        rating: Number(formData.rating),
        reviewText: formData.reviewText.trim(),
      });

      if (!isEditing) {
        setFormData({
          rating: 5,
          reviewText: "",
        });
      }
    } catch (err) {
      setError(err.message || "Failed to submit review");
    }
  }

  return (
    <section className="review-form-section">
      <h2>{isEditing ? "Edit Review" : "Leave a Review"}</h2>

      <form className="review-form" onSubmit={handleSubmit}>
        <label htmlFor="rating">Rating</label>
        <select
          id="rating"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>

        <label htmlFor="reviewText">Review</label>
        <textarea
          id="reviewText"
          name="reviewText"
          value={formData.reviewText}
          onChange={handleChange}
          rows="5"
          required
        />

        {error ? (
          <p className="form-error" role="alert" aria-live="assertive">
            {error}
          </p>
        ) : null}

        <div className="review-form-actions">
          <button type="submit">
            {isEditing ? "Update Review" : "Submit Review"}
          </button>

          {isEditing && onCancel ? (
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

ReviewForm.propTypes = {
  bookId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    rating: PropTypes.number,
    reviewText: PropTypes.string,
  }),
  isEditing: PropTypes.bool,
  onCancel: PropTypes.func,
};

ReviewForm.defaultProps = {
  initialData: null,
  isEditing: false,
  onCancel: null,
};

export default ReviewForm;
