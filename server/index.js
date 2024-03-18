import express, { application } from "express";
import { port, mongoURL } from "./config.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors';

//models

import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

const app = express();

mongoose.connect(mongoURL)
    .then( () => {
    }).catch( (error) => {
        console.log(error);
    });

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

app.use('/chat', chatRoutes);
app.use('/users', userRoutes);
app.use('/application', applicationRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


