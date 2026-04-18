import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { loginUser } from "../../api/auth";
import "./Login.css";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const headingRef = useRef(null);
  const [loading, setLoading] = useState(false);

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
    setSuccess("");
    setLoading(true);

    try {
      const data = await loginUser(formData);
      onLogin(data.user);
      setSuccess("Login successful.");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }finally{
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <h1 tabIndex="-1" ref={headingRef}>
        Login
      </h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-describedby="email-error"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <small>Enter the email you registered with</small>

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {success && (
        <p
          className="feedback-message feedback-message--success"
          role="status"
          aria-live="polite"
        >
          {success}
        </p>
      )}

      {error && (
        <p
          className="feedback-message feedback-message--error"
          id="email-error"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </p>
      )}
    </main>
  );
}

export default Login;
