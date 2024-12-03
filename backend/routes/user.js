const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const admin = require('firebase-admin');



// Fetch user preferences
router.get('/preferences', async (req, res) => {
    try {
        const { userId } = req.query;
        console.log("Received userId:", userId);

        if (!userId) {
            return res.status(400).send("User ID is required");
        }

        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).send("User not found");
        }

        const userData = userDoc.data();
        console.log("User data:", userData);

        res.json(userData.preferences || { message: "No preferences found" });
    } catch (error) {
        console.error("Error fetching preferences:", error);
        res.status(500).send("Failed to fetch user preferences");
    }
});


// Update user preferences
router.post('/preferences', async (req, res) => {
    const { userId, preferences } = req.body;
    if (!userId || !preferences) {
        return res.status(400).json({ error: 'User ID and preferences are required.' });
    }

    try {
        await db.collection('users').doc(userId).set({ preferences }, { merge: true });
        res.status(200).json({ message: 'Preferences updated successfully!' });
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({ error: 'Failed to update preferences.' });
    }
});

// Fetch saved items
router.get('/saved', async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
            const { savedFlights = [], savedHotels = [], savedActivities = [] } = userDoc.data();
            res.json({ savedFlights, savedHotels, savedActivities });
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        console.error('Error fetching saved items:', error);
        res.status(500).json({ error: 'Failed to fetch saved items.' });
    }
});

// Save a flight
router.post('/saved/flight', async (req, res) => {
    const { userId, flight } = req.body;
    if (!userId || !flight) {
        return res.status(400).json({ error: 'User ID and flight details are required.' });
    }

    try {
        await db.collection('users').doc(userId).update({
            savedFlights: admin.firestore.FieldValue.arrayUnion(flight),
        });
        res.status(200).json({ message: 'Flight saved successfully!' });
    } catch (error) {
        console.error('Error saving flight:', error);
        res.status(500).json({ error: 'Failed to save flight.' });
    }
});

// Save a hotel
router.post('/saved/hotel', async (req, res) => {
    const { userId, hotel } = req.body;
    if (!userId || !hotel) {
        return res.status(400).json({ error: 'User ID and hotel details are required.' });
    }

    try {
        await db.collection('users').doc(userId).update({
            savedHotels: admin.firestore.FieldValue.arrayUnion(hotel),
        });
        res.status(200).json({ message: 'Hotel saved successfully!' });
    } catch (error) {
        console.error('Error saving hotel:', error);
        res.status(500).json({ error: 'Failed to save hotel.' });
    }
});

// Save an activity
router.post('/saved/activity', async (req, res) => {
    const { userId, activity } = req.body;
    if (!userId || !activity) {
        return res.status(400).json({ error: 'User ID and activity details are required.' });
    }

    try {
        await db.collection('users').doc(userId).update({
            savedActivities: admin.firestore.FieldValue.arrayUnion(activity),
        });
        res.status(200).json({ message: 'Activity saved successfully!' });
    } catch (error) {
        console.error('Error saving activity:', error);
        res.status(500).json({ error: 'Failed to save activity.' });
    }
});

module.exports = router;
