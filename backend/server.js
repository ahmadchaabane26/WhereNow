// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const flightRoutes = require('./routes/flights');
const { fetchUSCities } = require('./routes/cities');
const hotelOffers  = require('./routes/hotels')

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cities route
app.get('/api/cities', async (req, res) => {
  try {
    // Extract query parameters
    const {
      name = '',
      min_population = 0,
      max_population,
      limit = 30,
      offset = 0,
    } = req.query;

    // Fetch cities
    const cities = await fetchUSCities({
      name,
      minPopulation: parseInt(min_population, 10),
      maxPopulation: max_population ? parseInt(max_population, 10) : null,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error.message);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// Flights route
app.use('/api/flights', flightRoutes);
app.use('/api/hotels', hotelOffers);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Server is running and ready to handle requests.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send('Something went wrong! Please try again.');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
