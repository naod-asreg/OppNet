import express from "express";
import Application from "../models/applicationModel.js";
import Counter from "../models/counterModel.js";
import { verifyToken } from "../authMidelware.js";
const app = express.Router();

// Create Application endpoint
app.post('/', verifyToken, async (req, res) => {
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
app.get('/:userId', verifyToken, async (req, res) => {
    try {
        const {userId} = req.params;
        const applications = await Application.find({userId});
        res.json(applications);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
});

//Update Application endpoint
app.put('/:appId',verifyToken, async (req,res) => {
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

export default app;


