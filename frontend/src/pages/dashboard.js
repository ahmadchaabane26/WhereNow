import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, FormControl, Button, Container, Row, Col, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logout from "./logout";
import axios from 'axios';
import {db, auth} from "../firebase";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import cityToIATA from './cityToIATA.json';


export default function Dashboard() {
  const [filter, setFilter] = useState('flights'); // Active filter (default: flights)
  const [origin, setOrigin] = useState(''); // Selected origin city code
  const [destination, setDestination] = useState(''); // Selected destination city code
  const [departureDate, setDepartureDate] = useState(''); // Selected departure date
  const [checkInDate, setCheckInDate] = useState(''); // Selected check-in date for hotels
  const [checkOutDate, setCheckOutDate] = useState(''); // Selected check-out date for hotels
  const [city, setCity] = useState(''); // Selected city for activities and hotels
  const [cities, setCities] = useState([]); // List of cities
  const [data, setData] = useState([]); // Search results
  const [searchError, setSearchError] = useState(null); // Error state for search
  const [validationError, setValidationError] = useState(''); // Validation error state

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
    // Reset validation errors
    setValidationError('');
    setSearchError(null);

    // Validation checks based on the selected filter
    if (filter === 'flights') {
      if (!origin || !destination || !departureDate) {
        setValidationError('All fields are required for flights');
        return;
      }
      if (origin === destination) {
        setValidationError('Origin and destination cannot be the same');
        return;
      }
    } else if (filter === 'hotels') {
      if (!city || !checkInDate || !checkOutDate) {
        setValidationError('All fields are required for hotels');
        return;
      }
      if (checkInDate === checkOutDate) {
        setValidationError('Check-in date and checkout date cannot be the same');
        return;
      }
    } else if (filter === 'activities') {
      if (!city) {
        setValidationError('City is required for activities');
        return;
      }
    }

    try {
      // Determine API endpoint based on selected filter
      const endpointMap = {
        flights: 'http://localhost:3001/api/flights',
        hotels: 'http://localhost:3001/api/hotels',
        activities: 'http://localhost:3001/api/activities',
      };
      const params = {};

      // Format date to ISO format
      const formatDate = (date) => {
        const [year, month, day] = new Date(date).toISOString().split('T')[0].split('-');
        return `${year}-${month}-${day}`;
      };

      // Build the parameters dynamically based on the filter
      if (filter === 'flights') {
        params.origin = origin;
        params.destination = destination;
        params.date = departureDate;
      } else if (filter === 'hotels') {
        const cityCode = cityToIATA[city];
        if (!cityCode) {
          setValidationError('Selected city is not supported');
          return;
        }
        params.cityCode = cityCode; // Use cityCode directly
        params.checkInDate = formatDate(checkInDate);
        params.checkOutDate = formatDate(checkOutDate);
      } else if (filter === 'activities') {
        if (!city) {
          setValidationError('Selected city is not supported');
          return;
        }
        params.city = city; // Use cityCode directly
      }

      const response = await axios.get(endpointMap[filter], { params });
      setData(response.data); // Update results
    } catch (error) {
      console.error(`Error fetching ${filter}:`, error.response?.data || error.message);
      setSearchError(error.response?.data?.error || `Failed to fetch ${filter}. Please try again.`);
    }
  };

  const handleSave = async (item, type) => {
    const userId = auth.currentUser?.uid; // Retrieve the authenticated user's ID
  
    if (!userId) {
      alert("You need to log in to save items.");
      return;
    }
  
    try {
      // Create a reference to the user's document in Firestore
      const userDocRef = doc(db, "users", userId);
  
      // Save the item to the corresponding field (e.g., savedFlights, savedHotels, savedActivities)
      await setDoc(
        userDocRef,
        {
          [`saved${type}`]: arrayUnion(item),
        },
        { merge: true } // Merge with existing data instead of overwriting
      );
  
      alert(`${type} saved successfully!`);
    } catch (error) {
      console.error(`Error saving ${type}:`, error.message);
      alert(`Failed to save ${type}.`);
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
        {/* Filter Buttons */}
        <Row>
          <Col md={8}>
            {filter === 'flights' && (
              <>
                <div className="mb-3">
                  <label>Origin <span style={{ color: 'red' }}>*</span></label>
                  <FormControl
                    as="select"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    style={{ borderRadius: '10px', marginBottom: '10px' }}
                  >
                    <option value="">Select Origin</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>{city.name} ({city.country})</option>
                    ))}
                  </FormControl>
                </div>
                <div className="mb-3">
                  <label>Destination <span style={{ color: 'red' }}>*</span></label>
                  <FormControl
                    as="select"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    style={{ borderRadius: '10px', marginBottom: '10px' }}
                  >
                    <option value="">Select Destination</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>{city.name} ({city.country})</option>
                    ))}
                  </FormControl>
                </div>
                <div className="mb-3">
                  <label>Departure Date <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="form-control"
                  />
                </div>
              </>
            )}
            {filter === 'hotels' && (
              <>
                <div className="mb-3">
                  <label>City <span style={{ color: 'red' }}>*</span></label>
                  <FormControl
                    as="select"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ borderRadius: '10px', marginBottom: '10px' }}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>{city.name} ({city.country})</option>
                    ))}
                  </FormControl>
                </div>
                <div className="mb-3">
                  <label>Check-in Date <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label>Check-out Date <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="form-control"
                  />
                </div>
              </>
            )}
            {filter === 'activities' && (
              <div className="mb-3">
                <label>City <span style={{ color: 'red' }}>*</span></label>
                <FormControl
                  as="select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{ borderRadius: '10px', marginBottom: '10px' }}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>{city.name} ({city.country})</option>
                  ))}
                </FormControl>
              </div>
            )}
            <Button
              variant="primary"
              style={{ backgroundColor: '#b58b00', borderColor: '#b58b00', marginTop: '10px', marginBottom: "20px"}}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Col>
        </Row>

        {/* Validation Error */}
        {validationError && (
          <Row className="mt-3">
            <Col>
              <div className="alert alert-danger">{validationError}</div>
            </Col>
          </Row>
        )}

        {/* Error Message */}
        {searchError && (
          <Row className="mt-3">
            <Col>
              <div className="alert alert-danger">{searchError}</div>
            </Col>
          </Row>
        )}
        <Row className="mb-4" >
          <Col>
            <Button
              variant={filter === 'flights' ? 'primary' : 'outline-primary'}
              onClick={() => setFilter('flights')}
              style={{ marginRight: '10px' }}
            >
              Flights
            </Button>
            <Button
              variant={filter === 'hotels' ? 'primary' : 'outline-primary'}
              onClick={() => setFilter('hotels')}
              style={{ marginRight: '10px' }}
            >
              Hotels
            </Button>
            <Button
              variant={filter === 'activities' ? 'primary' : 'outline-primary'}
              onClick={() => setFilter('activities')}
            >
              Activities
            </Button>
          </Col>
        </Row>
        {/* Results */}
        <Row className="mt-4">
          <Col>
            <h4>{filter.charAt(0).toUpperCase() + filter.slice(1)} Results</h4>
            {data.length > 0 ? (
      <Table striped bordered hover>
        <thead>
          <tr>
            {filter === 'flights' && (
              <>
                <th>Price</th>
                <th>Departure</th>
                <th>Arrival</th>
              </>
            )}
            {filter === 'hotels' && (
              <>
                <th>Hotel Name</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Total Price (Currency)</th>
                <th> Price per Night</th>
              </>
            )}
            {filter === 'activities' && (
              <>
                <th>Activity Name</th>
                <th>category</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {filter === 'flights' && (
                <>
                  <td>${item.price}</td>
                  <td>{new Date(item.departure).toLocaleString()}</td>
                  <td>{new Date(item.arrival).toLocaleString()}</td>
                  <td>
                  <Button onClick={() => handleSave(item, 'Flights')}>Save</Button>
                  </td>
                </>
              )}
              {filter === 'hotels' && (
                <>
                  <td>{item.name || 'N/A'}</td>
                  <td>{item.checkIn || 'N/A'}</td>
                  <td>{item.checkOut || 'N/A'}</td>
                  <td>
                    {item.price} ({item.currency})
                  </td>
                  <td>
                    {/* Calculate price per night */}
                    {item.price && item.checkIn && item.checkOut
                      ? (
                        (item.price / (
                          Math.abs(new Date(item.checkOut) - new Date(item.checkIn)) /
                          (1000 * 60 * 60 * 24)
                        ))
                          .toFixed(2) + ` (${item.currency})`
                      )
                      : 'N/A'}
                  </td>
                  <td> 
                  <Button onClick={() => handleSave(item, 'Hotels')}>Save</Button>
                  </td>
                </>
              )}
              {filter === 'activities' && (
                <>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>
                    <Button onClick={() => handleSave(item, 'Activities')}>Save</Button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
              </Table>
            ) : (
              <p>No {filter} results found. Please search to see available options.</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
