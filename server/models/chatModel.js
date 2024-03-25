import mongoose from 'mongoose';

const { Schema } = mongoose;

const chatSchema = new Schema({
    participants: [{ type: Number, required: true }], // Assuming there's a User model
    name: { type: String, required: true }
});

// Middleware to ensure user existence when adding participants to the chat
chatSchema.pre('updateOne', async function(next) {
    try {
        // Get the list of participant IDs being added
        const participantsToAdd = this._update.$addToSet?.participants || [];
        
        // Iterate through each participant
        for (const userId of participantsToAdd) {
            // Check if the user with the given userId exists
            const userExists = await mongoose.model('User').exists({ _id: userId });
            if (!userExists) {
                throw new Error(`User with ID ${userId} does not exist.`);
            }
        }
        next(); // Proceed with the update operation if all participants exist
    } catch (error) {
        next(error); // Pass any error to the next middleware
    }
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
