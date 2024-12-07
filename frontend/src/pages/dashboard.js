import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, FormControl, Button, Container, Row, Col, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logout from "./logout";
import axios from 'axios';

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState(null); // Tracks the selected main filter
  const [origin, setOrigin] = useState(''); // Selected origin city code
  const [destination, setDestination] = useState(''); // Selected destination city code
  const [departureDate, setDepartureDate] = useState(''); // Selected departure date
  const [cities, setCities] = useState([]); // List of cities
  const [flights, setFlights] = useState([]); // Flight search results
  const [searchError, setSearchError] = useState(null); // Error state for flight search

  // Load cities from the backend API and sort them alphabetically
  const loadCities = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/cities');
      const sortedCities = response.data.sort((a, b) => a.name.localeCompare(b.name));
      setCities(sortedCities); // Update state with sorted city data
    } catch (error) {
      console.error('Error fetching cities:', error.response?.data || error.message);
    }
  };

  // Call the loadCities function on component mount
  useEffect(() => {
    loadCities(); // Fetch cities
  }, []);

  const handleSearch = async () => {
    try {
      setSearchError(null); // Clear previous errors
      const response = await axios.get('http://localhost:3001/api/flights', {
        params: {
          origin,
          destination,
          date: departureDate,
        },
      });
      setFlights(response.data); // Update flight results
    } catch (error) {
      console.error('Error fetching flights:', error.response?.data || error.message);
      setSearchError('Failed to fetch flight data. Please try again.');
    }
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
              <NavDropdown.Item as={Link} to="saved">Saved</NavDropdown.Item>
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
            {/* Origin Dropdown */}
            <FormControl
              as="select"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="me-2"
              style={{ borderRadius: '10px', padding: '0.5rem', fontSize: '1rem', border: '1px solid #ccc' }}
            >
              <option value="">Select Origin</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name} ({city.country})
                </option>
              ))}
            </FormControl>

            {/* Destination Dropdown */}
            <FormControl
              as="select"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="me-2"
              style={{ borderRadius: '10px', padding: '0.5rem', fontSize: '1rem', border: '1px solid #ccc' }}
            >
              <option value="">Select Destination</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name} ({city.country})
                </option>
              ))}
            </FormControl>

            {/* Departure Date Picker */}
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="form-control me-2"
              style={{ borderRadius: '10px', padding: '0.5rem', fontSize: '1rem', border: '1px solid #ccc' }}
            />

            <Button
              variant="primary"
              style={{ backgroundColor: '#b58b00', borderColor: '#b58b00' }}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Col>
        </Row>

        {/* Error Message */}
        {searchError && (
          <Row className="mt-3">
            <Col>
              <div className="alert alert-danger">{searchError}</div>
            </Col>
          </Row>
        )}

        {/* Flight Results */}
        <Row className="mt-4">
          <Col>
            <h4>Flight Results</h4>
            {flights.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Price</th>
                    <th>Departure</th>
                    <th>Arrival</th>
                    <th>Duration</th>
                    <th>Airline</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map((flight) => (
                    <tr key={flight.id}>
                      <td>${flight.price}</td>
                      <td>{new Date(flight.departure).toLocaleString()}</td>
                      <td>{new Date(flight.arrival).toLocaleString()}</td>
                      <td>{flight.duration}</td>
                      <td>{flight.airline}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No flight results found. Please search to see available options.</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
