import express from "express";
import { port, mongoURL } from "./config.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors';


const app = express();

mongoose.connect(mongoURL)
    .then( () => {
    }).catch( (error) => {
        console.log(error);
    });

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequenceValue: { type: Number, default: 1 }
});

const Counter = mongoose.model('Counter', counterSchema);
// User schema
const userSchema = new mongoose.Schema({
    name: String,
    userId : Number,
    username: String,
    email: String,
    password: String,
    university: String,
});

const User = mongoose.model('User', userSchema);

// Create User endpoint
app.post('/users', async (req, res) => {
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
app.get('/users/:email', async (req, res) => {
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

app.get('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params; 
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete User endpoint
app.delete('/users/:userId', async (req, res) => {
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
app.put('/users/:userId', async (req, res) => {
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



// Applicaition Schema
const applicationSchema = new mongoose.Schema({
    type: { type: String, enum: ['JOB', 'COLLEGE'] },
    applicationId : Number,
    userId: { type: Number, ref: 'User', required: true },
    jobTitle: { type: String, required: function() { return this.type === 'JOB'; } },
    company: { type: String, required: function() { return this.type === 'JOB'; } },
    university: { type: String, required: function() { return this.type === 'COLLEGE'; } },
    resume: String,
    coverLetter: String,
    notes: String,
    essays: {
        type: Map,
        of: String,
    },
    recommendationLetters: [String],
});

const Application = mongoose.model('Application', applicationSchema);


// Create Application endpoint
app.post('/application', async (req, res) => {
    try {
        // Get the current sequence value for application ID
        let counter = await Counter.findById('applicationId');

        // If counter document doesn't exist, create a new one
        if (!counter) {
            counter = await Counter.create({ _id: 'applicationId', sequenceValue: 1 });
        }

        const applicationId = counter.sequenceValue;

        // Create a new application with the obtained application ID
        const newApplication = await Application.create({ ...req.body, applicationId });
        // Increment the sequence value for application ID in the counter schema
        counter.sequenceValue++;
        await counter.save();

        res.status(201).json(newApplication);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


//get application based on userid
//future changes will be toreturn only the metadata
app.get('/application/:userId', async (req, res) => {
    try {
        const {userId} = req.params;
        const applications = await Application.find({userId});
        res.json(applications);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
});

//Update Application endpoint
app.put('/application/:appId', async (req,res) => {
    try{
        const {appId} = req.params;
        const updatedApplication = await Application.findOneAndUpdate({applicationId : appId}, req.body, {new: true});
        if (!updatedApplication) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json(updatedApplication)
    } catch (error){
        res.status.json({message: error.message});
    }
});




