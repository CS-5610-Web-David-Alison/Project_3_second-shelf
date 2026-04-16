import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { registerUser } from "../../api/auth";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await registerUser(formData);
      setMessage("Registration successful");
      navigate("/login", {
        state: { successMessage: "Registration successful. Please log in." },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <h1 tabIndex="-1" ref={headingRef}>
        Register
      </h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <small>Enter your full name</small>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <small>Must be at least 6 characters</small>
        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      {message && (
        <p
          className="feedback-message feedback-message--success"
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}

      {error && (
        <p
          className="feedback-message feedback-message--error"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </p>
      )}
    </main>
  );
}

export default Register;
