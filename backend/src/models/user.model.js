import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, 
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    email: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String, // URL to the profile picture
        default: ''
    },
},{timestamps: true});

const User=mongoose.model('User',userSchema);

export default User;