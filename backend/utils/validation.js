// utils/validation.js
// Input validation helpers for incoming request bodies.
// Each function checks required fields and basic constraints,
// returning an error message string if invalid, or null if valid.
// These are called in route handlers before any database operations.

/**
 * Validates the body of a create/update book request.
 * @param {Object} params
 * @param {string} params.title - The book's title (required)
 * @param {string} params.author - The book's author (required)
 * @param {number} params.price - The listing price; must be a non-negative number (required)
 * @param {string} params.condition - Must be one of: 'Like New', 'Good', 'Fair', 'Poor' (required)
 * @returns {string|null} An error message if invalid, or null if the data is valid
 */
export function validateBook({ title, author, price, condition }) {
  if (!title) return "Title is required";
  if (!author) return "Author is required";
  if (price == null || isNaN(price) || price < 0)
    return "Valid price is required";
  const conditions = ["Like New", "Good", "Fair", "Poor"];
  if (!conditions.includes(condition))
    return `Condition must be one of: ${conditions.join(", ")}`;
  return null;
}

/**
 * Validates the body of a create/update review request.
 * @param {Object} params
 * @param {string} params.bookId - The _id of the book being reviewed (required)
 * @param {number} params.rating - A numeric rating between 1 and 5 inclusive (required)
 * @returns {string|null} An error message if invalid, or null if the data is valid
 */
export function validateReview({ bookId, rating }) {
  if (!bookId) return "bookId is required";
  if (rating == null || rating < 1 || rating > 5)
    return "Rating must be between 1 and 5";
  return null;
}

/**
 * Validates the body of a register request.
 * @param {Object} params
 * @param {string} params.username - Must be at least 3 characters long (required)
 * @param {string} params.password - Must be at least 6 characters long (required)
 * @returns {string|null} An error message if invalid, or null if the data is valid
 */
export function validateUser({ username, password }) {
  if (!username || username.trim().length < 3)
    return "Username must be at least 3 characters";
  if (!password || password.length < 6)
    return "Password must be at least 6 characters";
  return null;
}
