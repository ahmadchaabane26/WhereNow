import React, { useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logout from "./logout";
import { useAuth } from '../context/AuthContext';
import { fetchPreferences } from '../api/user'; // API call function



export default function Dashboard() {

  const { idToken } = useAuth();

  useEffect(() => {
      const getPreferences = async () => {
          if (!idToken) {
              console.log("User not authenticated");
              return;
          }

          try {
              const preferences = await fetchPreferences(idToken);
              console.log("User preferences:", preferences);
          } catch (error) {
              console.error("Error fetching preferences:", error);
          }
      };

      getPreferences();
  }, [idToken]);
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
              <NavDropdown.Item as={Link} to="saved">Saved</NavDropdown.Item> {/* Link to "/saved" */}
              <NavDropdown.Divider />
              <NavDropdown.Item> <Logout /> </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Search and Filter Section */}
      <Container className="mt-4">
        <Row>
          <Col md={8}>
            {/* Search Bar */}
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                style={{
                  borderRadius: '10px',
                  padding: '0.5rem',
                  fontSize: '1rem',
                  border: '1px solid #ccc',
                }}
              />
              <Button variant="primary" style={{ backgroundColor: '#b58b00', borderColor: '#b58b00' }}>
                Search
              </Button>
            </Form>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mt-3">
          <Col>
            <div className="d-flex justify-content-start">
              <Button variant="outline-primary" className="me-2">
                Filter 1
              </Button>
              <Button variant="outline-primary" className="me-2">
                Filter 2
              </Button>
              <Button variant="outline-primary" className="me-2">
                Filter 3
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Nested Routes */}
    </div>
  );
}
