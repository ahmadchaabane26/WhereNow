const express = require('express');
const router = express.Router();
const axios = require('axios');
const cityToIATA = require('./cityToIATA.json'); // Import the city-to-IATA mapping file
require('dotenv').config();

/**
 * Fetch an access token from Amadeus API
 */
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
const fetchHotelIds = async (cityCode) => {
    try {
      const accessToken = await getAccessToken();
  
      const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { cityCode },
      });
  
      return response.data.data.map((hotel) => hotel.hotelId);
    } catch (error) {
      console.error('Error in fetchHotelIds:', error.response?.data || error.message);
      throw new Error('Failed to fetch hotel IDs');
    }
  };
  
  const fetchHotels = async (hotelIds, checkInDate, checkOutDate) => {
    try {
      const accessToken = await getAccessToken();
  
      const response = await axios.get('https://test.api.amadeus.com/v3/shopping/hotel-offers', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          hotelIds: hotelIds.join(','), // Combine IDs into a comma-separated string
          checkInDate,
          checkOutDate,
          adults: 1,
        },
      });
  
      return response.data.data.map((hotel) => ({
        name: hotel.hotel.name,
        checkIn: hotel.offers[0]?.checkInDate,
        checkOut: hotel.offers[0]?.checkOutDate,
        price: hotel.offers[0]?.price.total,
        currency: hotel.offers[0]?.price.currency,
      }));
    } catch (error) {
      console.error('Error in fetchHotels:', error.response?.data || error.message);
      throw new Error('Failed to fetch hotel data');
    }
  };
  
  router.get('/', async (req, res) => {
    try {
      const { city, checkInDate, checkOutDate } = req.query;
  
      if (!city || !checkInDate || !checkOutDate) {
        return res.status(400).json({ error: 'City code, check-in date, and check-out date are required' });
      }
  
      const cityCode = cityToIATA[city];
      if (!cityCode) {
        return res.status(400).json({ error: 'Invalid city name' });
      }
  
      const hotelIds = await fetchHotelIds(cityCode);
      if (hotelIds.length === 0) {
        return res.status(404).json({ error: 'No hotels found for the specified city' });
      }
  
      const hotels = await fetchHotels(hotelIds, checkInDate, checkOutDate);
      res.json(hotels);
    } catch (error) {
      console.error('Error in /api/hotels route:', error.message, error.response?.data);
      res.status(500).json({ error: 'Failed to fetch hotel data' });
    }
  });
  
  module.exports = router;
  