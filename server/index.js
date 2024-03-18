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