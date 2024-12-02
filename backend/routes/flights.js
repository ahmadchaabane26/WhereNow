const express = require('express');
const router = express.Router();
const axios = require('axios');

// Fetch flight data
router.get('/flights', async (req, res) => {
    try {
        const { origin, destination, date } = req.query;
        const response = await axios.get('https://api.example.com/flights', {
            params: {
                origin,
                destination,
                date,
                apiKey: process.env.TRAVEL_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch flight data' });
    }
});

module.exports = router;
