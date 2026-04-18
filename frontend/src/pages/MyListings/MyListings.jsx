import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router";
import { fetchMyBooks } from "../../api/books.js";
import BookList from "../../components/BookList/BookList.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import "./MyListings.css";

function MyListings({ user }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const headingRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    async function loadMyBooks() {
      try {
        const data = await fetchMyBooks();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadMyBooks();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <main className="mylistings-page">
        <h1 tabIndex="-1" ref={headingRef}>
          My Listings
        </h1>

        <section className="mylistings-empty-state">
          <p>You must be logged in to view your listings.</p>

          <button
            type="button"
            className="mylistings-empty-state__cta"
            onClick={() => setShowLoginModal(true)}
          >
            Log in to continue
          </button>
        </section>
        <Modal
          isOpen={showLoginModal}
          title="Login Required"
          onClose={() => setShowLoginModal(false)}
          onConfirm={() =>
            navigate("/login", {
              state: { from: "/my-listings" },
            })
          }
          confirmText="Go to Login"
          cancelText="Cancel"
          confirmVariant="primary"
        >
          <p>You need to log in before you can view your listings.</p>
        </Modal>
      </main>
    );
  }

  return (
    <main className="mylistings-page">
      <h1 tabIndex="-1" ref={headingRef}>
        My Listings
      </h1>
      <p>Books you are currently selling.</p>

      {!loading && !error && books.length === 0 ? (
        <section className="mylistings-empty-state">
          <h2 className="mylistings-empty-state__heading">No listings yet</h2>
          <p>You have not listed any books yet.</p>
          <Link to="/add" className="mylistings-empty-state__cta">
            Sell your first book
          </Link>
        </section>
      ) : (
        <BookList books={books} loading={loading} error={error} />
      )}
    </main>
  );
}

MyListings.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
};

MyListings.defaultProps = {
  user: null,
};

export default MyListings;
