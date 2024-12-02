const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

// Save flight to user profile
router.post('/save/flight', async (req, res) => {
    try {
        const { userId, flight } = req.body;
        await db.collection('users').doc(userId).update({
            savedFlights: admin.firestore.FieldValue.arrayUnion(flight),
        });
        res.status(200).send('Flight saved successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to save flight');
    }
});

module.exports = router;
