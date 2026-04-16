import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router";
import BookList from "../../components/BookList/BookList";
import {
  fetchBooks,
  fetchBooksSortedByRating,
  searchBooks,
} from "../../api/books";
import "./Home.css";

function Home({ user }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortMode, setSortMode] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const location = useLocation();
  const [successMessage] = useState(location.state?.successMessage || "");
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    loadBooks();
  }, [sortMode, query]);

  async function loadBooks() {
    setLoading(true);
    setError("");

    try {
      let data;

      if (query.trim()) {
        data = await searchBooks(query);
      } else if (sortMode === "rating") {
        data = await fetchBooksSortedByRating();
      } else {
        data = await fetchBooks();
      }

      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    setSortMode("default");
    setQuery(searchTerm.trim());
  }

  function handleClearSearch() {
    setSearchTerm("");
    setQuery("");
  }

  function toggleSort() {
    setSortMode((prev) => (prev === "rating" ? "default" : "rating"));
  }

  return (
    <main className="home-page">
      <h1 tabIndex="-1" ref={headingRef}>
        Second-Shelf
      </h1>
      <p>
        Search by title or author, browse used books, and log in to sell your
        own.
      </p>{" "}
      {successMessage && (
        <p
          className="feedback-message feedback-message--success"
          role="status"
          aria-live="polite"
        >
          {successMessage}
        </p>
      )}
      {user ? (
        <div className="home-page__hero-actions">
          <Link to="/add" className="home-page__cta">
            + Sell a Book
          </Link>
        </div>
      ) : null}
      <form className="home-page__controls" onSubmit={handleSearchSubmit}>
        <label htmlFor="book-search" className="home-page__label">
          Search books
        </label>

        <input
          id="book-search"
          type="text"
          className="home-page__search"
          placeholder="Search by title or author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="home-page__actions">
          <button type="submit" className="sort-button">
            Search
          </button>

          {query && (
            <button
              type="button"
              className="sort-button home-page__clear-button"
              onClick={handleClearSearch}
            >
              Clear Search
            </button>
          )}

          <button type="button" className="sort-button" onClick={toggleSort}>
            {sortMode === "rating"
              ? "Show Default Order"
              : "Sort by Highest Rating"}
          </button>
        </div>
      </form>
      <BookList
        books={books}
        loading={loading}
        error={error}
        emptyMessage={
          query ? `No books found for "${query}".` : "No books found."
        }
      />{" "}
    </main>
  );
}

Home.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
};

Home.defaultProps = {
  user: null,
};

export default Home;
