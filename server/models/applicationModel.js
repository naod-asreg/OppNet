import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    type: { type: String, enum: ['JOB', 'COLLEGE'] },
    applicationId : Number,
    description: String,
    userId: { type: String, ref: 'User', required: true },
    jobTitle: { type: String, required: function() { return this.type === 'JOB'; } },
    company: { type: String, required: function() { return this.type === 'JOB'; } },
    university: { type: String, required: function() { return this.type === 'COLLEGE'; } },
    resume: String,
    coverLetter: String,
    notes: String,
    essays: {
        type: Map,
        of: String,
    },
    recommendationLetters: [String],
    notifications: { type: Boolean, default: false }, // New field: notifications
    deadlines: [{ // New field: deadlines (array of objects)
        name: String,
        date: Date
    }],
    tasks: [String] // New field: tasks (array of strings)
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;