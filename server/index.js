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
import eventRoutes from './routes/eventRoutes.js'



const app = express();
const httpServer = createServer(app); // Create HTTP server
const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT"],
      allowedHeaders: ["my-custom-header", "Authorization"],
      credentials: true
    }
  });

mongoose.connect(mongoURL)
    .then( () => {
    }).catch( (error) => {
        console.log(error);
    });

// Middaleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

app.use('/chats', chatRoutes);
app.use('/users', userRoutes);
app.use('/application', applicationRoutes);
app.use('/events', eventRoutes)

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
 
    socket.on("setup", (userData) => {
      console.log("setup: ", userData);
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
socket.on("typing", (room) => socket.in(room).emit("typing"));
socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (messageData) => {
      console.log("new message: ", messageData);
  
      if (!messageData.users) return console.log("chat.users not defined");

      messageData.users.forEach((user) => {
        if (user == messageData.sender) return;

        socket.in(user).emit("message recieved: ", messageData);
      });
    });

    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
});

// Start the server
httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

