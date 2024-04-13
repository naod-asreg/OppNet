import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema({
  chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: String, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

messageSchema.path('chat').validate({
    validator: async function(value) {
        const Chat = mongoose.model('Chat');
        const existingChat = await Chat.findById(value);
        return !!existingChat; // Return true if the chat exists, false otherwise
    },
    message: 'The specified chat does not exist'
});

const Message = mongoose.model('Message', messageSchema);

export default Message;