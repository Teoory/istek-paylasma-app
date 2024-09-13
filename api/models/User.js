const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true
    },
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        minlength: 3,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    role: {
        type: String,
        enum: ['admin', 'moderator', 'vip', 'user', 'system'],
        default: 'user'
    },
    CreatedAt: {
        type: Date,
        default: Date.now()
    },
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;