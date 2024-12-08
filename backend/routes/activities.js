const express = require('express');
const axios = require('axios');
const router = express.Router();
const GEOAPIFY_API_KEY = 'da6882e372354f72853c683ca0d2f2ce';

router.get('/', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    // Get placeId for the city
    const geoResponse = await axios.get(`https://api.geoapify.com/v1/geocode/search`, {
      params: {
        city,
        apiKey: GEOAPIFY_API_KEY,
      },
    });

    const placeId = geoResponse.data.features[0]?.properties?.place_id;
    if (!placeId) {
      return res.status(404).json({ error: 'City not found' });
    }

    // Fetch places in the city
    const placesResponse = await axios.get(`https://api.geoapify.com/v2/places`, {
      params: {
        categories: 'tourism.attraction',
        filter: `place:${placeId}`,
        limit: 20,
        apiKey: GEOAPIFY_API_KEY,
      },
    });

    res.json(placesResponse.data.features.map(feature => ({
      name: feature.properties.name,
      address: feature.properties.address_line1,
      category: feature.properties.categories[0],
      city: feature.properties.city,
    })));
  } catch (error) {
    console.error('Error fetching places:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

module.exports = router;
