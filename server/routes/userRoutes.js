import User from '../models/userModel.js'
import express from "express";
import Counter from "../models/counterModel.js";
import { OAuth2Client } from 'google-auth-library';
import {verifyToken} from '../authMidelware.js';
import axios from 'axios'
import jwt from "jsonwebtoken"
// Create User endpoint
const app = express.Router();
const client = new OAuth2Client('176150502414-dl4hvgllhk6s6gndttt6c5t7d42afdar.apps.googleusercontent.com');


const validateGoogleAccessToken = async (req, res, next) => {
    try {
      const { accessToken } = req.body;
  
      // Verify the Google OAuth access token with the Google OAuth client
        const response = await axios
          .get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
            {
              headers: {
                Authorization: `${accessToken}`,
                Accept: "application/json",
              },
            }
          )
  
      // Get user information from the verified token
      const { name, email, picture} = response.data;

      // Here, you can optionally check if the email exists in your database or perform any other checks
      let user = await User.findOne({ email });

      if (!user) {
        // If user doesn't exist, create a new user in your database
        user = new User({ name, email, picture});
        await user.save();
      }
      // If validation is successful, generate a JWT token
      const jwtToken = jwt.sign({user}, 'ilias', { expiresIn: '1h' });
      // Send the JWT token back to the client
      res.json({ token: jwtToken, user:user });
    } catch (error) {
      console.error('Google OAuth token validation failed:', error);
      res.status(401).json({ message: 'Google OAuth token validation failed' });
    }
  };
  
  // Route for validating Google OAuth access token
app.post('/google-auth', validateGoogleAccessToken);

app.post('/login', async (req, res) => { 
    try {
      const {name, email} = req.body; 
  
      

        res.json({ token });
    }catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
  })
  

app.post('/', verifyToken, async (req, res) => {
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
app.get('/:email', verifyToken, async (req, res) => {
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
// })

// Get User by UserId endpoint
// Get User Picture by UserId endpoint
app.get('/picture/:userId', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Assuming userId is a unique identifier in your User model
        const user = await User.findOne({ userId });

        if (!user) {
            console.log("not found")
            return res.status(404).json({ message: 'User not found' });
        }
    
        // Return only the user's picture
        res.json({ picture: user.picture });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



// Delete User endpoint
app.delete('/:userId', verifyToken, async (req, res) => {
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
app.put('/:userId', verifyToken, async (req, res) => {
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

app.get('/', verifyToken, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default app;
