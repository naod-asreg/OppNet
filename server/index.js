import express from "express";
import { port, mongoURL } from "./config.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();

mongoose.connect(mongoURL)
    .then( () => {
    }).catch( (error) => {
        console.log(error);
    });

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Define User schema
const userSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true },
    email: String,
    password: String,
    university: String,
});

const User = mongoose.model('User', userSchema);

// Create User endpoint
app.post('/users', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get User endpoint
app.get('/user', async (req, res) => {
    try {
        const { username } = req.body; 
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
