import express from "express";
import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";
const router = express.Router();

// Route to get all messages for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const userChats = await Chat.find({ participants: userId }).populate('participants', 'name');
        
        res.json(userChats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get messages for a specific chat
router.get('/:chatId', async (req, res) => {
    try {
        const { chatId } = req.params;
        // Fetch all messages for the chat from the database
        const messages = await Message.find({ chat: chatId });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to create a new chat
router.post('/', async (req, res) => {
    try {
        // Extract chat data from the request body
        const { participants, name } = req.body;

        // Create a new chat instance
        const newChat = new Chat({ participants, name });

        // Save the new chat to the database
        const savedChat = await newChat.save();

        // Send the saved chat as a response
        res.status(201).json(savedChat);
    } catch (error) {
        // Handle errors
        res.status(400).json({ message: error.message });
    }
});

// Route to create a new message
router.post('/messages', async (req, res) => {
    try {
        // Extract message data from the request body
        const { chat, sender, content } = req.body;

        // Create a new message instance
        const newMessage = new Message({ chat, sender, content });

        // Save the new message to the database
        const savedMessage = await newMessage.save();

        // Send the saved message as a response
        res.status(201).json(savedMessage);
    } catch (error) {
        // Handle errors
        res.status(400).json({ message: error.message });
    }
});



// Route to update participants in a chat
router.put('/:chatId/addUsers', async (req, res) => {
    try {
        const { chatId } = req.params;
        const { users } = req.body;

        // Validate that the chat exists
        const existingChat = await Chat.findById(chatId);
        if (!existingChat) {
            return res.status(404).json({ message: "Chat not found." });
        }

        // Validate that each user exists before adding them to the chat
        for (const userId of users) {
            const userExists = await User.exists({ _id: userId });
            if (!userExists) {
                return res.status(400).json({ message: `User with ID ${userId} does not exist.` });
            }
        }

        // Update the participants in the chat
        await Chat.findByIdAndUpdate(chatId, { $addToSet: { participants: { $each: users } } });

        res.status(200).json({ message: "Participants added successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



export default router;
