// routes/eventRoutes.js
import express from 'express';
import Event from '../models/eventModel.js';
import { verifyToken } from '../authMidelware.js';

const router = express.Router();

// Create Event
router.post('/', verifyToken, async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get Events for a User
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const events = await Event.find({ userId });
        res.json(events);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update Event
router.put('/:eventId', verifyToken, async (req, res) => {
    try {
        const { eventId } = req.params;
        const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Event
router.delete('/:eventId', verifyToken, async (req, res) => {
    try {
        const { eventId } = req.params;
        await Event.findByIdAndDelete(eventId);
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
