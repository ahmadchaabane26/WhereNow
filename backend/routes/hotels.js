const express = require('express');
const router = express.Router();
const axios = require('axios');
const cityToIATA = require('./cityToIATA.json'); // Import the city-to-IATA mapping file
require('dotenv').config();

/**
 * Helper function to fetch an access token from Amadeus API
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
    console.error('Error fetching access token:', error.response?.data || error.message);
    throw new Error('Failed to fetch access token');
  }
};

/**
 * Helper function to chunk an array into smaller batches
 */
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Helper function to add a delay
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch hotel IDs for a given city code
 */
const fetchHotelIds = async (cityCode) => {
  const maxRetries = 3;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        'https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { cityCode },
        }
      );

      return response.data.data.map((hotel) => hotel.hotelId);
    } catch (error) {
      attempts++;

      if (attempts >= maxRetries || error.response?.status !== 500) {
        console.error('Error in fetchHotelIds:', error.response?.data || error.message);
        throw new Error('Failed to fetch hotel IDs');
      }

      console.log(`Retrying fetchHotelIds... Attempt ${attempts}/${maxRetries}`);
      await new Promise((resolve) => setTimeout(resolve, attempts * 1000)); // Exponential backoff
    }
  }
};


const validateHotelIdFormat = (hotelId) => {
  const validPattern = /^[A-Z0-9]{6,}$/; // Adjust based on known ID format
  return validPattern.test(hotelId);
};

const validateHotelIds = async (hotelIds) => {
  const validHotelIds = [];
  const invalidHotelIds = [];

  for (const hotelId of hotelIds) {
    try {
      const accessToken = await getAccessToken();
      await axios.get(
        'https://test.api.amadeus.com/v3/shopping/hotel-offers',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { hotelIds: hotelId },
        }
      );
      validHotelIds.push(hotelId);
    } catch (error) {
      console.error(`Invalid hotelId: ${hotelId}`, error.response?.data || error.message);
      invalidHotelIds.push(hotelId);
    }
  }

  console.log('Invalid Hotel IDs:', invalidHotelIds);
  return validHotelIds;
};



/**
 * Fetch hotel offers for given hotel IDs and dates
 */
const fetchHotels = async (hotelIds, checkInDate, checkOutDate) => {
  const validHotelIds = await validateHotelIds(hotelIds);

  if (validHotelIds.length === 0) {
    console.log('No valid hotel IDs available.');
    return [];
  }

  const hotelOffers = [];
  for (const hotelId of validHotelIds) {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        'https://test.api.amadeus.com/v3/shopping/hotel-offers',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            hotelIds: hotelId,
            checkInDate,
            checkOutDate,
            adults: 1,
          },
        }
      );

      hotelOffers.push(response.data.data[0]); // Add first hotel offer to results
    } catch (error) {
      console.error(`Error fetching offers for ${hotelId}:`, error.response?.data || error.message);
    }
  }

  return hotelOffers;
};





/**
 * Main route to fetch hotels
 */
router.get('/', async (req, res) => {
  try {
    const { city, checkInDate, checkOutDate } = req.query;

    if (!city || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: 'City, check-in date, and check-out date are required' });
    }

    const cityCode = cityToIATA[city];
    if (!cityCode) {
      return res.status(400).json({ error: 'Invalid city name' });
    }

    const hotelIds = await fetchHotelIds(cityCode);
    if (hotelIds.length === 0) {
      return res.status(404).json({ error: 'No hotels found for the specified city' });
    }

    const validHotelIds = await validateHotelIds(hotelIds);

    if (validHotelIds.length === 0) {
      return res.status(404).json({ error: 'No valid hotel IDs found' });
    }

    const hotelOffers = await fetchHotels(validHotelIds, checkInDate, checkOutDate);

    res.json({ hotels: hotelOffers });
  } catch (error) {
    console.error('Error in /api/hotels route:', error.message, error.response?.data || '');
    res.status(500).json({ error: 'Failed to fetch hotel IDs. Please try again later.' });
  }
});






module.exports = router;
