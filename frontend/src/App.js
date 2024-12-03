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
  const [preferences, setPreferences] = useState(null);
  const [savedItems, setSavedItems] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the ID token from Firebase Authentication
        const idToken = await currentUser?.getIdToken();

        if (!idToken) {
          console.error("User not authenticated");
          return;
        }

        // Fetch user preferences
        const preferencesResponse = await axios.get("http://localhost:3001/api/user/preferences", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        setPreferences(preferencesResponse.data);

        // Fetch saved items (flights, hotels, activities)
        const savedItemsResponse = await axios.get("http://localhost:3001/api/user/saved", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        setSavedItems(savedItemsResponse.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (currentUser) {
      fetchData();
    }
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
            <Dashboard preferences={preferences} />
          </PrivateRoute>
        }
      />
      <Route
        path="/:userId/dashboard/saved"
        element={
          <PrivateRoute>
            <Saved savedItems={savedItems} />
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
