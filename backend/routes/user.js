const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

// Fetch user preferences
router.get('/preferences', async (req, res) => {
    try {
        const { userId } = req.query;
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
            res.json(userDoc.data().preferences || {});
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching preferences:', error);
        res.status(500).send('Failed to fetch user preferences');
    }
});

// Update user preferences
router.post('/preferences', async (req, res) => {
    try {
        const { userId, preferences } = req.body;
        await db.collection('users').doc(userId).set({ preferences }, { merge: true });
        res.status(200).send('Preferences updated successfully!');
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).send('Failed to update preferences');
    }
});

// Fetch saved items (flights, hotels, activities)
router.get('/saved', async (req, res) => {
    try {
        const { userId } = req.query;
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
            const { savedFlights = [], savedHotels = [], savedActivities = [] } = userDoc.data();
            res.json({ savedFlights, savedHotels, savedActivities });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching saved items:', error);
        res.status(500).send('Failed to fetch saved items');
    }
});

// Save a flight
router.post('/saved/flight', async (req, res) => {
    try {
        const { userId, flight } = req.body;
        await db.collection('users').doc(userId).update({
            savedFlights: admin.firestore.FieldValue.arrayUnion(flight),
        });
        res.status(200).send('Flight saved successfully!');
    } catch (error) {
        console.error('Error saving flight:', error);
        res.status(500).send('Failed to save flight');
    }
});

// Save a hotel
router.post('/saved/hotel', async (req, res) => {
    try {
        const { userId, hotel } = req.body;
        await db.collection('users').doc(userId).update({
            savedHotels: admin.firestore.FieldValue.arrayUnion(hotel),
        });
        res.status(200).send('Hotel saved successfully!');
    } catch (error) {
        console.error('Error saving hotel:', error);
        res.status(500).send('Failed to save hotel');
    }
});

// Save an activity
router.post('/saved/activity', async (req, res) => {
    try {
        const { userId, activity } = req.body;
        await db.collection('users').doc(userId).update({
            savedActivities: admin.firestore.FieldValue.arrayUnion(activity),
        });
        res.status(200).send('Activity saved successfully!');
    } catch (error) {
        console.error('Error saving activity:', error);
        res.status(500).send('Failed to save activity');
    }
});

module.exports = router;
