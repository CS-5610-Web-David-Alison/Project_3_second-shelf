import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router";
import "./Header.css";
import "../../index.css";
import Modal from "../Modal/Modal";

function Header({ user, onLogout }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    if (showLogoutModal) {
      modalRef.current?.focus();
    }
  }, [showLogoutModal]);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") {
        setShowLogoutModal(false);
      }
    }

    if (showLogoutModal) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [showLogoutModal]);
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg site-navbar">
          <div className="container">
            <Link className="navbar-brand site-navbar__brand" to="/">
              Second-Shelf
            </Link>

            <button
              className="navbar-toggler site-navbar__toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNavbar"
              aria-controls="mainNavbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="mainNavbar">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
                <li className="nav-item">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `nav-link site-navbar__link${isActive ? " active" : ""}`
                    }
                  >
                    Home
                  </NavLink>
                </li>

                {user ? (
                  <>
                    <li className="nav-item">
                      <NavLink
                        to="/add"
                        className={({ isActive }) =>
                          `site-navbar__cta${
                            isActive ? " site-navbar__cta--active" : ""
                          }`
                        }
                      >
                        + Sell a Book
                      </NavLink>
                    </li>

                    <li className="nav-item">
                      <NavLink
                        to="/my-listings"
                        className={({ isActive }) =>
                          `nav-link site-navbar__link${isActive ? " active" : ""}`
                        }
                      >
                        My Listings
                      </NavLink>
                    </li>
                  </>
                ) : null}
              </ul>

              <div className="d-flex align-items-center gap-2">
                {user ? (
                  <>
                    <span className="site-navbar__welcome">
                      Hi, {user.name}
                    </span>

                    {/* <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={onLogout}
                  >
                    Logout
                  </button> */}

                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => setShowLogoutModal(true)}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        `btn btn-outline-light btn-sm${isActive ? " active" : ""}`
                      }
                    >
                      Register
                    </NavLink>

                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        `btn btn-light btn-sm${isActive ? " active" : ""}`
                      }
                    >
                      Login
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
      {/* {showLogoutModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <div 
          className="logout-modal" 
          tabIndex="-1" 
          ref={modalRef}
          >
            <h2 id="logout-title">Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>

            <div className="logout-modal__actions">
              <button
                type="button"
                className="logout-modal__button logout-modal__button--confirm"
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
              >
                Yes
              </button>

              <button
                type="button"
                className="logout-modal__button logout-modal__button--cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )} */}
      <Modal
        isOpen={showLogoutModal}
        title="Confirm Logout"
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          onLogout();
        }}
        confirmText="Yes"
        cancelText="No"
        confirmVariant="danger"
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </>
  );
}

Header.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    id: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
};

Header.defaultProps = {
  user: null,
};

export default Header;
