import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Logout from './logout';

export default function Dashboard() {
  const navigate = useNavigate();
  const { userId } = useParams(); // Extract userId from the URL

  const handleBackToDashboard = () => {
    navigate(`/${userId}/dashboard`); // Navigate to the user's dashboard
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" style={{ padding: '1rem 2rem' }}>
        <Navbar.Brand href="#home" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          WhereNow
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <NavDropdown title="Profile" id="basic-nav-dropdown">
              {/* Navigate back to dashboard */}
              <NavDropdown.Item onClick={handleBackToDashboard}>
                Dashboard
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                <Logout />
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
