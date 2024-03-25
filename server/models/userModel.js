import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    userId : Number,
    username: String,
    email: String,
    password: String,
    university: String,
});

const User = mongoose.model('User', userSchema);

export default User;