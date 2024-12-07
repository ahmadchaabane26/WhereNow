import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./context/AuthContext";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/Frogotpassword";
import Dashboard from "./pages/dashboard";
import Saved from "./pages/saved";
import axios from "axios";

// Create a wrapper component for protected routes
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { currentUser } = useAuth();
  const [countries, setCountries] = useState([]); // State to store countries data

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch countries
        const countriesResponse = await axios.get("http://localhost:3001/api/cities");
        setCountries(countriesResponse.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentUser]);

  return (
    <Routes>
      <Route
        path="/Signup"
        element={
          <Container
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "100%", maxWidth: "400px" }}>
              <Signup />
            </div>
          </Container>
        }
      />
      <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect root to login */}
      <Route
        path="/login"
        element={
          <Container
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "100%", maxWidth: "400px" }}>
              <Login />
            </div>
          </Container>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <Container
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "100%", maxWidth: "400px" }}>
              <ForgotPassword />
            </div>
          </Container>
        }
      />
      <Route
        path="/:userId/dashboard"
        element={
          <PrivateRoute>
            <Dashboard countries={countries} />
          </PrivateRoute>
        }
      />
      <Route
        path="/:userId/dashboard/saved"
        element={
          <PrivateRoute>
            <Saved />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
