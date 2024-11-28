import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/Frogotpassword";


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
        <Route path="/Signup" element={
            <Container style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "100%", maxWidth: "400px" }}>
                <Signup />
              </div>
            </Container>
          } />
          <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect root to login */}
          <Route path="/login" element={
            <Container style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "100%", maxWidth: "400px" }}>
                <Login />
              </div>
            </Container>
          } />
          <Route path="/forgot-password" element={
            <Container style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "100%", maxWidth: "400px" }}>
                <ForgotPassword />
              </div>
            </Container>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
