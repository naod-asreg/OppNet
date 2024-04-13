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
      allowedHeaders: ["my-custom-header", "Authorization"],
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
// io.on("connection", (socket) => {

//     socket.on("setup", (userData) => {
//         socket.join(userData);
//         socket.emit("connected");
//       });


//     socket.on("join chat", ({ chatId, userId }) => { // Receive an object with chatId and userId
//         socket.join(chatId); // Join the room corresponding to the chatId
//     });

//     socket.on("new message", (messageData) => {
//         // Broadcast the new message to all users in the chat room
//         console.log("Sending message to chat ID:", messageData.chatId);
//         console.log("Message data:", messageData);
        

//         if (!messageData.users) return console.log("chat.users not defined");
    
//         messageData.users.forEach((user) => {
//             console.log(user);
//           socket.in(user).emit("message recieved", messageData);
//         });        //abive line causing problems 
//         // Save the new message to the database
//         const message = new Message({
//             chat: messageData.chatId,
//             sender: messageData.sender,
//             content: messageData.content
//         });
        
//         message.save()
//             .then(savedMessage => {
//                console.log('Message saved:', savedMessage);
//             })
//             .catch(error => {
//                 console.error('Error saving message:', error);
//             });
//     });

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

