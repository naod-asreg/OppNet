// models/eventModel.js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    time: String,
    title: String,
    location: String
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
