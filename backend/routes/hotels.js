const express = require('express');
const router = express.Router();
const axios = require('axios');

// Fetch hotel data
router.get('/hotels', async (req, res) => {
    try {
        const { location, checkin, checkout } = req.query;
        const response = await axios.get('https://api.example.com/hotels', {
            params: {
                location,
                checkin,
                checkout,
                apiKey: process.env.TRAVEL_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch hotel data' });
    }
});

module.exports = router;
