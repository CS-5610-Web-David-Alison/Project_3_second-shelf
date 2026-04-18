import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./Modal.css";

function Modal({
  isOpen,
  title,
  children,
  onClose,
  confirmText,
  cancelText,
  onConfirm,
  confirmVariant,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleEsc(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="app-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-modal-title"
      onClick={onClose}
    >
      <div
        className="app-modal"
        tabIndex="-1"
        ref={modalRef}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="app-modal-title" className="app-modal__title">
          {title}
        </h2>

        <div className="app-modal__content">{children}</div>

        <div className="app-modal__actions">
          <button
            type="button"
            className={`app-modal__button ${
              confirmVariant === "danger"
                ? "app-modal__button--danger"
                : "app-modal__button--primary"
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>

          <button
            type="button"
            className="app-modal__button app-modal__button--secondary"
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  confirmVariant: PropTypes.oneOf(["primary", "danger"]),
};

Modal.defaultProps = {
  confirmText: "Confirm",
  cancelText: "Cancel",
  confirmVariant: "primary",
};

export default Modal;