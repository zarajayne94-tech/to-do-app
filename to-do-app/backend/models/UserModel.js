import mongoose from 'mongoose';

// Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
    },
    dateCreated: {
        type: String,
        default: () => new Date(Date.now()).toLocaleDateString(),
    }
});

// Model
const User = mongoose.model('User', userSchema);

export default User;