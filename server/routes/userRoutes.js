import User from '../models/userModel.js'
import express from "express";
import Counter from "../models/counterModel.js";
// Create User endpoint
const app = express.Router();

app.post('/', async (req, res) => {
    try {
        // Get the current sequence value for user ID
        let counter = await Counter.findById('userId');

        // If counter document doesn't exist, create a new one
        if (!counter) {
            counter = await Counter.create({ _id: 'userId', sequenceValue: 1 });
        }

        const userId = counter.sequenceValue;

        // Create a new user with the obtained user ID
        const newUser = await User.create({ ...req.body, userId });

        // Increment the sequence value for user ID in the counter schema
        counter.sequenceValue++;
        await counter.save();

        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Get User endpointss
app.get('/:email', async (req, res) => {
    try {
        const { email } = req.params; 
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// app.get('/users/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params; 
//         const user = await User.findOne({ userId });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.json(user);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// Delete User endpoint
app.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const deletedUser = await User.findOneAndDelete({ userId });
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update User endpoint
app.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedUser = await User.findOneAndUpdate({ userId }, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default app;
