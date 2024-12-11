import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Button, Container, Row, Col, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Logout from './logout';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure you have a Firebase setup file exporting `db`

export default function Saved() {
  const navigate = useNavigate();
  const { userId } = useParams(); // Extract userId from the URL
  const [savedData, setSavedData] = useState({
    savedHotels: [],
    savedFlights: [],
    savedActivities: [],
  });
  const [activeTab, setActiveTab] = useState('savedHotels'); // Default to 'Saved Hotels'

  // Fetch saved items from Firebase
  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setSavedData({
            savedHotels: userData.savedHotels || [],
            savedFlights: userData.savedFlights || [],
            savedActivities: userData.savedActivities || [],
          });
        }
      } catch (error) {
        console.error('Error fetching saved items:', error.message);
      }
    };

    fetchSavedItems();
  }, [userId]);

  // Handle unsave
  const handleUnsave = async (item, type) => {
    try {
      const userRef = doc(db, 'users', userId);
  
      // Remove the item from the database
      await updateDoc(userRef, {
        [type]: arrayRemove(item),
      });
  
      // Refetch updated data to reflect changes
      await Saved();
  
      alert(`${type.slice(5)} unsaved successfully!`);
    } catch (error) {
      console.error(`Error unsaving ${type}:`, error.message);
      alert(`Failed to unsave ${type.slice(5)}.`);
    }
  }
  
  
  return (
    <div>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" style={{ padding: '1rem 2rem' }}>
        <Navbar.Brand href="#home" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          Saved
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <NavDropdown title="Profile" id="basic-nav-dropdown">
              {/* Navigate back to dashboard */}
              <NavDropdown.Item onClick={() => navigate(`/${userId}/dashboard`)}>
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

      {/* Tabs for Saved Items */}
      <Container>
        <Row className="mt-3">
          <Col>
            <div className="d-flex justify-content-start">
              <Button
                variant={activeTab === 'savedHotels' ? 'primary' : 'outline-primary'}
                className="me-2"
                onClick={() => setActiveTab('savedHotels')}
              >
                Saved Hotels
              </Button>
              <Button
                variant={activeTab === 'savedFlights' ? 'primary' : 'outline-primary'}
                className="me-2"
                onClick={() => setActiveTab('savedFlights')}
              >
                Saved Flights
              </Button>
              <Button
                variant={activeTab === 'savedActivities' ? 'primary' : 'outline-primary'}
                className="me-2"
                onClick={() => setActiveTab('savedActivities')}
              >
                Saved Activities
              </Button>
            </div>
          </Col>
        </Row>

        {/* Display Saved Items */}
        <Row className="mt-4">
          <Col>
            {savedData[activeTab].length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    {activeTab === 'savedHotels' && (
                      <>
                        <th>Hotel Name</th>
                        <th>Check-In</th>
                        <th>Check-Out</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </>
                    )}
                    {activeTab === 'savedFlights' && (
                      <>
                        <th>Price</th>
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Actions</th>
                      </>
                    )}
                    {activeTab === 'savedActivities' && (
                      <>
                        <th>Activity Name</th>
                        <th>Category</th>
                        <th>Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {savedData[activeTab].map((item, index) => (
                    <tr key={index}>
                      {activeTab === 'savedHotels' && (
                        <>
                          <td>{item.name}</td>
                          <td>{item.checkIn}</td>
                          <td>{item.checkOut}</td>
                          <td>{item.price}</td>
                          <td>
                            <Button
                              variant="danger"
                              onClick={() => handleUnsave(item, 'savedHotels')}
                            >
                              Unsave
                            </Button>
                          </td>
                        </>
                      )}
                      {activeTab === 'savedFlights' && (
                        <>
                          <td>${item.price}</td>
                          <td>{item.departure}</td>
                          <td>{item.arrival}</td>
                          <td>
                            <Button
                              variant="danger"
                              onClick={() => handleUnsave(item, 'savedFlights')}
                            >
                              Unsave
                            </Button>
                          </td>
                        </>
                      )}
                      {activeTab === 'savedActivities' && (
                        <>
                          <td>{item.name}</td>
                          <td>{item.category}</td>
                          <td>
                            <Button
                              variant="danger"
                              onClick={() => handleUnsave(item, 'savedActivities')}
                            >
                              Unsave
                            </Button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No items found in {activeTab.slice(5)}.</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
