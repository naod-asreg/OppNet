import express, { application } from "express";
import { port, mongoURL } from "./config.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors';
import { Server } from "socket.io"; // Import Socket.io
import { createServer } from "http"; // Import http module

import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

const app = express();
const httpServer = createServer(app); // Create HTTP server
const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

mongoose.connect(mongoURL)
    .then( () => {
    }).catch( (error) => {
        console.log(error);
    });

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

app.use('/chats', chatRoutes);
app.use('/users', userRoutes);
app.use('/application', applicationRoutes);

// Socket.io event handling
io.on("connection", (socket) => {
    socket.on("join chat", ({ room, userId }) => { // Receive an object with room and userId
        socket.join(room);
        console.log(`User ${userId} Joined Room: ${room}`);
    });
});


// Start the server
httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



// Applicaition Schema
// description
// notifications (boolean array)
// deadlines : [ ]
// tasks : [two things]
const applicationSchema = new mongoose.Schema({
    type: { type: String, enum: ['JOB', 'COLLEGE'] },
    applicationId : Number,
    description: String,
    status: String, 
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
    notifications: { type: Boolean, default: true }, // New field: notifications
    deadlines: [{ // New field: deadlines (array of objects)
        name: String,
        date: Date
    }],
    tasks: [String], // New field: tasks (array of strings)
    recruiters: [String], 
    recommenders: [String], 
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
        res.status(404).json({message: error.message});
    }
});




