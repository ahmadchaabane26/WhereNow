const axios = require('axios');
require('dotenv').config();


const API_URL = 'https://api.api-ninjas.com/v1/city';

/**
 * Fetch cities in the US with optional parameters for filtering and pagination.
 * @param {Object} options - Query parameters for filtering cities.
 * @param {string} [options.name] - Partial or full name of the city.
 * @param {number} [options.minPopulation] - Minimum population of the city.
 * @param {number} [options.maxPopulation] - Maximum population of the city.
 * @param {number} [options.limit] - Number of results to return (default is 30).
 * @param {number} [options.offset] - Number of results to offset for pagination.
 * @returns {Promise<Array>} - List of cities matching the criteria.
 */
const fetchUSCities = async ({
  name = '',
  minPopulation = 0,
  maxPopulation = null,
  limit = 30,
  offset = 0,
} = {}) => {
  try {
    const params = {
      country: 'US',
      name,
      min_population: minPopulation,
      limit,
      offset,
    };

    if (maxPopulation) {
      params.max_population = maxPopulation;
    }

    const response = await axios.get(API_URL, {
      params,
      headers: {
        'X-Api-Key': process.env.CITIES_API_KEY,
      },
    });

    return response.data; // Returns the list of cities
  } catch (error) {
    console.error('Error fetching US cities:', error.response?.data || error.message);
    throw new Error('Failed to fetch US cities');
  }
};

module.exports = { fetchUSCities };
