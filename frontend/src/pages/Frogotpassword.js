import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const styles = {
  body: {
    fontFamily: "'Roboto', Arial, sans-serif",
    color: '#333',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    border: '2px solid #b58b00',
    animation: 'fadeIn 0.5s ease-out',
  },
  h2: {
    color: '#b58b00',
    fontSize: '2.5rem',
    fontWeight: 700,
    letterSpacing: '2px',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    marginTop: '1rem',
    color: '#b58b00',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    marginTop: '0.5rem',
    border: '1px solid #b58b00',
    borderRadius: '5px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
  },
  button: {
    padding: '0.5rem 1rem',
    marginTop: '1rem',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#b58b00',
    color: 'white',
    width: '100%',
    animation: 'breathe 2s infinite ease-in-out',
    transition: 'transform 0.1s ease',
  },
  link: {
    color: '#b58b00',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '0.9rem',
    marginTop: '0.25rem',
  },
  success: {
    color: '#28a745',
    fontSize: '0.9rem',
    marginTop: '0.25rem',
  },
  '@keyframes breathe': {
    '0%, 100%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.03)',
    },
  },
  '@keyframes fadeIn': {
    from: { 
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: { 
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
};

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
    }

    setLoading(false);
  }

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.h2}>Password Reset</h2>
        {error && <div style={styles.error}>{error}</div>}
        {message && <div style={styles.success}>{message}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            ref={emailRef}
            required
            style={styles.input}
          />
          <button disabled={loading} type="submit" style={{
            ...styles.button,
            animation: loading ? 'none' : styles.button.animation,
            opacity: loading ? 0.7 : 1,
          }}>
            Reset Password
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/login" style={styles.link}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
}