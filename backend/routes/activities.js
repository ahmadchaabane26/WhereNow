const express = require('express');
const router = express.Router();
const axios = require('axios');

// Fetch activity data
router.get('/activities', async (req, res) => {
    try {
        const { destination } = req.query;
        const response = await axios.get('https://api.example.com/activities', {
            params: {
                destination,
                apiKey: process.env.TRAVEL_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch activity data' });
    }
});

module.exports = router;
