const express = require('express');
const router = express.Router();
const axios = require('axios');
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

/**
 * Fetch hotel IDs by city code
 */
const fetchHotelIdsByCity = async (cityCode) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { cityCode },
    });

    const hotelIds = response.data.data.map((hotel) => hotel.hotelId);
    console.log(`Fetched ${hotelIds.length} hotel IDs for cityCode: ${cityCode}`);
    return hotelIds;
  } catch (error) {
    console.error('Error in fetchHotelIdsByCity:', error.response?.data || error.message);
    throw new Error('Failed to fetch hotel IDs');
  }
};

/**
 * Fetch hotel offers for given hotel IDs and dates
 */
const fetchHotelOffers = async (hotelIds, checkInDate, checkOutDate) => {
  try {
    const accessToken = await getAccessToken();
    const chunkSize = 50; // Adjust chunk size
    const hotelOffers = [];
    const errors = [];

    for (let i = 0; i < hotelIds.length; i += chunkSize) {
      const chunk = hotelIds.slice(i, i + chunkSize);
      try {
        const response = await axios.get('https://test.api.amadeus.com/v3/shopping/hotel-offers', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            hotelIds: chunk.join(','),
            checkInDate,
            checkOutDate,
            adults: 1,
          },
        });

        if (response.data?.data) {
          hotelOffers.push(
            ...response.data.data.map((hotel) => ({
              name: hotel.hotel.name,
              checkIn: hotel.offers[0]?.checkInDate,
              checkOut: hotel.offers[0]?.checkOutDate,
              price: hotel.offers[0]?.price.total,
              currency: hotel.offers[0]?.price.currency,
            }))
          );
        }
      } catch (chunkError) {
        console.error(`Error processing chunk:`, chunk, chunkError.response?.data || chunkError.message);
        errors.push({
          chunk,
          error: chunkError.response?.data || chunkError.message,
        });
      }
    }

    if (errors.length) {
      console.error('Partial errors occurred:', errors);
    }

    return hotelOffers;
  } catch (error) {
    console.error('Error in fetchHotelOffers:', error.response?.data || error.message);
    throw new Error('Failed to fetch hotel offers');
  }
};

/**
 * Main route to fetch hotels
 */
router.get('/', async (req, res) => {
  try {
    const { cityCode, checkInDate, checkOutDate } = req.query;
    console.log('Received parameters:', { cityCode, checkInDate, checkOutDate });

    if (!cityCode || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: 'City code, check-in date, and check-out date are required' });
    }

    // Step 1: Fetch hotel IDs for the city
    const hotelIds = await fetchHotelIdsByCity(cityCode);
    if (hotelIds.length === 0) {
      return res.status(404).json({ error: 'No hotels found for the specified city' });
    }

    // Step 2: Fetch hotel offers for the IDs
    const hotels = await fetchHotelOffers(hotelIds, checkInDate, checkOutDate);
    res.json(hotels);
  } catch (error) {
    console.error('Error in /api/hotels route:', error.message, error.response?.data || '');
    res.status(500).json({ error: 'Failed to fetch hotel data' });
  }
});

module.exports = router;
