const express = require('express');
const router = express.Router();
const axios = require('axios');
const cityToIATA = require('./cityToIATA.json'); // Import the mapping file
require('dotenv').config();

const getAccessToken = async () => {
  try {
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_API_KEY,
        client_secret: process.env.AMADEUS_API_SECRET,
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error.message);
    throw new Error('Failed to fetch access token');
  }
};

const fetchFlights = async (origin, destination, date) => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: date,
        adults: 1,
      },
    });

    return response.data.data.map((flight) => ({
      id: flight.id,
      price: flight.price.total,
      departure: flight.itineraries[0].segments[0].departure.at,
      arrival: flight.itineraries[0].segments.slice(-1)[0].arrival.at,
      duration: flight.itineraries[0].duration,
      airline: flight.validatingAirlineCodes[0],
    }));
  } catch (error) {
    console.error('Error fetching flights:', error.message);
    throw new Error('Failed to fetch flight data');
  }
};

router.get('/', async (req, res) => {
  try {
    const { origin, destination, date } = req.query;

    if (!origin || !destination || !date) {
      return res.status(400).json({ error: 'Origin, destination, and date are required' });
    }

    const originCode = cityToIATA[origin];
    const destinationCode = cityToIATA[destination];

    if (!originCode || !destinationCode) {
      return res.status(400).json({ error: 'Invalid origin or destination city' });
    }

    const flights = await fetchFlights(originCode, destinationCode, date);
    res.json(flights);
  } catch (error) {
    console.error('Error in /api/flights route:', error.message);
    res.status(500).json({ error: 'Failed to fetch flight data' });
  }
});

module.exports = router;
