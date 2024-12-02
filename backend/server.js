// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const flightRoutes = require('./routes/flights');
const hotelRoutes = require('./routes/hotels');
const activityRoutes = require('./routes/activities');
const userRoutes = require('./routes/user');

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Routes
app.use('/api/flights', flightRoutes); // Flight search routes
app.use('/api/hotels', hotelRoutes);   // Hotel search routes
app.use('/api/activities', activityRoutes); // Activity search routes
app.use('/api/user', userRoutes); // User preferences and saved items

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
